import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MacLearningView } from "./mac-learning-view";
import { macLearningEvent } from "./story-data";

const meta = {
  title: "数据链路层/MAC 自学习",
  component: MacLearningView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof MacLearningView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LearnSourceMac: Story = {
  name: "学习源 MAC",
  args: {
    ...macLearningEvent,
    className: "w-[420px]",
  },
};
