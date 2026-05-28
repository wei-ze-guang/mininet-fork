import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RouteTable } from "./route-table";

const meta = {
  title: "网络表/路由表",
  component: RouteTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RouteTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RouterRoutes: Story = {
  name: "路由选择",
  args: {
    entries: [
      { id: "route-1", destination: "10.0.1.0/24", iface: "r1-eth0", kind: "connected", metric: 0 },
      { id: "route-2", destination: "10.0.2.0/24", iface: "r1-eth1", kind: "connected", metric: 0, active: true },
      { id: "route-3", destination: "10.0.3.0/24", gateway: "10.0.2.254", iface: "r1-eth1", kind: "static", metric: 10 },
      { id: "route-4", destination: "0.0.0.0/0", gateway: "10.0.1.254", iface: "r1-eth0", kind: "default", metric: 100 },
    ],
  },
};

export const Empty: Story = {
  name: "空表",
  args: {
    entries: [],
  },
};
