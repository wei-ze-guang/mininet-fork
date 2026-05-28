import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TcpHandshakeView } from "./tcp-handshake-view";

const meta = {
  title: "运输层/TCP三次握手",
  component: TcpHandshakeView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TcpHandshakeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Handshake: Story = {
  name: "SYN SYN-ACK ACK",
  args: {
    steps: [
      { id: "syn", from: "client", to: "server", flags: "SYN", seq: 1000 },
      { id: "syn-ack", from: "server", to: "client", flags: "SYN-ACK", seq: 5000, ack: 1001, active: true },
      { id: "ack", from: "client", to: "server", flags: "ACK", seq: 1001, ack: 5001 },
    ],
  },
};
