import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PhysicalTransmissionView } from "./physical-transmission-view";
import { demoTransmission } from "./story-data";

const meta = {
  title: "物理层/收发动作",
  component: PhysicalTransmissionView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PhysicalTransmissionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DeliveredSignal: Story = {
  name: "比特信号交付",
  args: {
    transmission: demoTransmission,
  },
};

export const CollisionSignal: Story = {
  name: "碰撞结果",
  args: {
    transmission: {
      ...demoTransmission,
      id: "tx-collision",
      result: "collision",
      endedAtMs: 14,
    },
  },
};
