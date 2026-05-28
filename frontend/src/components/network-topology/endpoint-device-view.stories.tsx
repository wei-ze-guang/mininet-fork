import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EndpointDeviceView } from "./endpoint-device-view";
import { demoPc, demoPhone, demoServer } from "./story-data";

const meta = {
  title: "网络设备/终端设备",
  component: EndpointDeviceView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EndpointDeviceView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllKinds: Story = {
  name: "PC / 手机 / 服务器",
  args: {
    device: demoPc,
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <EndpointDeviceView device={demoPc} selected />
      <EndpointDeviceView device={demoPhone} />
      <EndpointDeviceView device={demoServer} />
    </div>
  ),
};

export const Compact: Story = {
  name: "紧凑模式",
  args: {
    device: demoPhone,
    compact: true,
  },
};
