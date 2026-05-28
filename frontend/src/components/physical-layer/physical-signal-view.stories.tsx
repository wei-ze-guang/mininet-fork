import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PhysicalSignalView } from "./physical-signal-view";
import { demoPhysicalSignal } from "./story-data";

const meta = {
  title: "物理层/物理信号",
  component: PhysicalSignalView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PhysicalSignalView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ManchesterBits: Story = {
  name: "Manchester 编码比特",
  args: {
    signal: demoPhysicalSignal,
  },
};
