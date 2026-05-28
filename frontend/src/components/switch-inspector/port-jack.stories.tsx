import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PortJack } from "./port-jack";

const meta = {
  title: "网络设备/端口插槽",
  component: PortJack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortJack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RJ45Connected: Story = {
  name: "RJ45 已连接",
  args: {
    kind: "rj45",
    connected: true,
    status: "link",
  },
};

export const SfpDisconnected: Story = {
  name: "SFP 未连接",
  args: {
    kind: "sfp",
    connected: false,
    status: "down",
  },
};

export const ErrorPort: Story = {
  name: "异常端口",
  args: {
    kind: "rj45",
    connected: true,
    status: "error",
  },
};
