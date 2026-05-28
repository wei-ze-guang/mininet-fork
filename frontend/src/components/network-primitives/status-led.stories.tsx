import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StatusLed } from "./status-led";

const meta = {
  title: "网络基础组件/状态灯",
  component: StatusLed,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusLed>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  name: "全部状态",
  args: {
    status: "link",
  },
  render: () => (
    <div className="flex items-center gap-4 rounded-lg border bg-zinc-950 p-4 text-xs text-zinc-300">
      <LedLabel status="down" label="断开" />
      <LedLabel status="link" label="已连接" />
      <LedLabel status="activity" label="有流量" />
      <LedLabel status="warning" label="警告" />
      <LedLabel status="error" label="错误" />
    </div>
  ),
};

function LedLabel({
  status,
  label,
}: {
  status: "down" | "link" | "activity" | "warning" | "error";
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <StatusLed status={status} label={label} />
      <span>{label}</span>
    </div>
  );
}
