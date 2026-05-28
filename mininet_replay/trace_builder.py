"""Build replay traces and replay frames from packet events and topology."""

from collections import defaultdict
from collections import deque

from mininet_replay.models import ReplayFrameRecord, TraceRecord


def _build_graph(topology):
    interfaces = {item["intf_id"]: item for item in topology.get("interfaces", [])}
    graph = defaultdict(set)
    for intf in interfaces.values():
        graph[intf["node_id"]].add(intf["intf_id"])
        graph[intf["intf_id"]].add(intf["node_id"])
    for link in topology.get("links", []):
        left = link["a_intf_id"]
        right = link["b_intf_id"]
        graph[left].add(right)
        graph[right].add(left)
    return graph


def _shortest_path(graph, start, target):
    if start == target:
        return [start]
    queue = deque([(start, [start])])
    seen = {start}
    while queue:
        current, path = queue.popleft()
        for neighbor in graph.get(current, ()):
            if neighbor in seen:
                continue
            next_path = path + [neighbor]
            if neighbor == target:
                return next_path
            seen.add(neighbor)
            queue.append((neighbor, next_path))
    return [start, target]


def _node_only(path_items):
    return [item for item in path_items if ":link:" not in item and item.count(":") == 1]


def build_trace_records(event_payloads, topology=None):
    """Build minimal trace steps from packet events."""
    grouped = defaultdict(list)
    for event in event_payloads:
        grouped[event["flow_id"]].append(event)

    graph = _build_graph(topology or {})
    traces = []
    for flow_id, events in grouped.items():
        events.sort(key=lambda item: item["ts"])
        path = []
        previous_node = None
        for index, event in enumerate(events, start=1):
            current_node = event["node_id"]
            if previous_node is None:
                if current_node not in path:
                    path.append(current_node)
            else:
                expanded = _node_only(_shortest_path(graph, previous_node, current_node))
                for item in expanded[1:]:
                    if item not in path:
                        path.append(item)
            traces.append(
                TraceRecord(
                    ts=event["ts"],
                    run_id=event["run_id"],
                    flow_id=flow_id,
                    step_index=index,
                    current_node=current_node,
                    current_intf=event.get("intf_id"),
                    next_hop=event.get("dst_ip") or event.get("arp_target_ip"),
                    path=list(path),
                    final_destination=events[-1]["node_id"],
                    evidence_sources=["packet_event"],
                    confidence="medium",
                )
            )
            previous_node = current_node
    return traces


def build_replay_frames(event_payloads, trace_records):
    """Build front-end friendly replay frames from events and traces."""
    events_by_key = defaultdict(list)
    for event in event_payloads:
        events_by_key[(event["flow_id"], event["ts"])].append(event)

    frames = []
    for index, trace in enumerate(trace_records, start=1):
        trace_dict = trace.to_dict() if hasattr(trace, "to_dict") else trace
        event_candidates = events_by_key.get((trace_dict["flow_id"], trace_dict["ts"]), [])
        event = event_candidates[0] if event_candidates else {}
        frames.append(
            ReplayFrameRecord(
                ts=trace_dict["ts"],
                run_id=trace_dict["run_id"],
                flow_id=trace_dict["flow_id"],
                frame_index=index,
                current_node=trace_dict["current_node"],
                current_intf=trace_dict["current_intf"],
                next_hop=trace_dict["next_hop"],
                path=trace_dict["path"],
                final_destination=trace_dict["final_destination"],
                proto=event.get("proto"),
                context={
                    "event": event,
                },
                evidence_sources=trace_dict["evidence_sources"],
                confidence=trace_dict["confidence"],
            )
        )
    return frames


def build_timeline_payload(replay_frames):
    """Build a compact timeline index for front-end playback."""
    frame_dicts = [
        frame.to_dict() if hasattr(frame, "to_dict") else frame
        for frame in replay_frames
    ]
    flow_groups = defaultdict(list)
    for frame in frame_dicts:
        flow_groups[frame["flow_id"]].append(frame)

    flows = []
    for flow_id, frames in sorted(flow_groups.items()):
        frames.sort(key=lambda item: (item["ts"], item["frame_index"]))
        flows.append(
            {
                "flow_id": flow_id,
                "proto": frames[0].get("proto"),
                "started_at": frames[0]["ts"],
                "ended_at": frames[-1]["ts"],
                "frame_count": len(frames),
                "source_node": frames[0]["current_node"],
                "final_destination": frames[-1]["final_destination"],
                "path": frames[-1]["path"],
            }
        )

    return {
        "frame_count": len(frame_dicts),
        "flow_count": len(flows),
        "flows": flows,
    }


def build_session_payload(run_id, meta, topology, replay_frames):
    """Build a run-level session summary for discovery and playback."""
    frame_dicts = [
        frame.to_dict() if hasattr(frame, "to_dict") else frame
        for frame in replay_frames
    ]
    time_bounds = [frame["ts"] for frame in frame_dicts]
    nodes = topology.get("nodes", [])
    interfaces = topology.get("interfaces", [])
    links = topology.get("links", [])

    return {
        "run_id": run_id,
        "started_at": meta.started_at,
        "packet_protocols": meta.packet_protocols,
        "sampler_interval_ms": meta.sampler_interval_ms,
        "node_count": len(nodes),
        "interface_count": len(interfaces),
        "link_count": len(links),
        "frame_count": len(frame_dicts),
        "first_frame_ts": min(time_bounds) if time_bounds else None,
        "last_frame_ts": max(time_bounds) if time_bounds else None,
    }


def build_snapshot_index(snapshot_records):
    """Build a front-end friendly index over snapshot records."""
    records = [
        record.to_dict() if hasattr(record, "to_dict") else record
        for record in snapshot_records
    ]
    nodes = {}
    tables = defaultdict(list)

    for index, record in enumerate(records):
        node_entry = nodes.setdefault(
            record["node_id"],
            {
                "node_id": record["node_id"],
                "mn_name": record["mn_name"],
                "kind": record["kind"],
                "tables": {},
            },
        )
        table_entry = node_entry["tables"].setdefault(
            record["table"],
            {
                "table": record["table"],
                "count": 0,
                "first_ts": record["ts"],
                "last_ts": record["ts"],
                "record_indexes": [],
            },
        )
        table_entry["count"] += 1
        table_entry["first_ts"] = min(table_entry["first_ts"], record["ts"])
        table_entry["last_ts"] = max(table_entry["last_ts"], record["ts"])
        table_entry["record_indexes"].append(index)
        tables[record["table"]].append(record["ts"])

    table_summary = {}
    for table_name, timestamps in tables.items():
        table_summary[table_name] = {
            "count": len(timestamps),
            "first_ts": min(timestamps),
            "last_ts": max(timestamps),
        }

    return {
        "record_count": len(records),
        "nodes": nodes,
        "tables": table_summary,
    }
