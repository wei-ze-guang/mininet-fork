import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MacForwardingDecisionView } from "./mac-forwarding-decision-view";
import { fcsErrorDecision, unicastHitDecision, unknownUnicastDecision } from "./story-data";

const meta = {
  title: "数据链路层/MAC 转发决策",
  component: MacForwardingDecisionView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof MacForwardingDecisionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UnicastHit: Story = {
  name: "单播查表命中",
  args: {
    decision: unicastHitDecision,
    className: "w-[420px]",
  },
};

export const UnknownUnicastFlood: Story = {
  name: "未知单播泛洪",
  args: {
    decision: unknownUnicastDecision,
    className: "w-[420px]",
  },
};

export const FcsErrorDrop: Story = {
  name: "FCS 错误丢弃",
  args: {
    decision: fcsErrorDecision,
    className: "w-[420px]",
  },
};
