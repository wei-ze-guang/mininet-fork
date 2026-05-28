import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BroadcastDomainBadge } from "./broadcast-domain-badge";

const meta = {
  title: "数据链路层/广播域",
  component: BroadcastDomainBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof BroadcastDomainBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Domains: Story = {
  name: "VLAN 广播域",
  args: { domainId: "bd-10", vlanId: 10, portCount: 4 },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <BroadcastDomainBadge domainId="bd-10" vlanId={10} portCount={4} />
      <BroadcastDomainBadge domainId="bd-20" vlanId={20} portCount={3} />
      <BroadcastDomainBadge domainId="native" portCount={2} />
    </div>
  ),
};
