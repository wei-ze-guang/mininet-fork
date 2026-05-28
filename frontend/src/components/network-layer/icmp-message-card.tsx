import { MessageCircleWarning } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type IcmpMessageType =
  | "echo-request"
  | "echo-reply"
  | "destination-unreachable"
  | "time-exceeded"
  | "redirect";

export type IcmpMessageCardProps = {
  type: IcmpMessageType;
  code?: number;
  sourceIp: string;
  destinationIp: string;
  sequence?: number;
  className?: string;
};

export function IcmpMessageCard({
  type,
  code,
  sourceIp,
  destinationIp,
  sequence,
  className,
}: IcmpMessageCardProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MessageCircleWarning aria-hidden className="size-4" />
          ICMP 报文
        </div>
        <Badge variant={type === "echo-reply" ? "secondary" : "outline"}>{typeText(type)}</Badge>
      </div>
      <div className="grid gap-2 text-sm">
        <Info label="源 IP" value={sourceIp} />
        <Info label="目的 IP" value={destinationIp} />
        {code !== undefined ? <Info label="Code" value={String(code)} /> : null}
        {sequence !== undefined ? <Info label="Sequence" value={String(sequence)} /> : null}
      </div>
    </section>
  );
}

function typeText(type: IcmpMessageType) {
  if (type === "echo-request") return "Echo Request";
  if (type === "echo-reply") return "Echo Reply";
  if (type === "destination-unreachable") return "Destination Unreachable";
  if (type === "time-exceeded") return "Time Exceeded";
  return "Redirect";
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}
