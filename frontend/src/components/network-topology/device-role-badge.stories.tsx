import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DeviceRoleBadge } from "./device-role-badge";

const meta = {
  title: "网络基础组件/设备角色标签",
  component: DeviceRoleBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DeviceRoleBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllRoles: Story = {
  name: "全部角色",
  args: {
    role: "gateway",
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <DeviceRoleBadge role="host" />
      <DeviceRoleBadge role="mobile" />
      <DeviceRoleBadge role="server" />
      <DeviceRoleBadge role="switch" />
      <DeviceRoleBadge role="router" />
      <DeviceRoleBadge role="gateway" />
      <DeviceRoleBadge role="firewall" />
      <DeviceRoleBadge role="nat" />
    </div>
  ),
};
