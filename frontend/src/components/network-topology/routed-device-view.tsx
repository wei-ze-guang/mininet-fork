import { Globe2, Router, Shield } from "lucide-react";

import { StatusLed } from "@/components/network-primitives/status-led";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { DeviceMetricStrip } from "./device-metric-strip";
import { DeviceRoleBadge } from "./device-role-badge";
import { GatewayBadge } from "./gateway-badge";
import { NetworkInterfaceBadge } from "./network-interface-badge";
import type { RoutedDevice } from "./types";

export type RoutedDeviceViewProps = {
  device: RoutedDevice;
  selected?: boolean;
  compact?: boolean;
  className?: string;
};

export function RoutedDeviceView({
  device,
  selected,
  compact,
  className,
}: RoutedDeviceViewProps) {
  const role = device.role ?? "router";
  const Icon = role === "gateway" || role === "nat" ? Globe2 : role === "firewall" ? Shield : Router;
  const routeAddress = device.gatewayInterfaceIp ?? device.upstreamNextHopIp;
  const routeLabel = device.gatewayInterfaceIp ? "网关接口" : "上游下一跳";

  return (
    <div
      className={cn(
        "w-64 rounded-lg border bg-card p-3 text-card-foreground shadow-sm",
        selected && "border-cyan-400 ring-2 ring-cyan-400/30",
        compact && "w-48 p-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-md border bg-zinc-900 text-zinc-100">
            <Icon aria-hidden className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{device.name}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              <DeviceRoleBadge role={role} />
            </div>
          </div>
        </div>
        <StatusLed status={device.status} label={`${device.name} ${device.status}`} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {routeAddress ? (
          <GatewayBadge address={routeAddress} label={routeLabel} active={role === "gateway"} />
        ) : null}
        <Badge variant="outline">{device.interfaces.length} 接口</Badge>
      </div>

      {!compact ? (
        <>
          <div className="mt-3 grid gap-1">
            {device.interfaces.map((iface) => (
              <NetworkInterfaceBadge key={iface.id} iface={iface} />
            ))}
          </div>
          <DeviceMetricStrip
            className="mt-3"
            rxPackets={device.rxPackets}
            txPackets={device.txPackets}
            latencyMs={2}
            compact
          />
        </>
      ) : null}
    </div>
  );
}
