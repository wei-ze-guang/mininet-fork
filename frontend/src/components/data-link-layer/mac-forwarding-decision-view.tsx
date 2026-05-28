import { ArrowRight, Shuffle, TableProperties } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { MacForwardingDecision } from "./data-link-types";

export type MacForwardingDecisionViewProps = {
  decision: MacForwardingDecision;
  className?: string;
};

const actionClassNames: Record<MacForwardingDecision["action"], string> = {
  learn: "border-blue-400/40 bg-blue-400/10 text-blue-700 dark:text-blue-200",
  forward: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  flood: "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  filter: "border-zinc-400/40 bg-zinc-400/10 text-zinc-700 dark:text-zinc-200",
  drop: "border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-200",
};

export function MacForwardingDecisionView({
  decision,
  className,
}: MacForwardingDecisionViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <TableProperties aria-hidden className="size-4" />
          MAC 转发决策
        </div>
        <Badge variant="outline" className={cn(actionClassNames[decision.action])}>
          {actionText(decision.action)}
        </Badge>
      </div>

      <div className="grid gap-2">
        <Info label="入接口" value={decision.ingressInterfaceId} />
        <Info label="源 MAC 学习" value={`${decision.sourceMac}${decision.vlanId ? ` · VLAN ${decision.vlanId}` : ""}`} />
        <Info label="目的 MAC 查表" value={decision.destinationMac} />
        <div className="rounded-md border bg-muted/30 px-3 py-2">
          <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Shuffle aria-hidden className="size-3.5" />
            出接口
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {decision.egressInterfaceIds.map((iface) => (
              <Badge key={iface} variant="secondary" className="font-mono">
                {iface}
              </Badge>
            ))}
            {decision.egressInterfaceIds.length === 0 ? (
              <span className="text-xs text-muted-foreground">无</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ArrowRight aria-hidden className="size-3.5" />
          {reasonText(decision.reason)}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-xs">{value}</span>
    </div>
  );
}

function actionText(action: MacForwardingDecision["action"]) {
  if (action === "learn") return "学习";
  if (action === "forward") return "单播转发";
  if (action === "flood") return "泛洪";
  if (action === "filter") return "过滤";
  return "丢弃";
}

function reasonText(reason: MacForwardingDecision["reason"]) {
  if (reason === "source-learning") return "根据源 MAC 学习入口位置";
  if (reason === "unicast-hit") return "目的 MAC + VLAN 查表命中";
  if (reason === "unknown-unicast") return "未知单播，在同 VLAN 内泛洪";
  if (reason === "broadcast") return "广播帧，在广播域内泛洪";
  if (reason === "stp-blocked") return "STP 阻塞端口，禁止转发";
  return "FCS 校验失败，丢弃帧";
}
