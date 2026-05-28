import { Laptop, Monitor, Server, Smartphone } from "lucide-react";

import { DeviceMetricStrip } from "./device-metric-strip";
import { NetworkInterfaceBadge } from "./network-interface-badge";
import type { EndpointDevice } from "./types";
import { StatusLed } from "@/components/network-primitives/status-led";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EndpointDeviceViewProps = {
  device: EndpointDevice;
  selected?: boolean;
  compact?: boolean;
  className?: string;
};

export function EndpointDeviceView({
  device,
  selected,
  compact,
  className,
}: EndpointDeviceViewProps) {
  const Icon = deviceIcons[device.kind];

  return (
    <div
      className={cn(
        "w-56 rounded-lg border bg-card p-3 text-card-foreground shadow-sm",
        selected && "border-cyan-400 ring-2 ring-cyan-400/30",
        compact && "w-44 p-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-md border bg-muted",
              device.kind === "phone" && "h-10 w-7 rounded-lg",
              device.kind === "server" && "bg-zinc-900 text-zinc-100",
            )}
          >
            <Icon aria-hidden className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{device.name}</div>
            <div className="text-xs text-muted-foreground">{kindText(device.kind)}</div>
          </div>
        </div>
        <StatusLed status={device.status} label={`${device.name} ${device.status}`} />
      </div>

      {!compact ? (
        <>
          <div className="mt-3 space-y-1 text-xs">
            {device.ip ? <InfoLine label="IP" value={device.ip} /> : null}
            {device.mac ? <InfoLine label="MAC" value={device.mac} /> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {device.interfaces.map((iface) => (
              <NetworkInterfaceBadge key={iface.id} iface={iface} compact />
            ))}
          </div>
          <DeviceMetricStrip
            className="mt-3"
            rxPackets={device.rxPackets}
            txPackets={device.txPackets}
            compact
          />
        </>
      ) : (
        <div className="mt-2 flex items-center justify-between gap-2">
          <Badge variant="outline">{device.interfaces.length} 网卡</Badge>
          <span className="truncate font-mono text-[10px] text-muted-foreground">{device.ip}</span>
        </div>
      )}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono">{value}</span>
    </div>
  );
}

function kindText(kind: EndpointDevice["kind"]) {
  if (kind === "pc") {
    return "PC 终端";
  }

  if (kind === "phone") {
    return "移动终端";
  }

  return "服务器";
}

const deviceIcons = {
  pc: Monitor,
  phone: Smartphone,
  server: Server,
} satisfies Record<EndpointDevice["kind"], typeof Laptop>;
