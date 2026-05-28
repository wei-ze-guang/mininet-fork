import { DoorOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TransportProtocol = "TCP" | "UDP";

export type PortBadgeProps = {
  port: number;
  protocol: TransportProtocol;
  service?: string;
  className?: string;
};

export function PortBadge({ port, protocol, service, className }: PortBadgeProps) {
  return (
    <Badge variant="outline" className={cn("gap-1 font-mono", className)}>
      <DoorOpen aria-hidden className="size-3" />
      {protocol}:{port}
      {service ? <span className="font-sans text-[10px] opacity-70">{service}</span> : null}
    </Badge>
  );
}
