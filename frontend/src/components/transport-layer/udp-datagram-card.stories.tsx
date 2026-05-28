import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { UdpDatagramCard } from "./udp-datagram-card";

const meta = {
  title: "运输层/UDP用户数据报",
  component: UdpDatagramCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof UdpDatagramCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DnsQuery: Story = {
  name: "DNS 查询",
  args: {
    datagram: {
      sourcePort: 53532,
      destinationPort: 53,
      lengthBytes: 72,
      checksum: "0x7a21",
      payloadLabel: "DNS query",
    },
  },
};
