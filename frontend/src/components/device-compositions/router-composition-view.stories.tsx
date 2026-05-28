import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { demoGateway } from "@/components/network-topology/story-data";

import { RouterCompositionView } from "./router-composition-view";

const meta = {
  title: "设备组合/路由器组成",
  component: RouterCompositionView,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RouterCompositionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GatewayRouter: Story = {
  name: "网关路由器",
  args: {
    device: demoGateway,
    subnets: [
      {
        cidr: "10.0.1.0/24",
        netmask: "255.255.255.0",
        networkAddress: "10.0.1.0",
        broadcastAddress: "10.0.1.255",
        firstUsable: "10.0.1.1",
        lastUsable: "10.0.1.254",
        hostCount: 254,
      },
      {
        cidr: "10.0.2.0/24",
        netmask: "255.255.255.0",
        networkAddress: "10.0.2.0",
        broadcastAddress: "10.0.2.255",
        firstUsable: "10.0.2.1",
        lastUsable: "10.0.2.254",
        hostCount: 254,
      },
    ],
    routes: [
      { id: "route-1", destination: "10.0.1.0/24", iface: "r1-eth0", kind: "connected", metric: 0 },
      { id: "route-2", destination: "10.0.2.0/24", iface: "r1-eth1", kind: "connected", metric: 0, active: true },
      { id: "route-3", destination: "0.0.0.0/0", gateway: "10.0.1.254", iface: "r1-eth0", kind: "default", metric: 100 },
    ],
    prefixCandidates: [
      { id: "default", prefix: "0.0.0.0/0", prefixLength: 0, nextHop: "10.0.1.254", iface: "r1-eth0", metric: 100, matched: true },
      { id: "lan-a", prefix: "10.0.1.0/24", prefixLength: 24, iface: "r1-eth0", metric: 0, matched: false },
      { id: "lan-b", prefix: "10.0.2.0/24", prefixLength: 24, iface: "r1-eth1", metric: 0, matched: true, selected: true },
    ],
    arpEntries: [
      { id: "arp-1", ip: "10.0.1.11", mac: "02:42:0a:00:01:0b", iface: "r1-eth0", ageSeconds: 5, state: "reachable" },
      { id: "arp-2", ip: "10.0.2.21", mac: "02:42:0a:00:02:15", iface: "r1-eth1", ageSeconds: 88, state: "stale" },
    ],
    natEntries: [
      {
        id: "nat-1",
        protocol: "TCP",
        insideLocal: "10.0.1.11:53218",
        insideGlobal: "203.0.113.10:40001",
        outsideRemote: "198.51.100.20:443",
        timeoutSeconds: 288,
        state: "active",
      },
    ],
    packet: {
      id: "frame-00042",
      capturedAs: "ethernet-frame",
      protocol: "ICMP",
      srcMac: "02:42:0a:00:01:0b",
      dstMac: "02:42:0a:00:01:01",
      srcIp: "10.0.1.11",
      dstIp: "10.0.2.21",
      ttl: 63,
      sizeBytes: 98,
      note: "路由器收到的 Ethernet frame，载荷为 IPv4/ICMP",
    },
  },
};
