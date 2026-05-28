import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MechanismBadge, type NetworkMechanism } from "./mechanism-badge";

const meta = {
  title: "网络诊断/机制标签",
  component: MechanismBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MechanismBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

const mechanisms: NetworkMechanism[] = ["NAT", "VLAN", "STP", "QoS", "ACL"];

export const AllMechanisms: Story = {
  name: "全部机制",
  args: {
    mechanism: "VLAN",
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {mechanisms.map((mechanism) => (
        <MechanismBadge key={mechanism} mechanism={mechanism} />
      ))}
    </div>
  ),
};
