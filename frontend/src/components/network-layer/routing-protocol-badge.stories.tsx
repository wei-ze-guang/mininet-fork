import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RoutingProtocolBadge } from "./routing-protocol-badge";

const meta = {
  title: "网络层/路由协议标签",
  component: RoutingProtocolBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RoutingProtocolBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Protocols: Story = {
  name: "协议状态",
  args: { protocol: "OSPF" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <RoutingProtocolBadge protocol="CONNECTED" />
      <RoutingProtocolBadge protocol="STATIC" />
      <RoutingProtocolBadge protocol="RIP" state="converging" />
      <RoutingProtocolBadge protocol="OSPF" />
      <RoutingProtocolBadge protocol="BGP" state="down" />
    </div>
  ),
};
