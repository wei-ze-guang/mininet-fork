import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PacketActionBadge, type PacketActionKind } from "./packet-action-badge";

const meta = {
  title: "包动作/动作标签",
  component: PacketActionBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketActionBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

const actions: PacketActionKind[] = [
  "capture",
  "inspect",
  "encapsulate",
  "decapsulate",
  "forward",
  "drop",
  "delay",
  "reorder",
  "duplicate",
  "nat",
  "rewrite",
];

export const AllActions: Story = {
  name: "全部动作",
  args: {
    action: "drop",
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <PacketActionBadge key={action} action={action} />
      ))}
    </div>
  ),
};
