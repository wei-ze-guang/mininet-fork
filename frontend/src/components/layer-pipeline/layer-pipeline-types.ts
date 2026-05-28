import type { LinkLayerProcess } from "@/components/data-link-layer/data-link-types";
import type { PhysicalTransmission } from "@/components/physical-layer/physical-types";

export type PipelineLayer = "physical" | "data-link" | "network" | "transport" | "application";

export type PipelineActor = "host" | "switch" | "router" | "link";

export type PipelineDirection = "send" | "receive" | "forward" | "transmit";

export type PipelineProxyKind = "layer-processor" | "physical-link" | "table" | "action";

export type PipelineDataKind =
  | "upper-payload"
  | "ethernet-frame"
  | "bit-stream"
  | "physical-signal"
  | "forward-decision"
  | "drop-decision";

export type PipelineDataRef = {
  kind: PipelineDataKind;
  label: string;
  detail?: string;
};

export type LayerPipelineNode = {
  id: string;
  title: string;
  proxyKind?: PipelineProxyKind;
  layer: PipelineLayer;
  actor: PipelineActor;
  direction: PipelineDirection;
  summary?: string;
  dataIn?: PipelineDataRef;
  dataOut?: PipelineDataRef;
  detail?: {
    kind: "data-link-process";
    process: LinkLayerProcess;
  } | {
    kind: "physical-transmission";
    transmission: PhysicalTransmission;
  };
};

export type PipelineActionKind =
  | "send"
  | "receive"
  | "verify-fcs"
  | "learn-mac"
  | "lookup-fdb"
  | "forward"
  | "flood"
  | "drop";

export type LayerPipelineEdge = {
  id: string;
  from: string;
  to: string;
  data: PipelineDataRef;
};

export type LayerPipelineActionEdge = {
  id: string;
  from: string;
  to: string;
  action: {
    kind: PipelineActionKind;
    label: string;
    condition?: string;
  };
};

export type LayerPipeline = {
  id: string;
  title: string;
  nodes: LayerPipelineNode[];
  edges: LayerPipelineEdge[];
  actionEdges?: LayerPipelineActionEdge[];
};
