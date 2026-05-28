import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProtocolBadge, type NetworkProtocol } from "./protocol-badge";

const meta = {
  title: "网络诊断/协议标签",
  component: ProtocolBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProtocolBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

const protocols: NetworkProtocol[] = [
  "Ethernet",
  "ARP",
  "IPv4",
  "ICMP",
  "TCP",
  "UDP",
  "HTTP",
  "DNS",
  "DHCP",
];

export const AllProtocols: Story = {
  name: "全部协议",
  args: {
    protocol: "ICMP",
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {protocols.map((protocol) => (
        <ProtocolBadge key={protocol} protocol={protocol} />
      ))}
    </div>
  ),
};
