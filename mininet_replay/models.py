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


@dataclass
class ReplayFrameRecord:
    ts: float
    run_id: str
    flow_id: str
    frame_index: int
    current_node: str
    current_intf: Optional[str]
    next_hop: Optional[str]
    path: List[str]
    final_destination: Optional[str]
    proto: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)
    evidence_sources: List[str] = field(default_factory=list)
    confidence: str = "medium"

    def to_dict(self):
        return asdict(self)
