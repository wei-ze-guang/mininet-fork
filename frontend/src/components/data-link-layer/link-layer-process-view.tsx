import { ArrowDown, CheckCircle2, Circle, CircleDot, Layers2, XCircle } from "lucide-react";

import { PacketDropAction } from "@/components/network-packet-actions/packet-drop-action";
import { MacAddressTable, type MacTableEntry } from "@/components/switch-inspector/mac-address-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { LinkLayerProcess, LinkLayerProcessStep } from "./data-link-types";

export type LinkLayerProcessViewProps = {
  process: LinkLayerProcess;
  macEntries?: MacTableEntry[];
  className?: string;
};

const statusClassNames: Record<LinkLayerProcessStep["status"], string> = {
  pending: "border-zinc-300 bg-background text-muted-foreground",
  active: "border-cyan-400 bg-cyan-400/10 text-cyan-800 dark:text-cyan-100",
  done: "border-emerald-400/60 bg-emerald-400/10 text-emerald-800 dark:text-emerald-100",
  failed: "border-red-400/60 bg-red-400/10 text-red-800 dark:text-red-100",
  skipped: "border-zinc-300 bg-muted/40 text-muted-foreground",
};

export function LinkLayerProcessView({ process, macEntries, className }: LinkLayerProcessViewProps) {
  const physicalSteps = process.steps.filter((step) => step.layer === "physical");
  const linkSteps = process.steps.filter((step) => step.layer === "data-link");
  const hasCorruptedDrop = process.steps.some(
    (step) => step.id === "drop-corrupted-frame" && (step.status === "active" || step.status === "done"),
  );

  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Layers2 aria-hidden className="size-4" />
          {process.title}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {process.direction ? <Badge variant="secondary">{directionText(process.direction)}</Badge> : null}
          {process.actor ? <Badge variant="outline">{actorText(process.actor)}</Badge> : null}
          <Badge variant="outline" className="font-mono">{process.ingressInterfaceId}</Badge>
          <Badge variant="secondary" className="font-mono">{process.frameId}</Badge>
        </div>
      </div>

      {(process.input || process.output) ? (
        <div className="mb-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {process.input ? <DataRefCard label="输入" data={process.input} /> : null}
          <div className="hidden items-center justify-center text-xs text-muted-foreground md:flex">
            <ArrowDown aria-hidden className="size-4 rotate-[-90deg]" />
          </div>
          {process.output ? <DataRefCard label="输出" data={process.output} /> : null}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[minmax(220px,0.7fr)_auto_minmax(300px,1.3fr)]">
        <LayerColumn title="物理层 L1" subtitle="信号恢复为比特流" steps={physicalSteps} />
        <div className="hidden items-center justify-center lg:flex">
          <div className="grid place-items-center gap-1 text-xs text-muted-foreground">
            <ArrowDown aria-hidden className="size-4 rotate-[-90deg]" />
            上交比特流
          </div>
        </div>
        <LayerColumn title="数据链路层 L2" subtitle="帧定界、差错检测、MAC 处理" steps={linkSteps} />
      </div>
      {hasCorruptedDrop ? (
        <PacketDropAction
          sourceName={process.ingressInterfaceId}
          packetBits="FCS!"
          reason="checksum-error"
          className="mt-3"
        />
      ) : null}
      {macEntries?.length ? (
        <MacAddressTable entries={macEntries} title="本次 MAC/FDB 查表" className="mt-3" />
      ) : null}
    </section>
  );
}

function DataRefCard({
  label,
  data,
}: {
  label: string;
  data: NonNullable<LinkLayerProcess["input"]>;
}) {
  return (
    <div className="rounded-md border bg-background px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{dataKindText(data.kind)}</Badge>
        <span className="font-mono text-sm font-medium">{data.label}</span>
      </div>
      {data.detail ? <div className="mt-1 text-xs text-muted-foreground">{data.detail}</div> : null}
    </div>
  );
}

function LayerColumn({
  title,
  subtitle,
  steps,
}: {
  title: string;
  subtitle: string;
  steps: LinkLayerProcessStep[];
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-3">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div className="grid gap-2">
        {steps.map((step, index) => (
          <ProcessStepCard key={step.id} last={index === steps.length - 1} step={step} />
        ))}
      </div>
    </div>
  );
}

function ProcessStepCard({ step, last }: { step: LinkLayerProcessStep; last: boolean }) {
  return (
    <div className="grid grid-cols-[18px_minmax(0,1fr)] gap-2">
      <div className="grid justify-items-center">
        <StepStatusIcon status={step.status} />
        {!last ? <div className="mt-1 h-full w-px bg-border" /> : null}
      </div>
      <div className={cn("rounded-md border px-3 py-2", statusClassNames[step.status])}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">{step.title}</div>
          <Badge variant="outline" className="h-5 text-[10px]">{statusText(step.status)}</Badge>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{step.description}</div>
        {(step.input || step.output) ? (
          <div className="mt-2 grid gap-1 text-[11px]">
            {step.input ? <InfoLine label="输入" value={step.input} /> : null}
            {step.output ? <InfoLine label="输出" value={step.output} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StepStatusIcon({ status }: { status: LinkLayerProcessStep["status"] }) {
  const className = cn(
    "size-4",
    status === "active" && "text-cyan-600",
    status === "done" && "text-emerald-600",
    status === "failed" && "text-red-600",
    (status === "pending" || status === "skipped") && "text-muted-foreground",
  );

  if (status === "done") return <CheckCircle2 aria-hidden className={className} />;
  if (status === "failed") return <XCircle aria-hidden className={className} />;
  if (status === "active") return <CircleDot aria-hidden className={className} />;
  return <Circle aria-hidden className={className} />;
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded border bg-background/70 px-2 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono">{value}</span>
    </div>
  );
}

function statusText(status: LinkLayerProcessStep["status"]) {
  if (status === "done") return "完成";
  if (status === "active") return "正在执行";
  if (status === "failed") return "失败";
  if (status === "skipped") return "跳过";
  return "等待";
}

function directionText(direction: NonNullable<LinkLayerProcess["direction"]>) {
  return direction === "send" ? "发送方向" : "接收方向";
}

function actorText(actor: NonNullable<LinkLayerProcess["actor"]>) {
  if (actor === "host") return "主机";
  if (actor === "switch") return "交换机";
  return "路由器";
}

function dataKindText(kind: NonNullable<LinkLayerProcess["input"]>["kind"]) {
  if (kind === "upper-payload") return "上层数据";
  if (kind === "bit-stream") return "比特流";
  if (kind === "ethernet-frame") return "以太网帧";
  if (kind === "ppp-frame") return "PPP 帧";
  if (kind === "forward-decision") return "转发决策";
  return "丢弃决策";
}
