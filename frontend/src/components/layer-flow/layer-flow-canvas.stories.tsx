import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { hostToSwitchPipeline } from "@/components/layer-pipeline/story-data";

import { LayerFlowCanvas } from "./layer-flow-canvas";

const meta = {
  title: "分层组合/React Flow 画布",
  component: LayerFlowCanvas,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof LayerFlowCanvas>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HostToSwitch: Story = {
  name: "主机到交换机",
  args: {
    pipeline: hostToSwitchPipeline,
  },
};
