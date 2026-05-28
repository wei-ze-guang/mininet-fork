import type { BitStream, PhysicalLink, PhysicalPort, PhysicalSignal, PhysicalTransmission } from "./physical-types";

export const demoCopperPortA: PhysicalPort = {
  id: "h11-eth0",
  name: "eth0",
  deviceId: "h11",
  medium: "copper",
  connector: "rj45",
  duplex: "full-duplex",
  speedMbps: 1000,
  status: "activity",
};

export const demoCopperPortB: PhysicalPort = {
  id: "s1-eth3",
  name: "eth3",
  deviceId: "s1",
  medium: "copper",
  connector: "rj45",
  duplex: "full-duplex",
  speedMbps: 1000,
  status: "activity",
};

export const demoFiberPort: PhysicalPort = {
  id: "s1-sfp1",
  name: "sfp1",
  deviceId: "s1",
  medium: "fiber",
  connector: "sfp+",
  duplex: "full-duplex",
  speedMbps: 10000,
  status: "link",
};

export const demoWirelessPort: PhysicalPort = {
  id: "phone1-wlan0",
  name: "wlan0",
  deviceId: "phone1",
  medium: "wireless",
  connector: "wifi",
  duplex: "half-duplex",
  speedMbps: 300,
  status: "link",
};

export const demoLoopbackPort: PhysicalPort = {
  id: "h11-lo",
  name: "lo",
  deviceId: "h11",
  medium: "loopback",
  connector: "lo",
  duplex: "full-duplex",
  speedMbps: 0,
  status: "link",
};

export const demoVirtualPort: PhysicalPort = {
  id: "s1-tap0",
  name: "tap0",
  deviceId: "s1",
  medium: "virtual",
  connector: "tap",
  duplex: "full-duplex",
  speedMbps: 10000,
  status: "activity",
};

export const demoBitStream: BitStream = {
  id: "bits-1",
  bits: "10100110 01101001 11110000",
  bitRateMbps: 1000,
};

export const demoPhysicalSignal: PhysicalSignal = {
  id: "sig-1",
  bitStream: demoBitStream,
  encoding: "Manchester",
  symbolRateMbaud: 125,
  powerDbm: -3,
};

export const demoPhysicalLink: PhysicalLink = {
  id: "link-h11-s1",
  endpointA: demoCopperPortA,
  endpointB: demoCopperPortB,
  medium: {
    kind: "copper",
    label: "Cat6 双绞线",
    attenuationDb: 1.2,
    noiseDb: -42,
  },
  bandwidthMbps: 1000,
  propagationDelayMs: 0.03,
  bitErrorRate: 0.000001,
  status: "link",
};

export const demoTransmission: PhysicalTransmission = {
  id: "tx-1",
  link: demoPhysicalLink,
  fromPortId: "h11-eth0",
  toPortId: "s1-eth3",
  signal: demoPhysicalSignal,
  direction: "A_TO_B",
  startedAtMs: 12,
  endedAtMs: 13,
  result: "delivered",
};
