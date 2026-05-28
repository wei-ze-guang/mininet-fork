import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PacketCard } from "./packet-card";

const meta = {
  title: "网络诊断/数据包卡片",
  component: PacketCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IcmpPacket: Story = {
  name: "ICMP 帧摘要",
  args: {
    active: true,
    packet: {
      id: "frame-00042",
      capturedAs: "ethernet-frame",
      protocol: "ICMP",
      srcMac: "02:42:0a:00:01:0b",
      dstMac: "02:42:0a:00:02:15",
      srcIp: "10.0.1.11",
      dstIp: "10.0.2.21",
      ttl: 63,
      sizeBytes: 98,
      vlanId: 10,
      note: "Ethernet frame carrying ICMP echo request",
    },
  },
};

export const TcpPacket: Story = {
  name: "TCP 帧摘要",
  args: {
    packet: {
      id: "frame-00088",
      capturedAs: "ethernet-frame",
      protocol: "TCP",
      srcMac: "02:42:0a:00:01:0b",
      dstMac: "02:42:0a:00:01:01",
      srcIp: "10.0.1.11",
      dstIp: "198.51.100.20",
      srcPort: 53218,
      dstPort: 443,
      ttl: 64,
      sizeBytes: 1514,
      note: "Ethernet frame carrying TCP segment",
    },
  },
};
