"use client";

import { useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { LinkLayerProcessView } from "@/components/data-link-layer/link-layer-process-view";
import { PhysicalTransmissionView } from "@/components/physical-layer/physical-transmission-view";
import { Badge } from "@/components/ui/badge";

import type { LayerPipeline, LayerPipelineNode } from "@/components/layer-pipeline/layer-pipeline-types";
import type { LayerFlowEdgeData, LayerFlowNodeData } from "./layer-flow-types";
import { LayerDataEdge } from "./edges/layer-data-edge";
import { ActionNode } from "./nodes/action-node";
import { LayerProcessorNode } from "./nodes/layer-processor-node";
import { PhysicalLinkNode } from "./nodes/physical-link-node";

export type LayerFlowCanvasProps = {
  pipeline: LayerPipeline;
};

const nodeTypes = {
  layerProcessor: LayerProcessorNode,
  physicalLink: PhysicalLinkNode,
  action: ActionNode,
};

const edgeTypes = {
  layerData: LayerDataEdge,
};

export function LayerFlowCanvas({ pipeline }: LayerFlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <LayerFlowCanvasInner pipeline={pipeline} />
    </ReactFlowProvider>
  );
}

function LayerFlowCanvasInner({ pipeline }: LayerFlowCanvasProps) {
  const [selectedNodeId, setSelectedNodeId] = useState(pipeline.nodes[0]?.id);
  const selectedNode = pipeline.nodes.find((node) => node.id === selectedNodeId) ?? pipeline.nodes[0];
  const { nodes, edges } = useMemo(() => toFlowElements(pipeline), [pipeline]);

  return (
    <section className="rounded-lg border bg-card p-4 text-card-foreground">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">{pipeline.title}</div>
        <Badge variant="secondary">React Flow 画布</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="h-[520px] overflow-hidden rounded-lg border bg-muted/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.35}
            maxZoom={1.6}
            nodesDraggable
            onNodeClick={(_, node) => setSelectedNodeId(String(node.id))}
          >
            <Background />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
        <FlowInspector node={selectedNode} />
      </div>
    </section>
  );
}

function toFlowElements(pipeline: LayerPipeline): { nodes: Node<LayerFlowNodeData>[]; edges: Edge<LayerFlowEdgeData>[] } {
  const baseNodes: Node<LayerFlowNodeData>[] = pipeline.nodes.map((node, index) => ({
    id: node.id,
    type: node.proxyKind === "physical-link" ? "physicalLink" : "layerProcessor",
    position: { x: index * 310, y: 120 },
    data: { pipelineNode: node },
  }));

  const actionNodes: Node<LayerFlowNodeData>[] = (pipeline.actionEdges ?? []).map((edge, index) => ({
    id: `action-${edge.id}`,
    type: "action",
    position: { x: 120 + index * 170, y: 340 },
    data: {
      pipelineNode: {
        id: `action-${edge.id}`,
        title: edge.action.label,
        proxyKind: "action",
        layer: "data-link",
        actor: "switch",
        direction: "forward",
        summary: edge.action.condition,
      },
    },
  }));

  const dataEdges: Edge<LayerFlowEdgeData>[] = pipeline.edges.map((edge) => ({
    id: edge.id,
    source: edge.from,
    target: edge.to,
    type: "layerData",
    animated: true,
    data: {
      kind: edge.data.kind === "physical-signal" ? "physical" : "data",
      label: edge.data.label,
      detail: edge.data.detail,
    },
  }));

  const actionEdges: Edge<LayerFlowEdgeData>[] = (pipeline.actionEdges ?? []).flatMap((edge) => [
    {
      id: `${edge.id}-from`,
      source: edge.from,
      target: `action-${edge.id}`,
      type: "layerData",
      data: { kind: "action", label: edge.action.label, detail: edge.action.condition },
    },
    {
      id: `${edge.id}-to`,
      source: `action-${edge.id}`,
      target: edge.to,
      type: "layerData",
      data: { kind: "action", label: edge.action.condition ?? edge.action.kind },
    },
  ]);

  return { nodes: [...baseNodes, ...actionNodes], edges: [...dataEdges, ...actionEdges] };
}

function FlowInspector({ node }: { node?: LayerPipelineNode }) {
  if (!node) {
    return <aside className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">请选择一个节点。</aside>;
  }

  return (
    <aside className="max-h-[520px] overflow-auto rounded-lg border bg-background p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">节点详情</div>
        <Badge variant="outline">{node.title}</Badge>
      </div>
      {node.detail?.kind === "data-link-process" ? <LinkLayerProcessView process={node.detail.process} /> : null}
      {node.detail?.kind === "physical-transmission" ? <PhysicalTransmissionView transmission={node.detail.transmission} /> : null}
      {!node.detail ? (
        <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
          {node.summary ?? "动作节点暂未绑定详情组件。"}
        </div>
      ) : null}
    </aside>
  );
}
