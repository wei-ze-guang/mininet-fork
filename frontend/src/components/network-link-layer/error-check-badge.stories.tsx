import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ErrorCheckBadge } from "./error-check-badge";

const meta = {
  title: "数据链路层/差错检测",
  component: ErrorCheckBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorCheckBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  name: "检测状态",
  args: { status: "passed" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ErrorCheckBadge status="passed" />
      <ErrorCheckBadge status="failed" />
      <ErrorCheckBadge status="unchecked" />
    </div>
  ),
};
