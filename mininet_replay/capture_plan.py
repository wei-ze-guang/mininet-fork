"""Capture planning helpers derived from exported topology and scenarios."""

from collections import defaultdict, deque
from dataclasses import dataclass


@dataclass(frozen=True)
class CaptureSpec:
    node_name: str
    intf_name: str


@dataclass(frozen=True)
class TrafficScenario:
    kind: str
    src: str
    dst: str
    count: int = 1
    timeout: int = 1
    warmup: bool = False


def involved_node_names(scenarios):
    names = set()
    for scenario in scenarios:
        names.add(scenario.src)
        names.add(scenario.dst)
    return names


def build_capture_specs(topology, scenarios, mode="path"):
    """Build deterministic capture specs for path, edge, or all capture modes."""
    interfaces = topology.get("interfaces", [])
    nodes_by_id = {node["node_id"]: node for node in topology.get("nodes", [])}
    intfs_by_id = {intf["intf_id"]: intf for intf in interfaces}

    selected_intf_ids = set()
    ordered_intf_ids = None
    if mode == "all":
        selected_intf_ids.update(intf["intf_id"] for intf in interfaces)
    elif mode == "edge":
        for intf in interfaces:
            node = nodes_by_id.get(intf["node_id"], {})
            if node.get("kind") in ("host", "router", "nat"):
                selected_intf_ids.add(intf["intf_id"])
    elif mode == "path":
        ordered_intf_ids = _scenario_path_interface_ids(
            topology, intfs_by_id, nodes_by_id, scenarios
        )
        selected_intf_ids.update(ordered_intf_ids)
    else:
        raise ValueError(f"unsupported capture mode: {mode}")

    if ordered_intf_ids is not None:
        return _specs_from_ordered_intf_ids(ordered_intf_ids, intfs_by_id, nodes_by_id)
    return _specs_from_intf_ids(selected_intf_ids, intfs_by_id, nodes_by_id)


def _scenario_path_interface_ids(topology, intfs_by_id, nodes_by_id, scenarios):
    graph = _build_intf_graph(topology)
    node_intfs = defaultdict(list)
    for intf in topology.get("interfaces", []):
        node = nodes_by_id.get(intf["node_id"])
        if node:
            node_intfs[node["mn_name"]].append(intf["intf_id"])

    selected = []
    seen = set()
    for scenario in scenarios:
        for src_intf in node_intfs.get(scenario.src, []):
            for dst_intf in node_intfs.get(scenario.dst, []):
                path = _shortest_path(graph, src_intf, dst_intf)
                for item in path:
                    if item in intfs_by_id and item not in seen:
                        selected.append(item)
                        seen.add(item)
    return selected


def _build_intf_graph(topology):
    graph = defaultdict(set)
    for intf in topology.get("interfaces", []):
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
        for neighbor in sorted(graph.get(current, ())):
            if neighbor in seen:
                continue
            next_path = path + [neighbor]
            if neighbor == target:
                return next_path
            seen.add(neighbor)
            queue.append((neighbor, next_path))
    return []


def _specs_from_intf_ids(intf_ids, intfs_by_id, nodes_by_id):
    specs = []
    for intf_id in intf_ids:
        intf = intfs_by_id[intf_id]
        node = nodes_by_id[intf["node_id"]]
        specs.append(CaptureSpec(node_name=node["mn_name"], intf_name=intf["mn_name"]))
    return sorted(specs, key=lambda item: (_node_sort_key(item.node_name), item.intf_name))


def _specs_from_ordered_intf_ids(intf_ids, intfs_by_id, nodes_by_id):
    specs = []
    for intf_id in intf_ids:
        intf = intfs_by_id[intf_id]
        node = nodes_by_id[intf["node_id"]]
        specs.append(CaptureSpec(node_name=node["mn_name"], intf_name=intf["mn_name"]))
    return specs


def _node_sort_key(name):
    if name.startswith("h"):
        group = 0
    elif name.startswith("r"):
        group = 1
    elif name.startswith("s"):
        group = 2
    else:
        group = 3
    return (group, name)
