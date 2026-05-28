import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CableLink } from "./cable-link";

const meta = {
  title: "网络基础组件/链路线",
  component: CableLink,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CableLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  name: "全部状态",
  args: {
    status: "activity",
  },
  render: () => (
    <div className="grid w-[520px] gap-4 rounded-lg bg-zinc-950 p-4">
      <CableLink status="down" label="断开" />
      <CableLink status="link" label="已连接" bandwidthMbps={100} latencyMs={1} />
      <CableLink status="activity" direction="forward" label="单向流量" bandwidthMbps={1000} latencyMs={4} />
      <CableLink
        status="activity"
        direction="both"
        label="双向流量"
        bandwidthMbps={1000}
        latencyMs={12}
        flow={{ forwardTone: "data", reverseTone: "control" }}
      />
      <CableLink status="error" label="错误链路" packetLoss={8} />
    </div>
  ),
};
