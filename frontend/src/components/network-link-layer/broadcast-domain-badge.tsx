import { RadioTower } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BroadcastDomainBadgeProps = {
  vlanId?: number;
  domainId: string;
  portCount?: number;
  className?: string;
};

export function BroadcastDomainBadge({
  vlanId,
  domainId,
  portCount,
  className,
}: BroadcastDomainBadgeProps) {
  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <RadioTower aria-hidden className="size-3" />
      广播域 {domainId}
      {vlanId !== undefined ? <span className="font-mono">VLAN {vlanId}</span> : null}
      {portCount !== undefined ? <span>{portCount} 端口</span> : null}
    </Badge>
  );
}
