import type { PacketLayerBlockData } from "./packet-layer-block";

export const icmpPacketLayers: PacketLayerBlockData[] = [
  {
    id: "L2",
    name: "Ethernet Header",
    protocol: "Ethernet",
    fields: [
      { label: "dst", value: "02:42:0a:00:02:15" },
      { label: "src", value: "02:42:0a:00:01:0b" },
      { label: "type", value: "0x0800" },
    ],
  },
  {
    id: "L3",
    name: "IPv4 Header",
    protocol: "IPv4",
    fields: [
      { label: "src", value: "10.0.1.11" },
      { label: "dst", value: "10.0.2.21" },
      { label: "ttl", value: 63, changed: true },
    ],
    highlight: true,
  },
  {
    id: "L3-Control",
    name: "ICMP Control Message",
    protocol: "ICMP",
    fields: [
      { label: "type", value: "echo-request" },
      { label: "seq", value: 7 },
    ],
  },
  {
    id: "Payload",
    name: "Payload",
    protocol: "Payload",
    fields: [
      { label: "bytes", value: 56 },
      { label: "bits", value: "1010 0101" },
    ],
  },
];

export const tcpAssemblyLayers: PacketLayerBlockData[] = [
  {
    id: "Payload",
    name: "Application Payload",
    protocol: "Payload",
    fields: [
      { label: "message", value: "GET /" },
      { label: "bytes", value: 128 },
    ],
  },
  {
    id: "L4",
    name: "TCP Header",
    protocol: "TCP",
    fields: [
      { label: "srcPort", value: 53218 },
      { label: "dstPort", value: 443 },
    ],
    highlight: true,
  },
  {
    id: "L3",
    name: "IPv4 Header",
    protocol: "IPv4",
    fields: [
      { label: "src", value: "10.0.1.11" },
      { label: "dst", value: "198.51.100.20" },
      { label: "ttl", value: 64 },
    ],
  },
  {
    id: "L2",
    name: "Ethernet Header",
    protocol: "Ethernet",
    fields: [
      { label: "dst", value: "02:42:0a:00:01:01" },
      { label: "src", value: "02:42:0a:00:01:0b" },
      { label: "type", value: "0x0800" },
    ],
  },
];
