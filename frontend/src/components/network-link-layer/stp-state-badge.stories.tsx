import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StpStateBadge, type StpPortState } from "./stp-state-badge";

const meta = {
  title: "数据链路层/STP状态",
  component: StpStateBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StpStateBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

const states: StpPortState[] = ["blocking", "listening", "learning", "forwarding", "disabled"];

export const AllStates: Story = {
  name: "全部状态",
  args: { state: "forwarding" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {states.map((state) => (
        <StpStateBadge key={state} state={state} role={state === "forwarding" ? "designated" : undefined} />
      ))}
    </div>
  ),
};
