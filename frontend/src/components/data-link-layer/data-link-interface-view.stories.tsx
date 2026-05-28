import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DataLinkInterfaceView } from "./data-link-interface-view";
import { hostAccessInterface, switchAccessInterface, switchTrunkInterface } from "./story-data";

const meta = {
  title: "数据链路层/链路接口",
  component: DataLinkInterfaceView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DataLinkInterfaceView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AccessPort: Story = {
  name: "Access 接口",
  args: {
    iface: switchAccessInterface,
    selected: true,
  },
};

export const TrunkPort: Story = {
  name: "Trunk 接口",
  args: {
    iface: switchTrunkInterface,
  },
};

export const InterfaceGroup: Story = {
  name: "主机与交换机接口",
  args: {
    iface: switchAccessInterface,
  },
  render: () => (
    <div className="grid gap-3 lg:grid-cols-3">
      <DataLinkInterfaceView iface={hostAccessInterface} />
      <DataLinkInterfaceView iface={switchAccessInterface} selected />
      <DataLinkInterfaceView iface={switchTrunkInterface} />
    </div>
  ),
};
