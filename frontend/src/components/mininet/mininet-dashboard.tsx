"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Box,
  Database,
  GitBranch,
  ListTree,
  Play,
  RotateCcw,
} from "lucide-react";

import { NetworkCanvas } from "@/components/mininet/network-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadMininetRun } from "@/lib/mininet/load-run";
import type {
  MininetRunData,
  NetworkLink,
  NetworkNode,
  ReplayFrame,
  SnapshotRecord,
  TimelineFlow,
} from "@/lib/mininet/types";
import { cn } from "@/lib/utils";

export function MininetDashboard() {
  const [run, setRun] = useState<MininetRunData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [selectedLinkId, setSelectedLinkId] = useState<string | undefined>();
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    loadMininetRun()
      .then((data) => {
        setRun(data);
        setSelectedNodeId(data.nodes[0]?.id);
        setSelectedFlowId(data.timeline.flows[0]?.flow_id);
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : String(cause));
      });
  }, []);

  const selectedFlow = useMemo(() => {
    return run?.timeline.flows.find((flow) => flow.flow_id === selectedFlowId);
  }, [run, selectedFlowId]);

  const flowFrames = useMemo(() => {
    if (!run || !selectedFlowId) {
      return [];
    }
    return run.frames.filter((frame) => frame.flowId === selectedFlowId);
  }, [run, selectedFlowId]);

  const activeFrame = flowFrames[Math.min(frameIndex, Math.max(flowFrames.length - 1, 0))];
  const selectedNode = run?.nodes.find((node) => node.id === selectedNodeId);
  const selectedLink = run?.links.find((link) => link.id === selectedLinkId);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>运行数据加载失败</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (!run) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="min-h-screen bg-muted/30 p-4 text-sm md:p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <Header run={run} />

        <div className="grid min-h-[720px] grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
          <Card className="min-h-[640px]">
            <CardHeader>
              <CardTitle>拓扑回放</CardTitle>
              <CardDescription>
                {selectedFlow ? compactFlowId(selectedFlow.flow_id) : "请选择一个流"}
              </CardDescription>
              <CardAction>
                <Badge variant={activeFrame?.proto === "ICMP" ? "default" : "secondary"}>
                  {activeFrame?.proto ?? "空闲"}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <NetworkCanvas
                nodes={run.nodes}
                links={run.links}
                activePath={activeFrame?.path}
                selectedNodeId={selectedNodeId}
                selectedLinkId={selectedLinkId}
                onNodeSelect={(node) => {
                  setSelectedNodeId(node.id);
                  setSelectedLinkId(undefined);
                }}
                onLinkSelect={(link) => {
                  setSelectedLinkId(link.id);
                  setSelectedNodeId(undefined);
                }}
              />
              <FrameControls
                frames={flowFrames}
                activeFrame={activeFrame}
                frameIndex={frameIndex}
                onFrameIndexChange={setFrameIndex}
              />
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-4">
            <FlowPanel
              flows={run.timeline.flows}
              selectedFlowId={selectedFlowId}
              onSelect={(flow) => {
                setSelectedFlowId(flow.flow_id);
                setFrameIndex(0);
              }}
            />
            <DetailsPanel
              run={run}
              node={selectedNode}
              link={selectedLink}
              activeFrame={activeFrame}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function Header({ run }: { run: MininetRunData }) {
  const stats = [
    { label: "节点", value: run.session.node_count, icon: Box },
    { label: "链路", value: run.session.link_count, icon: GitBranch },
    { label: "回放帧", value: run.session.frame_count, icon: Activity },
    { label: "快照", value: run.snapshotIndex.record_count, icon: Database },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mininet 运行查看器</CardTitle>
        <CardDescription>{run.session.run_id}</CardDescription>
        <CardAction>
          <Badge variant="outline">{new Date(run.session.started_at).toLocaleString()}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-lg border bg-background p-3">
              <stat.icon aria-hidden data-icon="inline-start" />
              <div>
                <div className="text-lg font-semibold leading-none">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FlowPanel({
  flows,
  selectedFlowId,
  onSelect,
}: {
  flows: TimelineFlow[];
  selectedFlowId?: string;
  onSelect: (flow: TimelineFlow) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>流列表</CardTitle>
        <CardDescription>已观测到 {flows.length} 条流</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px]">
          <div className="flex flex-col gap-2 pr-3">
            {flows.map((flow) => (
              <button
                key={flow.flow_id}
                className={cn(
                  "rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted",
                  selectedFlowId === flow.flow_id && "border-primary bg-primary/5",
                )}
                onClick={() => onSelect(flow)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{compactFlowId(flow.flow_id)}</span>
                  <Badge variant="secondary">{flow.proto ?? "流"}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <ListTree aria-hidden data-icon="inline-start" />
                  <span>{flow.path.map(shortNodeName).join(" -> ")}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {flow.frame_count} 帧
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function FrameControls({
  frames,
  activeFrame,
  frameIndex,
  onFrameIndexChange,
}: {
  frames: ReplayFrame[];
  activeFrame?: ReplayFrame;
  frameIndex: number;
  onFrameIndexChange: (index: number) => void;
}) {
  const max = Math.max(frames.length - 1, 0);

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            第 {frames.length ? frameIndex + 1 : 0}/{frames.length} 帧
          </Badge>
          <span className="text-xs text-muted-foreground">
            {activeFrame ? `${shortNodeName(activeFrame.currentNodeId)} @ ${activeFrame.ts.toFixed(3)}` : "暂无帧"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFrameIndexChange(0)}
            disabled={!frames.length}
          >
            <RotateCcw data-icon="inline-start" />
            重置
          </Button>
          <Button
            size="sm"
            onClick={() => onFrameIndexChange(Math.min(frameIndex + 1, max))}
            disabled={!frames.length || frameIndex >= max}
          >
            <Play data-icon="inline-start" />
            下一帧
          </Button>
        </div>
      </div>
      <input
        className="mt-3 w-full accent-current"
        type="range"
        min={0}
        max={max}
        value={Math.min(frameIndex, max)}
        disabled={!frames.length}
        onChange={(event) => onFrameIndexChange(Number(event.target.value))}
      />
    </div>
  );
}

function DetailsPanel({
  run,
  node,
  link,
  activeFrame,
}: {
  run: MininetRunData;
  node?: NetworkNode;
  link?: NetworkLink;
  activeFrame?: ReplayFrame;
}) {
  const snapshots = useMemo(() => {
    if (!node) {
      return [];
    }
    return run.snapshots.filter((snapshot) => snapshot.node_id === node.id);
  }, [node, run.snapshots]);

  return (
    <Card className="min-h-[360px]">
      <CardHeader>
        <CardTitle>详情</CardTitle>
        <CardDescription>
          {node ? node.name : link ? "已选择链路" : activeFrame ? "当前回放帧" : "请选择拓扑元素"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="selection">
          <TabsList>
            <TabsTrigger value="selection">选中项</TabsTrigger>
            <TabsTrigger value="snapshots">快照</TabsTrigger>
            <TabsTrigger value="event">回放帧</TabsTrigger>
          </TabsList>
          <TabsContent value="selection">
            {node ? <NodeDetails node={node} snapshots={snapshots} /> : null}
            {link ? <LinkDetails link={link} run={run} /> : null}
            {!node && !link ? <EmptyDetails /> : null}
          </TabsContent>
          <TabsContent value="snapshots">
            <SnapshotTable snapshots={snapshots} />
          </TabsContent>
          <TabsContent value="event">
            <FrameDetails frame={activeFrame} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function NodeDetails({ node, snapshots }: { node: NetworkNode; snapshots: SnapshotRecord[] }) {
  return (
    <div className="flex flex-col gap-3 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{node.name}</div>
          <div className="text-xs text-muted-foreground">{node.id}</div>
        </div>
        <Badge>{node.type}</Badge>
      </div>
      <Separator />
      <KeyValue label="IP 地址" value={node.ipAddrs.join(", ") || "无"} />
      <KeyValue label="MAC 地址" value={node.macAddrs.join(", ") || "无"} />
      <KeyValue label="快照表" value={snapshots.map((snapshot) => snapshot.table).join(", ") || "无"} />
    </div>
  );
}

function LinkDetails({ link, run }: { link: NetworkLink; run: MininetRunData }) {
  const from = run.nodes.find((node) => node.id === link.from);
  const to = run.nodes.find((node) => node.id === link.to);
  return (
    <div className="flex flex-col gap-3 pt-3">
      <KeyValue label="起点" value={`${from?.name ?? link.from} (${shortInterfaceName(link.fromInterfaceId)})`} />
      <KeyValue label="终点" value={`${to?.name ?? link.to} (${shortInterfaceName(link.toInterfaceId)})`} />
      <KeyValue label="链路 ID" value={link.id} />
    </div>
  );
}

function SnapshotTable({ snapshots }: { snapshots: SnapshotRecord[] }) {
  if (!snapshots.length) {
    return <EmptyDetails />;
  }
  return (
    <ScrollArea className="h-[260px] pt-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>表</TableHead>
            <TableHead>记录数</TableHead>
            <TableHead>时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {snapshots.map((snapshot) => (
            <TableRow key={`${snapshot.node_id}-${snapshot.table}`}>
              <TableCell>{snapshot.table}</TableCell>
              <TableCell>{snapshot.data.length}</TableCell>
              <TableCell>{snapshot.ts.toFixed(3)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

function FrameDetails({ frame }: { frame?: ReplayFrame }) {
  if (!frame) {
    return <EmptyDetails />;
  }
  const event = frame.data.context?.event;
  return (
    <div className="flex flex-col gap-3 pt-3">
      <KeyValue label="流" value={frame.flowId} />
      <KeyValue label="当前节点" value={shortNodeName(frame.currentNodeId)} />
      <KeyValue label="接口" value={frame.currentInterfaceId ? shortInterfaceName(frame.currentInterfaceId) : "无"} />
      <KeyValue label="路径" value={frame.path.map(shortNodeName).join(" -> ")} />
      <Separator />
      <KeyValue label="事件" value={event?.raw ?? "无"} />
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-mono text-xs">{value}</div>
    </div>
  );
}

function EmptyDetails() {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
      暂无选中内容
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <Skeleton className="h-36" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
          <Skeleton className="h-[640px]" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[340px]" />
            <Skeleton className="h-[360px]" />
          </div>
        </div>
      </div>
    </main>
  );
}

function compactFlowId(flowId: string) {
  return flowId.replace(/^icmp:/, "ICMP ").replace(/^arp:/, "ARP ");
}

function shortNodeName(nodeId: string) {
  return nodeId.split(":").at(-1) ?? nodeId;
}

function shortInterfaceName(intfId: string) {
  return intfId.split(":").at(-1) ?? intfId;
}
