import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { demoEthernetFrameFields, FrameBoundary } from "./frame-boundary";

const meta = {
  title: "数据链路层/成帧组件",
  component: FrameBoundary,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof FrameBoundary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EthernetFrame: Story = {
  name: "以太网帧",
  args: {
    fields: demoEthernetFrameFields,
    fcsStatus: "passed",
  },
};

export const FcsFailed: Story = {
  name: "FCS 失败",
  args: {
    fields: demoEthernetFrameFields,
    fcsStatus: "failed",
  },
};
