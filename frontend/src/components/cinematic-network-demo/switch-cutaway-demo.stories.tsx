import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SwitchCutawayDemo } from "./switch-cutaway-demo";

const meta = {
  title: "演示效果/立体链路层机器",
  component: SwitchCutawayDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SwitchCutawayDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SwitchCutaway: Story = {
  name: "交换机剖面数据流",
};
