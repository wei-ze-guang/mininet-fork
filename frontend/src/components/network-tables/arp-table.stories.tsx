import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArpTable } from "./arp-table";

const meta = {
  title: "网络表/ARP表",
  component: ArpTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ArpTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeighborCache: Story = {
  name: "邻居缓存",
  args: {
    entries: [
      { id: "arp-1", ip: "10.0.1.1", mac: "02:42:0a:00:01:01", iface: "eth0", ageSeconds: 4, state: "reachable" },
      { id: "arp-2", ip: "10.0.1.11", mac: "02:42:0a:00:01:0b", iface: "eth0", ageSeconds: 52, state: "stale" },
      { id: "arp-3", ip: "10.0.2.21", mac: "00:00:00:00:00:00", iface: "eth1", ageSeconds: 1, state: "probing" },
      { id: "arp-4", ip: "10.0.9.99", mac: "--", iface: "eth1", ageSeconds: 30, state: "failed" },
    ],
  },
};

export const Empty: Story = {
  name: "空表",
  args: {
    entries: [],
  },
};
