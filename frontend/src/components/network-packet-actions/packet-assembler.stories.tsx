import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PacketAssembler } from "./packet-assembler";
import { tcpAssemblyLayers } from "./story-data";

const meta = {
  title: "包动作/装包视图",
  component: PacketAssembler,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketAssembler>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TcpAssembly: Story = {
  name: "TCP 封装",
  args: {
    layers: tcpAssemblyLayers,
  },
};
