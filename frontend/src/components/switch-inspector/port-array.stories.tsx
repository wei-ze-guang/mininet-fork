import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { createDemoPorts } from "./story-data";
import { PortArray } from "./port-array";

const meta = {
  title: "网络设备/端口阵列",
  component: PortArray,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortArray>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EightPorts: Story = {
  name: "八口阵列",
  args: {
    ports: createDemoPorts({
      portCount: 8,
      connectedPorts: [1, 2, 3, 4],
      activePorts: [1, 3],
      errorPorts: [],
    }),
    activePortIds: ["port-1", "port-3"],
    selectedPortId: "port-1",
    columns: 8,
  },
};

export const TwentyFourPorts: Story = {
  name: "二十四口阵列",
  args: {
    ports: createDemoPorts({
      portCount: 24,
      connectedPorts: [1, 2, 3, 4, 5, 6, 7, 12, 18, 24],
      activePorts: [2, 12, 18],
      errorPorts: [6],
    }),
    activePortIds: ["port-2", "port-12", "port-18"],
    selectedPortId: "port-6",
    columns: 24,
  },
};
