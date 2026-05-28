import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { createDemoSwitch } from "@/components/switch-inspector/story-data";

import { SwitchCompositionView } from "./switch-composition-view";

const meta = {
  title: "设备组合/交换机组成",
  component: SwitchCompositionView,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SwitchCompositionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Layer2Switch: Story = {
  name: "二层交换机",
  args: {
    device: createDemoSwitch({
      name: "s1",
      modelName: "Mininet OVS Bridge",
      portCount: 24,
      connectedPorts: [1, 2, 3, 4, 5, 6, 12, 18, 24],
      activePorts: [1, 3, 18],
      errorPorts: [],
    }),
    activePortIds: ["port-1", "port-3", "port-18"],
    macEntries: [
      {
        id: "mac-1",
        mac: "02:42:0a:00:01:0b",
        portId: "eth3",
        vlan: "10",
        learnedFrom: "h11-eth0",
        ageSeconds: 5,
        state: "hit",
      },
      {
        id: "mac-2",
        mac: "02:42:0a:00:02:15",
        portId: "eth18",
        vlan: "20",
        learnedFrom: "h21-eth0",
        ageSeconds: 41,
        state: "learned",
      },
      {
        id: "mac-3",
        mac: "02:42:0a:00:01:01",
        portId: "eth1",
        vlan: "10",
        learnedFrom: "r1-eth0",
        ageSeconds: 12,
        state: "learned",
      },
    ],
    vlanEntries: [
      {
        id: "vlan-10",
        vlanId: 10,
        name: "LAN-A",
        ports: ["eth1", "eth2", "eth3", "trunk1"],
        taggedPorts: ["trunk1"],
        untaggedPorts: ["eth1", "eth2", "eth3"],
        sviInterfaceIp: "10.0.1.1",
        state: "active",
      },
      {
        id: "vlan-20",
        vlanId: 20,
        name: "LAN-B",
        ports: ["eth18", "eth24", "trunk1"],
        taggedPorts: ["trunk1"],
        untaggedPorts: ["eth18", "eth24"],
        sviInterfaceIp: "10.0.2.1",
        state: "active",
      },
    ],
  },
};
