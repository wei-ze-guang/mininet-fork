import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { LayerFlowNodeData } from "../layer-flow-types";

export function ActionNode({ data, selected }: NodeProps) {
  const nodeData = data as LayerFlowNodeData;
  const node = nodeData.pipelineNode;

  return (
    <div
      className={cn(
        "relative grid min-h-20 w-32 place-items-center rounded-full border border-dashed bg-background p-3 text-center shadow-sm",
        selected && "ring-2 ring-cyan-400/40",
      )}
    >
      <Handle type="target" position={Position.Left} className="!size-2 !bg-amber-500" />
      <div className="grid place-items-center gap-1">
        <Zap aria-hidden className="size-4 text-amber-600" />
        <div className="text-xs font-semibold">{node.title}</div>
        <Badge variant="outline" className="h-5 text-[10px]">动作</Badge>
      </div>
      <Handle type="source" position={Position.Right} className="!size-2 !bg-amber-500" />
    </div>
  );
}
