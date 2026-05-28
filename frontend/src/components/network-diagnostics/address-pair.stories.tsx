import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AddressPair } from "./address-pair";

const meta = {
  title: "网络诊断/地址对",
  component: AddressPair,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AddressPair>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddressPairs: Story = {
  name: "地址映射",
  args: {
    from: "10.0.1.11",
    to: "10.0.2.21",
  },
  render: () => (
    <div className="grid w-[460px] gap-2">
      <AddressPair label="MAC" kind="mac" from="02:42:0a:00:01:0b" to="02:42:0a:00:02:15" />
      <AddressPair label="IP" kind="ip" from="10.0.1.11" to="10.0.2.21" />
      <AddressPair label="端口" kind="port" from="53218" to="443" />
    </div>
  ),
};
