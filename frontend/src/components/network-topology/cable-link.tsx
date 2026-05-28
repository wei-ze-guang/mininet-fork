import type { CableLinkDirection, CableLinkStatus } from "./types";
import { cn } from "@/lib/utils";

import { TrafficFlowOverlay, type TrafficFlowOverlayProps } from "./traffic-flow-overlay";

export type CableLinkProps = {
  status: CableLinkStatus;
  direction?: CableLinkDirection;
  label?: string;
  bandwidthMbps?: number;
  latencyMs?: number;
  packetLoss?: number;
  flow?: TrafficFlowOverlayProps;
  className?: string;
};

const statusClassNames: Record<CableLinkStatus, string> = {
  down: "bg-red-900/50",
  link: "bg-emerald-500/55",
  activity: "bg-cyan-400/70 shadow-[0_0_10px_rgba(34,211,238,0.35)]",
  error: "bg-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.35)]",
};

export function CableLink({
  status,
  direction = "none",
  label,
  bandwidthMbps,
  latencyMs,
  packetLoss,
  flow,
  className,
}: CableLinkProps) {
  const active = status === "activity";

  return (
    <div className={cn("relative min-w-32 py-4", className)}>
      <div
        className={cn(
          "relative h-5 overflow-hidden rounded-full",
          statusClassNames[status],
          status === "down" && "opacity-50",
        )}
      >
        <TrafficFlowOverlay active={active} direction={direction} {...flow} />
      </div>
      {label || bandwidthMbps || latencyMs !== undefined || packetLoss !== undefined ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-1 text-[10px] text-muted-foreground">
          {label ? <span>{label}</span> : null}
          {bandwidthMbps ? <span>{bandwidthMbps} Mbps</span> : null}
          {latencyMs !== undefined ? <span>{latencyMs} ms</span> : null}
          {packetLoss !== undefined ? <span>{packetLoss}% loss</span> : null}
        </div>
      ) : null}
    </div>
  );
}
