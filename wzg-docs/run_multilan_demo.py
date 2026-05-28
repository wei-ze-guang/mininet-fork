from datetime import datetime
from pathlib import Path
from signal import SIGINT
from time import sleep, time

from mininet.net import Mininet
from mininet.node import Node, OVSBridge
from mininet.link import TCLink
from mininet.log import setLogLevel
from mininet.util import pmonitor

from mininet_replay.annotations import empty_annotations
from mininet_replay.capture_plan import (
    TrafficScenario,
    build_capture_specs,
    involved_node_names,
)
from mininet_replay.ids import intf_id, new_run_id, node_id
from mininet_replay.models import RunMeta
from mininet_replay.packet_capture import (
    normalize_event_payloads,
    parse_tcpdump_line,
    tcpdump_command,
)
from mininet_replay.run_store import RunStore
from mininet_replay.samplers import (
    sample_link_stats,
    sample_neighbors,
    sample_ovs_flows,
    sample_routes,
)
from mininet_replay.topology_exporter import export_topology
from mininet_replay.trace_builder import (
    build_replay_frames,
    build_session_payload,
    build_snapshot_index,
    build_timeline_payload,
    build_trace_records,
)


CAPTURE_MODE = "path"

TRAFFIC_SCENARIOS = [
    TrafficScenario(kind="ping", src="h11", dst="r1", count=1, warmup=True),
    TrafficScenario(kind="ping", src="h11", dst="h21", count=2),
]

VALIDATION_PINGS = [
    ("h11", "h21"),
    ("h11", "h31"),
    ("h22", "h33"),
]

IPERF_PAIR = ("h11", "h33")


class LinuxRouter(Node):
    def config(self, **params):
        super().config(**params)
        self.cmd("sysctl -w net.ipv4.ip_forward=1")

    def terminate(self):
        self.cmd("sysctl -w net.ipv4.ip_forward=0")
        super().terminate()


def build_net():
    net = Mininet(controller=None, switch=OVSBridge, link=TCLink, build=False)

    r1 = net.addHost("r1", cls=LinuxRouter, ip="10.0.1.1/24")

    lans = [
        ("s1", "10.0.1", "10.0.1.1"),
        ("s2", "10.0.2", "10.0.2.1"),
        ("s3", "10.0.3", "10.0.3.1"),
    ]

    for idx, (sname, subnet, gw) in enumerate(lans, start=1):
        sw = net.addSwitch(sname)
        net.addLink(r1, sw, intfName1=f"r1-eth{idx - 1}")
        for host_num in range(1, 4):
            host = net.addHost(
                f"h{idx}{host_num}",
                ip=f"{subnet}.{10 + host_num}/24",
                defaultRoute=f"via {gw}",
            )
            net.addLink(host, sw)

    net.build()

    for intf, cidr in (
        ("r1-eth0", "10.0.1.1/24"),
        ("r1-eth1", "10.0.2.1/24"),
        ("r1-eth2", "10.0.3.1/24"),
    ):
        r1.cmd(f"ip addr flush dev {intf}")
        r1.cmd(f"ip addr add {cidr} dev {intf}")
        r1.cmd(f"ip link set {intf} up")

    net.start()
    return net, r1


def bootstrap_run_store(net, sampler_interval_ms=1000):
    """Create one run directory and write static metadata."""
    run_id = new_run_id()
    run_root = Path("runs") / run_id
    store = RunStore(run_root)
    meta = RunMeta(
        run_id=run_id,
        started_at=datetime.utcnow().isoformat() + "Z",
        sampler_interval_ms=sampler_interval_ms,
        packet_protocols=["ARP", "ICMP", "TCP", "UDP"],
    )
    store.write_meta(meta)
    store.write_annotations(empty_annotations())
    topology = export_topology(net, run_id)
    store.write_topology(topology)
    return run_id, meta, store, run_root, topology


def collect_snapshots(net, run_id, store):
    """Capture one first-version batch of table snapshots."""
    snapshot_records = []
    for node in net.hosts:
        kind = "router" if node.name == "r1" else "host"
        nid = node_id(run_id, node.name)
        for record in (
            sample_routes(node, run_id, nid, kind),
            sample_neighbors(node, run_id, nid, kind),
            sample_link_stats(node, run_id, nid, kind),
        ):
            store.append_snapshot(record)
            snapshot_records.append(record)
    for switch in net.switches:
        nid = node_id(run_id, switch.name)
        record = sample_ovs_flows(switch, run_id, nid)
        store.append_snapshot(record)
        snapshot_records.append(record)
    return snapshot_records


def _run_traffic_scenario(net, scenario):
    if scenario.kind != "ping":
        raise ValueError(f"unsupported traffic scenario: {scenario.kind}")
    dst_ip = net[scenario.dst].IP()
    redirect = " >/dev/null" if scenario.warmup else ""
    return f"ping -c{scenario.count} -W{scenario.timeout} {dst_ip}{redirect}"


def capture_packet_events(net, run_id, topology, scenarios, seconds=3):
    """Capture a short burst of tcpdump summary events on key interfaces."""
    capture_specs = build_capture_specs(topology, scenarios, mode=CAPTURE_MODE)
    popens = {}
    for spec in capture_specs:
        popens[(spec.node_name, spec.intf_name)] = net[spec.node_name].popen(
            tcpdump_command(spec.intf_name),
            shell=True,
        )
    sleep(0.5)

    for node_name in involved_node_names(scenarios):
        net[node_name].cmd("ip neigh flush all")

    commands_by_source = {}
    for scenario in scenarios:
        commands_by_source.setdefault(scenario.src, []).append(
            _run_traffic_scenario(net, scenario)
        )
    for src_name, commands in commands_by_source.items():
        net[src_name].sendCmd("sh -c '" + "; ".join(commands) + "'")

    end_time = time() + seconds
    event_payloads = []
    for label, line in pmonitor(popens, timeoutms=500):
        if time() >= end_time:
            break
        if not label or not line:
            continue
        node_name, intf_name = label
        node = net[node_name]
        event = parse_tcpdump_line(
            run_id,
            node_id(run_id, node.name),
            node.name,
            intf_id(run_id, node.name, intf_name),
            intf_name,
            line,
        )
        if event is not None:
            event_payloads.append(event.to_dict())

    for src_name in commands_by_source:
        if net[src_name].waiting:
            net[src_name].waitOutput()

    for process in popens.values():
        process.send_signal(SIGINT)
        process.wait(timeout=5)
    return event_payloads


if __name__ == "__main__":
    setLogLevel("info")
    net, r1 = build_net()
    try:
        run_id, meta, store, run_root, topology = bootstrap_run_store(net)
        snapshot_records = collect_snapshots(net, run_id, store)
        event_payloads = capture_packet_events(
            net,
            run_id,
            topology,
            TRAFFIC_SCENARIOS,
        )
        event_payloads = normalize_event_payloads(event_payloads)
        for event_payload in event_payloads:
            store.append_ndjson("events.ndjson", event_payload)
        trace_records = build_trace_records(event_payloads, topology=topology)
        for trace in trace_records:
            store.append_trace(trace)
        replay_frames = build_replay_frames(event_payloads, trace_records)
        for frame in replay_frames:
            store.append_replay_frame(frame)
        store.write_session(
            build_session_payload(run_id, meta, topology, replay_frames)
        )
        store.write_timeline(build_timeline_payload(replay_frames))
        store.write_snapshot_index(build_snapshot_index(snapshot_records))
        print("=== router routes ===")
        print(r1.cmd("ip route"))
        print("=== router interfaces ===")
        print(r1.cmd("ip -brief addr"))
        print("=== replay output ===")
        print(run_root)
        print("=== ping all ===")
        loss = net.pingAll(timeout="1")
        print("PINGLOSS", loss)
        print("=== sample cross-lan pings ===")
        for src, dst in VALIDATION_PINGS:
            out = net[src].cmd(f"ping -c1 -W1 {net[dst].IP()}")
            print(f"--- {src} -> {dst} ---")
            print(out)
        print("=== sample bandwidth ===")
        print("IPERF", net.iperf((net[IPERF_PAIR[0]], net[IPERF_PAIR[1]])))
    finally:
        net.stop()
