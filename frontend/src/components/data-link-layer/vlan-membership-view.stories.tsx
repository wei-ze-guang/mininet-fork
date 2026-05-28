import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VlanMembershipView } from "./vlan-membership-view";
import { demoVlanMemberships } from "./story-data";

const meta = {
  title: "数据链路层/VLAN 成员关系",
  component: VlanMembershipView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof VlanMembershipView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AccessAndTrunk: Story = {
  name: "Access / Trunk / Native",
  args: {
    memberships: demoVlanMemberships,
  },
};
