import { ArrowRightLeft, Zap } from "lucide-react";

import { MetricPill } from "@/components/network-primitives/metric-pill";
import { StatusLed } from "@/components/network-primitives/status-led";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PhysicalMediumBadge } from "./physical-medium-badge";
import { PhysicalPortView } from "./physical-port-view";
import type { PhysicalLink } from "./physical-types";

export type PhysicalLinkViewProps = {
  link: PhysicalLink;
  className?: string;
};

export function PhysicalLinkView({ link, className }: PhysicalLinkViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ArrowRightLeft aria-hidden className="size-4" />
          物理链路
        </div>
        <div className="flex items-center gap-2">
          <StatusLed status={link.status === "link" ? "link" : link.status === "degraded" ? "warning" : link.status === "error" ? "error" : "down"} />
          <Badge variant="outline">{statusText(link.status)}</Badge>
        </div>
      </div>

      <div className="grid items-center gap-3 lg:grid-cols-[1fr_180px_1fr]">
        <PhysicalPortView port={link.endpointA} />
        <div className="rounded-lg border bg-muted/30 p-3 text-center">
          <PhysicalMediumBadge kind={link.medium.kind} label={link.medium.label} />
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            <MetricPill label="带宽" value={link.bandwidthMbps} unit="Mbps" icon="rate" compact />
            <MetricPill label="传播" value={link.propagationDelayMs ?? 0} unit="ms" icon="latency" compact />
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <Zap aria-hidden className="size-3 text-cyan-500" />
            BER {link.bitErrorRate ?? 0}
          </div>
        </div>
        <PhysicalPortView port={link.endpointB} />
      </div>
    </section>
  );
}

function statusText(status: PhysicalLink["status"]) {
  if (status === "link") return "已连通";
  if (status === "degraded") return "退化";
  if (status === "error") return "错误";
  return "断开";
}
