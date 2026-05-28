import { Boxes } from "lucide-react";

import { cn } from "@/lib/utils";

import { ErrorCheckBadge, type ErrorCheckStatus } from "./error-check-badge";

export type EthernetFrameField = {
  name: string;
  value: string;
  bits?: number;
  role: "line-coding" | "sfd" | "destination" | "source" | "vlan-tag" | "type" | "payload" | "fcs";
  outsideMacFrame?: boolean;
};

export type FrameBoundaryProps = {
  fields: EthernetFrameField[];
  fcsStatus?: ErrorCheckStatus;
  className?: string;
};

const roleClassNames: Record<EthernetFrameField["role"], string> = {
  "line-coding": "border-zinc-400/35 bg-zinc-400/10",
  sfd: "border-zinc-400/35 bg-zinc-400/10",
  destination: "border-cyan-400/35 bg-cyan-400/10",
  source: "border-sky-400/35 bg-sky-400/10",
  "vlan-tag": "border-indigo-400/35 bg-indigo-400/10",
  type: "border-violet-400/35 bg-violet-400/10",
  payload: "border-emerald-400/35 bg-emerald-400/10",
  fcs: "border-amber-400/35 bg-amber-400/10",
};

export function FrameBoundary({ fields, fcsStatus = "passed", className }: FrameBoundaryProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Boxes aria-hidden className="size-4" />
          以太网线上定界 / MAC 帧
        </div>
        <ErrorCheckBadge algorithm="FCS" status={fcsStatus} />
      </div>
      <div className="flex min-w-0 overflow-x-auto pb-1">
        {fields.map((field) => (
          <div
            key={`${field.role}-${field.name}`}
            className={cn(
              "min-w-28 border-y border-l px-3 py-2 first:rounded-l-md last:rounded-r-md last:border-r",
              roleClassNames[field.role],
            )}
          >
            <div className="text-xs font-semibold">{field.name}</div>
            <div className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{field.value}</div>
            {field.bits ? <div className="mt-1 text-[10px] text-muted-foreground">{field.bits} bit</div> : null}
            {field.outsideMacFrame ? (
              <div className="mt-1 text-[10px] text-muted-foreground">不计入 MAC 帧</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export const demoEthernetFrameFields: EthernetFrameField[] = [
  { name: "Preamble", value: "1010...", bits: 56, role: "line-coding", outsideMacFrame: true },
  { name: "SFD", value: "10101011", bits: 8, role: "sfd", outsideMacFrame: true },
  { name: "Dst MAC", value: "02:42:0a:00:02:15", bits: 48, role: "destination" },
  { name: "Src MAC", value: "02:42:0a:00:01:0b", bits: 48, role: "source" },
  { name: "Type", value: "0x0800 IPv4", bits: 16, role: "type" },
  { name: "Payload", value: "IP packet", role: "payload" },
  { name: "FCS", value: "0x91ac33f2", bits: 32, role: "fcs" },
];
