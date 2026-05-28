"""Packet summary capture helpers."""

from collections import defaultdict
import re
import time

from mininet_replay.models import EventRecord


def tcpdump_command(intf_name):
    """Return the summary tcpdump command for one interface."""
    return f"tcpdump -l -n -e -tt -i {intf_name} 'arp or icmp or tcp or udp'"


def infer_flow_id(proto, src_ip=None, dst_ip=None, src_port=None, dst_port=None,
                  arp_sender_ip=None, arp_target_ip=None):
    """Build a stable-enough first-version flow identifier."""
    if proto == "ARP":
        return f"arp:{arp_sender_ip}->{arp_target_ip}"
    left = f"{src_ip}:{src_port}" if src_port else src_ip
    right = f"{dst_ip}:{dst_port}" if dst_port else dst_ip
    return f"{proto.lower()}:{left}->{right}"


def parse_tcpdump_line(run_id, node_id_value, node_name, intf_id_value, intf_name, line):
    """Parse one tcpdump summary line into an event record."""
    line = line.strip()
    if not line:
        return None

    ts_match = re.match(r"^(\d+\.\d+)", line)
    ts = float(ts_match.group(1)) if ts_match else time.time()

    if "ethertype ARP" in line or "ARP," in line:
        request_match = re.search(
            r"(?:ARP,\s*)?Request who-has ([0-9.]+) tell ([0-9.]+)",
            line,
        )
        reply_match = re.search(r"(?:ARP,\s*)?Reply ([0-9.]+) is-at", line)
        if request_match:
            target_ip, sender_ip = request_match.group(1), request_match.group(2)
            return EventRecord(
                ts=ts,
                run_id=run_id,
                flow_id=infer_flow_id(
                    "ARP",
                    arp_sender_ip=sender_ip,
                    arp_target_ip=target_ip,
                ),
                node_id=node_id_value,
                mn_name=node_name,
                intf_id=intf_id_value,
                intf_name=intf_name,
                proto="ARP",
                fields={
                    "arp_op": "request",
                    "arp_sender_ip": sender_ip,
                    "arp_target_ip": target_ip,
                    "raw": line,
                },
            )
        if reply_match:
            sender_ip = reply_match.group(1)
            return EventRecord(
                ts=ts,
                run_id=run_id,
                flow_id=infer_flow_id(
                    "ARP",
                    arp_sender_ip=sender_ip,
                    arp_target_ip=sender_ip,
                ),
                node_id=node_id_value,
                mn_name=node_name,
                intf_id=intf_id_value,
                intf_name=intf_name,
                proto="ARP",
                fields={
                    "arp_op": "reply",
                    "arp_sender_ip": sender_ip,
                    "arp_target_ip": sender_ip,
                    "raw": line,
                },
            )

    ip_match = re.search(
        r"ethertype IPv4 .*: ([0-9.]+)(?:\.(\d+))? > ([0-9.]+)(?:\.(\d+))?:",
        line,
    )
    if not ip_match:
        return None
    src_ip, src_port, dst_ip, dst_port = ip_match.groups()
    if "ICMP" in line:
        proto = "ICMP"
    elif "Flags" in line or "seq " in line:
        proto = "TCP"
    elif "UDP" in line:
        proto = "UDP"
    else:
        proto = "IP"
    return EventRecord(
        ts=ts,
        run_id=run_id,
        flow_id=infer_flow_id(proto, src_ip, dst_ip, src_port, dst_port),
        node_id=node_id_value,
        mn_name=node_name,
        intf_id=intf_id_value,
        intf_name=intf_name,
        proto=proto,
        fields={
            "src_ip": src_ip,
            "dst_ip": dst_ip,
            "src_port": src_port,
            "dst_port": dst_port,
            "raw": line,
        },
    )


def normalize_event_payloads(event_payloads, max_pair_gap=1.0):
    """Normalize raw event payloads, pairing ARP replies with recent requests."""
    requests_by_target = defaultdict(list)
    normalized = []

    for event in sorted(event_payloads, key=lambda item: item["ts"]):
        item = dict(event)
        if item.get("proto") == "ARP":
            arp_op = item.get("arp_op")
            if arp_op == "request":
                requests_by_target[item["arp_target_ip"]].append(item)
            elif arp_op == "reply":
                sender_ip = item.get("arp_sender_ip")
                candidates = requests_by_target.get(sender_ip, [])
                chosen = None
                for candidate in reversed(candidates):
                    if item["ts"] - candidate["ts"] <= max_pair_gap:
                        chosen = candidate
                        break
                if chosen is not None:
                    item["arp_target_ip"] = chosen["arp_sender_ip"]
                    item["flow_id"] = infer_flow_id(
                        "ARP",
                        arp_sender_ip=item["arp_sender_ip"],
                        arp_target_ip=item["arp_target_ip"],
                    )
        normalized.append(item)

    return normalized
