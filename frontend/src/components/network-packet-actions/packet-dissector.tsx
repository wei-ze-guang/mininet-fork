import { PackageOpen } from "lucide-react";

import { cn } from "@/lib/utils";

import { PacketLayerBlock, type PacketLayerBlockData } from "./packet-layer-block";

export type PacketDissectorProps = {
  packetId: string;
  layers: PacketLayerBlockData[];
  className?: string;
};

export function PacketDissector({ packetId, layers, className }: PacketDissectorProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center gap-2">
        <PackageOpen aria-hidden className="size-4 text-muted-foreground" />
        <div>
          <h3 className="text-sm font-semibold">拆包视图</h3>
          <p className="font-mono text-xs text-muted-foreground">{packetId}</p>
        </div>
      </div>
      <div className="grid gap-2">
        {layers.map((layer) => (
          <PacketLayerBlock key={layer.id} layer={layer} />
        ))}
      </div>
    </section>
  );
}
