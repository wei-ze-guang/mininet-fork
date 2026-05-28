import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SlidingWindowView } from "./sliding-window-view";

const meta = {
  title: "运输层/TCP滑动窗口",
  component: SlidingWindowView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SlidingWindowView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Window: Story = {
  name: "发送窗口",
  args: {
    baseSeq: 1001,
    windowSize: 6,
    segments: [
      { seqStart: 1001, seqEnd: 1460, state: "acked" },
      { seqStart: 1461, seqEnd: 1920, state: "acked" },
      { seqStart: 1921, seqEnd: 2380, state: "sent" },
      { seqStart: 2381, seqEnd: 2840, state: "retransmit" },
      { seqStart: 2841, seqEnd: 3300, state: "sent" },
      { seqStart: 3301, seqEnd: 3760, state: "pending" },
      { seqStart: 3761, seqEnd: 4220, state: "pending" },
      { seqStart: 4221, seqEnd: 4680, state: "pending" },
    ],
  },
};
