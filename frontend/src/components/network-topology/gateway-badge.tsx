import { Globe2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type GatewayBadgeProps = {
  address?: string;
  label?: string;
  active?: boolean;
  className?: string;
};

export function GatewayBadge({
  address,
  label = "默认网关",
  active,
  className,
}: GatewayBadgeProps) {
  return (
    <Badge
      variant={active ? "secondary" : "outline"}
      className={cn("max-w-full gap-1 font-mono", active && "border-cyan-400/40 bg-cyan-400/10", className)}
    >
      <Globe2 aria-hidden className="size-3" />
      <span className="font-sans">{label}</span>
      <span className="truncate">{address ?? "未设置"}</span>
    </Badge>
  );
}
