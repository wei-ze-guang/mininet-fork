export type SwitchPortKind = "rj45" | "sfp";

export type SwitchPortStatus = "down" | "link" | "activity" | "error";

export type SwitchPort = {
  id: string;
  name: string;
  index: number;
  kind: SwitchPortKind;
  status: SwitchPortStatus;
  connected: boolean;
  peerName?: string;
  rxPackets?: number;
  txPackets?: number;
};

export type SwitchDevice = {
  id: string;
  name: string;
  modelName: string;
  portCount: number;
  backplaneGbps?: number;
  powered: boolean;
  systemStatus: "normal" | "warning" | "error";
  ports: SwitchPort[];
};
