import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NetworkInterfaceBadge } from "./network-interface-badge";

const meta = {
  title: "网络基础组件/接口标签",
  component: NetworkInterfaceBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NetworkInterfaceBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  name: "全部状态",
  args: {
    iface: {
      id: "eth0",
      name: "eth0",
      ip: "10.0.1.11/24",
      mac: "02:42:0a:00:01:0b",
      status: "link",
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <NetworkInterfaceBadge iface={{ id: "eth0", name: "eth0", ip: "10.0.1.11/24", status: "link" }} />
      <NetworkInterfaceBadge iface={{ id: "eth1", name: "eth1", ip: "10.0.1.12/24", status: "activity" }} />
      <NetworkInterfaceBadge iface={{ id: "wlan0", name: "wlan0", ip: "10.0.1.31/24", status: "warning" }} />
      <NetworkInterfaceBadge iface={{ id: "eth2", name: "eth2", status: "down" }} />
    </div>
  ),
};
