import { CheckCircle2, CircleDot, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ErrorCheckStatus = "passed" | "failed" | "unchecked";

export type ErrorCheckBadgeProps = {
  algorithm?: "CRC32" | "FCS" | "checksum";
  status: ErrorCheckStatus;
  className?: string;
};

export function ErrorCheckBadge({
  algorithm = "FCS",
  status,
  className,
}: ErrorCheckBadgeProps) {
  const Icon = status === "passed" ? CheckCircle2 : status === "failed" ? XCircle : CircleDot;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1",
        status === "passed" && "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
        status === "failed" && "border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-200",
        className,
      )}
    >
      <Icon aria-hidden className="size-3" />
      {algorithm} {statusText(status)}
    </Badge>
  );
}

function statusText(status: ErrorCheckStatus) {
  if (status === "passed") return "通过";
  if (status === "failed") return "失败";
  return "未检查";
}
