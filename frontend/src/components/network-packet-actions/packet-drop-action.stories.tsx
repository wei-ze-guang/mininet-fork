import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PacketDropAction } from "./packet-drop-action";

const meta = {
  title: "包动作/丢包动作",
  component: PacketDropAction,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketDropAction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const QueueOverflow: Story = {
  name: "队列溢出",
  args: {
    sourceName: "eth1 输出队列",
    packetBits: "0001",
    reason: "queue-overflow",
  },
};

export const TtlExpired: Story = {
  name: "TTL 归零",
  args: {
    sourceName: "r1 路由处理队列",
    packetBits: "1011",
    reason: "ttl-expired",
  },
};
