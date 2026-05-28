import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TcpTeardownView } from "./tcp-teardown-view";

const meta = {
  title: "运输层/TCP四次挥手",
  component: TcpTeardownView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TcpTeardownView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Teardown: Story = {
  name: "FIN ACK FIN ACK",
  args: {
    steps: [
      { id: "fin-1", from: "client", to: "server", flags: "FIN", state: "FIN-WAIT-1" },
      { id: "ack-1", from: "server", to: "client", flags: "ACK", state: "CLOSE-WAIT", active: true },
      { id: "fin-2", from: "server", to: "client", flags: "FIN", state: "LAST-ACK" },
      { id: "ack-2", from: "client", to: "server", flags: "ACK", state: "TIME-WAIT" },
    ],
  },
};
