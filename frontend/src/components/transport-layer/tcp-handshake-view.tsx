import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TcpHandshakeStep = {
  id: string;
  from: string;
  to: string;
  flags: "SYN" | "SYN-ACK" | "ACK";
  seq?: number;
  ack?: number;
  active?: boolean;
};

export type TcpHandshakeViewProps = {
  steps: TcpHandshakeStep[];
  className?: string;
};

export function TcpHandshakeView({ steps, className }: TcpHandshakeViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <h3 className="mb-3 text-sm font-semibold">TCP 三次握手</h3>
      <div className="grid gap-2">
        {steps.map((step) => (
          <TcpStep key={step.id} step={step} />
        ))}
      </div>
    </section>
  );
}

function TcpStep({ step }: { step: TcpHandshakeStep }) {
  return (
    <div className={cn("rounded-md border px-3 py-2", step.active && "border-cyan-400/45 bg-cyan-400/10")}>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-mono">{step.from}</span>
        <ArrowRight aria-hidden className="size-4 text-muted-foreground" />
        <span className="font-mono">{step.to}</span>
        <Badge variant="secondary" className="ml-auto font-mono">{step.flags}</Badge>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {step.seq !== undefined ? `seq=${step.seq}` : ""}
        {step.ack !== undefined ? ` ack=${step.ack}` : ""}
      </div>
    </div>
  );
}
