import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PortBadge } from "./port-badge";

const meta = {
  title: "运输层/端口标签",
  component: PortBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PortBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CommonPorts: Story = {
  name: "常见端口",
  args: { protocol: "TCP", port: 443, service: "HTTPS" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PortBadge protocol="TCP" port={80} service="HTTP" />
      <PortBadge protocol="TCP" port={443} service="HTTPS" />
      <PortBadge protocol="UDP" port={53} service="DNS" />
      <PortBadge protocol="UDP" port={67} service="DHCP" />
    </div>
  ),
};
