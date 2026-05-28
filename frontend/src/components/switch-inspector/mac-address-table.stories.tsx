import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MacAddressTable } from "./mac-address-table";

const meta = {
  title: "网络设备/MAC地址表",
  component: MacAddressTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MacAddressTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Learning: Story = {
  name: "学习过程",
  args: {
    entries: [
      {
        id: "mac-1",
        mac: "02:42:0a:00:01:0b",
        portId: "eth1",
        vlan: "10",
        learnedFrom: "h11",
        ageSeconds: 3,
        state: "learned",
      },
      {
        id: "mac-2",
        mac: "02:42:0a:00:02:15",
        portId: "eth3",
        vlan: "20",
        learnedFrom: "h21",
        ageSeconds: 1,
        state: "hit",
      },
      {
        id: "mac-3",
        mac: "02:42:0a:00:01:01",
        portId: "eth8",
        vlan: "10",
        learnedFrom: "r1",
        ageSeconds: 187,
        state: "aging",
      },
      {
        id: "mac-4",
        mac: "02:42:0a:00:09:99",
        portId: "eth6",
        vlan: "30",
        learnedFrom: "old-host",
        ageSeconds: 301,
        state: "expired",
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
