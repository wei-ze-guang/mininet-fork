import type { PhysicalPort } from "@/components/physical-layer/physical-types";
import type { StpPortRole, StpPortState } from "@/components/network-link-layer/stp-state-badge";

export type MacAddress = string;

export type EtherType = "IPv4" | "ARP" | "IPv6" | "unknown";

export type VlanPortMode = "access" | "trunk" | "routed";

export type VlanTag = {
  tpid: "0x8100";
  vlanId: number;
  pcp?: number;
  dei?: boolean;
};

export type DataLinkInterface = {
  id: string;
  name: string;
  physicalPort: PhysicalPort;
  macAddress: MacAddress;
  mtu: number;
  vlanMode: VlanPortMode;
  accessVlan?: number;
  taggedVlans?: number[];
  nativeVlan?: number;
  stpState?: StpPortState;
  stpRole?: StpPortRole;
};

export type EthernetFrameSummary = {
  id: string;
  destinationMac: MacAddress;
  sourceMac: MacAddress;
  etherType: EtherType;
  vlanTag?: VlanTag;
  payloadBytes: number;
  fcs: string;
};

export type MacForwardingAction = "learn" | "forward" | "flood" | "filter" | "drop";

export type MacForwardingDecision = {
  id: string;
  ingressInterfaceId: string;
  sourceMac: MacAddress;
  destinationMac: MacAddress;
  vlanId?: number;
  action: MacForwardingAction;
  egressInterfaceIds: string[];
  reason: "source-learning" | "unicast-hit" | "unknown-unicast" | "broadcast" | "stp-blocked" | "fcs-error";
};

export type BroadcastDomain = {
  id: string;
  vlanId?: number;
  name: string;
  interfaceIds: string[];
};

export type VlanMembership = {
  vlanId: number;
  name: string;
  accessInterfaceIds: string[];
  trunkInterfaceIds: string[];
  nativeInterfaceIds?: string[];
};

export type LinkLayerProcessStepId =
  | "recover-bit-stream"
  | "find-preamble"
  | "find-sfd"
  | "strip-preamble-sfd"
  | "assemble-mac-frame"
  | "read-destination-mac"
  | "read-source-mac"
  | "read-vlan-tag"
  | "read-type-or-length"
  | "read-payload"
  | "read-fcs"
  | "verify-fcs"
  | "drop-corrupted-frame"
  | "accept-frame"
  | "learn-source-mac"
  | "lookup-destination-mac"
  | "apply-vlan-rules"
  | "apply-stp-state"
  | "forward-frame"
  | "flood-frame"
  | "filter-frame"
  | "drop-frame";

export type NetworkLayerName = "physical" | "data-link";

export type DataLinkProcessDirection = "send" | "receive";

export type DataLinkActor = "host" | "switch" | "router";

export type DataLinkDataKind =
  | "upper-payload"
  | "bit-stream"
  | "ethernet-frame"
  | "ppp-frame"
  | "forward-decision"
  | "drop-decision";

export type DataLinkDataRef = {
  kind: DataLinkDataKind;
  label: string;
  detail?: string;
};

export type LinkLayerProcessStepStatus = "pending" | "active" | "done" | "failed" | "skipped";

export type LayeredReceiveProcessStep = {
  id: LinkLayerProcessStepId;
  layer: NetworkLayerName;
  title: string;
  description: string;
  input?: string;
  output?: string;
  status: LinkLayerProcessStepStatus;
};

export type LayeredReceiveProcess = {
  id: string;
  title: string;
  direction?: DataLinkProcessDirection;
  actor?: DataLinkActor;
  input?: DataLinkDataRef;
  output?: DataLinkDataRef;
  ingressInterfaceId: string;
  frameId: string;
  steps: LayeredReceiveProcessStep[];
};

export type DataLinkProcess = Omit<LayeredReceiveProcess, "direction" | "actor" | "input" | "output"> & {
  direction: DataLinkProcessDirection;
  actor: DataLinkActor;
  input: DataLinkDataRef;
  output: DataLinkDataRef;
};

export type LinkLayerProcessStep = LayeredReceiveProcessStep;

export type LinkLayerProcess = LayeredReceiveProcess;
