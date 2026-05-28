import { Cpu, HardDrive, Zap } from "lucide-react";

import { StatusLed } from "@/components/network-primitives/status-led";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PortArray } from "./port-array";
import type { SwitchDevice, SwitchPort } from "./types";

export type SwitchDeviceViewProps = {
  device: SwitchDevice;
  selectedPortId?: string;
  activePortIds?: string[];
  onPortSelect?: (port: SwitchPort) => void;
};

export function SwitchDeviceView({
  device,
  selectedPortId,
  activePortIds = [],
  onPortSelect,
}: SwitchDeviceViewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{device.name}</CardTitle>
            <div className="mt-1 text-sm text-muted-foreground">{device.modelName}</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <StatusLed
              status={device.powered ? "link" : "down"}
              label={device.powered ? "电源已接通" : "电源关闭"}
            />
            <Badge variant={device.systemStatus === "normal" ? "secondary" : "destructive"}>
              {device.systemStatus === "normal" ? "系统正常" : "系统异常"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-zinc-950 p-4 text-zinc-100 shadow-inner">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <HardDrive aria-hidden data-icon="inline-start" />
              <span>机箱 / 面板</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <Zap aria-hidden data-icon="inline-start" />
                <span>{device.powered ? "电源已接通" : "电源关闭"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu aria-hidden data-icon="inline-start" />
                <span>背板 {device.backplaneGbps ?? "-"} Gbps</span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-zinc-800 bg-zinc-900 p-2.5">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
              <span>端口阵列</span>
              <span>{device.portCount} 个端口</span>
            </div>
            <PortArray
              ports={device.ports}
              selectedPortId={selectedPortId}
              activePortIds={activePortIds}
              onPortSelect={onPortSelect}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
