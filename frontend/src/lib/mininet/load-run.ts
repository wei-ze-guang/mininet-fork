import type {
  EventRecord,
  MininetRunData,
  NetworkInterface,
  NetworkLink,
  NetworkNode,
  ReplayFrame,
  ReplayFrameRecord,
  RunMeta,
  RunSession,
  SnapshotIndex,
  SnapshotRecord,
  TimelinePayload,
  TopologyPayload,
  TraceRecord,
} from "./types";

const RUN_BASE_PATH = "/runs/latest";

async function readJson<T>(name: string): Promise<T> {
  const response = await fetch(`${RUN_BASE_PATH}/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${name}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function readNdjson<T>(name: string): Promise<T[]> {
  const response = await fetch(`${RUN_BASE_PATH}/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${name}: ${response.status}`);
  }
  const text = await response.text();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

export async function loadMininetRun(): Promise<MininetRunData> {
  const [
    meta,
    session,
    topology,
    timeline,
    snapshotIndex,
    snapshots,
    events,
    traces,
    frameRecords,
  ] = await Promise.all([
    readJson<RunMeta>("meta.json"),
    readJson<RunSession>("session.json"),
    readJson<TopologyPayload>("topology.json"),
    readJson<TimelinePayload>("timeline.json"),
    readJson<SnapshotIndex>("snapshot_index.json"),
    readNdjson<SnapshotRecord>("snapshots.ndjson"),
    readNdjson<EventRecord>("events.ndjson"),
    readNdjson<TraceRecord>("traces.ndjson"),
    readNdjson<ReplayFrameRecord>("replay_frames.ndjson"),
  ]);

  const interfaces = adaptInterfaces(topology);
  return {
    meta,
    session,
    topology,
    timeline,
    snapshotIndex,
    snapshots,
    events,
    traces,
    frames: adaptReplayFrames(frameRecords),
    nodes: adaptNodes(topology),
    interfaces,
    links: adaptLinks(topology, interfaces),
  };
}

function adaptNodes(topology: TopologyPayload): NetworkNode[] {
  return topology.nodes.map((node) => ({
    id: node.node_id,
    name: node.mn_name,
    type: node.kind,
    ipAddrs: node.ip_addrs,
    macAddrs: node.mac_addrs,
    data: node,
  }));
}

function adaptInterfaces(topology: TopologyPayload): NetworkInterface[] {
  return topology.interfaces.map((intf) => ({
    id: intf.intf_id,
    nodeId: intf.node_id,
    name: intf.mn_name,
    ipAddrs: intf.ip_addrs,
    mac: intf.mac,
    data: intf,
  }));
}

function adaptLinks(
  topology: TopologyPayload,
  interfaces: NetworkInterface[],
): NetworkLink[] {
  const intfById = new Map(interfaces.map((intf) => [intf.id, intf]));
  return topology.links.map((link) => {
    const fromInterface = intfById.get(link.a_intf_id);
    const toInterface = intfById.get(link.b_intf_id);
    return {
      id: link.link_id,
      from: fromInterface?.nodeId ?? link.a_intf_id,
      to: toInterface?.nodeId ?? link.b_intf_id,
      fromInterfaceId: link.a_intf_id,
      toInterfaceId: link.b_intf_id,
      data: link,
    };
  });
}

function adaptReplayFrames(frames: ReplayFrameRecord[]): ReplayFrame[] {
  return frames.map((frame) => ({
    index: frame.frame_index,
    ts: frame.ts,
    flowId: frame.flow_id,
    currentNodeId: frame.current_node,
    currentInterfaceId: frame.current_intf,
    path: frame.path,
    proto: frame.proto,
    data: frame,
  }));
}
