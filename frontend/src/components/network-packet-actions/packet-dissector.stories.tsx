import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PacketDissector } from "./packet-dissector";
import { icmpPacketLayers } from "./story-data";

const meta = {
  title: "包动作/拆包视图",
  component: PacketDissector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketDissector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IcmpDissection: Story = {
  name: "ICMP 拆包",
  args: {
    packetId: "frame-00042",
    layers: icmpPacketLayers,
  },
};
