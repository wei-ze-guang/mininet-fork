import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EthernetFrameView } from "./ethernet-frame-view";
import { arpRequestFrame, ipv4UnicastFrame } from "./story-data";

const meta = {
  title: "数据链路层/以太网帧视图",
  component: EthernetFrameView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof EthernetFrameView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ArpBroadcastFrame: Story = {
  name: "ARP 广播帧",
  args: {
    frame: arpRequestFrame,
    fcsStatus: "passed",
  },
};

export const Ipv4UnicastFrame: Story = {
  name: "IPv4 单播帧",
  args: {
    frame: ipv4UnicastFrame,
    fcsStatus: "passed",
  },
};

export const FcsFailedFrame: Story = {
  name: "FCS 失败帧",
  args: {
    frame: ipv4UnicastFrame,
    fcsStatus: "failed",
  },
};
