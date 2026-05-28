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

export type RouteEntryKind = "connected" | "static" | "default" | "dynamic";

export type RouteEntry = {
  id: string;
  destination: string;
  gateway?: string;
  iface: string;
  metric?: number;
  kind: RouteEntryKind;
  active?: boolean;
};

export type RouteTableProps = {
  entries: RouteEntry[];
  className?: string;
};

export function RouteTable({ entries, className }: RouteTableProps) {
  return (
    <TableShell
      title="路由表"
      description="根据目标网段选择下一跳和出口接口"
      count={entries.length}
      empty={entries.length === 0}
      emptyText="暂无路由"
      className={className}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>目标网段</TableHead>
            <TableHead>下一跳</TableHead>
            <TableHead>出口接口</TableHead>
            <TableHead className="text-right">Metric</TableHead>
            <TableHead>类型</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} className={entry.active ? "bg-cyan-500/10" : ""}>
              <TableCell className="font-mono text-xs">{entry.destination}</TableCell>
              <TableCell className="font-mono text-xs">{entry.gateway ?? "直连"}</TableCell>
              <TableCell className="font-mono text-xs">{entry.iface}</TableCell>
              <TableCell className="text-right font-mono text-xs">{entry.metric ?? "-"}</TableCell>
              <TableCell>
                <RouteKindBadge kind={entry.kind} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}

function RouteKindBadge({ kind }: { kind: RouteEntryKind }) {
  if (kind === "default") {
    return <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-200">默认</Badge>;
  }

  if (kind === "connected") {
    return <Badge variant="secondary">直连</Badge>;
  }

  if (kind === "dynamic") {
    return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-200">动态</Badge>;
  }

  return <Badge variant="outline">静态</Badge>;
}
