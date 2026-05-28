import type { StatusLedState } from "@/components/network-primitives/status-led";

export type NetworkDeviceKind = "pc" | "phone" | "server" | "switch" | "router";

export type NetworkDeviceRole =
  | "host"
  | "mobile"
  | "server"
  | "switch"
  | "router"
  | "gateway"
  | "firewall"
  | "nat";

export type NetworkInterfaceInfo = {
  id: string;
  name: string;
  ip?: string;
  mac?: string;
  status: StatusLedState;
};

export type NetworkDevice = {
  id: string;
  name: string;
  kind: NetworkDeviceKind;
  role?: NetworkDeviceRole;
  status: StatusLedState;
  ip?: string;
  mac?: string;
  defaultGatewayIp?: string;
  interfaces: NetworkInterfaceInfo[];
  rxPackets?: number;
  txPackets?: number;
};

export type EndpointDevice = NetworkDevice & {
  kind: "pc" | "phone" | "server";
};

export type RoutedDevice = NetworkDevice & {
  kind: "router";
  role?: "router" | "gateway" | "firewall" | "nat";
  gatewayInterfaceIp?: string;
  upstreamNextHopIp?: string;
};

export type CableLinkStatus = "down" | "link" | "activity" | "error";

export type CableLinkDirection = "none" | "forward" | "reverse" | "both";
