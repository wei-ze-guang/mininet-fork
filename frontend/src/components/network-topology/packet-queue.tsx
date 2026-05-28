import { Boxes } from "lucide-react";

import { MetricPill } from "@/components/network-primitives/metric-pill";
import { cn } from "@/lib/utils";

export type PacketQueueItemState = "waiting" | "processing" | "dropped";

export type PacketQueueItem = {
  id: string;
  bits: string;
  protocol?: string;
  state?: PacketQueueItemState;
};

export type PacketQueueProps = {
  name: string;
  items: PacketQueueItem[];
  capacity?: number;
  direction?: "horizontal" | "vertical";
  className?: string;
};

const itemClassNames: Record<PacketQueueItemState, string> = {
  waiting: "border-cyan-400/35 bg-cyan-400/10 text-cyan-200",
  processing: "border-emerald-400/45 bg-emerald-400/15 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.2)]",
  dropped: "border-red-400/45 bg-red-400/10 text-red-200 line-through opacity-70",
};

export function PacketQueue({
  name,
  items,
  capacity = Math.max(items.length, 1),
  direction = "horizontal",
  className,
}: PacketQueueProps) {
  const visibleSlots = Array.from({ length: capacity }, (_, index) => items[index]);
  const usagePercent = Math.min(100, Math.round((items.length / capacity) * 100));

  return (
    <section className={cn("rounded-lg border bg-zinc-950 p-3 text-zinc-100", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Boxes aria-hidden className="size-4" />
          {name}
        </div>
        <MetricPill
          label="占用"
          value={`${items.length}/${capacity}`}
          unit={`${usagePercent}%`}
          tone={usagePercent >= 80 ? "warning" : "neutral"}
          compact
        />
      </div>

      <div
        className={cn(
          "grid gap-1.5",
          direction === "horizontal" ? "grid-flow-col auto-cols-fr" : "grid-cols-1",
        )}
      >
        {visibleSlots.map((item, index) => (
          <QueueSlot key={item?.id ?? `empty-${index}`} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function QueueSlot({ item, index }: { item?: PacketQueueItem; index: number }) {
  if (!item) {
    return (
      <div className="flex h-12 min-w-16 items-center justify-center rounded-md border border-dashed border-zinc-700 bg-zinc-900/60 text-[10px] text-zinc-600">
        {index + 1}
      </div>
    );
  }

  const state = item.state ?? "waiting";

  return (
    <div
      className={cn(
        "flex h-12 min-w-16 flex-col items-center justify-center rounded-md border px-2 text-center",
        itemClassNames[state],
      )}
    >
      <span className="font-mono text-xs font-bold tracking-[0.18em]">{item.bits}</span>
      <span className="mt-0.5 text-[10px] text-current/65">{item.protocol ?? "frame"}</span>
    </div>
  );
}
