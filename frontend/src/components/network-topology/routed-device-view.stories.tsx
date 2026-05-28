import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { demoGateway, demoNatRouter } from "./story-data";
import { RoutedDeviceView } from "./routed-device-view";

const meta = {
  title: "网络设备/路由与网关设备",
  component: RoutedDeviceView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RoutedDeviceView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GatewayAndNat: Story = {
  name: "网关 / NAT 路由器",
  args: {
    device: demoGateway,
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <RoutedDeviceView device={demoGateway} selected />
      <RoutedDeviceView device={demoNatRouter} />
      <RoutedDeviceView
        device={{
          ...demoGateway,
          id: "gw1",
          name: "gw1",
        }}
      />
      <RoutedDeviceView
        device={{
          ...demoGateway,
          id: "edge-router",
          name: "edge-router",
          role: "router",
        }}
      />
    </div>
  ),
};

export const Compact: Story = {
  name: "紧凑模式",
  args: {
    device: demoGateway,
    compact: true,
  },
};
