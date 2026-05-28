"use client";

import { Activity, Cpu, Network, Server } from "lucide-react";

import { StatusLed } from "@/components/network-primitives/status-led";

const bitTokens = ["1", "0", "1", "1", "0", "0", "1", "0"];
const modules = [
  { label: "端口接收", detail: "eth1 收到物理比特流", delay: "0.9s" },
  { label: "恢复成帧", detail: "识别帧边界与以太网首部", delay: "1.6s" },
  { label: "FCS 校验", detail: "CRC 检查通过", delay: "2.3s" },
  { label: "MAC 学习", detail: "源 MAC -> eth1", delay: "3.0s" },
  { label: "查表转发", detail: "目的 MAC 命中 eth2", delay: "3.7s" },
];

export function SwitchCutawayDemo() {
  return (
    <section className="relative min-h-[760px] overflow-hidden rounded-lg border bg-[#10141b] p-6 text-slate-100 shadow-2xl">
      <style>{cinematicStyles}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(20,184,166,0.20),transparent_30%),radial-gradient(circle_at_78%_30%,rgba(96,165,250,0.18),transparent_30%),linear-gradient(180deg,#121821_0%,#0d1117_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(148,163,184,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.32)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 flex items-start justify-between gap-6">
        <div>
          <div className="text-xs font-semibold tracking-[0.22em] text-cyan-200/80">演示效果 / 交换机剖面</div>
          <h2 className="mt-2 text-2xl font-bold tracking-normal">二层交换机正在处理一帧数据</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            缩小时是拓扑，数据进入设备时切到剖面视角：端口点亮、内部通道接通、二层处理模块依次工作。
          </p>
        </div>
        <div className="rounded-md border border-cyan-300/20 bg-slate-950/50 px-3 py-2 text-xs text-slate-300 shadow-lg shadow-cyan-950/30">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-cyan-300" />
            <span>自动循环播放</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 grid min-h-[560px] grid-cols-[180px_1fr_180px] items-center gap-6">
        <Endpoint name="h1" ip="10.0.0.11" mac="00:00:00:00:00:11" side="left" />

        <div className="relative h-[520px]">
          <PhysicalCable side="left" />
          <PhysicalCable side="right" reverse />
          <SwitchMachine />
        </div>

        <Endpoint name="h2" ip="10.0.0.21" mac="00:00:00:00:00:21" side="right" />
      </div>
    </section>
  );
}

function Endpoint({
  name,
  ip,
  mac,
  side,
}: {
  name: string;
  ip: string;
  mac: string;
  side: "left" | "right";
}) {
  return (
    <div className={`endpoint-card endpoint-${side}`}>
      <div className="relative mx-auto flex size-24 items-center justify-center rounded-lg border border-slate-500/50 bg-slate-900 shadow-2xl shadow-black/50">
        <div className="absolute -bottom-4 h-4 w-16 rounded-b-md border border-t-0 border-slate-500/50 bg-slate-800" />
        <Server className="size-10 text-cyan-200" />
        <span className="absolute right-2 top-2">
          <StatusLed status="activity" size="sm" />
        </span>
      </div>
      <div className="mt-7 text-center">
        <div className="text-lg font-bold">{name}</div>
        <div className="mt-1 font-mono text-xs text-cyan-200">{ip}</div>
        <div className="mt-1 font-mono text-[10px] text-slate-400">{mac}</div>
      </div>
    </div>
  );
}

function PhysicalCable({ side, reverse }: { side: "left" | "right"; reverse?: boolean }) {
  return (
    <div className={`cable cable-${side}`}>
      <div className="cable-core" />
      <div className="cable-glow" />
      {bitTokens.map((bit, index) => (
        <span
          className={`bit bit-${side}`}
          style={{ animationDelay: `${index * 0.22}s` }}
          key={`${side}-${index}`}
        >
          {reverse ? (bit === "1" ? "0" : "1") : bit}
        </span>
      ))}
      <div className="cable-label">{side === "left" ? "物理层 Cat6 / bit stream" : "eth2 输出比特流"}</div>
    </div>
  );
}

function SwitchMachine() {
  return (
    <div className="switch-perspective">
      <div className="switch-shadow" />
      <div className="switch-chassis">
        <div className="switch-face">
          <div className="flex items-center justify-between border-b border-slate-600/50 px-5 py-3">
            <div>
              <div className="text-sm font-bold text-slate-100">s1 / Open vSwitch</div>
              <div className="text-[11px] text-slate-400">二层转发剖面视图</div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-200">
              <StatusLed status="activity" size="sm" />
              Link / Act
            </div>
          </div>

          <div className="grid grid-cols-[86px_1fr_86px] gap-3 p-5">
            <PortColumn active label="eth1 入端口" />

            <div className="relative min-h-[330px] rounded-md border border-cyan-300/20 bg-slate-950/70 p-4 shadow-inner shadow-cyan-950/50">
              <div className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-cyan-300/25 shadow-[0_0_20px_rgba(34,211,238,0.35)]" />
              <div className="switching-pulse" />
              <FrameCard />
              <div className="mt-24 grid grid-cols-5 gap-2">
                {modules.map((module) => (
                  <ProcessModule key={module.label} {...module} />
                ))}
              </div>
              <MacTableDrawer />
            </div>

            <PortColumn active label="eth2 出端口" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PortColumn({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="text-[11px] text-slate-400">{label}</div>
      {[1, 2, 3, 4].map((port) => (
        <div
          className={`port-jack ${active && (port === 1 || port === 2) ? "port-active" : ""}`}
          key={port}
        >
          <span>{port}</span>
          <StatusLed status={active && port <= 2 ? "activity" : "down"} size="xs" />
        </div>
      ))}
    </div>
  );
}

function FrameCard() {
  return (
    <div className="frame-card">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-cyan-100">Ethernet Frame</span>
        <span className="rounded bg-emerald-400/15 px-2 py-0.5 text-[10px] text-emerald-200">FCS OK</span>
      </div>
      <div className="grid grid-cols-[1fr_1fr_0.7fr] overflow-hidden rounded border border-slate-600/50 font-mono text-[10px]">
        <div className="bg-sky-400/20 p-2 text-sky-100">Dst h2</div>
        <div className="bg-teal-400/20 p-2 text-teal-100">Src h1</div>
        <div className="bg-amber-400/20 p-2 text-amber-100">Type IP</div>
      </div>
    </div>
  );
}

function ProcessModule({ label, detail, delay }: { label: string; detail: string; delay: string }) {
  return (
    <div className="process-module" style={{ animationDelay: delay }}>
      <Cpu className="mx-auto mb-2 size-5 text-cyan-200" />
      <div className="text-center text-[11px] font-bold text-slate-100">{label}</div>
      <div className="mt-1 text-center text-[9px] leading-tight text-slate-400">{detail}</div>
    </div>
  );
}

function MacTableDrawer() {
  return (
    <div className="mac-drawer">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-cyan-100">
        <Network className="size-4" />
        MAC 地址表
      </div>
      <div className="space-y-1 font-mono text-[10px]">
        <div className="table-row table-row-learn">
          <span>00:...:11</span>
          <span>eth1</span>
        </div>
        <div className="table-row table-row-hit">
          <span>00:...:21</span>
          <span>eth2</span>
        </div>
      </div>
    </div>
  );
}

const cinematicStyles = `
  .endpoint-card {
    transform-style: preserve-3d;
    animation: endpoint-breathe 4.8s ease-in-out infinite;
  }

  .endpoint-left {
    animation-delay: 0.1s;
  }

  .endpoint-right {
    animation-delay: 1.4s;
  }

  .cable {
    position: absolute;
    top: 50%;
    width: 31%;
    height: 54px;
    transform: translateY(-50%);
  }

  .cable-left {
    left: 0;
  }

  .cable-right {
    right: 0;
  }

  .cable-core,
  .cable-glow {
    position: absolute;
    left: 0;
    right: 0;
    top: 24px;
    height: 8px;
    border-radius: 999px;
  }

  .cable-core {
    background: linear-gradient(90deg, rgba(15,23,42,0.2), rgba(34,211,238,0.9), rgba(15,23,42,0.2));
    border: 1px solid rgba(103,232,249,0.35);
  }

  .cable-glow {
    filter: blur(12px);
    background: rgba(34,211,238,0.55);
    animation: cable-throb 2.4s ease-in-out infinite;
  }

  .cable-label {
    position: absolute;
    left: 50%;
    top: 38px;
    transform: translateX(-50%);
    white-space: nowrap;
    color: rgba(203,213,225,0.72);
    font-size: 10px;
  }

  .bit {
    position: absolute;
    top: 7px;
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border-radius: 999px;
    background: rgba(8,47,73,0.92);
    border: 1px solid rgba(103,232,249,0.65);
    color: rgb(207,250,254);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    box-shadow: 0 0 18px rgba(34,211,238,0.7);
    opacity: 0;
  }

  .bit-left {
    animation: bit-left 2.8s linear infinite;
  }

  .bit-right {
    animation: bit-right 2.8s linear infinite;
    animation-delay: 3.1s;
  }

  .switch-perspective {
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(620px, 78%);
    transform: translate(-50%, -50%) perspective(1000px) rotateX(7deg);
    transform-style: preserve-3d;
  }

  .switch-shadow {
    position: absolute;
    inset: auto 8% -34px;
    height: 64px;
    border-radius: 999px;
    background: rgba(0,0,0,0.5);
    filter: blur(22px);
  }

  .switch-chassis {
    position: relative;
    border-radius: 10px;
    padding: 10px;
    background: linear-gradient(145deg, #475569, #111827 42%, #020617);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.18),
      0 34px 80px rgba(0,0,0,0.55),
      0 0 60px rgba(34,211,238,0.16);
  }

  .switch-face {
    overflow: hidden;
    border-radius: 7px;
    border: 1px solid rgba(148,163,184,0.28);
    background: linear-gradient(180deg, rgba(30,41,59,0.96), rgba(2,6,23,0.96));
  }

  .port-jack {
    display: flex;
    width: 58px;
    height: 34px;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    border: 1px solid rgba(71,85,105,0.9);
    background: linear-gradient(180deg, #020617, #1e293b);
    padding: 5px 7px;
    color: rgba(203,213,225,0.7);
    font-size: 10px;
    box-shadow: inset 0 4px 10px rgba(0,0,0,0.6);
  }

  .port-active {
    border-color: rgba(45,212,191,0.75);
    box-shadow: inset 0 4px 10px rgba(0,0,0,0.6), 0 0 18px rgba(45,212,191,0.28);
  }

  .switching-pulse {
    position: absolute;
    left: 6%;
    top: calc(50% - 12px);
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: rgb(34,211,238);
    box-shadow: 0 0 24px rgba(34,211,238,0.95);
    animation: switching-pulse 4.6s cubic-bezier(.4,0,.2,1) infinite;
  }

  .frame-card {
    position: absolute;
    left: 50%;
    top: 24px;
    width: 270px;
    transform: translateX(-50%);
    border: 1px solid rgba(103,232,249,0.35);
    border-radius: 8px;
    background: rgba(15,23,42,0.9);
    padding: 10px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.34), 0 0 30px rgba(34,211,238,0.14);
    animation: frame-pop 4.6s ease-in-out infinite;
  }

  .process-module {
    min-height: 96px;
    border-radius: 7px;
    border: 1px solid rgba(71,85,105,0.9);
    background: rgba(15,23,42,0.8);
    padding: 10px 6px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    animation: module-scan 4.6s ease-in-out infinite;
  }

  .mac-drawer {
    position: absolute;
    right: 20px;
    bottom: 18px;
    width: 168px;
    border-radius: 7px;
    border: 1px solid rgba(103,232,249,0.28);
    background: rgba(2,6,23,0.92);
    padding: 10px;
    box-shadow: 0 18px 35px rgba(0,0,0,0.35);
    animation: drawer-slide 4.6s ease-in-out infinite;
  }

  .table-row {
    display: flex;
    justify-content: space-between;
    border-radius: 4px;
    padding: 4px 6px;
    background: rgba(30,41,59,0.86);
    color: rgba(226,232,240,0.78);
  }

  .table-row-learn {
    animation: table-learn 4.6s ease-in-out infinite;
  }

  .table-row-hit {
    animation: table-hit 4.6s ease-in-out infinite;
  }

  @keyframes endpoint-breathe {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes cable-throb {
    0%, 100% { opacity: 0.42; }
    50% { opacity: 0.95; }
  }

  @keyframes bit-left {
    0% { left: -6%; opacity: 0; transform: scale(0.8); }
    12% { opacity: 1; }
    86% { opacity: 1; }
    100% { left: 96%; opacity: 0; transform: scale(1.08); }
  }

  @keyframes bit-right {
    0% { right: 96%; opacity: 0; transform: scale(0.8); }
    12% { opacity: 1; }
    86% { opacity: 1; }
    100% { right: -6%; opacity: 0; transform: scale(1.08); }
  }

  @keyframes switching-pulse {
    0%, 18% { left: 6%; opacity: 0; transform: scale(0.55); }
    28% { opacity: 1; transform: scale(1); }
    72% { left: 88%; opacity: 1; transform: scale(1); }
    84%, 100% { left: 88%; opacity: 0; transform: scale(0.62); }
  }

  @keyframes frame-pop {
    0%, 20%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.92); }
    30%, 78% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  @keyframes module-scan {
    0%, 100% {
      border-color: rgba(71,85,105,0.9);
      background: rgba(15,23,42,0.8);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
      transform: translateY(0);
    }
    10%, 22% {
      border-color: rgba(103,232,249,0.9);
      background: rgba(8,47,73,0.78);
      box-shadow: 0 0 24px rgba(34,211,238,0.28), inset 0 1px 0 rgba(255,255,255,0.12);
      transform: translateY(-5px);
    }
  }

  @keyframes drawer-slide {
    0%, 48%, 100% { opacity: 0.42; transform: translateX(20px); }
    58%, 84% { opacity: 1; transform: translateX(0); }
  }

  @keyframes table-learn {
    0%, 56%, 100% { background: rgba(30,41,59,0.86); }
    62%, 76% { background: rgba(16,185,129,0.26); color: rgb(209,250,229); }
  }

  @keyframes table-hit {
    0%, 66%, 100% { background: rgba(30,41,59,0.86); }
    72%, 88% { background: rgba(34,211,238,0.24); color: rgb(207,250,254); }
  }
`;
