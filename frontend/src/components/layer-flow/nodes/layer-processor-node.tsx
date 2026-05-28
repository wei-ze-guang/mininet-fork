import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Layers2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { LayerFlowNodeData } from "../layer-flow-types";

export function LayerProcessorNode({ data, selected }: NodeProps) {
  const nodeData = data as LayerFlowNodeData;
  const node = nodeData.pipelineNode;

  return (
    <div
      className={cn(
        "relative grid min-h-24 w-36 place-items-center rounded-xl border bg-background p-3 text-center shadow-sm",
        "border-emerald-400/50 bg-emerald-400/10",
        selected && "ring-2 ring-cyan-400/40",
      )}
    >
      <Handle type="target" position={Position.Left} className="!size-2 !bg-emerald-500" />
      <div className="grid place-items-center gap-1">
        <div className="grid size-10 place-items-center rounded-lg border bg-background shadow-sm">
          <Layers2 aria-hidden className="size-5 text-emerald-700 dark:text-emerald-200" />
        </div>
        <div className="text-xs font-semibold">{node.title}</div>
        <div className="text-[10px] text-muted-foreground">{node.direction === "send" ? "发送方向" : "接收方向"}</div>
        <Badge variant="outline" className="h-5 text-[10px]">L2</Badge>
      </div>
      <Handle type="source" position={Position.Right} className="!size-2 !bg-emerald-500" />
    </div>
  );
}
