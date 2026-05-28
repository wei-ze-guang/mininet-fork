import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DeviceMetricStrip } from "./device-metric-strip";

const meta = {
  title: "网络基础组件/设备指标条",
  component: DeviceMetricStrip,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DeviceMetricStrip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  name: "正常指标",
  args: {
    rxPackets: 1248,
    txPackets: 932,
    latencyMs: 18,
    lossPercent: 0,
  },
};

export const Warning: Story = {
  name: "异常指标",
  args: {
    rxPackets: 890,
    txPackets: 177,
    latencyMs: 128,
    lossPercent: 2,
  },
};
