import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PacketLayerBlock } from "./packet-layer-block";
import { icmpPacketLayers } from "./story-data";

const meta = {
  title: "包动作/包层块",
  component: PacketLayerBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketLayerBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IpHeader: Story = {
  name: "IP 头部",
  args: {
    layer: icmpPacketLayers[1],
  },
};
