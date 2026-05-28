import { Signal, Waves } from "lucide-react";

import { MetricPill } from "@/components/network-primitives/metric-pill";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { PhysicalSignal } from "./physical-types";

export type PhysicalSignalViewProps = {
  signal: PhysicalSignal;
  className?: string;
};

export function PhysicalSignalView({ signal, className }: PhysicalSignalViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Waves aria-hidden className="size-4" />
          物理信号
        </div>
        <Badge variant="outline" className="font-mono">{signal.encoding ?? "unknown"}</Badge>
      </div>
      <div className="rounded-md border bg-zinc-950 p-3 text-zinc-100">
        <div className="flex items-center gap-2 font-mono text-sm tracking-[0.25em] text-cyan-200">
          <Signal aria-hidden className="size-4 shrink-0 text-cyan-300" />
          <span className="break-all">{signal.bitStream.bits}</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {signal.bitStream.bitRateMbps !== undefined ? (
          <MetricPill label="比特率" value={signal.bitStream.bitRateMbps} unit="Mbps" icon="rate" compact />
        ) : null}
        {signal.symbolRateMbaud !== undefined ? (
          <MetricPill label="符号率" value={signal.symbolRateMbaud} unit="Mbaud" icon="rate" compact />
        ) : null}
        {signal.powerDbm !== undefined ? (
          <MetricPill label="功率" value={signal.powerDbm} unit="dBm" tone="info" compact />
        ) : null}
      </div>
    </section>
  );
}
