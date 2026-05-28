"""State samplers for host, router, and ovs nodes."""

import json
import time

from mininet_replay.models import SnapshotRecord


def _json_cmd(node, command):
    output = node.cmd(command).strip()
    return json.loads(output) if output else []


def sample_routes(node, run_id, node_id_value, kind):
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind=kind,
        table="routes",
        data=_json_cmd(node, "ip -j route"),
    )


def sample_neighbors(node, run_id, node_id_value, kind):
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind=kind,
        table="neighbors",
        data=_json_cmd(node, "ip -j neigh"),
    )


def sample_link_stats(node, run_id, node_id_value, kind):
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind=kind,
        table="link_stats",
        data=_json_cmd(node, "ip -j -s link"),
    )


def parse_ovs_flows(raw_output):
    records = []
    for line in raw_output.splitlines():
        line = line.strip()
        if not line or line.startswith("NXST_") or line.startswith("OFPST_"):
            continue
        records.append({"raw": line})
    return records


def sample_ovs_flows(node, run_id, node_id_value):
    return SnapshotRecord(
        ts=time.time(),
        run_id=run_id,
        node_id=node_id_value,
        mn_name=node.name,
        kind="ovs",
        table="flows",
        data=parse_ovs_flows(node.dpctl("dump-flows")),
    )
