import { GitCompareArrows } from "lucide-react";

import { cn } from "@/lib/utils";

export type AddressPairProps = {
  from: string;
  to: string;
  label?: string;
  kind?: "mac" | "ip" | "port" | "endpoint";
  className?: string;
};

export function AddressPair({
  from,
  to,
  label,
  kind = "endpoint",
  className,
}: AddressPairProps) {
  return (
    <div className={cn("min-w-0 rounded-md border bg-muted/30 px-2 py-1.5", className)}>
      {label ? <div className="mb-1 text-[10px] text-muted-foreground">{label}</div> : null}
      <div className="flex min-w-0 items-center gap-2 font-mono text-xs">
        <span className={cn("truncate", kind === "mac" && "tracking-wide")}>{from}</span>
        <GitCompareArrows aria-hidden className="size-3 shrink-0 text-muted-foreground" />
        <span className={cn("truncate", kind === "mac" && "tracking-wide")}>{to}</span>
      </div>
    </div>
  );
}
