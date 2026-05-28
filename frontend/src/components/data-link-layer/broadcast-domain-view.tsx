import { RadioTower } from "lucide-react";

import { BroadcastDomainBadge } from "@/components/network-link-layer/broadcast-domain-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { BroadcastDomain } from "./data-link-types";

export type BroadcastDomainViewProps = {
  domain: BroadcastDomain;
  className?: string;
};

export function BroadcastDomainView({ domain, className }: BroadcastDomainViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <RadioTower aria-hidden className="size-4" />
          广播域成员
        </div>
        <BroadcastDomainBadge domainId={domain.id} vlanId={domain.vlanId} portCount={domain.interfaceIds.length} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {domain.interfaceIds.map((iface) => (
          <Badge key={iface} variant="outline" className="font-mono">
            {iface}
          </Badge>
        ))}
      </div>
    </section>
  );
}
