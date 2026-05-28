import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PppFrameView } from "./ppp-frame-view";

const meta = {
  title: "数据链路层/PPP 帧",
  component: PppFrameView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PppFrameView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IpPayload: Story = {
  name: "承载 IP",
  args: {
    protocol: "IP",
    payloadBytes: 96,
    fcsStatus: "passed",
  },
};

export const LcpFrame: Story = {
  name: "LCP 控制帧",
  args: {
    protocol: "LCP",
    payloadBytes: 24,
    fcsStatus: "passed",
  },
};
