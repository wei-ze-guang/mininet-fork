import { Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PrefixRouteCandidate = {
  id: string;
  prefix: string;
  prefixLength: number;
  nextHop?: string;
  iface: string;
  metric?: number;
  matched: boolean;
  selected?: boolean;
};

export type PrefixMatchViewProps = {
  destinationIp: string;
  routes: PrefixRouteCandidate[];
  className?: string;
};

export function PrefixMatchView({
  destinationIp,
  routes,
  className,
}: PrefixMatchViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Route aria-hidden className="size-4" />
          最长前缀匹配
        </div>
        <Badge variant="outline" className="font-mono">{destinationIp}</Badge>
      </div>
      <div className="grid gap-2">
        {routes.map((route) => (
          <div
            key={route.id}
            className={cn(
              "rounded-md border px-3 py-2",
              route.selected && "border-cyan-400/45 bg-cyan-400/10",
              route.matched && !route.selected && "bg-muted/40",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold">{route.prefix}</span>
              <div className="flex gap-1">
                {route.matched ? <Badge variant="secondary">匹配 /{route.prefixLength}</Badge> : null}
                {route.selected ? <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-200">选中</Badge> : null}
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              下一跳 {route.nextHop ?? "直连"} · 出口 {route.iface}
              {route.metric !== undefined ? ` · metric ${route.metric}` : ""}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
