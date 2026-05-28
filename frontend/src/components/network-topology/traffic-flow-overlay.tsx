import { FlowParticle, type FlowParticleTone } from "./flow-particle";
import type { CableLinkDirection } from "./types";

export type TrafficFlowOverlayProps = {
  active?: boolean;
  direction?: CableLinkDirection;
  forwardTone?: FlowParticleTone;
  reverseTone?: FlowParticleTone;
  forwardBits?: string;
  reverseBits?: string;
};

export function TrafficFlowOverlay({
  active,
  direction = "none",
  forwardTone = "forward",
  reverseTone = "reverse",
  forwardBits = "1010",
  reverseBits = "0101",
}: TrafficFlowOverlayProps) {
  return (
    <>
      {(direction === "forward" || direction === "both") && (
        <FlowParticle active={active} tone={forwardTone} bits={forwardBits} />
      )}
      {(direction === "reverse" || direction === "both") && (
        <FlowParticle active={active} tone={reverseTone} bits={reverseBits} reverse />
      )}
    </>
  );
}
