import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BroadcastDomainView } from "./broadcast-domain-view";
import { vlan10BroadcastDomain } from "./story-data";

const meta = {
  title: "数据链路层/广播域",
  component: BroadcastDomainView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof BroadcastDomainView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VlanBroadcastDomain: Story = {
  name: "VLAN 广播域",
  args: {
    domain: vlan10BroadcastDomain,
    className: "w-[480px]",
  },
};
