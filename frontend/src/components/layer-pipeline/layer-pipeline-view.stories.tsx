import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LayerPipelineView } from "./layer-pipeline-view";
import { hostToSwitchPipeline } from "./story-data";

const meta = {
  title: "分层组合/可拆卸流水线",
  component: LayerPipelineView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof LayerPipelineView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HostToSwitch: Story = {
  name: "主机到交换机",
  args: {
    pipeline: hostToSwitchPipeline,
  },
};
