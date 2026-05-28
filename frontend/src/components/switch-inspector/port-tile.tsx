import { StatusLed } from "@/components/network-primitives/status-led";
import { cn } from "@/lib/utils";

import { PortJack } from "./port-jack";
import type { SwitchPort } from "./types";

export type PortTileProps = {
  port: SwitchPort;
  selected?: boolean;
  active?: boolean;
  compact?: boolean;
  onSelect?: (port: SwitchPort) => void;
};

export function PortTile({
  port,
  selected,
  active,
  compact = true,
  onSelect,
}: PortTileProps) {
  const status = active ? "activity" : port.status;

  return (
    <button
      type="button"
      className={cn(
        "group relative flex flex-col items-center rounded-[4px] border border-zinc-700 bg-zinc-950 text-zinc-300 transition-colors hover:border-zinc-400",
        compact ? "h-12 gap-0.5 px-1 py-1" : "h-16 gap-1 px-1.5 py-1.5",
        selected && "border-cyan-300 ring-2 ring-cyan-300/40",
      )}
      onClick={() => onSelect?.(port)}
    >
      <div className="flex w-full items-center justify-between gap-1">
        <StatusLed
          status={status}
          size="xs"
          label={`${port.name} ${statusLabel(status)}`}
        />
        <span className="font-mono text-[10px] leading-none text-zinc-400">{port.index}</span>
      </div>
      <PortJack
        kind={port.kind}
        connected={port.connected}
        status={port.status}
        compact={compact}
      />
      {!compact ? (
        <div className="w-full truncate text-center text-[10px] leading-none text-zinc-500">
          {port.name}
        </div>
      ) : null}
      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-36 -translate-x-1/2 rounded-md border bg-popover p-2 text-left text-xs text-popover-foreground shadow-md group-hover:block">
        <div className="font-medium">{port.name}</div>
        <div className="mt-1 text-muted-foreground">{port.peerName ?? "未连接"}</div>
        <div className="mt-2 grid grid-cols-2 gap-1 font-mono text-[10px] text-muted-foreground">
          <span>RX {port.rxPackets ?? "-"}</span>
          <span>TX {port.txPackets ?? "-"}</span>
        </div>
      </div>
    </button>
  );
}

function statusLabel(status: SwitchPort["status"]) {
  if (status === "down") {
    return "断开";
  }
  if (status === "link") {
    return "已连接";
  }
  if (status === "activity") {
    return "活动";
  }
  return "异常";
}
