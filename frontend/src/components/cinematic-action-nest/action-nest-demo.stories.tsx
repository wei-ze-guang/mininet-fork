import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ActionNestDemo } from "./action-nest-demo";

const meta = {
  title: "演示效果/无限套娃动作",
  component: ActionNestDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ActionNestDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CenterExpandCollapse: Story = {
  name: "居中展开收缩循环",
};
