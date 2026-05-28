import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GatewayBadge } from "./gateway-badge";

const meta = {
  title: "网络基础组件/网关标签",
  component: GatewayBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GatewayBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  name: "网关状态",
  args: {
    address: "10.0.1.1",
    active: true,
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <GatewayBadge address="10.0.1.1" active />
      <GatewayBadge address="203.0.113.1" label="上游下一跳" />
      <GatewayBadge />
    </div>
  ),
};
