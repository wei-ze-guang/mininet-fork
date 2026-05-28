import { Cable, RadioTower } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CollisionNode = {
  id: string;
  name: string;
  transmitting?: boolean;
  backoffSlots?: number;
};

export type CollisionDomainViewProps = {
  nodes: CollisionNode[];
  collided?: boolean;
  className?: string;
};

export function CollisionDomainView({
  nodes,
  collided,
  className,
}: CollisionDomainViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <RadioTower aria-hidden className="size-4" />
          冲突域 / 半双工共享介质教学模型
        </div>
        <Badge variant={collided ? "destructive" : "secondary"}>
          {collided ? "发生碰撞" : "信道空闲"}
        </Badge>
      </div>
      <div className="grid gap-3">
        <div className="relative h-2 rounded-full bg-zinc-300 dark:bg-zinc-700">
          {collided ? (
            <div className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.65)]" />
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {nodes.map((node) => (
            <div key={node.id} className="rounded-md border bg-muted/30 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold">{node.name}</span>
                <Cable aria-hidden className={cn("size-4", node.transmitting && "text-cyan-500")} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {node.transmitting ? "正在发送" : "等待信道"}
                {node.backoffSlots !== undefined ? ` · 退避 ${node.backoffSlots} slot` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
