import { hostSendProcess, switchReceiveProcess } from "@/components/data-link-layer/story-data";
import { demoTransmission } from "@/components/physical-layer/story-data";

import type { LayerPipeline } from "./layer-pipeline-types";

export const hostToSwitchPipeline: LayerPipeline = {
  id: "pipeline-host-switch",
  title: "主机到交换机：可拆卸分层流水线",
  nodes: [
    {
      id: "host-l2-send",
      title: "Host L2",
      proxyKind: "layer-processor",
      layer: "data-link",
      actor: "host",
      direction: "send",
      summary: "把上层 IPv4 数据封装成以太网帧，并输出比特流。",
      dataIn: hostSendProcess.input,
      dataOut: hostSendProcess.output,
      detail: {
        kind: "data-link-process",
        process: hostSendProcess,
      },
    },
    {
      id: "physical-link",
      title: "Cat6 Link",
      proxyKind: "physical-link",
      layer: "physical",
      actor: "link",
      direction: "transmit",
      summary: "物理介质代理：比特流被编码成信号，在 Cat6 链路上传播，再恢复为比特流。",
      dataIn: {
        kind: "bit-stream",
        label: "Preamble + SFD + MAC frame bits",
      },
      dataOut: {
        kind: "physical-signal",
        label: "Manchester signal",
      },
      detail: {
        kind: "physical-transmission",
        transmission: demoTransmission,
      },
    },
    {
      id: "switch-l2-receive",
      title: "Switch L2",
      proxyKind: "layer-processor",
      layer: "data-link",
      actor: "switch",
      direction: "receive",
      summary: "从比特流识别帧，校验 FCS，学习源 MAC 并查表转发。",
      dataIn: switchReceiveProcess.input,
      dataOut: switchReceiveProcess.output,
      detail: {
        kind: "data-link-process",
        process: switchReceiveProcess,
      },
    },
  ],
  edges: [
    {
      id: "edge-host-l2-l1",
      from: "host-l2-send",
      to: "physical-link",
      data: {
        kind: "bit-stream",
        label: "01 bits",
        detail: "链路层交给物理层的比特流。",
      },
    },
    {
      id: "edge-physical-link",
      from: "physical-link",
      to: "switch-l2-receive",
      data: {
        kind: "bit-stream",
        label: "01 bits",
        detail: "物理链路恢复后交给交换机链路层的比特流。",
      },
    },
  ],
  actionEdges: [
    {
      id: "action-send-to-link",
      from: "host-l2-send",
      to: "physical-link",
      action: { kind: "send", label: "交付比特流" },
    },
    {
      id: "action-link-receive",
      from: "physical-link",
      to: "switch-l2-receive",
      action: { kind: "receive", label: "恢复并交付" },
    },
    {
      id: "action-fcs-pass",
      from: "switch-l2-receive",
      to: "switch-l2-receive",
      action: { kind: "verify-fcs", label: "FCS 校验", condition: "pass" },
    },
    {
      id: "action-learn-lookup",
      from: "switch-l2-receive",
      to: "switch-l2-receive",
      action: { kind: "lookup-fdb", label: "学习源 MAC / 查 FDB", condition: "hit" },
    },
    {
      id: "action-forward",
      from: "switch-l2-receive",
      to: "switch-l2-receive",
      action: { kind: "forward", label: "单播转发", condition: "s1-sfp1" },
    },
  ],
};
