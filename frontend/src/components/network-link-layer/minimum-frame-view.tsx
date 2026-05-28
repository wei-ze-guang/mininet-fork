import { Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MinimumFrameViewProps = {
  frameBytes: number;
  minimumBytes?: number;
  slotTimeBits?: number;
  collisionDetected?: boolean;
  className?: string;
};

export function MinimumFrameView({
  frameBytes,
  minimumBytes = 64,
  slotTimeBits = 512,
  collisionDetected,
  className,
}: MinimumFrameViewProps) {
  const ratio = Math.min(100, Math.round((frameBytes / minimumBytes) * 100));
  const valid = frameBytes >= minimumBytes;

  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Ruler aria-hidden className="size-4" />
          以太网最短帧长
        </div>
        <Badge variant={valid ? "secondary" : "destructive"}>{valid ? "满足最短帧" : "过短帧"}</Badge>
      </div>
      <div className="rounded-md border bg-muted/30 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{frameBytes} bytes</span>
          <span>最短 {minimumBytes} bytes / 争用期 {slotTimeBits} bit time</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", valid ? "bg-emerald-500" : "bg-red-500")}
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        半双工共享以太网中，最短帧长保证发送端在发送期间仍能检测到最远端传播回来的碰撞。
        {collisionDetected !== undefined ? ` 当前碰撞检测：${collisionDetected ? "检测到碰撞" : "未检测到碰撞"}。` : ""}
      </p>
    </section>
  );
}
