import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TransparentTransmissionView } from "./transparent-transmission-view";

const meta = {
  title: "数据链路层/透明传输",
  component: TransparentTransmissionView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof TransparentTransmissionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ByteStuffing: Story = {
  name: "字节填充",
  args: {
    mode: "byte-stuffing",
    flagPattern: "0x7E",
    originalData: "45 7E 20 7D 11",
    escapedData: "45 7D 5E 20 7D 5D 11",
  },
};

export const BitStuffing: Story = {
  name: "比特填充",
  args: {
    mode: "bit-stuffing",
    flagPattern: "01111110",
    originalData: "01111110111110",
    escapedData: "011111010111110",
  },
};
