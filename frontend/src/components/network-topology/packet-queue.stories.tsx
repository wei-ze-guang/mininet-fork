import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PacketQueue } from "./packet-queue";

const meta = {
  title: "网络基础组件/队列",
  component: PacketQueue,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketQueue>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PortBuffer: Story = {
  name: "端口缓存队列",
  args: {
    name: "eth1 输出队列",
    capacity: 6,
    items: [
      { id: "pkt-1", bits: "1010", protocol: "ICMP", state: "processing" },
      { id: "pkt-2", bits: "0101", protocol: "ARP" },
      { id: "pkt-3", bits: "1110", protocol: "TCP" },
      { id: "pkt-4", bits: "0001", protocol: "TCP", state: "dropped" },
    ],
  },
};

export const VerticalQueue: Story = {
  name: "纵向队列",
  args: {
    name: "交换机入口队列",
    capacity: 5,
    direction: "vertical",
    items: [
      { id: "pkt-1", bits: "1001", protocol: "ARP", state: "processing" },
      { id: "pkt-2", bits: "0110", protocol: "ICMP" },
      { id: "pkt-3", bits: "1100", protocol: "TCP" },
    ],
  },
};
