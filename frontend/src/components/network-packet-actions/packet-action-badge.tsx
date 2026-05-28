import {
  Clock,
  PackageOpen,
  PackagePlus,
  PackageX,
  Repeat,
  Route,
  ScanSearch,
  Send,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PacketActionKind =
  | "capture"
  | "inspect"
  | "encapsulate"
  | "decapsulate"
  | "forward"
  | "drop"
  | "delay"
  | "reorder"
  | "duplicate"
  | "nat"
  | "rewrite";

export type PacketActionBadgeProps = {
  action: PacketActionKind;
  className?: string;
};

const actionClassNames: Record<PacketActionKind, string> = {
  capture: "border-cyan-400/35 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200",
  inspect: "border-blue-400/35 bg-blue-400/10 text-blue-700 dark:text-blue-200",
  encapsulate: "border-emerald-400/35 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  decapsulate: "border-violet-400/35 bg-violet-400/10 text-violet-700 dark:text-violet-200",
  forward: "border-teal-400/35 bg-teal-400/10 text-teal-700 dark:text-teal-200",
  drop: "border-red-400/35 bg-red-400/10 text-red-700 dark:text-red-200",
  delay: "border-amber-400/35 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  reorder: "border-orange-400/35 bg-orange-400/10 text-orange-700 dark:text-orange-200",
  duplicate: "border-fuchsia-400/35 bg-fuchsia-400/10 text-fuchsia-700 dark:text-fuchsia-200",
  nat: "border-sky-400/35 bg-sky-400/10 text-sky-700 dark:text-sky-200",
  rewrite: "border-indigo-400/35 bg-indigo-400/10 text-indigo-700 dark:text-indigo-200",
};

const actionIcons = {
  capture: ScanSearch,
  inspect: ScanSearch,
  encapsulate: PackagePlus,
  decapsulate: PackageOpen,
  forward: Send,
  drop: Trash2,
  delay: Clock,
  reorder: Route,
  duplicate: Repeat,
  nat: Route,
  rewrite: PackageX,
};

export function PacketActionBadge({ action, className }: PacketActionBadgeProps) {
  const Icon = actionIcons[action];

  return (
    <Badge variant="outline" className={cn("gap-1", actionClassNames[action], className)}>
      <Icon aria-hidden className="size-3" />
      {actionText(action)}
    </Badge>
  );
}

function actionText(action: PacketActionKind) {
  if (action === "capture") return "抓到";
  if (action === "inspect") return "检查";
  if (action === "encapsulate") return "封装";
  if (action === "decapsulate") return "解封装";
  if (action === "forward") return "转发";
  if (action === "drop") return "丢弃";
  if (action === "delay") return "延迟";
  if (action === "reorder") return "乱序";
  if (action === "duplicate") return "重复";
  if (action === "nat") return "NAT";
  return "改写";
}
