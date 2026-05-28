import { Activity, ArrowDownToLine, ArrowUpFromLine, Clock3, Gauge } from "lucide-react";

import { cn } from "@/lib/utils";

export type MetricPillTone = "neutral" | "good" | "warning" | "danger" | "info";

export type MetricPillIcon = "rx" | "tx" | "latency" | "rate" | "activity";

export type MetricPillProps = {
  label: string;
  value: string | number;
  unit?: string;
  tone?: MetricPillTone;
  icon?: MetricPillIcon;
  compact?: boolean;
  className?: string;
};

const toneClassNames: Record<MetricPillTone, string> = {
  neutral: "border-zinc-700 bg-zinc-900 text-zinc-200",
  good: "border-emerald-500/35 bg-emerald-500/10 text-emerald-200",
  warning: "border-amber-400/35 bg-amber-400/10 text-amber-200",
  danger: "border-red-500/35 bg-red-500/10 text-red-200",
  info: "border-cyan-400/35 bg-cyan-400/10 text-cyan-200",
};

export function MetricPill({
  label,
  value,
  unit,
  tone = "neutral",
  icon,
  compact,
  className,
}: MetricPillProps) {
  const Icon = icon ? metricIcons[icon] : undefined;

  return (
    <div
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs leading-none",
        toneClassNames[tone],
        compact && "gap-1 px-1.5 py-0.5 text-[10px]",
        className,
      )}
    >
      {Icon ? <Icon aria-hidden className={cn("size-3", compact && "size-2.5")} /> : null}
      <span className="font-sans text-[10px] text-current/70">{label}</span>
      <span className="truncate font-semibold">{value}</span>
      {unit ? <span className="text-[10px] text-current/60">{unit}</span> : null}
    </div>
  );
}

const metricIcons = {
  rx: ArrowDownToLine,
  tx: ArrowUpFromLine,
  latency: Clock3,
  rate: Gauge,
  activity: Activity,
};
