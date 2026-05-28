import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FragmentationView } from "./fragmentation-view";

const meta = {
  title: "网络层/IP分片",
  component: FragmentationView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof FragmentationView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MtuExceeded: Story = {
  name: "超过 MTU",
  args: {
    datagramBytes: 4000,
    mtu: 1500,
    fragments: [
      { id: "frag-1", offsetBytes: 0, sizeBytes: 1500, moreFragments: true },
      { id: "frag-2", offsetBytes: 1480, sizeBytes: 1500, moreFragments: true },
      { id: "frag-3", offsetBytes: 2960, sizeBytes: 1060, moreFragments: false },
    ],
  },
};
