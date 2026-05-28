import { Gauge, Radio, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type LinkQualityBadgeProps = {
  bandwidthMbps?: number;
  latencyMs?: number;
  jitterMs?: number;
  lossPercent?: number;
  mtu?: number;
  duplex?: "half" | "full";
  className?: string;
};

export function LinkQualityBadge({
  bandwidthMbps,
  latencyMs,
  jitterMs,
  lossPercent,
  mtu,
  duplex,
  className,
}: LinkQualityBadgeProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {bandwidthMbps !== undefined ? (
        <QualityChip icon={Gauge} label={`${bandwidthMbps} Mbps`} />
      ) : null}
      {latencyMs !== undefined ? (
        <QualityChip icon={Timer} label={`${latencyMs} ms`} tone={latencyMs > 80 ? "warning" : "neutral"} />
      ) : null}
      {jitterMs !== undefined ? (
        <QualityChip label={`抖动 ${jitterMs} ms`} tone={jitterMs > 20 ? "warning" : "neutral"} />
      ) : null}
      {lossPercent !== undefined ? (
        <QualityChip label={`丢包 ${lossPercent}%`} tone={lossPercent > 0 ? "danger" : "neutral"} />
      ) : null}
      {mtu !== undefined ? <QualityChip icon={Radio} label={`MTU ${mtu}`} /> : null}
      {duplex ? <QualityChip label={duplex === "full" ? "全双工" : "半双工"} /> : null}
    </div>
  );
}

function QualityChip({
  icon: Icon,
  label,
  tone = "neutral",
}: {
  icon?: typeof Gauge;
  label: string;
  tone?: "neutral" | "warning" | "danger";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1",
        tone === "warning" && "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-200",
        tone === "danger" && "border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-200",
      )}
    >
      {Icon ? <Icon aria-hidden className="size-3" /> : null}
      {label}
    </Badge>
  );
}
