import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PhysicalPortView } from "./physical-port-view";
import {
  demoCopperPortA,
  demoFiberPort,
  demoLoopbackPort,
  demoVirtualPort,
  demoWirelessPort,
} from "./story-data";

const meta = {
  title: "物理层/物理端口",
  component: PhysicalPortView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PhysicalPortView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CopperPort: Story = {
  name: "RJ45 铜缆口",
  args: {
    port: demoCopperPortA,
    selected: true,
  },
};

export const FiberPort: Story = {
  name: "SFP+ 光口",
  args: {
    port: demoFiberPort,
  },
};

export const Implementations: Story = {
  name: "多种实现",
  args: {
    port: demoCopperPortA,
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-3">
      <PhysicalPortView port={demoCopperPortA} selected />
      <PhysicalPortView port={demoFiberPort} />
      <PhysicalPortView port={demoWirelessPort} />
      <PhysicalPortView port={demoLoopbackPort} />
      <PhysicalPortView port={demoVirtualPort} />
    </div>
  ),
};
