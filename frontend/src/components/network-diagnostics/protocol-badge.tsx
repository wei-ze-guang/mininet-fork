import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type NetworkProtocol =
  | "ARP"
  | "ICMP"
  | "TCP"
  | "UDP"
  | "HTTP"
  | "DNS"
  | "DHCP"
  | "Ethernet"
  | "IPv4";

export type ProtocolBadgeProps = {
  protocol: NetworkProtocol;
  compact?: boolean;
  className?: string;
};

const protocolClassNames: Record<NetworkProtocol, string> = {
  ARP: "border-amber-400/35 bg-amber-400/10 text-amber-700 dark:text-amber-200",
  ICMP: "border-cyan-400/35 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200",
  TCP: "border-emerald-400/35 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
  UDP: "border-sky-400/35 bg-sky-400/10 text-sky-700 dark:text-sky-200",
  HTTP: "border-violet-400/35 bg-violet-400/10 text-violet-700 dark:text-violet-200",
  DNS: "border-indigo-400/35 bg-indigo-400/10 text-indigo-700 dark:text-indigo-200",
  DHCP: "border-lime-400/35 bg-lime-400/10 text-lime-700 dark:text-lime-200",
  Ethernet: "border-zinc-400/35 bg-zinc-400/10 text-zinc-700 dark:text-zinc-200",
  IPv4: "border-blue-400/35 bg-blue-400/10 text-blue-700 dark:text-blue-200",
};

export function ProtocolBadge({ protocol, compact, className }: ProtocolBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono",
        protocolClassNames[protocol],
        compact && "h-4 px-1.5 text-[10px]",
        className,
      )}
    >
      {protocol}
    </Badge>
  );
}
