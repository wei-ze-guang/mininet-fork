import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CollisionDomainView } from "./collision-domain-view";

const meta = {
  title: "数据链路层/冲突域",
  component: CollisionDomainView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof CollisionDomainView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Collision: Story = {
  name: "碰撞与退避",
  args: {
    collided: true,
    nodes: [
      { id: "h1", name: "h1", transmitting: true, backoffSlots: 3 },
      { id: "h2", name: "h2", transmitting: true, backoffSlots: 7 },
      { id: "h3", name: "h3" },
    ],
  },
};

export const Idle: Story = {
  name: "信道空闲",
  args: {
    nodes: [
      { id: "h1", name: "h1" },
      { id: "h2", name: "h2" },
      { id: "h3", name: "h3" },
    ],
  },
};
