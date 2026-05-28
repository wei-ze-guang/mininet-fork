import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TransparentTransmissionMode = "byte-stuffing" | "bit-stuffing";

export type TransparentTransmissionViewProps = {
  mode: TransparentTransmissionMode;
  originalData: string;
  escapedData: string;
  flagPattern: string;
  className?: string;
};

export function TransparentTransmissionView({
  mode,
  originalData,
  escapedData,
  flagPattern,
  className,
}: TransparentTransmissionViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck aria-hidden className="size-4" />
          透明传输
        </div>
        <Badge variant="secondary">{modeText(mode)}</Badge>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <Field label="定界符" value={flagPattern} />
        <Field label="原始数据" value={originalData} />
        <Field label="转义/填充后" value={escapedData} active />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        当数据字段中出现与帧定界符相同的比特/字节模式时，链路层必须转义或填充，避免接收端误判帧边界。
      </p>
    </section>
  );
}

function Field({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={cn("rounded-md border bg-muted/30 px-3 py-2", active && "border-cyan-400/45 bg-cyan-400/10")}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-all font-mono text-sm">{value}</div>
    </div>
  );
}

function modeText(mode: TransparentTransmissionMode) {
  return mode === "byte-stuffing" ? "字节填充" : "比特填充";
}
