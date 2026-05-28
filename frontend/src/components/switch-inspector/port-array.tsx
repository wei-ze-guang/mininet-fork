import { cn } from "@/lib/utils";

import { PortTile } from "./port-tile";
import type { SwitchPort } from "./types";

export type PortArrayProps = {
  ports: SwitchPort[];
  selectedPortId?: string;
  activePortIds?: string[];
  columns?: 8 | 12 | 16 | 24;
  compact?: boolean;
  onPortSelect?: (port: SwitchPort) => void;
  className?: string;
};

const columnClassNames: Record<NonNullable<PortArrayProps["columns"]>, string> = {
  8: "grid-cols-4 sm:grid-cols-8",
  12: "grid-cols-6 sm:grid-cols-12",
  16: "grid-cols-8 sm:grid-cols-16",
  24: "grid-cols-8 sm:grid-cols-12 lg:grid-cols-16 xl:grid-cols-24",
};

export function PortArray({
  ports,
  selectedPortId,
  activePortIds = [],
  columns = 24,
  compact = true,
  onPortSelect,
  className,
}: PortArrayProps) {
  const activePorts = new Set(activePortIds);

  return (
    <div className={cn("grid gap-1.5", columnClassNames[columns], className)}>
      {ports.map((port) => (
        <PortTile
          key={port.id}
          port={port}
          selected={selectedPortId === port.id}
          active={activePorts.has(port.id)}
          compact={compact}
          onSelect={onPortSelect}
        />
      ))}
    </div>
  );
}
