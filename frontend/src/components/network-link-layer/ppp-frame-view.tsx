import { Cable } from "lucide-react";

import { ErrorCheckBadge, type ErrorCheckStatus } from "@/components/network-link-layer/error-check-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PppFrameViewProps = {
  protocol: "IP" | "LCP" | "NCP" | "unknown";
  payloadBytes: number;
  fcsStatus?: ErrorCheckStatus;
  className?: string;
};

export function PppFrameView({
  protocol,
  payloadBytes,
  fcsStatus = "passed",
  className,
}: PppFrameViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Cable aria-hidden className="size-4" />
          PPP 帧
        </div>
        <ErrorCheckBadge algorithm="FCS" status={fcsStatus} />
      </div>
      <div className="flex min-w-0 overflow-x-auto pb-1">
        <Field name="Flag" value="0x7E" bits={8} muted />
        <Field name="Address" value="0xFF" bits={8} />
        <Field name="Control" value="0x03" bits={8} />
        <Field name="Protocol" value={protocol} bits={16} active />
        <Field name="Information" value={`${payloadBytes} bytes`} />
        <Field name="FCS" value="16/32 bit" />
        <Field name="Flag" value="0x7E" bits={8} muted />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
        <Badge variant="outline">点对点链路</Badge>
        <Badge variant="outline">无 MAC 地址</Badge>
        <Badge variant="outline">支持透明传输</Badge>
      </div>
    </section>
  );
}

function Field({
  name,
  value,
  bits,
  active,
  muted,
}: {
  name: string;
  value: string;
  bits?: number;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-28 border-y border-l px-3 py-2 first:rounded-l-md last:rounded-r-md last:border-r",
        active && "border-cyan-400/35 bg-cyan-400/10",
        muted && "border-zinc-400/35 bg-zinc-400/10",
        !active && !muted && "border-slate-400/30 bg-slate-400/5",
      )}
    >
      <div className="text-xs font-semibold">{name}</div>
      <div className="mt-1 font-mono text-[11px] text-muted-foreground">{value}</div>
      {bits ? <div className="mt-1 text-[10px] text-muted-foreground">{bits} bit</div> : null}
    </div>
  );
}
