import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TcpTeardownStep = {
  id: string;
  from: string;
  to: string;
  flags: "FIN" | "ACK" | "FIN+ACK";
  state?: string;
  active?: boolean;
};

export type TcpTeardownViewProps = {
  steps: TcpTeardownStep[];
  className?: string;
};

export function TcpTeardownView({ steps, className }: TcpTeardownViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <h3 className="mb-3 text-sm font-semibold">TCP 四次挥手</h3>
      <div className="grid gap-2">
        {steps.map((step) => (
          <div key={step.id} className={cn("rounded-md border px-3 py-2", step.active && "border-amber-400/45 bg-amber-400/10")}>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono">{step.from}</span>
              <ArrowRight aria-hidden className="size-4 text-muted-foreground" />
              <span className="font-mono">{step.to}</span>
              <Badge variant="outline" className="ml-auto font-mono">{step.flags}</Badge>
            </div>
            {step.state ? <div className="mt-1 text-xs text-muted-foreground">{step.state}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
