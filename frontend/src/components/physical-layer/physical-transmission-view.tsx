import { ArrowRightLeft, CircleDot } from "lucide-react";

import { MetricPill } from "@/components/network-primitives/metric-pill";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PhysicalSignalView } from "./physical-signal-view";
import type { PhysicalTransmission } from "./physical-types";

export type PhysicalTransmissionViewProps = {
  transmission: PhysicalTransmission;
  className?: string;
};

const resultClassNames: Record<PhysicalTransmission["result"], string> = {
  delivered: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  lost: "border-zinc-400/40 bg-zinc-400/10 text-zinc-700 dark:text-zinc-200",
  corrupted: "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  collision: "border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-200",
};

export function PhysicalTransmissionView({
  transmission,
  className,
}: PhysicalTransmissionViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CircleDot aria-hidden className="size-4" />
          物理层收发动作
        </div>
        <Badge variant="outline" className={cn(resultClassNames[transmission.result])}>
          {resultText(transmission.result)}
        </Badge>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
        <span className="font-mono">{transmission.fromPortId}</span>
        <ArrowRightLeft aria-hidden className="size-4 text-muted-foreground" />
        <span className="font-mono">{transmission.toPortId}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {transmission.direction}
        </span>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <MetricPill label="开始" value={transmission.startedAtMs} unit="ms" icon="latency" compact />
        {transmission.endedAtMs !== undefined ? (
          <MetricPill label="结束" value={transmission.endedAtMs} unit="ms" icon="latency" compact />
        ) : null}
      </div>
      <PhysicalSignalView signal={transmission.signal} />
    </section>
  );
}

function resultText(result: PhysicalTransmission["result"]) {
  if (result === "delivered") return "已交付";
  if (result === "lost") return "丢失";
  if (result === "corrupted") return "误码";
  return "碰撞";
}
