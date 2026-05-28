import { Split } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type IpFragment = {
  id: string;
  offsetBytes: number;
  sizeBytes: number;
  moreFragments: boolean;
};

export type FragmentationViewProps = {
  datagramBytes: number;
  mtu: number;
  headerBytes?: number;
  fragments: IpFragment[];
  className?: string;
};

export function FragmentationView({
  datagramBytes,
  mtu,
  headerBytes = 20,
  fragments,
  className,
}: FragmentationViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Split aria-hidden className="size-4" />
          IP 分片
        </div>
        <div className="flex gap-1">
          <Badge variant="outline">MTU {mtu}</Badge>
          <Badge variant="outline">IP {datagramBytes} bytes</Badge>
        </div>
      </div>
      <div className="grid gap-2">
        {fragments.map((fragment) => (
          <div key={fragment.id} className="rounded-md border bg-muted/30 px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold">{fragment.id}</span>
              <Badge variant={fragment.moreFragments ? "secondary" : "outline"}>
                MF={fragment.moreFragments ? 1 : 0}
              </Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              offsetBytes {fragment.offsetBytes} · fragmentOffset={fragment.offsetBytes / 8} · payload{" "}
              {fragment.sizeBytes - headerBytes} bytes · header {headerBytes} bytes
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
