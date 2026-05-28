import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type MacTableEntryState = "learned" | "hit" | "aging" | "expired";

export type MacTableEntry = {
  id: string;
  mac: string;
  portId: string;
  vlan?: string;
  learnedFrom?: string;
  ageSeconds?: number;
  state: MacTableEntryState;
};

export type MacAddressTableProps = {
  entries: MacTableEntry[];
  title?: string;
  emptyText?: string;
  className?: string;
};

export function MacAddressTable({
  entries,
  title = "MAC 地址表",
  emptyText = "暂无学习到的 MAC 地址",
  className,
}: MacAddressTableProps) {
  return (
    <section className={cn("rounded-lg border bg-card text-card-foreground", className)}>
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">
            按目的 MAC + VLAN 查表；未命中或广播会在同 VLAN 内泛洪
          </p>
        </div>
        <Badge variant="secondary">{entries.length} 条</Badge>
      </div>

      {entries.length === 0 ? (
        <div className="px-3 py-8 text-center text-sm text-muted-foreground">{emptyText}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MAC 地址</TableHead>
              <TableHead>端口</TableHead>
              <TableHead>VLAN</TableHead>
              <TableHead>推断对端</TableHead>
              <TableHead className="text-right">年龄</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className={rowClassNames[entry.state]}>
                <TableCell className="font-mono text-xs">{entry.mac}</TableCell>
                <TableCell className="font-mono text-xs">{entry.portId}</TableCell>
                <TableCell className="font-mono text-xs">{entry.vlan ?? "-"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {entry.learnedFrom ?? "-"}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatAge(entry.ageSeconds)}
                </TableCell>
                <TableCell>
                  <MacEntryStateBadge state={entry.state} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}

function MacEntryStateBadge({ state }: { state: MacTableEntryState }) {
  if (state === "hit") {
    return <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-200">本次命中</Badge>;
  }

  if (state === "aging") {
    return <Badge variant="outline">老化中</Badge>;
  }

  if (state === "expired") {
    return <Badge variant="destructive">过期</Badge>;
  }

  return <Badge variant="secondary">已学习</Badge>;
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

const rowClassNames: Record<MacTableEntryState, string> = {
  learned: "",
  hit: "bg-cyan-500/10 hover:bg-cyan-500/15",
  aging: "text-muted-foreground",
  expired: "bg-red-500/5 text-muted-foreground line-through hover:bg-red-500/10",
};
