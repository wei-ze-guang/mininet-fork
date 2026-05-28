import { StatusLed } from "@/components/network-primitives/status-led";
import { cn } from "@/lib/utils";

import type { NetworkInterfaceInfo } from "./types";

export type NetworkInterfaceBadgeProps = {
  iface: NetworkInterfaceInfo;
  compact?: boolean;
  className?: string;
};

export function NetworkInterfaceBadge({
  iface,
  compact,
  className,
}: NetworkInterfaceBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex min-w-0 items-center gap-2 rounded-md border bg-background px-2 py-1 text-xs",
        compact && "gap-1 px-1.5 py-0.5 text-[10px]",
        className,
      )}
    >
      <StatusLed status={iface.status} size="xs" label={`${iface.name} ${iface.status}`} />
      <span className="font-mono font-medium">{iface.name}</span>
      {iface.ip ? <span className="truncate font-mono text-muted-foreground">{iface.ip}</span> : null}
    </div>
  );
}
