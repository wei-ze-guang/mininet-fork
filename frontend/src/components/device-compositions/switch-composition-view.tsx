"use client";

import { Cpu, HardDrive, Network } from "lucide-react";

import { BroadcastDomainBadge } from "@/components/network-link-layer/broadcast-domain-badge";
import { ErrorCheckBadge } from "@/components/network-link-layer/error-check-badge";
import { FrameBoundary, demoEthernetFrameFields } from "@/components/network-link-layer/frame-boundary";
import { StpStateBadge } from "@/components/network-link-layer/stp-state-badge";
import { MechanismBadge } from "@/components/network-diagnostics/mechanism-badge";
import { PacketQueue } from "@/components/network-topology/packet-queue";
import { VlanTable, type VlanEntry } from "@/components/network-tables/vlan-table";
import { MacAddressTable, type MacTableEntry } from "@/components/switch-inspector/mac-address-table";
import { SwitchInspectorPanel } from "@/components/switch-inspector/switch-inspector-panel";
import type { SwitchDevice } from "@/components/switch-inspector/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SwitchCompositionViewProps = {
  device: SwitchDevice;
  macEntries: MacTableEntry[];
  vlanEntries: VlanEntry[];
  activePortIds?: string[];
};

export function SwitchCompositionView({
  device,
  macEntries,
  vlanEntries,
  activePortIds,
}: SwitchCompositionViewProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>交换机由哪些基础组件组成</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <CompositionItem icon={HardDrive} title="物理躯体" detail="机箱、端口阵列、状态灯、背板带宽" />
          <CompositionItem icon={Network} title="二层逻辑" detail="MAC/FDB 表、VLAN 广播域、STP 端口状态" />
          <CompositionItem icon={Cpu} title="转发过程" detail="成帧、FCS 检测、查表、入队/出队" />
        </CardContent>
      </Card>

      <SwitchInspectorPanel
        device={device}
        macEntries={macEntries}
        activePortIds={activePortIds}
        initialSelectedPortId={activePortIds?.[0]}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <MacAddressTable entries={macEntries} title="MAC/FDB 表" />
        <VlanTable entries={vlanEntries} />
        <Card>
          <CardHeader>
            <CardTitle>二层机制</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <MechanismBadge mechanism="VLAN" />
            <MechanismBadge mechanism="STP" />
            <BroadcastDomainBadge domainId="bd-10" vlanId={10} portCount={4} />
            <StpStateBadge state="forwarding" role="designated" />
            <ErrorCheckBadge status="passed" />
          </CardContent>
        </Card>
        <PacketQueue
          name="eth1 输出队列"
          capacity={6}
          items={[
            { id: "pkt-1", bits: "1010", protocol: "ICMP", state: "processing" },
            { id: "pkt-2", bits: "0101", protocol: "ARP" },
            { id: "pkt-3", bits: "1110", protocol: "TCP" },
          ]}
        />
      </div>

      <FrameBoundary fields={demoEthernetFrameFields} fcsStatus="passed" />
    </div>
  );
}

function CompositionItem({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof HardDrive;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/25 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon aria-hidden className="size-4 text-muted-foreground" />
        <Badge variant="secondary">{title}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
