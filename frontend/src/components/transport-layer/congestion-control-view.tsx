import { ChartNoAxesColumnIncreasing } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CongestionPoint = {
  round: number;
  cwnd: number;
  phase: "slow-start" | "congestion-avoidance" | "loss-recovery";
};

export type CongestionControlViewProps = {
  ssthresh: number;
  unit?: "MSS" | "bytes";
  points: CongestionPoint[];
  className?: string;
};

const phaseClassNames: Record<CongestionPoint["phase"], string> = {
  "slow-start": "bg-emerald-400",
  "congestion-avoidance": "bg-cyan-400",
  "loss-recovery": "bg-red-400",
};

export function CongestionControlView({
  ssthresh,
  unit = "MSS",
  points,
  className,
}: CongestionControlViewProps) {
  const maxCwnd = Math.max(...points.map((point) => point.cwnd), 1);

  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ChartNoAxesColumnIncreasing aria-hidden className="size-4" />
          TCP 拥塞控制
        </div>
        <Badge variant="outline">ssthresh={ssthresh} {unit}</Badge>
      </div>
      <div className="flex h-36 items-end gap-2 rounded-md border bg-muted/20 p-3">
        {points.map((point) => (
          <div key={point.round} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn("w-full rounded-t-sm", phaseClassNames[point.phase])}
              style={{ height: `${Math.max(8, (point.cwnd / maxCwnd) * 100)}%` }}
              title={`round ${point.round}, cwnd ${point.cwnd} ${unit}`}
            />
            <span className="font-mono text-[10px] text-muted-foreground">{point.round}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
