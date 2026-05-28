import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TableShellProps = {
  title: string;
  description: string;
  count: number;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
  className?: string;
};

export function TableShell({
  title,
  description,
  count,
  empty,
  emptyText = "暂无数据",
  children,
  className,
}: TableShellProps) {
  return (
    <section className={cn("rounded-lg border bg-card text-card-foreground", className)}>
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge variant="secondary">{count} 条</Badge>
      </div>
      {empty ? (
        <div className="px-3 py-8 text-center text-sm text-muted-foreground">{emptyText}</div>
      ) : (
        children
      )}
    </section>
  );
}
