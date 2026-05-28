"""Static topology export helpers."""

from mininet_replay.ids import intf_id, link_id, node_id
from mininet_replay.models import InterfaceRecord, LinkRecord, NodeRecord


def _kind(node):
    cls_name = node.__class__.__name__.lower()
    if "switch" in cls_name or "bridge" in cls_name:
        return "ovs" if "ovs" in cls_name else "switch"
    if "nat" in cls_name:
        return "nat"
    if "router" in cls_name:
        return "router"
    return "host"


def export_topology(net, run_id):
    """Export static nodes, interfaces, and links for one run."""
    node_records = []
    interface_records = []
    link_records = []
    seen_links = set()

    for node in net.hosts + net.switches + net.controllers:
        nid = node_id(run_id, node.name)
        node_ips = []
        node_macs = []
        for intf in node.intfList():
            if intf.name == "lo":
                continue
            iid = intf_id(run_id, node.name, intf.name)
            ip_addr = intf.IP()
            mac_addr = intf.MAC()
            if ip_addr:
                node_ips.append(ip_addr)
            if mac_addr:
                node_macs.append(mac_addr)
            interface_records.append(
                InterfaceRecord(
                    intf_id=iid,
                    node_id=nid,
                    mn_name=intf.name,
                    mac=mac_addr,
                    ip_addrs=[ip_addr] if ip_addr else [],
                ).to_dict()
            )
            if intf.link:
                other = intf.link.intf1 if intf.link.intf2 is intf else intf.link.intf2
                key = tuple(
                    sorted(
                        (
                            (intf.node.name, intf.name),
                            (other.node.name, other.name),
                        )
                    )
                )
                if key not in seen_links:
                    seen_links.add(key)
                    left_node, left_intf = key[0]
                    right_node, right_intf = key[1]
                    link_records.append(
                        LinkRecord(
                            link_id=link_id(run_id, left_intf, right_intf),
                            a_intf_id=intf_id(run_id, left_node, left_intf),
                            b_intf_id=intf_id(run_id, right_node, right_intf),
                        ).to_dict()
                    )

        node_records.append(
            NodeRecord(
                node_id=nid,
                mn_name=node.name,
                kind=_kind(node),
                ip_addrs=node_ips,
                mac_addrs=node_macs,
            ).to_dict()
        )

    return {
        "nodes": node_records,
        "interfaces": interface_records,
        "links": link_records,
    }
