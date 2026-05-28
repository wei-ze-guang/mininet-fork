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

export type VlanEntryState = "active" | "suspended";

export type VlanEntry = {
  id: string;
  vlanId: number;
  name: string;
  ports: string[];
  taggedPorts?: string[];
  untaggedPorts?: string[];
  nativeVlanPorts?: string[];
  sviInterfaceIp?: string;
  state: VlanEntryState;
};

export type VlanTableProps = {
  entries: VlanEntry[];
  className?: string;
};

export function VlanTable({ entries, className }: VlanTableProps) {
  return (
    <TableShell
      title="VLAN 表"
      description="二层广播域划分、Access/Trunk 端口成员"
      count={entries.length}
      empty={entries.length === 0}
      emptyText="暂无 VLAN"
      className={className}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>VLAN</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>成员端口</TableHead>
            <TableHead>Tagged</TableHead>
            <TableHead>Untagged</TableHead>
            <TableHead>Native</TableHead>
            <TableHead>三层接口</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-xs">{entry.vlanId}</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell className="font-mono text-xs">{entry.ports.join(", ")}</TableCell>
              <TableCell className="font-mono text-xs">{entry.taggedPorts?.join(", ") ?? "-"}</TableCell>
              <TableCell className="font-mono text-xs">{entry.untaggedPorts?.join(", ") ?? "-"}</TableCell>
              <TableCell className="font-mono text-xs">{entry.nativeVlanPorts?.join(", ") ?? "-"}</TableCell>
              <TableCell className="font-mono text-xs">{entry.sviInterfaceIp ?? "-"}</TableCell>
              <TableCell>
                {entry.state === "active" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-200">启用</Badge>
                ) : (
                  <Badge variant="outline">挂起</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}
