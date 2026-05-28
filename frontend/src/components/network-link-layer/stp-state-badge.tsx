import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StpPortState = "blocking" | "listening" | "learning" | "forwarding" | "disabled";
export type StpPortRole = "root" | "designated" | "alternate" | "backup" | "edge";

export type StpStateBadgeProps = {
  state: StpPortState;
  role?: StpPortRole;
  className?: string;
};

const stateClassNames: Record<StpPortState, string> = {
  blocking: "border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-200",
  listening: "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  learning: "border-blue-400/40 bg-blue-400/10 text-blue-700 dark:text-blue-200",
  forwarding: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  disabled: "text-muted-foreground",
};

export function StpStateBadge({ state, role, className }: StpStateBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-mono", stateClassNames[state], className)}>
      STP {stateText(state)}
      {role ? <span className="font-sans text-[10px] opacity-70">{roleText(role)}</span> : null}
    </Badge>
  );
}

function stateText(state: StpPortState) {
  if (state === "blocking") return "阻塞";
  if (state === "listening") return "监听";
  if (state === "learning") return "学习";
  if (state === "forwarding") return "转发";
  return "禁用";
}

function roleText(role: StpPortRole) {
  if (role === "root") return "根端口";
  if (role === "designated") return "指定端口";
  if (role === "alternate") return "替代端口";
  if (role === "backup") return "备份端口";
  return "边缘端口";
}
