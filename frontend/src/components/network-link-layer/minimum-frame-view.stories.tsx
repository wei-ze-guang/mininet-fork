import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MinimumFrameView } from "./minimum-frame-view";

const meta = {
  title: "数据链路层/最短帧长",
  component: MinimumFrameView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof MinimumFrameView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ValidEthernetFrame: Story = {
  name: "满足 64 字节",
  args: {
    frameBytes: 84,
    className: "w-[520px]",
  },
};

export const TooShortFrame: Story = {
  name: "过短帧",
  args: {
    frameBytes: 42,
    collisionDetected: true,
    className: "w-[520px]",
  },
};
