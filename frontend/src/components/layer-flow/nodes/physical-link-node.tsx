import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Cable } from "lucide-react";

import { cn } from "@/lib/utils";

import type { LayerFlowNodeData } from "../layer-flow-types";

export function PhysicalLinkNode({ data, selected }: NodeProps) {
  const nodeData = data as LayerFlowNodeData;
  const node = nodeData.pipelineNode;

  return (
    <div
      className={cn(
        "relative h-20 w-64 rounded-xl border bg-background px-5 shadow-sm",
        selected && "ring-2 ring-cyan-400/40",
      )}
    >
      <Handle type="target" position={Position.Left} className="!size-2 !bg-cyan-500" />
      <div className="absolute left-5 right-5 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 via-slate-300 to-emerald-500" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border bg-background px-2 py-1 text-xs font-semibold shadow-sm">
        <Cable aria-hidden className="size-3.5 text-cyan-600" />
        {node.title}
      </div>
      <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-muted-foreground">
        物理层代理：线 / 介质 / 信号流
      </div>
      <Handle type="source" position={Position.Right} className="!size-2 !bg-cyan-500" />
    </div>
  );
}
