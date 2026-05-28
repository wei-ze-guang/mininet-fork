import { BookOpenCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MacLearningViewProps = {
  sourceMac: string;
  ingressInterfaceId: string;
  vlanId?: number;
  ageSeconds?: number;
  className?: string;
};

export function MacLearningView({
  sourceMac,
  ingressInterfaceId,
  vlanId,
  ageSeconds,
  className,
}: MacLearningViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <BookOpenCheck aria-hidden className="size-4" />
        源 MAC 学习
      </div>
      <div className="grid gap-2 text-sm">
        <Info label="源 MAC" value={sourceMac} />
        <Info label="入口接口" value={ingressInterfaceId} />
        {vlanId !== undefined ? <Info label="VLAN" value={String(vlanId)} /> : null}
      </div>
      <div className="mt-3">
        <Badge variant="secondary">
          写入 FDB: {sourceMac} → {ingressInterfaceId}
          {vlanId !== undefined ? ` / VLAN ${vlanId}` : ""}
        </Badge>
        {ageSeconds !== undefined ? (
          <Badge variant="outline" className="ml-1">age {ageSeconds}s</Badge>
        ) : null}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-xs">{value}</span>
    </div>
  );
}
