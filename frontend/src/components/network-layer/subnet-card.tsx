import { Network } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SubnetInfo = {
  cidr: string;
  netmask: string;
  networkAddress: string;
  broadcastAddress?: string;
  firstUsable?: string;
  lastUsable?: string;
  defaultGateway?: string;
  hostCount?: number;
};

export type SubnetCardProps = {
  subnet: SubnetInfo;
  className?: string;
};

export function SubnetCard({ subnet, className }: SubnetCardProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Network aria-hidden className="size-4" />
          子网
        </div>
        <Badge variant="secondary" className="font-mono">{subnet.cidr}</Badge>
      </div>
      <div className="grid gap-2 text-sm">
        <Info label="子网掩码" value={subnet.netmask} />
        <Info label="网络地址" value={subnet.networkAddress} />
        {subnet.broadcastAddress ? <Info label="广播地址" value={subnet.broadcastAddress} /> : null}
        {subnet.defaultGateway ? <Info label="默认网关" value={subnet.defaultGateway} /> : null}
        {subnet.firstUsable && subnet.lastUsable ? (
          <Info label="可用范围" value={`${subnet.firstUsable} - ${subnet.lastUsable}`} />
        ) : null}
        {subnet.hostCount !== undefined ? <Info label="可用主机数" value={String(subnet.hostCount)} /> : null}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-xs">{value}</span>
    </div>
  );
}
