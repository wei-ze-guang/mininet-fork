import type { StatusLedState } from "@/components/network-primitives/status-led";

export type PhysicalMediumKind = "copper" | "fiber" | "wireless" | "loopback" | "virtual";

export type ConnectorKind = "rj45" | "sfp" | "sfp+" | "qsfp" | "wifi" | "lo" | "tap";

export type DuplexMode = "simplex" | "half-duplex" | "full-duplex";

export type PhysicalLinkStatus = "down" | "link" | "degraded" | "error";

export type PhysicalPort = {
  id: string;
  name: string;
  deviceId: string;
  medium: PhysicalMediumKind;
  connector: ConnectorKind;
  duplex: DuplexMode;
  speedMbps?: number;
  status: StatusLedState;
};

export type PhysicalMedium = {
  kind: PhysicalMediumKind;
  label: string;
  attenuationDb?: number;
  noiseDb?: number;
};

export type PhysicalLink = {
  id: string;
  endpointA: PhysicalPort;
  endpointB: PhysicalPort;
  medium: PhysicalMedium;
  bandwidthMbps: number;
  propagationDelayMs?: number;
  bitErrorRate?: number;
  status: PhysicalLinkStatus;
};

export type SignalEncoding = "NRZ" | "Manchester" | "PAM4" | "OFDM" | "unknown";

export type BitStream = {
  id: string;
  bits: string;
  bitRateMbps?: number;
};

export type PhysicalSignal = {
  id: string;
  bitStream: BitStream;
  encoding?: SignalEncoding;
  symbolRateMbaud?: number;
  powerDbm?: number;
};

export type PhysicalTransmissionResult = "delivered" | "lost" | "corrupted" | "collision";

export type PhysicalTransmission = {
  id: string;
  link: PhysicalLink;
  fromPortId: string;
  toPortId: string;
  signal: PhysicalSignal;
  direction: "A_TO_B" | "B_TO_A";
  startedAtMs: number;
  endedAtMs?: number;
  result: PhysicalTransmissionResult;
};
