import { Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { AddressPair } from "./address-pair";
import { ProtocolBadge, type NetworkProtocol } from "./protocol-badge";

export type CapturedPduSummary = {
  id: string;
  protocol: NetworkProtocol;
  capturedAs?: "ethernet-frame" | "ipv4-packet" | "tcp-segment" | "udp-datagram";
  srcMac?: string;
  dstMac?: string;
  srcIp?: string;
  dstIp?: string;
  srcPort?: number;
  dstPort?: number;
  ttl?: number;
  sizeBytes?: number;
  vlanId?: number;
  note?: string;
};

export type PacketCardProps = {
  packet: CapturedPduSummary;
  active?: boolean;
  className?: string;
};

export function PacketCard({ packet, active, className }: PacketCardProps) {
  return (
    <article
      className={cn(
        "w-full rounded-lg border bg-card p-3 text-card-foreground shadow-sm",
        active && "border-cyan-400 ring-2 ring-cyan-400/25",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package aria-hidden className="size-4 text-muted-foreground" />
          <div>
            <div className="font-mono text-xs font-semibold">{packet.id}</div>
            <div className="text-xs text-muted-foreground">
              {packet.note ?? capturedAsText(packet.capturedAs)}
            </div>
          </div>
        </div>
        <ProtocolBadge protocol={packet.protocol} />
      </div>

      <div className="mt-3 grid gap-2">
        {packet.srcMac && packet.dstMac ? (
          <AddressPair label="二层地址" kind="mac" from={packet.srcMac} to={packet.dstMac} />
        ) : null}
        {packet.srcIp && packet.dstIp ? (
          <AddressPair label="三层地址" kind="ip" from={packet.srcIp} to={packet.dstIp} />
        ) : null}
        {packet.srcPort !== undefined && packet.dstPort !== undefined ? (
          <AddressPair
            label="四层端口"
            kind="port"
            from={String(packet.srcPort)}
            to={String(packet.dstPort)}
          />
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {packet.ttl !== undefined ? <Badge variant="outline">TTL {packet.ttl}</Badge> : null}
        {packet.sizeBytes !== undefined ? (
          <Badge variant="outline">{packet.sizeBytes} bytes</Badge>
        ) : null}
        {packet.vlanId !== undefined ? <Badge variant="outline">VLAN {packet.vlanId}</Badge> : null}
      </div>
    </article>
  );
}

function capturedAsText(capturedAs?: CapturedPduSummary["capturedAs"]) {
  if (capturedAs === "ethernet-frame") return "捕获单位：Ethernet frame";
  if (capturedAs === "ipv4-packet") return "捕获单位：IPv4 packet";
  if (capturedAs === "tcp-segment") return "捕获单位：TCP segment";
  if (capturedAs === "udp-datagram") return "捕获单位：UDP datagram";
  return "分层 PDU 摘要";
}
