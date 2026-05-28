"use client";

import { Network, PlugZap } from "lucide-react";
import { useMemo, useState } from "react";

import { MetricPill } from "@/components/network-primitives/metric-pill";
import { StatusLed } from "@/components/network-primitives/status-led";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { MacAddressTable, type MacTableEntry } from "./mac-address-table";
import { SwitchDeviceView } from "./switch-device-view";
import type { SwitchDevice, SwitchPort } from "./types";

export type SwitchInspectorPanelProps = {
  device: SwitchDevice;
  macEntries: MacTableEntry[];
  activePortIds?: string[];
  initialSelectedPortId?: string;
  className?: string;
};

export function SwitchInspectorPanel({
  device,
  macEntries,
  activePortIds = [],
  initialSelectedPortId,
  className,
}: SwitchInspectorPanelProps) {
  const [selectedPortId, setSelectedPortId] = useState(
    initialSelectedPortId ?? firstConnectedPort(device.ports)?.id ?? device.ports[0]?.id,
  );
  const selectedPort = device.ports.find((port) => port.id === selectedPortId);
  const selectedPortMacEntries = useMemo(
    () => macEntries.filter((entry) => entry.portId === selectedPort?.name),
    [macEntries, selectedPort?.name],
  );

  return (
    <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]", className)}>
      <SwitchDeviceView
        device={device}
        selectedPortId={selectedPortId}
        activePortIds={activePortIds}
        onPortSelect={(port) => setSelectedPortId(port.id)}
      />

      <div className="grid gap-4">
        <PortDetailCard
          port={selectedPort}
          learnedCount={selectedPortMacEntries.length}
          active={selectedPort ? activePortIds.includes(selectedPort.id) : false}
        />
        <MacAddressTable entries={macEntries} />
      </div>
    </div>
  );
}

function PortDetailCard({
  port,
  learnedCount,
  active,
}: {
  port?: SwitchPort;
  learnedCount: number;
  active: boolean;
}) {
  if (!port) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>端口详情</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">没有可查看的端口</CardContent>
      </Card>
    );
  }

  const effectiveStatus = active ? "activity" : port.status;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PlugZap aria-hidden className="size-4" />
              {port.name}
            </CardTitle>
            <div className="mt-1 text-sm text-muted-foreground">端口 {port.index}</div>
          </div>
          <Badge variant={port.connected ? "secondary" : "destructive"}>
            {port.connected ? "已接线" : "未接线"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <StatusLed status={effectiveStatus} label={statusText(effectiveStatus)} />
            <span>{statusText(effectiveStatus)}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{port.kind.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MetricPill label="RX" value={port.rxPackets ?? "-"} unit="pkt" icon="rx" tone="info" />
          <MetricPill label="TX" value={port.txPackets ?? "-"} unit="pkt" icon="tx" tone="good" />
        </div>

        <Separator />

        <div className="grid gap-2 text-sm">
          <InfoRow label="对端" value={port.peerName ?? "无"} />
          <InfoRow label="学习 MAC" value={`${learnedCount} 条`} />
          <InfoRow label="链路角色" value={port.peerName?.startsWith("r") ? "上联/网关" : "接入端"} />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Network aria-hidden className="size-3.5" />
        {label}
      </span>
      <span className="truncate font-mono text-xs">{value}</span>
    </div>
  );
}

function firstConnectedPort(ports: SwitchPort[]) {
  return ports.find((port) => port.connected);
}

function statusText(status: SwitchPort["status"]) {
  if (status === "down") {
    return "断开";
  }

  if (status === "link") {
    return "已连接";
  }

  if (status === "activity") {
    return "有流量";
  }

  return "错误";
}
