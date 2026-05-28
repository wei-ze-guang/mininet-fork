import { PackagePlus } from "lucide-react";

import { cn } from "@/lib/utils";

import { PacketLayerBlock, type PacketLayerBlockData } from "./packet-layer-block";

export type PacketAssemblerProps = {
  title?: string;
  layers: PacketLayerBlockData[];
  className?: string;
};

export function PacketAssembler({
  title = "装包视图",
  layers,
  className,
}: PacketAssemblerProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center gap-2">
        <PackagePlus aria-hidden className="size-4 text-muted-foreground" />
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">从载荷逐层封装到链路层帧</p>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2">
        {layers.map((layer) => (
          <PacketLayerBlock key={layer.id} layer={layer} />
        ))}
      </div>
    </section>
  );
}
