import { Globe2, Route, TableProperties } from "lucide-react";

import { ArpTable, type ArpEntry } from "@/components/network-tables/arp-table";
import { NatTable, type NatEntry } from "@/components/network-tables/nat-table";
import { RouteTable, type RouteEntry } from "@/components/network-tables/route-table";
import { IcmpMessageCard } from "@/components/network-layer/icmp-message-card";
import { PrefixMatchView, type PrefixRouteCandidate } from "@/components/network-layer/prefix-match-view";
import { RoutingProtocolBadge } from "@/components/network-layer/routing-protocol-badge";
import { SubnetCard, type SubnetInfo } from "@/components/network-layer/subnet-card";
import { MechanismBadge } from "@/components/network-diagnostics/mechanism-badge";
import { PacketCard, type CapturedPduSummary } from "@/components/network-diagnostics/packet-card";
import { RoutedDeviceView } from "@/components/network-topology/routed-device-view";
import type { RoutedDevice } from "@/components/network-topology/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type RouterCompositionViewProps = {
  device: RoutedDevice;
  subnets: SubnetInfo[];
  routes: RouteEntry[];
  prefixCandidates: PrefixRouteCandidate[];
  arpEntries: ArpEntry[];
  natEntries?: NatEntry[];
  packet: CapturedPduSummary;
};

export function RouterCompositionView({
  device,
  subnets,
  routes,
  prefixCandidates,
  arpEntries,
  natEntries = [],
  packet,
}: RouterCompositionViewProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>路由器由哪些基础组件组成</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <CompositionItem icon={Globe2} title="接口与网关角色" detail="多个三层接口连接不同 IP 网络" />
          <CompositionItem icon={Route} title="路由决策" detail="路由表、最长前缀匹配、下一跳、出口接口" />
          <CompositionItem icon={TableProperties} title="辅助表与机制" detail="ARP 邻居、ICMP 控制、NAT 转换" />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <RoutedDeviceView device={device} selected />
        <div className="grid gap-4 md:grid-cols-2">
          {subnets.map((subnet) => (
            <SubnetCard key={subnet.cidr} subnet={subnet} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RouteTable entries={routes} />
        <PrefixMatchView destinationIp={packet.dstIp ?? "0.0.0.0"} routes={prefixCandidates} />
        <ArpTable entries={arpEntries} />
        <NatTable entries={natEntries} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>三层协议与机制</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <RoutingProtocolBadge protocol="CONNECTED" />
            <RoutingProtocolBadge protocol="STATIC" />
            <RoutingProtocolBadge protocol="OSPF" state="converging" />
            <MechanismBadge mechanism="NAT" />
            <MechanismBadge mechanism="ACL" />
          </CardContent>
        </Card>
        <IcmpMessageCard
          type="time-exceeded"
          code={0}
          sourceIp={device.interfaces[0]?.ip?.split("/")[0] ?? "10.0.1.1"}
          destinationIp={packet.srcIp ?? "10.0.1.11"}
        />
      </div>

      <PacketCard packet={packet} active />
    </div>
  );
}

function CompositionItem({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Globe2;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/25 p-3">
      <div className="mb-1 flex items-center gap-2">
        <Icon aria-hidden className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
