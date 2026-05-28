import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LinkLayerProcessView } from "./link-layer-process-view";
import {
  fcsFailedReceiveProcess,
  hostReceiveProcess,
  hostSendProcess,
  macTableEntriesForLookup,
  switchReceiveProcess,
} from "./story-data";

const meta = {
  title: "数据链路层/接收处理过程",
  component: LinkLayerProcessView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof LinkLayerProcessView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HostSend: Story = {
  name: "主机发送",
  args: {
    process: hostSendProcess,
  },
};

export const HostReceive: Story = {
  name: "主机接收",
  args: {
    process: hostReceiveProcess,
  },
};

export const ReceiveAndForward: Story = {
  name: "交换机接收并转发",
  args: {
    process: switchReceiveProcess,
    macEntries: macTableEntriesForLookup,
  },
};

export const FcsFailedDrop: Story = {
  name: "FCS 失败丢弃",
  args: {
    process: fcsFailedReceiveProcess,
  },
};
