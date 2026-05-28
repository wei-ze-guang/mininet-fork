import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PrefixMatchView } from "./prefix-match-view";

const meta = {
  title: "网络层/最长前缀匹配",
  component: PrefixMatchView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PrefixMatchView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MatchRoute: Story = {
  name: "路由命中",
  args: {
    destinationIp: "10.0.2.21",
    routes: [
      { id: "default", prefix: "0.0.0.0/0", prefixLength: 0, nextHop: "10.0.1.254", iface: "eth0", metric: 100, matched: true },
      { id: "lan", prefix: "10.0.0.0/16", prefixLength: 16, iface: "eth0", metric: 10, matched: true },
      { id: "target", prefix: "10.0.2.0/24", prefixLength: 24, iface: "eth1", metric: 0, matched: true, selected: true },
      { id: "other", prefix: "10.0.3.0/24", prefixLength: 24, iface: "eth2", metric: 0, matched: false },
    ],
  },
};
