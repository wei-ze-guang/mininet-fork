import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArpTable } from "./arp-table";
import { NatTable } from "./nat-table";
import { RouteTable } from "./route-table";
import { VlanTable } from "./vlan-table";

const meta = {
  title: "网络表/表格总览",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const RouterAndSwitchTables: Story = {
  name: "路由器与交换机常见表",
  render: () => (
    <div className="grid gap-4 xl:grid-cols-2">
      <ArpTable
        entries={[
          { id: "arp-1", ip: "10.0.1.11", mac: "02:42:0a:00:01:0b", iface: "r1-eth0", ageSeconds: 5, state: "reachable" },
          { id: "arp-2", ip: "10.0.2.21", mac: "02:42:0a:00:02:15", iface: "r1-eth1", ageSeconds: 88, state: "stale" },
        ]}
      />
      <RouteTable
        entries={[
          { id: "route-1", destination: "10.0.1.0/24", iface: "r1-eth0", kind: "connected", metric: 0 },
          { id: "route-2", destination: "10.0.2.0/24", iface: "r1-eth1", kind: "connected", metric: 0, active: true },
          { id: "route-3", destination: "0.0.0.0/0", gateway: "10.0.1.254", iface: "r1-eth0", kind: "default", metric: 100 },
        ]}
      />
      <NatTable
        entries={[
          {
            id: "nat-1",
            protocol: "TCP",
            insideLocal: "10.0.1.11:53218",
            insideGlobal: "203.0.113.10:40001",
            outsideRemote: "198.51.100.20:443",
            timeoutSeconds: 288,
            state: "active",
          },
        ]}
      />
      <VlanTable
        entries={[
          {
            id: "vlan-10",
            vlanId: 10,
            name: "LAN-A",
            ports: ["eth1", "eth2", "trunk1"],
            taggedPorts: ["trunk1"],
            untaggedPorts: ["eth1", "eth2"],
            sviInterfaceIp: "10.0.1.1",
            state: "active",
          },
          {
            id: "vlan-20",
            vlanId: 20,
            name: "LAN-B",
            ports: ["eth3", "eth4", "trunk1"],
            taggedPorts: ["trunk1"],
            untaggedPorts: ["eth3", "eth4"],
            sviInterfaceIp: "10.0.2.1",
            state: "active",
          },
        ]}
      />
    </div>
  ),
};
