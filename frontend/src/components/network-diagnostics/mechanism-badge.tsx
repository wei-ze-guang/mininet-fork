import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type NetworkMechanism = "NAT" | "VLAN" | "STP" | "QoS" | "ACL";

export type MechanismBadgeProps = {
  mechanism: NetworkMechanism;
  compact?: boolean;
  className?: string;
};

const mechanismClassNames: Record<NetworkMechanism, string> = {
  NAT: "border-teal-400/35 bg-teal-400/10 text-teal-700 dark:text-teal-200",
  VLAN: "border-fuchsia-400/35 bg-fuchsia-400/10 text-fuchsia-700 dark:text-fuchsia-200",
  STP: "border-orange-400/35 bg-orange-400/10 text-orange-700 dark:text-orange-200",
  QoS: "border-lime-400/35 bg-lime-400/10 text-lime-700 dark:text-lime-200",
  ACL: "border-red-400/35 bg-red-400/10 text-red-700 dark:text-red-200",
};

export function MechanismBadge({ mechanism, compact, className }: MechanismBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono",
        mechanismClassNames[mechanism],
        compact && "h-4 px-1.5 text-[10px]",
        className,
      )}
    >
      {mechanism}
    </Badge>
  );
}
