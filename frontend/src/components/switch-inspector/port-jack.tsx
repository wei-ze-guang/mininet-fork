import { cn } from "@/lib/utils";

import type { SwitchPortKind, SwitchPortStatus } from "./types";

export type PortJackProps = {
  kind: SwitchPortKind;
  connected: boolean;
  status: SwitchPortStatus;
  compact?: boolean;
};

export function PortJack({ kind, connected, status, compact }: PortJackProps) {
  if (kind === "sfp") {
    return (
      <span
        className={cn(
          "block rounded-[3px] border bg-zinc-800 shadow-inner",
          compact ? "h-4 w-7" : "h-5 w-9",
          connected ? "border-zinc-400" : "border-zinc-700",
          status === "error" && "border-red-500",
        )}
      >
        <span className="mx-auto mt-1 block h-1 w-4 rounded-sm bg-zinc-950" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative block rounded-[4px] border bg-zinc-800 shadow-inner",
        compact ? "h-5 w-6" : "h-6 w-7",
        connected ? "border-zinc-400" : "border-zinc-700",
        status === "error" && "border-red-500",
      )}
    >
      <span className="absolute left-1 top-1 h-1.5 w-1 rounded-sm bg-zinc-950" />
      <span className="absolute right-1 top-1 h-1.5 w-1 rounded-sm bg-zinc-950" />
      <span className="absolute bottom-1 left-1/2 h-1 w-3 -translate-x-1/2 rounded-sm bg-zinc-950" />
    </span>
  );
}
