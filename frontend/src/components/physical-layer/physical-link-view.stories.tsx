import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PhysicalLinkView } from "./physical-link-view";
import { demoPhysicalLink } from "./story-data";

const meta = {
  title: "物理层/物理链路",
  component: PhysicalLinkView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PhysicalLinkView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CopperLink: Story = {
  name: "主机到交换机铜缆链路",
  args: {
    link: demoPhysicalLink,
  },
};
