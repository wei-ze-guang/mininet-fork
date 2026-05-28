import { Cable, Cpu, Radio, Wifi } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { PhysicalMediumKind } from "./physical-types";

export type PhysicalMediumBadgeProps = {
  kind: PhysicalMediumKind;
  label?: string;
  className?: string;
};

const mediumClassNames: Record<PhysicalMediumKind, string> = {
  copper: "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  fiber: "border-cyan-400/40 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200",
  wireless: "border-violet-400/40 bg-violet-400/10 text-violet-700 dark:text-violet-200",
  loopback: "border-zinc-400/40 bg-zinc-400/10 text-zinc-700 dark:text-zinc-200",
  virtual: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
};

const mediumIcons = {
  copper: Cable,
  fiber: Cable,
  wireless: Wifi,
  loopback: Radio,
  virtual: Cpu,
};

export function PhysicalMediumBadge({ kind, label, className }: PhysicalMediumBadgeProps) {
  const Icon = mediumIcons[kind];

  return (
    <Badge variant="outline" className={cn("gap-1", mediumClassNames[kind], className)}>
      <Icon aria-hidden className="size-3" />
      {label ?? mediumText(kind)}
    </Badge>
  );
}

function mediumText(kind: PhysicalMediumKind) {
  if (kind === "copper") return "铜缆";
  if (kind === "fiber") return "光纤";
  if (kind === "wireless") return "无线";
  if (kind === "loopback") return "Loopback";
  return "虚拟介质";
}
