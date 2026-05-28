import type { LayerPipelineNode } from "@/components/layer-pipeline/layer-pipeline-types";

export type LayerFlowNodeData = {
  pipelineNode: LayerPipelineNode;
};

export type LayerFlowEdgeData = {
  label: string;
  kind: "data" | "physical" | "action";
  detail?: string;
};
