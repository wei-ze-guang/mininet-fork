import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PhysicalMediumBadge } from "./physical-medium-badge";

const meta = {
  title: "物理层/物理介质",
  component: PhysicalMediumBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PhysicalMediumBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MediaKinds: Story = {
  name: "介质类型",
  args: { kind: "copper" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PhysicalMediumBadge kind="copper" />
      <PhysicalMediumBadge kind="fiber" />
      <PhysicalMediumBadge kind="wireless" />
      <PhysicalMediumBadge kind="loopback" />
      <PhysicalMediumBadge kind="virtual" />
    </div>
  ),
};
