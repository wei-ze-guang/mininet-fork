import type { EndpointDevice, RoutedDevice } from "./types";

export const demoPc: EndpointDevice = {
  id: "h11",
  name: "h11",
  kind: "pc",
  status: "activity",
  ip: "10.0.1.11",
  mac: "02:42:0a:00:01:0b",
  rxPackets: 1248,
  txPackets: 932,
  interfaces: [
    {
      id: "h11-eth0",
      name: "eth0",
      ip: "10.0.1.11/24",
      mac: "02:42:0a:00:01:0b",
      status: "activity",
    },
  ],
};

export const demoPhone: EndpointDevice = {
  id: "phone1",
  name: "phone1",
  kind: "phone",
  status: "link",
  ip: "10.0.1.31",
  mac: "02:42:0a:00:01:31",
  rxPackets: 384,
  txPackets: 228,
  interfaces: [
    {
      id: "phone1-wlan0",
      name: "wlan0",
      ip: "10.0.1.31/24",
      mac: "02:42:0a:00:01:31",
      status: "link",
    },
  ],
};

export const demoServer: EndpointDevice = {
  id: "srv1",
  name: "srv1",
  kind: "server",
  status: "link",
  ip: "10.0.2.20",
  mac: "02:42:0a:00:02:20",
  rxPackets: 4808,
  txPackets: 5120,
  interfaces: [
    {
      id: "srv1-eth0",
      name: "eth0",
      ip: "10.0.2.20/24",
      mac: "02:42:0a:00:02:20",
      status: "link",
    },
  ],
};

export const demoGateway: RoutedDevice = {
  id: "r1",
  name: "r1",
  kind: "router",
  role: "gateway",
  status: "activity",
  gatewayInterfaceIp: "10.0.1.1",
  rxPackets: 6200,
  txPackets: 6128,
  interfaces: [
    {
      id: "r1-eth0",
      name: "eth0",
      ip: "10.0.1.1/24",
      mac: "02:42:0a:00:01:01",
      status: "activity",
    },
    {
      id: "r1-eth1",
      name: "eth1",
      ip: "10.0.2.1/24",
      mac: "02:42:0a:00:02:01",
      status: "link",
    },
  ],
};

export const demoNatRouter: RoutedDevice = {
  id: "edge-1",
  name: "edge-1",
  kind: "router",
  role: "nat",
  status: "link",
  upstreamNextHopIp: "203.0.113.1",
  rxPackets: 9800,
  txPackets: 10012,
  interfaces: [
    {
      id: "edge-1-lan",
      name: "lan0",
      ip: "10.0.1.254/24",
      mac: "02:42:0a:00:01:fe",
      status: "link",
    },
    {
      id: "edge-1-wan",
      name: "wan0",
      ip: "203.0.113.10/24",
      mac: "02:42:cb:00:71:0a",
      status: "link",
    },
  ],
};
