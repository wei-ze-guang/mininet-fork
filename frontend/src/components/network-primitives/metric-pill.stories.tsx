import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MetricPill } from "./metric-pill";

const meta = {
  title: "网络基础组件/指标标签",
  component: MetricPill,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MetricPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllTones: Story = {
  name: "全部状态",
  args: {
    label: "RX",
    value: 1280,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-zinc-950 p-4">
      <MetricPill label="RX" value="1.2k" unit="pkt" icon="rx" tone="info" />
      <MetricPill label="TX" value="932" unit="pkt" icon="tx" tone="good" />
      <MetricPill label="速率" value="84" unit="Mbps" icon="rate" tone="neutral" />
      <MetricPill label="队列" value="7" unit="帧" icon="activity" tone="warning" />
      <MetricPill label="丢包" value="3" unit="pkt" tone="danger" />
    </div>
  ),
};

export const Compact: Story = {
  name: "紧凑模式",
  args: {
    label: "RX",
    value: "384",
    unit: "pkt",
    icon: "rx",
    tone: "info",
    compact: true,
  },
};
