import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SubnetCard } from "./subnet-card";

const meta = {
  title: "网络层/子网卡片",
  component: SubnetCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SubnetCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LanSubnet: Story = {
  name: "LAN 子网",
  args: {
    subnet: {
      cidr: "10.0.1.0/24",
      netmask: "255.255.255.0",
      networkAddress: "10.0.1.0",
      broadcastAddress: "10.0.1.255",
      firstUsable: "10.0.1.1",
      lastUsable: "10.0.1.254",
      defaultGateway: "10.0.1.1",
      hostCount: 254,
    },
  },
};
