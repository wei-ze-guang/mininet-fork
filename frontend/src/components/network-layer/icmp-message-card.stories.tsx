import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { IcmpMessageCard } from "./icmp-message-card";

const meta = {
  title: "网络层/ICMP报文",
  component: IcmpMessageCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof IcmpMessageCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EchoRequest: Story = {
  args: {
    type: "echo-request",
    sourceIp: "10.0.1.11",
    destinationIp: "10.0.2.21",
    sequence: 7,
  },
};

export const TimeExceeded: Story = {
  args: {
    type: "time-exceeded",
    code: 0,
    sourceIp: "10.0.1.1",
    destinationIp: "10.0.1.11",
  },
};
