import { ArrowDownRight, Trash2 } from "lucide-react";

import { PacketQueue, type PacketQueueItem } from "@/components/network-topology/packet-queue";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PacketActionBadge } from "./packet-action-badge";

export type PacketDropReason =
  | "queue-overflow"
  | "ttl-expired"
  | "acl-deny"
  | "checksum-error"
  | "no-route"
  | "link-down";

export type PacketDropActionProps = {
  sourceName: string;
  packetBits: string;
  reason: PacketDropReason;
  queueItems?: PacketQueueItem[];
  className?: string;
};

export function PacketDropAction({
  sourceName,
  packetBits,
  reason,
  queueItems = defaultQueueItems,
  className,
}: PacketDropActionProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-4 text-card-foreground", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">丢包动作</h3>
          <p className="text-xs text-muted-foreground">包从端口/队列中被丢弃，而不是继续转发</p>
        </div>
        <PacketActionBadge action="drop" />
      </div>

      <div className="grid items-center gap-4 md:grid-cols-[minmax(240px,1fr)_120px_minmax(160px,0.7fr)]">
        <PacketQueue name={sourceName} capacity={5} items={queueItems} />

        <div className="relative flex h-28 items-center justify-center">
          <div className="absolute left-2 top-4 rounded-md border border-red-400/40 bg-red-400/10 px-3 py-2 font-mono text-xs font-bold tracking-[0.18em] text-red-700 shadow-[0_10px_20px_rgba(239,68,68,0.18)] motion-safe:animate-pulse dark:text-red-200">
            {packetBits}
          </div>
          <ArrowDownRight aria-hidden className="size-12 text-red-500" />
        </div>

        <div className="rounded-lg border border-red-400/35 bg-red-400/10 p-3 text-red-700 dark:text-red-200">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Trash2 aria-hidden className="size-4" />
            丢弃区
          </div>
          <Badge variant="outline" className="border-red-400/40 text-red-700 dark:text-red-200">
            {reasonText(reason)}
          </Badge>
          <p className="mt-2 text-xs text-current/70">该包不会进入后续链路或目标设备。</p>
        </div>
      </div>
    </section>
  );
}

function reasonText(reason: PacketDropReason) {
  if (reason === "queue-overflow") return "队列溢出";
  if (reason === "ttl-expired") return "TTL 归零";
  if (reason === "acl-deny") return "ACL 拒绝";
  if (reason === "checksum-error") return "校验失败";
  if (reason === "no-route") return "无路由";
  return "链路断开";
}

const defaultQueueItems: PacketQueueItem[] = [
  { id: "pkt-1", bits: "1010", protocol: "ICMP", state: "processing" },
  { id: "pkt-2", bits: "0101", protocol: "TCP" },
  { id: "pkt-3", bits: "1110", protocol: "ARP" },
  { id: "pkt-drop", bits: "0001", protocol: "TCP", state: "dropped" },
];
