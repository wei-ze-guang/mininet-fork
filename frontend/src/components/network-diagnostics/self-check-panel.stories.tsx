import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SelfCheckPanel } from "./self-check-panel";

const meta = {
  title: "网络诊断/自检面板",
  component: SelfCheckPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SelfCheckPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DataConsistency: Story = {
  name: "数据一致性检查",
  args: {
    items: [
      {
        id: "check-1",
        title: "拓扑节点完整",
        detail: "所有链路两端都能找到对应设备",
        severity: "ok",
        target: "topology",
      },
      {
        id: "check-2",
        title: "MAC 表引用了不存在端口",
        detail: "s1 的 MAC 表中 eth99 不存在，需要检查采集或映射逻辑",
        severity: "error",
        target: "s1/eth99",
      },
      {
        id: "check-3",
        title: "默认网关缺失",
        detail: "h21 没有 defaultGatewayIp，跨网段回放可能无法解释路由路径",
        severity: "warning",
        target: "h21",
      },
      {
        id: "check-4",
        title: "VLAN 表未接入真实采集",
        detail: "当前为前端演示数据，后续需要从服务端数据适配",
        severity: "info",
        target: "vlan",
      },
    ],
  },
};
