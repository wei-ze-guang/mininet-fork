import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableShell } from "./table-shell";

export type ArpEntryState = "reachable" | "stale" | "probing" | "failed";

export type ArpEntry = {
  id: string;
  ip: string;
  mac: string;
  iface: string;
  ageSeconds?: number;
  state: ArpEntryState;
};

export type ArpTableProps = {
  entries: ArpEntry[];
  className?: string;
};

export function ArpTable({ entries, className }: ArpTableProps) {
  return (
    <TableShell
      title="ARP 表"
      description="三层 IP 地址到二层 MAC 地址的邻居缓存"
      count={entries.length}
      empty={entries.length === 0}
      emptyText="暂无 ARP 邻居"
      className={className}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP 地址</TableHead>
            <TableHead>MAC 地址</TableHead>
            <TableHead>接口</TableHead>
            <TableHead className="text-right">年龄</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} className={entry.state === "failed" ? "bg-red-500/5" : ""}>
              <TableCell className="font-mono text-xs">{entry.ip}</TableCell>
              <TableCell className="font-mono text-xs">{entry.mac}</TableCell>
              <TableCell className="font-mono text-xs">{entry.iface}</TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatAge(entry.ageSeconds)}
              </TableCell>
              <TableCell>
                <ArpStateBadge state={entry.state} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}

function ArpStateBadge({ state }: { state: ArpEntryState }) {
  if (state === "reachable") {
    return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-200">可达</Badge>;
  }

  if (state === "probing") {
    return <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-200">探测中</Badge>;
  }

  if (state === "failed") {
    return <Badge variant="destructive">失败</Badge>;
  }

  return <Badge variant="outline">陈旧</Badge>;
}

function formatAge(ageSeconds?: number) {
  if (ageSeconds === undefined) {
    return "-";
  }

  if (ageSeconds < 60) {
    return `${ageSeconds}s`;
  }

  return `${Math.floor(ageSeconds / 60)}m ${ageSeconds % 60}s`;
}
