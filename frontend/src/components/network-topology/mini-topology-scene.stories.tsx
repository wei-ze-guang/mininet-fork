import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { demoPc, demoPhone, demoServer } from "./story-data";
import { MiniTopologyScene } from "./mini-topology-scene";

const meta = {
  title: "网络场景/小型拓扑",
  component: MiniTopologyScene,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MiniTopologyScene>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HostToServer: Story = {
  name: "主机到服务器",
  args: {
    left: demoPc,
    right: demoServer,
    middleLabel: "h11 <-> srv1",
    active: true,
  },
};

export const PhoneToHost: Story = {
  name: "手机到主机",
  args: {
    left: demoPhone,
    right: demoPc,
    middleLabel: "phone1 <-> h11",
    active: false,
  },
};
