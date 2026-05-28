import { Cable, Cpu, EthernetPort, Radio, Wifi } from "lucide-react";

import { MetricPill } from "@/components/network-primitives/metric-pill";
import { StatusLed } from "@/components/network-primitives/status-led";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PhysicalMediumBadge } from "./physical-medium-badge";
import type { PhysicalPort } from "./physical-types";

export type PhysicalPortViewProps = {
  port: PhysicalPort;
  selected?: boolean;
  className?: string;
};

export function PhysicalPortView({ port, selected, className }: PhysicalPortViewProps) {
  return (
    <div
      className={cn(
        "w-56 rounded-lg border bg-card p-3 text-card-foreground shadow-sm",
        selected && "border-cyan-400 ring-2 ring-cyan-400/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md border bg-muted">
            <PortIcon port={port} />
          </div>
          <div>
            <div className="font-mono text-sm font-semibold">{port.name}</div>
            <div className="text-xs text-muted-foreground">{port.deviceId}</div>
          </div>
        </div>
        <StatusLed status={port.status} label={`${port.name} ${port.status}`} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <PhysicalMediumBadge kind={port.medium} />
        <Badge variant="outline" className="font-mono">{port.connector.toUpperCase()}</Badge>
        <Badge variant="outline">{duplexText(port.duplex)}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {port.speedMbps !== undefined ? (
          <MetricPill label="速率" value={port.speedMbps} unit="Mbps" icon="rate" tone="neutral" compact />
        ) : null}
      </div>
    </div>
  );
}

function duplexText(duplex: PhysicalPort["duplex"]) {
  if (duplex === "simplex") return "单工";
  if (duplex === "half-duplex") return "半双工";
  return "全双工";
}

function PortIcon({ port }: { port: PhysicalPort }) {
  if (port.medium === "wireless" || port.connector === "wifi") {
    return <Wifi aria-hidden className="size-5" />;
  }

  if (port.medium === "fiber" || port.connector === "sfp" || port.connector === "sfp+") {
    return <Cable aria-hidden className="size-5" />;
  }

  if (port.medium === "loopback") {
    return <Radio aria-hidden className="size-5" />;
  }

  if (port.medium === "virtual" || port.connector === "tap") {
    return <Cpu aria-hidden className="size-5" />;
  }

  return <EthernetPort aria-hidden className="size-5" />;
}
