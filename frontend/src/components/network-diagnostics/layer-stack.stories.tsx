import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { defaultPacketLayers, LayerStack } from "./layer-stack";

const meta = {
  title: "网络诊断/协议分层",
  component: LayerStack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LayerStack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TcpIpStack: Story = {
  name: "TCP/IP 分层",
  args: {
    layers: defaultPacketLayers,
  },
};

export const ArpStack: Story = {
  name: "ARP 分层",
  args: {
    layers: [
      { id: "L7", name: "应用层", note: "无应用载荷" },
      { id: "L4", name: "传输层", note: "无传输层" },
      { id: "L3", name: "网络层", protocol: "IPv4", note: "被查询的 IP", active: true },
      { id: "L2", name: "数据链路层", protocol: "ARP", note: "广播请求 MAC", active: true },
    ],
  },
};
