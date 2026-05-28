# Mininet Replay Collector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a first-version replay collector for Mininet that exports structured topology, annotations, periodic table snapshots, packet summary events, and replay trace steps for later rendering and playback.

**Architecture:** Add a small Python package dedicated to run storage, ID generation, topology export, state sampling, packet summary collection, and trace reconstruction. Integrate it into the existing multi-LAN demo first so we can validate the whole pipeline on the current Ubuntu 20.04 server before broadening scope.

**Tech Stack:** Python 3, Mininet, Open vSwitch, tcpdump, NDJSON/JSON

---

### Task 1: Create Run Data Model Skeleton

**Files:**
- Create: `mininet_replay/__init__.py`
- Create: `mininet_replay/ids.py`
- Create: `mininet_replay/models.py`

- [ ] **Step 1: Create package entrypoint**

Use `mininet_replay/__init__.py`:

```python
"""Replay data collection helpers for Mininet experiments."""
```

- [ ] **Step 2: Add stable ID helpers**

Use `mininet_replay/ids.py`:

```python
"""Stable ID helpers for replay collector objects."""

from datetime import datetime
from itertools import count


_run_counter = count(1)


def new_run_id(now=None):
    """Return a stable run identifier for one collector execution."""
    now = now or datetime.utcnow()
    return f"run_{now:%Y%m%d_%H%M%S}_{next(_run_counter):03d}"


def node_id(run_id, mn_name):
    return f"{run_id}:{mn_name}"


def intf_id(run_id, node_name, intf_name):
    return f"{run_id}:{node_name}:{intf_name}"


def link_id(run_id, intf_a, intf_b):
    return f"{run_id}:link:{intf_a}__{intf_b}"
```

- [ ] **Step 3: Add core dataclass models**

Use `mininet_replay/models.py`:

```python
"""Typed replay collector records."""

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class RunMeta:
    run_id: str
    started_at: str
    sampler_interval_ms: int
    packet_protocols: List[str]
    packet_capture_mode: str = "summary"
    version: int = 1

    def to_dict(self):
        return asdict(self)


@dataclass
class NodeRecord:
    node_id: str
    mn_name: str
    kind: str
    ip_addrs: List[str] = field(default_factory=list)
    mac_addrs: List[str] = field(default_factory=list)

    def to_dict(self):
        return asdict(self)


@dataclass
class InterfaceRecord:
    intf_id: str
    node_id: str
    mn_name: str
    mac: Optional[str] = None
    ip_addrs: List[str] = field(default_factory=list)

    def to_dict(self):
        return asdict(self)


@dataclass
class LinkRecord:
    link_id: str
    a_intf_id: str
    b_intf_id: str

    def to_dict(self):
        return asdict(self)


@dataclass
class SnapshotRecord:
    ts: float
    run_id: str
    node_id: str
    mn_name: str
    kind: str
    table: str
    data: List[Dict[str, Any]]

    def to_dict(self):
        return asdict(self)


@dataclass
class EventRecord:
    ts: float
    run_id: str
    flow_id: str
    node_id: str
    mn_name: str
    intf_id: str
    intf_name: str
    proto: str
    fields: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self):
        payload = asdict(self)
        payload.update(payload.pop("fields"))
        return payload


@dataclass
class TraceRecord:
    ts: float
    run_id: str
    flow_id: str
    step_index: int
    current_node: str
    current_intf: Optional[str]
    next_hop: Optional[str]
    path: List[str]
    final_destination: Optional[str]
    evidence_sources: List[str]
    confidence: str

    def to_dict(self):
        return asdict(self)
```

- [ ] **Step 4: Sanity-check imports**

Run:

```bash
python3 - <<'PY'
from mininet_replay.ids import new_run_id, node_id
from mininet_replay.models import RunMeta
print(new_run_id())
print(node_id("run_x", "h1"))
print(RunMeta("run_x", "2026-05-27T00:00:00Z", 1000, ["ARP"]).to_dict())
PY
```

Expected: prints a run id, a node id, and a dict without errors

- [ ] **Step 5: Commit**

```bash
git add mininet_replay/__init__.py mininet_replay/ids.py mininet_replay/models.py
git commit -m "feat: add replay collector data models"
```

### Task 2: Add Run Storage Writer

**Files:**
- Create: `mininet_replay/run_store.py`
- Test: `mininet_replay/models.py`

- [ ] **Step 1: Write a failing storage smoke test**

Use:

```python
from pathlib import Path
from mininet_replay.run_store import RunStore
from mininet_replay.models import RunMeta

root = Path("tmp_run_store_test")
store = RunStore(root)
meta = RunMeta("run_x", "2026-05-27T00:00:00Z", 1000, ["ARP"])
store.write_meta(meta)
assert (root / "meta.json").exists()
```

- [ ] **Step 2: Verify it fails correctly**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
from mininet_replay.run_store import RunStore
PY
```

Expected: `ModuleNotFoundError` for `mininet_replay.run_store`

- [ ] **Step 3: Implement run storage**

Use `mininet_replay/run_store.py`:

```python
"""Filesystem writer for replay run artifacts."""

import json
from pathlib import Path


class RunStore:
    def __init__(self, root):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def write_json(self, name, payload):
        path = self.root / name
        path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
        return path

    def append_ndjson(self, name, payload):
        path = self.root / name
        with path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(payload, sort_keys=True) + "\n")
        return path

    def write_meta(self, meta):
        return self.write_json("meta.json", meta.to_dict())

    def write_topology(self, payload):
        return self.write_json("topology.json", payload)

    def write_annotations(self, payload):
        return self.write_json("annotations.json", payload)

    def append_snapshot(self, record):
        return self.append_ndjson("snapshots.ndjson", record.to_dict())

    def append_event(self, record):
        return self.append_ndjson("events.ndjson", record.to_dict())

    def append_trace(self, record):
        return self.append_ndjson("traces.ndjson", record.to_dict())
```

- [ ] **Step 4: Verify storage works**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
from shutil import rmtree
from mininet_replay.models import RunMeta
from mininet_replay.run_store import RunStore

root = Path("tmp_run_store_test")
if root.exists():
    rmtree(root)
store = RunStore(root)
store.write_meta(RunMeta("run_x", "2026-05-27T00:00:00Z", 1000, ["ARP"]))
print((root / "meta.json").exists())
PY
```

Expected: prints `True`

- [ ] **Step 5: Commit**

```bash
git add mininet_replay/run_store.py
git commit -m "feat: add replay run storage writer"
```

### Task 3: Export Static Topology

**Files:**
- Create: `mininet_replay/topology_exporter.py`
- Modify: `mininet_replay/models.py`

- [ ] **Step 1: Write a failing topology export smoke test**

Use:

```python
from mininet.net import Mininet
from mininet.topo import MinimalTopo
from mininet.node import OVSBridge, Host
from mininet_replay.topology_exporter import export_topology

net = Mininet(topo=MinimalTopo(), switch=OVSBridge, controller=None, host=Host)
payload = export_topology(net, "run_x")
assert "nodes" in payload and "interfaces" in payload and "links" in payload
```

- [ ] **Step 2: Verify it fails**

Run:

```bash
python3 - <<'PY'
from mininet_replay.topology_exporter import export_topology
PY
```

Expected: `ModuleNotFoundError`

- [ ] **Step 3: Implement topology export**

Use `mininet_replay/topology_exporter.py`:

```python
"""Static topology export helpers."""

from mininet_replay.ids import intf_id, link_id, node_id
from mininet_replay.models import InterfaceRecord, LinkRecord, NodeRecord


def _kind(node):
    cls = node.__class__.__name__.lower()
    if "switch" in cls or "bridge" in cls:
        return "ovs" if "ovs" in cls else "switch"
    if "nat" in cls:
        return "nat"
    if "router" in cls:
        return "router"
    return "host"


def export_topology(net, run_id):
    nodes, interfaces, links = [], [], []
    seen_links = set()

    for node in net.hosts + net.switches + net.controllers:
        nid = node_id(run_id, node.name)
        node_ips = []
        node_macs = []
        for intf in node.intfList():
            if intf.name == "lo":
                continue
            iid = intf_id(run_id, node.name, intf.name)
            ip = intf.IP()
            mac = intf.MAC()
            if ip:
                node_ips.append(ip)
            if mac:
                node_macs.append(mac)
            interfaces.append(
                InterfaceRecord(
                    intf_id=iid,
                    node_id=nid,
                    mn_name=intf.name,
                    mac=mac,
                    ip_addrs=[ip] if ip else [],
                ).to_dict()
            )
            if intf.link:
                other = intf.link.intf1 if intf.link.intf2 is intf else intf.link.intf2
                key = tuple(sorted((intf.name, other.name)))
                if key not in seen_links:
                    seen_links.add(key)
                    links.append(
                        LinkRecord(
                            link_id=link_id(run_id, key[0], key[1]),
                            a_intf_id=intf_id(run_id, intf.node.name, intf.name),
                            b_intf_id=intf_id(run_id, other.node.name, other.name),
                        ).to_dict()
                    )

        nodes.append(
            NodeRecord(
                node_id=nid,
                mn_name=node.name,
                kind=_kind(node),
                ip_addrs=node_ips,
                mac_addrs=node_macs,
            ).to_dict()
        )

    return {"nodes": nodes, "interfaces": interfaces, "links": links}
```

- [ ] **Step 4: Verify topology export**

Run:

```bash
python3 - <<'PY'
from mininet.net import Mininet
from mininet.topo import MinimalTopo
from mininet.node import OVSBridge, Host
from mininet_replay.topology_exporter import export_topology

net = Mininet(topo=MinimalTopo(), switch=OVSBridge, controller=None, host=Host, build=True)
try:
    payload = export_topology(net, "run_x")
    print(len(payload["nodes"]), len(payload["interfaces"]), len(payload["links"]))
finally:
    net.stop()
PY
```

Expected: prints non-zero counts

- [ ] **Step 5: Commit**

```bash
git add mininet_replay/topology_exporter.py
git commit -m "feat: export replay topology records"
```

### Task 4: Add Annotation Bootstrap

**Files:**
- Create: `mininet_replay/annotations.py`

- [ ] **Step 1: Add annotation bootstrap helper**

Use `mininet_replay/annotations.py`:

```python
"""Helpers for replay annotation payloads."""


def empty_annotations():
    return {
        "nodes": {},
        "interfaces": {},
        "links": {},
        "flows": {},
    }
```

- [ ] **Step 2: Verify helper output**

Run:

```bash
python3 - <<'PY'
from mininet_replay.annotations import empty_annotations
print(sorted(empty_annotations().keys()))
PY
```

Expected: prints `['flows', 'interfaces', 'links', 'nodes']`

- [ ] **Step 3: Commit**

```bash
git add mininet_replay/annotations.py
git commit -m "feat: add replay annotation bootstrap"
```

### Task 5: Add Route and Neighbor Samplers

**Files:**
- Create: `mininet_replay/samplers.py`

- [ ] **Step 1: Write minimal parser functions**

Use `mininet_replay/samplers.py`:

```python
"""State samplers for host, router, and ovs nodes."""

import json
import re
import time

from mininet_replay.models import SnapshotRecord


def sample_routes(node, run_id, node_id_value, kind):
    lines = node.cmd("ip -j route").strip()
    data = json.loads(lines) if lines else []
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind=kind,
        table="routes",
        data=data,
    )


def sample_neighbors(node, run_id, node_id_value, kind):
    lines = node.cmd("ip -j neigh").strip()
    data = json.loads(lines) if lines else []
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind=kind,
        table="neighbors",
        data=data,
    )


def sample_link_stats(node, run_id, node_id_value, kind):
    lines = node.cmd("ip -j -s link").strip()
    data = json.loads(lines) if lines else []
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind=kind,
        table="link_stats",
        data=data,
    )


def parse_ovs_flows(raw):
    records = []
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("NXST_") or line.startswith("OFPST_"):
            continue
        records.append({"raw": line})
    return records


def sample_ovs_flows(node, run_id, node_id_value):
    raw = node.dpctl("dump-flows")
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind="ovs",
        table="flows",
        data=parse_ovs_flows(raw),
    )
```

- [ ] **Step 2: Verify parsers and commands**

Run:

```bash
python3 - <<'PY'
from mininet.net import Mininet
from mininet.topo import MinimalTopo
from mininet.node import OVSBridge, Host
from mininet_replay.ids import node_id
from mininet_replay.samplers import sample_routes, sample_neighbors, sample_link_stats, sample_ovs_flows

net = Mininet(topo=MinimalTopo(), switch=OVSBridge, controller=None, host=Host, build=True)
try:
    net.start()
    host = net["h1"]
    sw = net["s1"]
    print(sample_routes(host, "run_x", node_id("run_x", "h1"), "host").table)
    print(sample_neighbors(host, "run_x", node_id("run_x", "h1"), "host").table)
    print(sample_link_stats(host, "run_x", node_id("run_x", "h1"), "host").table)
    print(sample_ovs_flows(sw, "run_x", node_id("run_x", "s1")).table)
finally:
    net.stop()
PY
```

Expected: prints `routes`, `neighbors`, `link_stats`, `flows`

- [ ] **Step 3: Commit**

```bash
git add mininet_replay/samplers.py
git commit -m "feat: add replay state samplers"
```

### Task 6: Add Packet Summary Collector

**Files:**
- Create: `mininet_replay/packet_capture.py`

- [ ] **Step 1: Add tcpdump command builder and parser**

Use `mininet_replay/packet_capture.py`:

```python
"""Packet summary capture helpers."""

import re
import time

from mininet_replay.models import EventRecord


def tcpdump_command(intf_name):
    return (
        f"tcpdump -l -n -e -tt -i {intf_name} "
        "'arp or icmp or tcp or udp'"
    )


def infer_flow_id(proto, src_ip=None, dst_ip=None, src_port=None, dst_port=None,
                  arp_sender_ip=None, arp_target_ip=None):
    if proto == "ARP":
        return f"arp:{arp_sender_ip}->{arp_target_ip}"
    left = f"{src_ip}:{src_port}" if src_port else src_ip
    right = f"{dst_ip}:{dst_port}" if dst_port else dst_ip
    return f"{proto.lower()}:{left}->{right}"


def parse_tcpdump_line(run_id, node_id_value, node_name, intf_id_value, intf_name, line):
    line = line.strip()
    if not line:
        return None

    ts_match = re.match(r"^(\\d+\\.\\d+)", line)
    ts = float(ts_match.group(1)) if ts_match else time.time()

    if "ARP," in line:
        sender = re.search(r"ARP, Request who-has ([0-9.]+) tell ([0-9.]+)", line)
        reply = re.search(r"ARP, Reply ([0-9.]+) is-at", line)
        if sender:
            target_ip, sender_ip = sender.group(1), sender.group(2)
            return EventRecord(
                ts=ts,
                run_id=run_id,
                flow_id=infer_flow_id("ARP", arp_sender_ip=sender_ip, arp_target_ip=target_ip),
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
        if reply:
            sender_ip = reply.group(1)
            return EventRecord(
                ts=ts,
                run_id=run_id,
                flow_id=infer_flow_id("ARP", arp_sender_ip=sender_ip, arp_target_ip=sender_ip),
                node_id=node_id_value,
                mn_name=node_name,
                intf_id=intf_id_value,
                intf_name=intf_name,
                proto="ARP",
                fields={
                    "arp_op": "reply",
                    "arp_sender_ip": sender_ip,
                    "raw": line,
                },
            )

    ip_match = re.search(r"([0-9.]+)(?:\\.(\\d+))? > ([0-9.]+)(?:\\.(\\d+))?:", line)
    if not ip_match:
        return None
    src_ip, src_port, dst_ip, dst_port = ip_match.groups()
    proto = "TCP" if "Flags" in line else "UDP" if "UDP" in line else "ICMP"
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
```

- [ ] **Step 2: Verify parser behavior**

Run:

```bash
python3 - <<'PY'
from mininet_replay.packet_capture import parse_tcpdump_line

line1 = "1710000000.210 ARP, Request who-has 10.0.1.1 tell 10.0.1.11, length 28"
line2 = "1710000000.220 IP 10.0.1.11 > 10.0.2.11: ICMP echo request, id 1, seq 1, length 64"

print(parse_tcpdump_line("run_x", "run_x:h1", "h1", "run_x:h1:h1-eth0", "h1-eth0", line1).to_dict()["proto"])
print(parse_tcpdump_line("run_x", "run_x:h1", "h1", "run_x:h1:h1-eth0", "h1-eth0", line2).to_dict()["proto"])
PY
```

Expected: prints `ARP` and `ICMP`

- [ ] **Step 3: Commit**

```bash
git add mininet_replay/packet_capture.py
git commit -m "feat: add packet summary parser"
```

### Task 7: Add Initial Trace Builder

**Files:**
- Create: `mininet_replay/trace_builder.py`

- [ ] **Step 1: Implement minimal grouping and step emission**

Use `mininet_replay/trace_builder.py`:

```python
"""Build replay traces from packet events and snapshots."""

from collections import defaultdict

from mininet_replay.models import TraceRecord


def build_trace_records(event_payloads):
    grouped = defaultdict(list)
    for event in event_payloads:
        grouped[event["flow_id"]].append(event)

    traces = []
    for flow_id, events in grouped.items():
        events.sort(key=lambda item: item["ts"])
        path = []
        for index, event in enumerate(events, start=1):
            if event["node_id"] not in path:
                path.append(event["node_id"])
            traces.append(
                TraceRecord(
                    ts=event["ts"],
                    run_id=event["run_id"],
                    flow_id=flow_id,
                    step_index=index,
                    current_node=event["node_id"],
                    current_intf=event.get("intf_id"),
                    next_hop=event.get("dst_ip") or event.get("arp_target_ip"),
                    path=list(path),
                    final_destination=events[-1]["node_id"],
                    evidence_sources=["packet_event"],
                    confidence="medium",
                )
            )
    return traces
```

- [ ] **Step 2: Verify builder output**

Run:

```bash
python3 - <<'PY'
from mininet_replay.trace_builder import build_trace_records

events = [
    {"ts": 1.0, "run_id": "run_x", "flow_id": "icmp:1->2", "node_id": "run_x:h1", "intf_id": "i1", "dst_ip": "10.0.0.2"},
    {"ts": 2.0, "run_id": "run_x", "flow_id": "icmp:1->2", "node_id": "run_x:s1", "intf_id": "i2", "dst_ip": "10.0.0.2"},
]
traces = build_trace_records(events)
print(len(traces))
print(traces[-1].path)
PY
```

Expected: prints `2` and `['run_x:h1', 'run_x:s1']`

- [ ] **Step 3: Commit**

```bash
git add mininet_replay/trace_builder.py
git commit -m "feat: add initial replay trace builder"
```

### Task 8: Integrate Collector Into Multi-LAN Demo

**Files:**
- Modify: `wzg-docs/run_multilan_demo.py`

- [ ] **Step 1: Add run directory bootstrap and topology export**

Update `wzg-docs/run_multilan_demo.py` to:

```python
from pathlib import Path
from datetime import datetime

from mininet_replay.annotations import empty_annotations
from mininet_replay.ids import new_run_id, node_id
from mininet_replay.models import RunMeta
from mininet_replay.run_store import RunStore
from mininet_replay.topology_exporter import export_topology
```

and initialize:

```python
run_id = new_run_id()
run_root = Path("runs") / run_id
store = RunStore(run_root)
store.write_meta(
    RunMeta(
        run_id=run_id,
        started_at=datetime.utcnow().isoformat() + "Z",
        sampler_interval_ms=1000,
        packet_protocols=["ARP", "ICMP", "TCP", "UDP"],
    )
)
store.write_annotations(empty_annotations())
store.write_topology(export_topology(net, run_id))
```

- [ ] **Step 2: Add one-shot snapshot collection**

In the demo, after `net.start()`, capture at least:

```python
for node in net.hosts:
    kind = "router" if node.name == "r1" else "host"
    nid = node_id(run_id, node.name)
    store.append_snapshot(sample_routes(node, run_id, nid, kind))
    store.append_snapshot(sample_neighbors(node, run_id, nid, kind))
    store.append_snapshot(sample_link_stats(node, run_id, nid, kind))
for switch in net.switches:
    nid = node_id(run_id, switch.name)
    store.append_snapshot(sample_ovs_flows(switch, run_id, nid))
```

- [ ] **Step 3: Add initial packet-event capture hook**

For first version, generate one event by parsing sample `tcpdump` lines captured during a targeted ping or ARP-triggering command. Keep it minimal but real.

- [ ] **Step 4: Build traces from stored events**

After collecting events:

```python
trace_records = build_trace_records(event_dicts)
for trace in trace_records:
    store.append_trace(trace)
```

- [ ] **Step 5: Verify local demo output**

Run:

```bash
python3 wzg-docs/run_multilan_demo.py
find runs -maxdepth 2 -type f | sort | tail -20
```

Expected: creates `meta.json`, `topology.json`, `annotations.json`, `snapshots.ndjson`, `events.ndjson`, `traces.ndjson`

- [ ] **Step 6: Commit**

```bash
git add wzg-docs/run_multilan_demo.py
git commit -m "feat: integrate replay collector into multilan demo"
```

### Task 9: Verify On Remote Server

**Files:**
- Modify: none locally
- Test: remote `/root/mininet-fork-clean` and `/root/run_multilan_demo.py`

- [ ] **Step 1: Sync updated files to server**

Run:

```bash
scp -P 28413 -i /Users/macbook/.ssh/mininet_server_ed25519 -r \
  mininet_replay wzg-docs/run_multilan_demo.py \
  root@43.228.78.156:/root/mininet-fork-clean/
```

Expected: copy completes successfully

- [ ] **Step 2: Run demo on server**

Run:

```bash
ssh -i /Users/macbook/.ssh/mininet_server_ed25519 -p 28413 root@43.228.78.156 \
  'cd /root/mininet-fork-clean && PATH=/root/mininet-fork-clean:$PATH PYTHONPATH=/root/mininet-fork-clean python3 run_multilan_demo.py'
```

Expected: network still comes up and replay output files are generated

- [ ] **Step 3: Verify artifact set**

Run:

```bash
ssh -i /Users/macbook/.ssh/mininet_server_ed25519 -p 28413 root@43.228.78.156 \
  'cd /root/mininet-fork-clean && find runs -maxdepth 2 -type f | sort | tail -20'
```

Expected: run directory includes all six artifact files

- [ ] **Step 4: Inspect sample contents**

Run:

```bash
ssh -i /Users/macbook/.ssh/mininet_server_ed25519 -p 28413 root@43.228.78.156 \
  'cd /root/mininet-fork-clean && latest=$(ls -1 runs | tail -1) && \
   echo META && sed -n "1,80p" runs/$latest/meta.json && \
   echo TOPO && sed -n "1,80p" runs/$latest/topology.json && \
   echo SNAP && sed -n "1,5p" runs/$latest/snapshots.ndjson && \
   echo EVENT && sed -n "1,5p" runs/$latest/events.ndjson && \
   echo TRACE && sed -n "1,5p" runs/$latest/traces.ndjson'
```

Expected: all files contain structured JSON/NDJSON records

- [ ] **Step 5: Commit**

```bash
git add mininet_replay wzg-docs/run_multilan_demo.py
git commit -m "test: validate replay collector on remote mininet server"
```
