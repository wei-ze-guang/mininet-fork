import { Network } from "lucide-react";

import { PhysicalPortView } from "@/components/physical-layer/physical-port-view";
import { StpStateBadge } from "@/components/network-link-layer/stp-state-badge";
import { StatusLed } from "@/components/network-primitives/status-led";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { DataLinkInterface } from "./data-link-types";

export type DataLinkInterfaceViewProps = {
  iface: DataLinkInterface;
  selected?: boolean;
  className?: string;
};

export function DataLinkInterfaceView({
  iface,
  selected,
  className,
}: DataLinkInterfaceViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Network aria-hidden className="size-4" />
          数据链路接口
        </div>
        <StatusLed status={iface.physicalPort.status} label={iface.name} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
        <PhysicalPortView port={iface.physicalPort} selected={selected} />
        <div className="grid content-start gap-2">
          <Info label="MAC" value={iface.macAddress} />
          <Info label="MTU" value={`${iface.mtu} bytes`} />
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{modeText(iface.vlanMode)}</Badge>
            {iface.accessVlan !== undefined ? <Badge variant="secondary">Access VLAN {iface.accessVlan}</Badge> : null}
            {iface.nativeVlan !== undefined ? <Badge variant="secondary">Native VLAN {iface.nativeVlan}</Badge> : null}
            {iface.taggedVlans?.map((vlan) => (
              <Badge key={vlan} variant="outline">Tagged {vlan}</Badge>
            ))}
            {iface.stpState ? <StpStateBadge state={iface.stpState} role={iface.stpRole} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-xs">{value}</span>
    </div>
  );
}

function modeText(mode: DataLinkInterface["vlanMode"]) {
  if (mode === "access") return "Access";
  if (mode === "trunk") return "Trunk";
  return "Routed";
}
