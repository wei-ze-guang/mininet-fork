import type { SwitchDevice, SwitchPort } from "./types";

export function createDemoSwitch({
  name,
  modelName,
  portCount,
  connectedPorts,
  activePorts,
  errorPorts = [],
}: {
  name: string;
  modelName: string;
  portCount: number;
  connectedPorts: number[];
  activePorts: number[];
  errorPorts?: number[];
}): SwitchDevice {
  return {
    id: name,
    name,
    modelName,
    portCount,
    backplaneGbps: portCount * 2,
    powered: true,
    systemStatus: errorPorts.length > 0 ? "warning" : "normal",
    ports: createDemoPorts({ portCount, connectedPorts, activePorts, errorPorts }),
  };
}

export function createDemoPorts({
  portCount,
  connectedPorts,
  activePorts,
  errorPorts,
}: {
  portCount: number;
  connectedPorts: number[];
  activePorts: number[];
  errorPorts: number[];
}): SwitchPort[] {
  return Array.from({ length: portCount }, (_, index) => {
    const portIndex = index + 1;
    const connected = connectedPorts.includes(portIndex);
    const active = activePorts.includes(portIndex);
    const error = errorPorts.includes(portIndex);

    return {
      id: `port-${portIndex}`,
      name: `eth${portIndex}`,
      index: portIndex,
      kind: portIndex > 20 ? "sfp" : "rj45",
      connected,
      status: error ? "error" : active ? "activity" : connected ? "link" : "down",
      peerName: connected ? peerName(portIndex) : undefined,
      rxPackets: active ? 1200 + portIndex * 17 : undefined,
      txPackets: active ? 900 + portIndex * 11 : undefined,
    };
  });
}

function peerName(index: number) {
  if (index === 1) {
    return "r1-eth0";
  }

  return `h${index}-eth0`;
}
