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

export type NatEntryState = "active" | "closing" | "expired";
export type NatProtocol = "TCP" | "UDP" | "ICMP";

export type NatEntry = {
  id: string;
  protocol: NatProtocol;
  insideLocal: string;
  insideGlobal: string;
  outsideRemote?: string;
  timeoutSeconds?: number;
  state: NatEntryState;
};

export type NatTableProps = {
  entries: NatEntry[];
  className?: string;
};

export function NatTable({ entries, className }: NatTableProps) {
  return (
    <TableShell
      title="NAT 表"
      description="内网地址与外部地址/端口之间的转换关系"
      count={entries.length}
      empty={entries.length === 0}
      emptyText="暂无 NAT 会话"
      className={className}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>协议</TableHead>
            <TableHead>Inside Local</TableHead>
            <TableHead>Inside Global</TableHead>
            <TableHead>Outside</TableHead>
            <TableHead className="text-right">超时</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} className={entry.state === "expired" ? "text-muted-foreground line-through" : ""}>
              <TableCell>
                <Badge variant="outline">{entry.protocol}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{entry.insideLocal}</TableCell>
              <TableCell className="font-mono text-xs">{entry.insideGlobal}</TableCell>
              <TableCell className="font-mono text-xs">{entry.outsideRemote ?? "*"}</TableCell>
              <TableCell className="text-right font-mono text-xs">
                {entry.timeoutSeconds === undefined ? "-" : `${entry.timeoutSeconds}s`}
              </TableCell>
              <TableCell>
                <NatStateBadge state={entry.state} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}

function NatStateBadge({ state }: { state: NatEntryState }) {
  if (state === "active") {
    return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-200">活动</Badge>;
  }

  if (state === "closing") {
    return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-200">关闭中</Badge>;
  }

  return <Badge variant="destructive">过期</Badge>;
}
