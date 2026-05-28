import { Globe2, Network, Router, Server, Shield, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { NetworkDeviceRole } from "./types";

export type DeviceRoleBadgeProps = {
  role: NetworkDeviceRole;
};

export function DeviceRoleBadge({ role }: DeviceRoleBadgeProps) {
  const Icon = roleIcons[role] ?? Network;

  return (
    <Badge variant="outline" className="gap-1">
      <Icon aria-hidden className="size-3" />
      {roleText(role)}
    </Badge>
  );
}

function roleText(role: NetworkDeviceRole) {
  if (role === "gateway") {
    return "网关";
  }

  if (role === "router") {
    return "路由器";
  }

  if (role === "firewall") {
    return "防火墙";
  }

  if (role === "nat") {
    return "NAT";
  }

  if (role === "switch") {
    return "交换机";
  }

  if (role === "server") {
    return "服务器";
  }

  if (role === "mobile") {
    return "移动端";
  }

  return "主机";
}

const roleIcons = {
  host: Network,
  mobile: Smartphone,
  server: Server,
  switch: Network,
  router: Router,
  gateway: Globe2,
  firewall: Shield,
  nat: Globe2,
} satisfies Record<NetworkDeviceRole, typeof Network>;
