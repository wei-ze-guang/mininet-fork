import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VlanTable } from "./vlan-table";

const meta = {
  title: "网络表/VLAN表",
  component: VlanTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VlanTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SegmentMembership: Story = {
  name: "网段成员",
  args: {
    entries: [
      {
        id: "vlan-10",
        vlanId: 10,
        name: "LAN-A",
        ports: ["eth1", "eth2", "eth3", "trunk1"],
        taggedPorts: ["trunk1"],
        untaggedPorts: ["eth1", "eth2", "eth3"],
        sviInterfaceIp: "10.0.1.1",
        state: "active",
      },
      {
        id: "vlan-20",
        vlanId: 20,
        name: "LAN-B",
        ports: ["eth4", "eth5", "trunk1"],
        taggedPorts: ["trunk1"],
        untaggedPorts: ["eth4", "eth5"],
        sviInterfaceIp: "10.0.2.1",
        state: "active",
      },
      {
        id: "vlan-99",
        vlanId: 99,
        name: "实验网段",
        ports: ["eth8"],
        untaggedPorts: ["eth8"],
        sviInterfaceIp: "10.0.99.1",
        state: "suspended",
      },
    ],
  },
};

export const Empty: Story = {
  name: "空表",
  args: {
    entries: [],
  },
};
