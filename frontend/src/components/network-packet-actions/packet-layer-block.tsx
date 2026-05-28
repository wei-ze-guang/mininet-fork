import { cn } from "@/lib/utils";

import { ProtocolBadge, type NetworkProtocol } from "../network-diagnostics/protocol-badge";

export type PacketLayerId = "L2" | "L3" | "L3-Control" | "L4" | "L7" | "Payload";

export type PacketLayerField = {
  label: string;
  value: string | number;
  changed?: boolean;
};

export type PacketLayerBlockData = {
  id: PacketLayerId;
  name: string;
  protocol: NetworkProtocol | "Payload";
  fields: PacketLayerField[];
  highlight?: boolean;
};

export type PacketLayerBlockProps = {
  layer: PacketLayerBlockData;
  compact?: boolean;
  className?: string;
};

const layerClassNames: Record<PacketLayerId, string> = {
  L2: "border-zinc-400/35 bg-zinc-400/10",
  L3: "border-blue-400/35 bg-blue-400/10",
  "L3-Control": "border-cyan-400/35 bg-cyan-400/10",
  L4: "border-emerald-400/35 bg-emerald-400/10",
  L7: "border-violet-400/35 bg-violet-400/10",
  Payload: "border-stone-400/35 bg-stone-400/10",
};

export function PacketLayerBlock({ layer, compact, className }: PacketLayerBlockProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        layerClassNames[layer.id],
        layer.highlight && "ring-2 ring-cyan-400/35",
        compact && "p-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground">{layer.id}</div>
          <div className="text-sm font-semibold">{layer.name}</div>
        </div>
        {layer.protocol === "Payload" ? (
          <span className="rounded-md border px-1.5 py-0.5 font-mono text-[10px]">Payload</span>
        ) : (
          <ProtocolBadge protocol={layer.protocol} compact />
        )}
      </div>
      <div className="mt-2 grid gap-1">
        {layer.fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">{field.label}</span>
            <span className={cn("truncate font-mono", field.changed && "text-cyan-600 dark:text-cyan-200")}>
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
