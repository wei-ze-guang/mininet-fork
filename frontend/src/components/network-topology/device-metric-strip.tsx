import { MetricPill } from "@/components/network-primitives/metric-pill";
import { cn } from "@/lib/utils";

export type DeviceMetricStripProps = {
  rxPackets?: number;
  txPackets?: number;
  latencyMs?: number;
  lossPercent?: number;
  compact?: boolean;
  className?: string;
};

export function DeviceMetricStrip({
  rxPackets,
  txPackets,
  latencyMs,
  lossPercent,
  compact,
  className,
}: DeviceMetricStripProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <MetricPill
        label="RX"
        value={rxPackets ?? "-"}
        unit="pkt"
        icon="rx"
        tone="info"
        compact={compact}
      />
      <MetricPill
        label="TX"
        value={txPackets ?? "-"}
        unit="pkt"
        icon="tx"
        tone="good"
        compact={compact}
      />
      {latencyMs !== undefined ? (
        <MetricPill
          label="延迟"
          value={latencyMs}
          unit="ms"
          icon="latency"
          tone={latencyMs > 80 ? "warning" : "neutral"}
          compact={compact}
        />
      ) : null}
      {lossPercent !== undefined ? (
        <MetricPill
          label="丢包"
          value={lossPercent}
          unit="%"
          tone={lossPercent > 0 ? "danger" : "neutral"}
          compact={compact}
        />
      ) : null}
    </div>
  );
}
