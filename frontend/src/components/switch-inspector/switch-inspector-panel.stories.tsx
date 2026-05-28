import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SwitchInspectorPanel } from "./switch-inspector-panel";
import { createDemoSwitch } from "./story-data";

const meta = {
  title: "网络设备/交换机观察面板",
  component: SwitchInspectorPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SwitchInspectorPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicInspection: Story = {
  name: "面板 + 端口详情 + MAC表",
  args: {
    device: createDemoSwitch({
      name: "s1",
      modelName: "Mininet OVS Bridge",
      portCount: 24,
      connectedPorts: [1, 2, 3, 4, 5, 6, 12, 18, 24],
      activePorts: [1, 3, 18],
      errorPorts: [6],
    }),
    activePortIds: ["port-1", "port-3", "port-18"],
    initialSelectedPortId: "port-1",
    macEntries: [
      {
        id: "mac-1",
        mac: "02:42:0a:00:01:0b",
        portId: "eth1",
        vlan: "10",
        learnedFrom: "r1",
        ageSeconds: 5,
        state: "hit",
      },
      {
        id: "mac-2",
        mac: "02:42:0a:00:01:11",
        portId: "eth3",
        vlan: "10",
        learnedFrom: "h11",
        ageSeconds: 12,
        state: "learned",
      },
      {
        id: "mac-3",
        mac: "02:42:0a:00:02:15",
        portId: "eth18",
        vlan: "20",
        learnedFrom: "h21",
        ageSeconds: 41,
        state: "learned",
      },
      {
        id: "mac-4",
        mac: "02:42:0a:00:09:99",
        portId: "eth6",
        vlan: "30",
        learnedFrom: "old-host",
        ageSeconds: 301,
        state: "expired",
      },
    ],
  },
};
