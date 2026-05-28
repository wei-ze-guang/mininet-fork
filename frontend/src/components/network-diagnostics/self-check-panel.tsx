import { AlertTriangle, CircleCheck, Info, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SelfCheckSeverity = "ok" | "info" | "warning" | "error";

export type SelfCheckItem = {
  id: string;
  title: string;
  detail?: string;
  severity: SelfCheckSeverity;
  target?: string;
};

export type SelfCheckPanelProps = {
  title?: string;
  items: SelfCheckItem[];
  className?: string;
};

const severityIcons = {
  ok: CircleCheck,
  info: Info,
  warning: AlertTriangle,
  error: ShieldCheck,
};

const severityClassNames: Record<SelfCheckSeverity, string> = {
  ok: "border-emerald-400/35 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  info: "border-cyan-400/35 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200",
  warning: "border-amber-400/35 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  error: "border-red-400/35 bg-red-400/10 text-red-700 dark:text-red-200",
};

export function SelfCheckPanel({
  title = "自检结果",
  items,
  className,
}: SelfCheckPanelProps) {
  const errors = items.filter((item) => item.severity === "error").length;
  const warnings = items.filter((item) => item.severity === "warning").length;

  return (
    <section className={cn("rounded-lg border bg-card text-card-foreground", className)}>
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">检查拓扑、接口、表项和回放数据是否一致</p>
        </div>
        <div className="flex gap-1">
          <Badge variant={errors > 0 ? "destructive" : "secondary"}>{errors} 错误</Badge>
          <Badge variant="outline">{warnings} 警告</Badge>
        </div>
      </div>
      <div className="grid gap-2 p-3">
        {items.map((item) => (
          <SelfCheckRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function SelfCheckRow({ item }: { item: SelfCheckItem }) {
  const Icon = severityIcons[item.severity];

  return (
    <div className={cn("rounded-md border px-3 py-2", severityClassNames[item.severity])}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-2">
          <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium">{item.title}</div>
            {item.detail ? <div className="text-xs text-current/70">{item.detail}</div> : null}
          </div>
        </div>
        {item.target ? <span className="font-mono text-[10px] text-current/65">{item.target}</span> : null}
      </div>
    </div>
  );
}
