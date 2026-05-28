import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SwitchDeviceView } from "./switch-device-view";
import { createDemoPorts, createDemoSwitch } from "./story-data";

const meta = {
  title: "网络设备/交换机外观",
  component: SwitchDeviceView,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SwitchDeviceView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EightPortAccessSwitch: Story = {
  name: "八口接入交换机",
  args: {
    device: createSwitch({
      name: "s1",
      modelName: "Mininet OVS Bridge",
      portCount: 8,
      connectedPorts: [1, 2, 3, 4],
      activePorts: [1, 3],
    }),
    activePortIds: ["port-1", "port-3"],
    selectedPortId: "port-1",
  },
};

export const TwentyFourPortSwitch: Story = {
  name: "二十四口交换机",
  args: {
    device: createSwitch({
      name: "s2",
      modelName: "24-Port Virtual Switch",
      portCount: 24,
      connectedPorts: [1, 2, 3, 4, 5, 6, 7, 12, 18, 24],
      activePorts: [2, 12, 18],
    }),
    activePortIds: ["port-2", "port-12", "port-18"],
  },
};

export const PortErrorState: Story = {
  name: "端口异常状态",
  args: {
    device: {
      ...createSwitch({
        name: "s3",
        modelName: "Error State Demo",
        portCount: 12,
        connectedPorts: [1, 2, 3, 6, 8],
        activePorts: [3],
      }),
      systemStatus: "warning",
      ports: createPorts({
        portCount: 12,
        connectedPorts: [1, 2, 3, 6, 8],
        activePorts: [3],
        errorPorts: [6],
      }),
    },
    selectedPortId: "port-6",
    activePortIds: ["port-3"],
  },
};

function createSwitch({
  name,
  modelName,
  portCount,
  connectedPorts,
  activePorts,
}: {
  name: string;
  modelName: string;
  portCount: number;
  connectedPorts: number[];
  activePorts: number[];
}) {
  return createDemoSwitch({
    name,
    modelName,
    portCount,
    connectedPorts,
    activePorts,
  });
}

function createPorts({
  portCount,
  connectedPorts,
  activePorts,
  errorPorts,
}: {
  portCount: number;
  connectedPorts: number[];
  activePorts: number[];
  errorPorts: number[];
}) {
  return createDemoPorts({ portCount, connectedPorts, activePorts, errorPorts });
}
