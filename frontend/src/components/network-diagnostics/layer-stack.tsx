import { Layers } from "lucide-react";

import { cn } from "@/lib/utils";

import { ProtocolBadge, type NetworkProtocol } from "./protocol-badge";

export type NetworkLayerId = "L2" | "L3" | "L4" | "L7";

export type NetworkLayer = {
  id: NetworkLayerId;
  name: string;
  protocol?: NetworkProtocol;
  active?: boolean;
  note?: string;
};

export type LayerStackProps = {
  layers: NetworkLayer[];
  className?: string;
};

export function LayerStack({ layers, className }: LayerStackProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Layers aria-hidden className="size-4" />
        协议分层
      </div>
      <div className="grid gap-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-md border px-3 py-2",
              layer.active ? "border-cyan-400/45 bg-cyan-400/10" : "bg-muted/30",
            )}
          >
            <div>
              <div className="text-sm font-medium">
                {layer.id} · {layer.name}
              </div>
              {layer.note ? <div className="text-xs text-muted-foreground">{layer.note}</div> : null}
            </div>
            {layer.protocol ? <ProtocolBadge protocol={layer.protocol} compact /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export const defaultPacketLayers: NetworkLayer[] = [
  { id: "L7", name: "应用层", protocol: "HTTP", note: "应用消息", active: false },
  { id: "L4", name: "传输层", protocol: "TCP", note: "端口与会话", active: true },
  { id: "L3", name: "网络层", protocol: "IPv4", note: "IP 寻址与路由", active: true },
  { id: "L2", name: "数据链路层", protocol: "Ethernet", note: "MAC 寻址与帧转发", active: true },
];
