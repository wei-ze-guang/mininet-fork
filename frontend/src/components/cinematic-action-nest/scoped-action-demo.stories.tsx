import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScopedActionDemo } from "./scoped-action-demo";

const meta = {
  title: "演示效果/多层作用域控制",
  component: ScopedActionDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScopedActionDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ParentResetClearsChildren: Story = {
  name: "父层回退清空子层",
};
