import { CableLink } from "./cable-link";
import { EndpointDeviceView } from "./endpoint-device-view";
import type { EndpointDevice } from "./types";
import { cn } from "@/lib/utils";

export type MiniTopologySceneProps = {
  left: EndpointDevice;
  right: EndpointDevice;
  middleLabel?: string;
  active?: boolean;
  className?: string;
};

export function MiniTopologyScene({
  left,
  right,
  middleLabel = "链路",
  active,
  className,
}: MiniTopologySceneProps) {
  return (
    <div
      className={cn(
        "grid min-w-[720px] grid-cols-[220px_minmax(180px,1fr)_220px] items-center gap-4 rounded-lg border bg-background p-5",
        className,
      )}
    >
      <EndpointDeviceView device={left} selected={active} />
      <CableLink
        status={active ? "activity" : "link"}
        direction={active ? "both" : "none"}
        label={middleLabel}
        bandwidthMbps={1000}
        latencyMs={4}
        flow={{ forwardTone: "data", reverseTone: "control" }}
      />
      <EndpointDeviceView device={right} />
    </div>
  );
}
