import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LinkQualityBadge } from "./link-quality-badge";

const meta = {
  title: "网络诊断/链路质量",
  component: LinkQualityBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LinkQualityBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GoodLink: Story = {
  name: "正常链路",
  args: {
    bandwidthMbps: 1000,
    latencyMs: 4,
    jitterMs: 1,
    lossPercent: 0,
    mtu: 1500,
    duplex: "full",
  },
};

export const BadLink: Story = {
  name: "异常链路",
  args: {
    bandwidthMbps: 100,
    latencyMs: 128,
    jitterMs: 42,
    lossPercent: 3,
    mtu: 1500,
    duplex: "half",
  },
};
