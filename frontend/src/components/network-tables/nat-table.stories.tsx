import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NatTable } from "./nat-table";

const meta = {
  title: "网络表/NAT表",
  component: NatTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NatTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TranslationSessions: Story = {
  name: "地址转换会话",
  args: {
    entries: [
      {
        id: "nat-1",
        protocol: "TCP",
        insideLocal: "10.0.1.11:53218",
        insideGlobal: "203.0.113.10:40001",
        outsideRemote: "198.51.100.20:443",
        timeoutSeconds: 288,
        state: "active",
      },
      {
        id: "nat-2",
        protocol: "UDP",
        insideLocal: "10.0.1.31:5353",
        insideGlobal: "203.0.113.10:40002",
        outsideRemote: "224.0.0.251:5353",
        timeoutSeconds: 28,
        state: "closing",
      },
      {
        id: "nat-3",
        protocol: "ICMP",
        insideLocal: "10.0.2.21:8",
        insideGlobal: "203.0.113.10:8",
        timeoutSeconds: 0,
        state: "expired",
      },
    ],
  },
};

export const Empty: Story = {
  name: "空表",
  args: {
    entries: [],
  },
};
