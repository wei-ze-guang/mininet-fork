"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Cable, Cpu, Info, Layers2, RadioTower, Router, Server, Workflow, Zap } from "lucide-react";

import { LinkLayerProcessView } from "@/components/data-link-layer/link-layer-process-view";
import { PhysicalTransmissionView } from "@/components/physical-layer/physical-transmission-view";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type {
  LayerPipeline,
  LayerPipelineActionEdge,
  LayerPipelineEdge,
  LayerPipelineNode,
  PipelineDataRef,
} from "./layer-pipeline-types";

export type LayerPipelineViewProps = {
  pipeline: LayerPipeline;
  className?: string;
};

const layerClassNames: Record<LayerPipelineNode["layer"], string> = {
  physical: "border-cyan-400/55 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200",
  "data-link": "border-emerald-400/55 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  network: "border-violet-400/55 bg-violet-400/10 text-violet-700 dark:text-violet-200",
  transport: "border-amber-400/55 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  application: "border-rose-400/55 bg-rose-400/10 text-rose-700 dark:text-rose-200",
};

export function LayerPipelineView({ pipeline, className }: LayerPipelineViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState(pipeline.nodes[0]?.id);
  const selectedNode = useMemo(
    () => pipeline.nodes.find((node) => node.id === selectedNodeId) ?? pipeline.nodes[0],
    [pipeline.nodes, selectedNodeId],
  );

  return (
    <section className={cn("rounded-lg border bg-card p-4 text-card-foreground", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Layers2 aria-hidden className="size-4" />
          {pipeline.title}
        </div>
        <Badge variant="secondary">可拆卸分层流水线</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-x-auto rounded-lg border bg-muted/20 px-5 py-8">
          <div className="flex min-w-max items-center">
            {pipeline.nodes.map((node, index) => (
              <PipelineNodeWithEdge
                key={node.id}
                active={node.id === selectedNode?.id}
                edge={pipeline.edges.find((candidate) => candidate.from === node.id)}
                last={index === pipeline.nodes.length - 1}
                node={node}
                onSelect={() => setSelectedNodeId(node.id)}
              />
            ))}
          </div>
          {pipeline.actionEdges?.length ? <ActionEdgeRail edges={pipeline.actionEdges} /> : null}
        </div>

        <PipelineInspector node={selectedNode} />
      </div>
    </section>
  );
}

function PipelineNodeWithEdge({
  active,
  edge,
  last,
  node,
  onSelect,
}: {
  active: boolean;
  edge?: LayerPipelineEdge;
  last: boolean;
  node: LayerPipelineNode;
  onSelect: () => void;
}) {
  return (
    <>
      {node.proxyKind === "physical-link" ? (
        <PipelinePhysicalLink active={active} node={node} onSelect={onSelect} />
      ) : (
        <PipelineLogoNode active={active} node={node} onSelect={onSelect} />
      )}
      {!last ? <PipelineEdgePill edge={edge} /> : null}
    </>
  );
}

function PipelinePhysicalLink({
  active,
  node,
  onSelect,
}: {
  active: boolean;
  node: LayerPipelineNode;
  onSelect: () => void;
}) {
  return (
    <div className="grid w-56 justify-items-center gap-2">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "relative h-[72px] w-56 rounded-xl border bg-background px-4 transition hover:border-cyan-400 focus-visible:border-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30",
          active && "border-cyan-400 ring-2 ring-cyan-400/35",
        )}
        aria-label={`查看 ${node.title}`}
      >
        <div className="absolute left-4 right-4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 via-slate-300 to-emerald-500 shadow-[0_0_12px_rgba(34,211,238,0.25)]" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border bg-background px-2 py-1 text-xs font-semibold shadow-sm">
          <Cable aria-hidden className="size-3.5 text-cyan-600" />
          {node.title}
        </div>
      </button>
      <div className="text-center">
        <div className="text-xs font-semibold">物理链路代理</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">线 / 介质 / 信号流</div>
      </div>
    </div>
  );
}

function PipelineLogoNode({
  active,
  node,
  onSelect,
}: {
  active: boolean;
  node: LayerPipelineNode;
  onSelect: () => void;
}) {
  return (
    <div className="grid w-24 justify-items-center gap-2">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "relative grid size-[72px] place-items-center rounded-2xl border bg-background shadow-sm transition hover:scale-[1.03] hover:border-cyan-400 focus-visible:border-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30",
          layerClassNames[node.layer],
          active && "border-cyan-400 ring-2 ring-cyan-400/35",
        )}
        aria-label={`查看 ${node.title}`}
      >
        <PipelineNodeIcon node={node} />
        <span className="absolute -right-2 -top-2 rounded-full border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
          {directionText(node.direction)}
        </span>
      </button>
      <div className="text-center">
        <div className="max-w-24 truncate text-xs font-semibold">{node.title}</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">{layerShortText(node.layer)} · {actorText(node.actor)}</div>
      </div>
    </div>
  );
}

function PipelineNodeIcon({ node }: { node: LayerPipelineNode }) {
  const className = "size-7";

  if (node.layer === "physical") return <RadioTower aria-hidden className={className} />;
  if (node.layer === "data-link") return <Layers2 aria-hidden className={className} />;
  if (node.actor === "router") return <Router aria-hidden className={className} />;
  if (node.actor === "host") return <Server aria-hidden className={className} />;
  if (node.direction === "forward") return <Workflow aria-hidden className={className} />;
  return <Cpu aria-hidden className={className} />;
}

function PipelineEdgePill({ edge }: { edge?: LayerPipelineEdge }) {
  if (!edge) {
    return <ArrowRight aria-hidden className="mx-4 size-5 text-muted-foreground" />;
  }

  return (
    <div className="relative mx-1 h-[72px] w-28 shrink-0">
      <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-cyan-500/60" />
      <ArrowRight aria-hidden className="absolute right-0 top-1/2 size-5 -translate-y-1/2 text-cyan-700" />
      <div className="absolute left-1/2 top-[calc(50%+12px)] flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background px-2 py-1 shadow-sm">
        <span className="font-mono text-[10px] font-semibold">{dataKindText(edge.data.kind)}</span>
        <span className="max-w-20 truncate font-mono text-[10px] text-muted-foreground">{edge.data.label}</span>
      </div>
    </div>
  );
}

function ActionEdgeRail({ edges }: { edges: LayerPipelineActionEdge[] }) {
  return (
    <div className="mt-8 rounded-lg border border-dashed bg-background/70 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Zap aria-hidden className="size-3.5" />
        动作连接
      </div>
      <div className="flex min-w-max flex-wrap items-center gap-2">
        {edges.map((edge, index) => (
          <div key={edge.id} className="flex items-center gap-2">
            <ActionBadge edge={edge} />
            {index < edges.length - 1 ? (
              <div className="h-px w-8 border-t border-dashed border-muted-foreground/60" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBadge({ edge }: { edge: LayerPipelineActionEdge }) {
  return (
    <div className="rounded-full border border-dashed bg-muted/30 px-3 py-1 text-xs">
      <span className="font-semibold">{actionKindText(edge.action.kind)}</span>
      <span className="mx-1 text-muted-foreground">/</span>
      <span>{edge.action.label}</span>
      {edge.action.condition ? (
        <span className="ml-1 font-mono text-[10px] text-cyan-700 dark:text-cyan-200">({edge.action.condition})</span>
      ) : null}
    </div>
  );
}

function PipelineInspector({ node }: { node?: LayerPipelineNode }) {
  if (!node) {
    return (
      <aside className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
        请选择一个层节点。
      </aside>
    );
  }

  return (
    <aside className="max-h-[620px] overflow-auto rounded-lg border bg-background p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Info aria-hidden className="size-4" />
          节点详情
        </div>
        <Badge variant="outline">{layerText(node.layer)}</Badge>
      </div>

      <div className="mb-3 grid gap-2">
        {node.dataIn ? <DataRefCard label="输入" data={node.dataIn} /> : null}
        {node.dataOut ? <DataRefCard label="输出" data={node.dataOut} /> : null}
      </div>

      {node.detail?.kind === "data-link-process" ? (
        <LinkLayerProcessView process={node.detail.process} />
      ) : null}
      {node.detail?.kind === "physical-transmission" ? (
        <PhysicalTransmissionView transmission={node.detail.transmission} />
      ) : null}
      {!node.detail ? (
        <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
          这个节点暂时只提供抽象输入/输出，可后续插入更具体的过程组件。
        </div>
      ) : null}
    </aside>
  );
}

function DataRefCard({ label, data }: { label: string; data: PipelineDataRef }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{dataKindText(data.kind)}</Badge>
        <span className="font-mono text-sm font-medium">{data.label}</span>
      </div>
      {data.detail ? <div className="mt-1 text-xs text-muted-foreground">{data.detail}</div> : null}
    </div>
  );
}

function layerText(layer: LayerPipelineNode["layer"]) {
  if (layer === "physical") return "物理层";
  if (layer === "data-link") return "数据链路层";
  if (layer === "network") return "网络层";
  if (layer === "transport") return "运输层";
  return "应用层";
}

function layerShortText(layer: LayerPipelineNode["layer"]) {
  if (layer === "physical") return "L1";
  if (layer === "data-link") return "L2";
  if (layer === "network") return "L3";
  if (layer === "transport") return "L4";
  return "L7";
}


function actorText(actor: LayerPipelineNode["actor"]) {
  if (actor === "host") return "主机";
  if (actor === "switch") return "交换机";
  if (actor === "router") return "路由器";
  return "链路";
}

function directionText(direction: LayerPipelineNode["direction"]) {
  if (direction === "send") return "发送";
  if (direction === "receive") return "接收";
  if (direction === "forward") return "转发";
  return "传输";
}

function dataKindText(kind: PipelineDataRef["kind"]) {
  if (kind === "upper-payload") return "上层数据";
  if (kind === "ethernet-frame") return "以太网帧";
  if (kind === "bit-stream") return "比特流";
  if (kind === "physical-signal") return "物理信号";
  if (kind === "forward-decision") return "转发决策";
  return "丢弃决策";
}

function actionKindText(kind: LayerPipelineActionEdge["action"]["kind"]) {
  if (kind === "send") return "发送";
  if (kind === "receive") return "接收";
  if (kind === "verify-fcs") return "校验";
  if (kind === "learn-mac") return "学习";
  if (kind === "lookup-fdb") return "查表";
  if (kind === "forward") return "转发";
  if (kind === "flood") return "泛洪";
  return "丢弃";
}
