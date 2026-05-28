export type NetworkNodeType = "host" | "router" | "switch" | "ovs" | "nat";

export type NetworkNode = {
  id: string;
  name: string;
  type: NetworkNodeType;
  ipAddrs: string[];
  macAddrs: string[];
  data: TopologyNode;
};

export type NetworkInterface = {
  id: string;
  nodeId: string;
  name: string;
  ipAddrs: string[];
  mac?: string | null;
  data: TopologyInterface;
};

export type NetworkLink = {
  id: string;
  from: string;
  to: string;
  fromInterfaceId: string;
  toInterfaceId: string;
  data: TopologyLink;
};

export type ReplayFrame = {
  index: number;
  ts: number;
  flowId: string;
  currentNodeId: string;
  currentInterfaceId?: string | null;
  path: string[];
  proto?: string | null;
  data: ReplayFrameRecord;
};

export type MininetRunData = {
  meta: RunMeta;
  session: RunSession;
  topology: TopologyPayload;
  timeline: TimelinePayload;
  snapshotIndex: SnapshotIndex;
  snapshots: SnapshotRecord[];
  events: EventRecord[];
  traces: TraceRecord[];
  frames: ReplayFrame[];
  nodes: NetworkNode[];
  interfaces: NetworkInterface[];
  links: NetworkLink[];
};

export type RunMeta = {
  run_id: string;
  started_at: string;
  sampler_interval_ms: number;
  packet_protocols: string[];
  packet_capture_mode?: string;
  version?: number;
};

export type RunSession = {
  run_id: string;
  started_at: string;
  packet_protocols: string[];
  sampler_interval_ms: number;
  node_count: number;
  interface_count: number;
  link_count: number;
  frame_count: number;
  first_frame_ts: number | null;
  last_frame_ts: number | null;
};

export type TopologyPayload = {
  nodes: TopologyNode[];
  interfaces: TopologyInterface[];
  links: TopologyLink[];
};

export type TopologyNode = {
  node_id: string;
  mn_name: string;
  kind: NetworkNodeType;
  ip_addrs: string[];
  mac_addrs: string[];
};

export type TopologyInterface = {
  intf_id: string;
  node_id: string;
  mn_name: string;
  mac?: string | null;
  ip_addrs: string[];
};

export type TopologyLink = {
  link_id: string;
  a_intf_id: string;
  b_intf_id: string;
};

export type TimelinePayload = {
  frame_count: number;
  flow_count: number;
  flows: TimelineFlow[];
};

export type TimelineFlow = {
  flow_id: string;
  proto?: string | null;
  started_at: number;
  ended_at: number;
  frame_count: number;
  source_node: string;
  final_destination: string;
  path: string[];
};

export type SnapshotIndex = {
  record_count: number;
  nodes: Record<string, SnapshotNodeIndex>;
  tables: Record<string, SnapshotTableSummary>;
};

export type SnapshotNodeIndex = {
  node_id: string;
  mn_name: string;
  kind: NetworkNodeType;
  tables: Record<string, SnapshotTableIndex>;
};

export type SnapshotTableIndex = {
  table: string;
  count: number;
  first_ts: number;
  last_ts: number;
  record_indexes: number[];
};

export type SnapshotTableSummary = {
  count: number;
  first_ts: number;
  last_ts: number;
};

export type SnapshotRecord = {
  ts: number;
  run_id: string;
  node_id: string;
  mn_name: string;
  kind: NetworkNodeType;
  table: string;
  data: unknown[];
};

export type EventRecord = {
  ts: number;
  run_id: string;
  flow_id: string;
  node_id: string;
  mn_name: string;
  intf_id: string;
  intf_name: string;
  proto: string;
  src_ip?: string | null;
  dst_ip?: string | null;
  src_port?: string | null;
  dst_port?: string | null;
  arp_op?: string | null;
  arp_sender_ip?: string | null;
  arp_target_ip?: string | null;
  raw?: string;
};

export type TraceRecord = {
  ts: number;
  run_id: string;
  flow_id: string;
  step_index: number;
  current_node: string;
  current_intf?: string | null;
  next_hop?: string | null;
  path: string[];
  final_destination?: string | null;
  evidence_sources: string[];
  confidence: string;
};

export type ReplayFrameRecord = TraceRecord & {
  frame_index: number;
  currentNode?: string;
  proto?: string | null;
  context?: {
    event?: EventRecord;
  };
};
