import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CongestionControlView } from "./congestion-control-view";

const meta = {
  title: "运输层/TCP拥塞控制",
  component: CongestionControlView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof CongestionControlView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cwnd: Story = {
  name: "cwnd 变化",
  args: {
    ssthresh: 16,
    unit: "MSS",
    points: [
      { round: 1, cwnd: 1, phase: "slow-start" },
      { round: 2, cwnd: 2, phase: "slow-start" },
      { round: 3, cwnd: 4, phase: "slow-start" },
      { round: 4, cwnd: 8, phase: "slow-start" },
      { round: 5, cwnd: 16, phase: "congestion-avoidance" },
      { round: 6, cwnd: 17, phase: "congestion-avoidance" },
      { round: 7, cwnd: 18, phase: "congestion-avoidance" },
      { round: 8, cwnd: 9, phase: "loss-recovery" },
    ],
  },
};
