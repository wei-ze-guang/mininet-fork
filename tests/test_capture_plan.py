import unittest

from mininet_replay.capture_plan import (
    TrafficScenario,
    build_capture_specs,
    involved_node_names,
)


RUN_ID = "run_test"


def node(name, kind="host"):
    return {"node_id": f"{RUN_ID}:{name}", "mn_name": name, "kind": kind}


def intf(node_name, intf_name):
    return {
        "intf_id": f"{RUN_ID}:{node_name}:{intf_name}",
        "node_id": f"{RUN_ID}:{node_name}",
        "mn_name": intf_name,
    }


def link(left_node, left_intf, right_node, right_intf):
    return {
        "a_intf_id": f"{RUN_ID}:{left_node}:{left_intf}",
        "b_intf_id": f"{RUN_ID}:{right_node}:{right_intf}",
    }


TOPOLOGY = {
    "nodes": [
        node("r1", "router"),
        node("h11"),
        node("h21"),
        node("h31"),
        node("s1", "ovs"),
        node("s2", "ovs"),
        node("s3", "ovs"),
    ],
    "interfaces": [
        intf("h11", "h11-eth0"),
        intf("h21", "h21-eth0"),
        intf("h31", "h31-eth0"),
        intf("r1", "r1-eth0"),
        intf("r1", "r1-eth1"),
        intf("r1", "r1-eth2"),
        intf("s1", "s1-eth0"),
        intf("s1", "s1-eth1"),
        intf("s2", "s2-eth0"),
        intf("s2", "s2-eth1"),
        intf("s3", "s3-eth0"),
        intf("s3", "s3-eth1"),
    ],
    "links": [
        link("r1", "r1-eth0", "s1", "s1-eth0"),
        link("h11", "h11-eth0", "s1", "s1-eth1"),
        link("r1", "r1-eth1", "s2", "s2-eth0"),
        link("h21", "h21-eth0", "s2", "s2-eth1"),
        link("r1", "r1-eth2", "s3", "s3-eth0"),
        link("h31", "h31-eth0", "s3", "s3-eth1"),
    ],
}


class CapturePlanTest(unittest.TestCase):
    def test_involved_node_names_uses_scenario_endpoints(self):
        scenarios = [
            TrafficScenario(kind="ping", src="h11", dst="h21"),
            TrafficScenario(kind="ping", src="h11", dst="h31"),
        ]

        self.assertEqual(involved_node_names(scenarios), {"h11", "h21", "h31"})

    def test_path_mode_selects_interfaces_on_scenario_paths(self):
        scenarios = [TrafficScenario(kind="ping", src="h11", dst="h21")]

        specs = build_capture_specs(TOPOLOGY, scenarios, mode="path")

        self.assertEqual(
            [(spec.node_name, spec.intf_name) for spec in specs],
            [
                ("h11", "h11-eth0"),
                ("s1", "s1-eth1"),
                ("s1", "s1-eth0"),
                ("r1", "r1-eth0"),
                ("r1", "r1-eth1"),
                ("s2", "s2-eth0"),
                ("s2", "s2-eth1"),
                ("h21", "h21-eth0"),
            ],
        )

    def test_edge_mode_selects_all_host_and_router_interfaces(self):
        specs = build_capture_specs(TOPOLOGY, [], mode="edge")

        self.assertEqual(
            [(spec.node_name, spec.intf_name) for spec in specs],
            [
                ("h11", "h11-eth0"),
                ("h21", "h21-eth0"),
                ("h31", "h31-eth0"),
                ("r1", "r1-eth0"),
                ("r1", "r1-eth1"),
                ("r1", "r1-eth2"),
            ],
        )

    def test_all_mode_selects_every_exported_interface(self):
        specs = build_capture_specs(TOPOLOGY, [], mode="all")

        self.assertEqual(len(specs), len(TOPOLOGY["interfaces"]))


if __name__ == "__main__":
    unittest.main()
