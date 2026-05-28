import { Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PortBadge } from "./port-badge";

export type UdpDatagram = {
  sourcePort: number;
  destinationPort: number;
  lengthBytes: number;
  checksum?: string;
  payloadLabel?: string;
};

export type UdpDatagramCardProps = {
  datagram: UdpDatagram;
  className?: string;
};

export function UdpDatagramCard({ datagram, className }: UdpDatagramCardProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Send aria-hidden className="size-4" />
          UDP 用户数据报
        </div>
        <Badge variant="outline">无连接</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <PortBadge protocol="UDP" port={datagram.sourcePort} service="src" />
        <PortBadge protocol="UDP" port={datagram.destinationPort} service="dst" />
        <Badge variant="outline">{datagram.lengthBytes} bytes</Badge>
        {datagram.checksum ? <Badge variant="outline">checksum {datagram.checksum}</Badge> : null}
        {datagram.payloadLabel ? <Badge variant="secondary">{datagram.payloadLabel}</Badge> : null}
      </div>
    </section>
  );
}
