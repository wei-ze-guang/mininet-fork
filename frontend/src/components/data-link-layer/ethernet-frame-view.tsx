import { FrameBoundary } from "@/components/network-link-layer/frame-boundary";
import type { ErrorCheckStatus } from "@/components/network-link-layer/error-check-badge";

import type { EthernetFrameSummary } from "./data-link-types";

export type EthernetFrameViewProps = {
  frame: EthernetFrameSummary;
  fcsStatus?: ErrorCheckStatus;
  className?: string;
};

export function EthernetFrameView({
  frame,
  fcsStatus = "passed",
  className,
}: EthernetFrameViewProps) {
  return (
    <FrameBoundary
      className={className}
      fcsStatus={fcsStatus}
      fields={[
        { name: "Preamble", value: "1010...", bits: 56, role: "line-coding", outsideMacFrame: true },
        { name: "SFD", value: "10101011", bits: 8, role: "sfd", outsideMacFrame: true },
        { name: "Dst MAC", value: frame.destinationMac, bits: 48, role: "destination" },
        { name: "Src MAC", value: frame.sourceMac, bits: 48, role: "source" },
        ...(frame.vlanTag
          ? [{ name: "802.1Q Tag", value: `${frame.vlanTag.tpid} VLAN ${frame.vlanTag.vlanId}`, bits: 32, role: "vlan-tag" as const }]
          : []),
        { name: "Type", value: frame.etherType, bits: 16, role: "type" },
        { name: "Payload", value: `${frame.etherType} · ${frame.payloadBytes} bytes`, role: "payload" },
        { name: "FCS", value: frame.fcs, bits: 32, role: "fcs" },
      ]}
    />
  );
}
