import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PortTile } from "./port-tile";

const meta = {
  title: "网络设备/端口单元",
  component: PortTile,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  name: "已连接",
  args: {
    port: {
      id: "port-1",
      name: "eth1",
      index: 1,
      kind: "rj45",
      connected: true,
      status: "link",
      peerName: "r1-eth0",
    },
  },
};

export const Activity: Story = {
  name: "有流量",
  args: {
    port: {
      id: "port-2",
      name: "eth2",
      index: 2,
      kind: "rj45",
      connected: true,
      status: "activity",
      peerName: "h11-eth0",
      rxPackets: 1248,
      txPackets: 932,
    },
    active: true,
  },
};

export const SelectedError: Story = {
  name: "选中异常",
  args: {
    port: {
      id: "port-6",
      name: "eth6",
      index: 6,
      kind: "rj45",
      connected: true,
      status: "error",
      peerName: "h21-eth0",
    },
    selected: true,
  },
};
