import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";

import { Badge } from "@/components/ui/badge";

import type { LayerFlowEdgeData } from "../layer-flow-types";

export function LayerDataEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath(props);
  const data = props.data as LayerFlowEdgeData | undefined;
  const isAction = data?.kind === "action";
  const isPhysical = data?.kind === "physical";

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{
          strokeWidth: isPhysical ? 5 : 2,
          strokeDasharray: isAction ? "6 5" : undefined,
          stroke: isAction ? "rgb(245 158 11)" : isPhysical ? "rgb(6 182 212)" : "rgb(14 165 233)",
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)` }}
        >
          <Badge variant="secondary" className="border bg-background font-mono text-[10px] shadow-sm">
            {data?.label ?? ""}
          </Badge>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
