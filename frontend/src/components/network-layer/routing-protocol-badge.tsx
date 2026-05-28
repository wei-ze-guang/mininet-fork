import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RoutingProtocol = "RIP" | "OSPF" | "BGP" | "STATIC" | "CONNECTED";
export type RoutingProtocolState = "up" | "down" | "converging";

export type RoutingProtocolBadgeProps = {
  protocol: RoutingProtocol;
  state?: RoutingProtocolState;
  className?: string;
};

const protocolClassNames: Record<RoutingProtocol, string> = {
  RIP: "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  OSPF: "border-cyan-400/40 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200",
  BGP: "border-violet-400/40 bg-violet-400/10 text-violet-700 dark:text-violet-200",
  STATIC: "border-zinc-400/40 bg-zinc-400/10 text-zinc-700 dark:text-zinc-200",
  CONNECTED: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
};

export function RoutingProtocolBadge({
  protocol,
  state = "up",
  className,
}: RoutingProtocolBadgeProps) {
  return (
    <Badge variant="outline" className={cn("gap-1 font-mono", protocolClassNames[protocol], className)}>
      {protocol}
      <span className="font-sans text-[10px] opacity-70">{stateText(state)}</span>
    </Badge>
  );
}

function stateText(state: RoutingProtocolState) {
  if (state === "up") return "运行";
  if (state === "converging") return "收敛中";
  return "断开";
}
