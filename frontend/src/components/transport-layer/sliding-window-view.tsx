import { Repeat } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TcpWindowSegmentState = "sent" | "acked" | "pending" | "retransmit";

export type TcpWindowSegment = {
  seqStart: number;
  seqEnd: number;
  state: TcpWindowSegmentState;
};

export type SlidingWindowViewProps = {
  baseSeq: number;
  windowSize: number;
  segments: TcpWindowSegment[];
  className?: string;
};

const stateClassNames: Record<TcpWindowSegmentState, string> = {
  acked: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  sent: "border-cyan-400/40 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200",
  pending: "border-zinc-400/40 bg-zinc-400/10 text-zinc-700 dark:text-zinc-200",
  retransmit: "border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-200",
};

export function SlidingWindowView({
  baseSeq,
  windowSize,
  segments,
  className,
}: SlidingWindowViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Repeat aria-hidden className="size-4" />
          TCP 滑动窗口
        </div>
        <Badge variant="outline">base={baseSeq} win={windowSize}</Badge>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
        {segments.map((segment) => (
          <div key={`${segment.seqStart}-${segment.seqEnd}`} className={cn("rounded-md border px-2 py-2 text-center", stateClassNames[segment.state])}>
            <div className="font-mono text-[11px] font-semibold">
              {segment.seqStart}-{segment.seqEnd}
            </div>
            <div className="text-[10px]">{stateText(segment.state)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function stateText(state: TcpWindowSegmentState) {
  if (state === "acked") return "ACK";
  if (state === "sent") return "已发";
  if (state === "retransmit") return "重传";
  return "待发";
}
