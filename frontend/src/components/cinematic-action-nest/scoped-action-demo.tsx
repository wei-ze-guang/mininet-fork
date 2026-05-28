"use client";

import { Check, ChevronLeft, ChevronRight, RotateCcw, Search, Server, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

import { type ActionRunnerSnapshot, type ActionStatus, useActionRunner } from "./action-runner";

const globalAction = {
  id: "global",
  label: "全局拓扑",
  children: [
    { id: "h1-send", label: "h1 发出数据" },
    { id: "switch-scope", label: "进入交换机" },
    { id: "h2-receive", label: "h2 收到数据" },
  ],
};

const switchAction = {
  id: "switch",
  label: "交换机内部",
  children: [
    { id: "port-in", label: "端口接收" },
    { id: "fcs-scope", label: "FCS 校验" },
    { id: "mac-lookup", label: "MAC 表查找" },
    { id: "port-out", label: "出口转发" },
  ],
};

const fcsAction = {
  id: "fcs",
  label: "FCS 内部",
  children: [
    { id: "read-frame", label: "读取帧字段" },
    { id: "crc-calc", label: "计算 CRC" },
    { id: "compare-fcs", label: "对比 FCS" },
    { id: "pass", label: "校验通过" },
  ],
};

const globalIds = ["h1-send", "switch-scope", "h2-receive"];
const switchIds = ["port-in", "fcs-scope", "mac-lookup", "port-out"];
const fcsIds = ["read-frame", "crc-calc", "compare-fcs", "pass"];

export function ScopedActionDemo() {
  const [scopeEpoch, setScopeEpoch] = useState({ switch: 0, fcs: 0 });
  const [openSwitch, setOpenSwitch] = useState(false);
  const [openFcs, setOpenFcs] = useState(false);

  const globalRunner = useActionRunner({ root: globalAction, autoPlay: false, loop: false });
  const switchRunner = useActionRunner({
    root: switchAction,
    autoPlay: false,
    initialData: { epoch: scopeEpoch.switch },
    loop: false,
  });
  const fcsRunner = useActionRunner({
    root: fcsAction,
    autoPlay: false,
    initialData: { epoch: scopeEpoch.fcs },
    loop: false,
  });

  function resetSwitchDescendants() {
    setOpenSwitch(false);
    setOpenFcs(false);
    setScopeEpoch((current) => ({ switch: current.switch + 1, fcs: current.fcs + 1 }));
  }

  function resetFcsDescendants() {
    setOpenFcs(false);
    setScopeEpoch((current) => ({ ...current, fcs: current.fcs + 1 }));
  }

  function globalPrevious() {
    globalRunner.stepBack();
    resetSwitchDescendants();
  }

  function globalReset() {
    globalRunner.reset();
    resetSwitchDescendants();
  }

  function switchPrevious() {
    switchRunner.stepBack();
    resetFcsDescendants();
  }

  function switchReset() {
    switchRunner.reset();
    resetFcsDescendants();
  }

  return (
    <section className="scope-stage">
      <style>{scopeStyles}</style>
      <div className="scope-bg" />
      <div className="scope-header">
        <div>
          <div className="scope-kicker">演示效果 / 多层作用域控制</div>
          <h2>父层回退时，子层直接清空</h2>
          <p>全局、交换机、FCS 各自有控制；父层上一步或重置时，下面展开的内部层会被丢弃。</p>
        </div>
      </div>

      <div className="scope-layout">
        <ScopePanel
          title="全局层"
          subtitle="h1 -> switch -> h2"
          runner={globalRunner}
          ids={globalIds}
          labels={["h1 发出", "交换机处理", "h2 收到"]}
          onNext={globalRunner.stepForward}
          onPrevious={globalPrevious}
          onReset={globalReset}
        />

        <div className="scope-actions">
          <button disabled={!globalRunner.isDone("switch-scope")} onClick={() => setOpenSwitch(true)} type="button">
            <Server className="scope-button-icon" />
            展开交换机层
          </button>
        </div>

        {openSwitch && globalRunner.isDone("switch-scope") ? (
          <ScopePanel
            title="交换机层"
            subtitle="端口 -> FCS -> MAC 表 -> 出口"
            runner={switchRunner}
            ids={switchIds}
            labels={["端口接收", "FCS 校验", "MAC 查表", "出口转发"]}
            onClose={() => setOpenSwitch(false)}
            onNext={switchRunner.stepForward}
            onPrevious={switchPrevious}
            onReset={switchReset}
            tone="emerald"
          />
        ) : (
          <EmptyScope text="全局完成“交换机处理”后，可以展开交换机内部。" />
        )}

        <div className="scope-actions">
          <button disabled={!openSwitch || !switchRunner.isDone("fcs-scope")} onClick={() => setOpenFcs(true)} type="button">
            <ShieldCheck className="scope-button-icon" />
            展开 FCS 层
          </button>
        </div>

        {openFcs && openSwitch && switchRunner.isDone("fcs-scope") ? (
          <ScopePanel
            title="FCS 层"
            subtitle="字段 -> CRC -> 对比 -> 通过"
            runner={fcsRunner}
            ids={fcsIds}
            labels={["读取字段", "计算 CRC", "对比 FCS", "校验通过"]}
            onClose={() => setOpenFcs(false)}
            onNext={fcsRunner.stepForward}
            onPrevious={fcsRunner.stepBack}
            onReset={fcsRunner.reset}
            tone="amber"
          />
        ) : (
          <EmptyScope text="交换机层完成“FCS 校验”后，可以展开 FCS 内部。" />
        )}
      </div>
    </section>
  );
}

function ScopePanel({
  ids,
  labels,
  onClose,
  onNext,
  onPrevious,
  onReset,
  runner,
  subtitle,
  title,
  tone = "cyan",
}: {
  ids: string[];
  labels: string[];
  onClose?: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  runner: ActionRunnerSnapshot;
  subtitle: string;
  title: string;
  tone?: "cyan" | "emerald" | "amber";
}) {
  return (
    <div className={`scope-panel tone-${tone}`}>
      <div className="scope-panel-head">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {onClose ? (
          <button className="scope-icon-button" onClick={onClose} type="button">
            <X className="scope-button-icon" />
          </button>
        ) : null}
      </div>

      <div className="scope-track">
        {ids.map((id, index) => (
          <div className={scopeNodeClass(runner.getStatus(id))} key={id}>
            <Check className="scope-done" />
            <span className="scope-node-index">{index + 1}</span>
            <strong>{labels[index]}</strong>
          </div>
        ))}
      </div>

      <div className="scope-control-row">
        <button onClick={onPrevious} type="button">
          <ChevronLeft className="scope-button-icon" />
          上一步
        </button>
        <button onClick={onNext} type="button">
          <ChevronRight className="scope-button-icon" />
          下一步
        </button>
        <button onClick={onReset} type="button">
          <RotateCcw className="scope-button-icon" />
          重置本层
        </button>
        <span>
          稳定点 {runner.milestoneIndex + 1} / {runner.milestoneCount}
        </span>
      </div>
    </div>
  );
}

function EmptyScope({ text }: { text: string }) {
  return (
    <div className="empty-scope">
      <Search className="empty-icon" />
      <span>{text}</span>
    </div>
  );
}

function scopeNodeClass(status: ActionStatus) {
  return `scope-node state-${status}`;
}

const scopeStyles = `
  .scope-stage {
    position: relative;
    min-height: 760px;
    overflow: hidden;
    border: 1px solid rgba(148,163,184,0.24);
    border-radius: 10px;
    background: #0b1020;
    color: rgb(241,245,249);
    padding: 24px;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .scope-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 16%, rgba(34,211,238,0.18), transparent 28%),
      radial-gradient(circle at 80% 32%, rgba(251,191,36,0.16), transparent 30%),
      linear-gradient(180deg, #111827, #070b13);
  }

  .scope-header,
  .scope-layout {
    position: relative;
    z-index: 1;
  }

  .scope-kicker {
    color: rgba(165,243,252,0.82);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.22em;
  }

  .scope-header h2 {
    margin: 8px 0 0;
    font-size: 24px;
    letter-spacing: 0;
  }

  .scope-header p {
    margin: 10px 0 0;
    max-width: 760px;
    color: rgb(203,213,225);
    font-size: 14px;
  }

  .scope-layout {
    display: grid;
    gap: 16px;
    margin-top: 28px;
  }

  .scope-panel,
  .empty-scope {
    border: 1px solid rgba(103,232,249,0.22);
    border-radius: 12px;
    background: rgba(2,6,23,0.72);
    box-shadow: 0 24px 70px rgba(0,0,0,0.28);
  }

  .scope-panel {
    padding: 16px;
  }

  .scope-panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .scope-panel h3 {
    margin: 0;
    font-size: 17px;
  }

  .scope-panel p {
    margin: 4px 0 0;
    color: rgb(148,163,184);
    font-size: 12px;
  }

  .scope-track {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
  }

  .scope-node {
    position: relative;
    display: grid;
    min-height: 92px;
    place-items: center;
    gap: 6px;
    border: 1px solid rgba(71,85,105,0.85);
    border-radius: 9px;
    background: rgba(15,23,42,0.86);
    padding: 12px;
    text-align: center;
    transition: 180ms ease;
  }

  .scope-node.state-entering,
  .scope-node.state-running,
  .scope-node.state-expanded,
  .scope-node.state-waiting-child {
    border-color: rgba(103,232,249,0.9);
    background: rgba(8,47,73,0.86);
    box-shadow: 0 0 24px rgba(34,211,238,0.24);
    transform: translateY(-4px);
  }

  .scope-node.state-done,
  .scope-node.state-exited {
    border-color: rgba(34,197,94,0.64);
    background: rgba(20,83,45,0.34);
  }

  .tone-emerald .scope-node.state-entering,
  .tone-emerald .scope-node.state-running,
  .tone-emerald .scope-node.state-expanded,
  .tone-emerald .scope-node.state-waiting-child {
    border-color: rgba(110,231,183,0.92);
    background: rgba(6,78,59,0.62);
  }

  .tone-amber .scope-node.state-entering,
  .tone-amber .scope-node.state-running,
  .tone-amber .scope-node.state-expanded,
  .tone-amber .scope-node.state-waiting-child {
    border-color: rgba(251,191,36,0.9);
    background: rgba(120,53,15,0.52);
  }

  .scope-node-index {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border-radius: 999px;
    background: rgba(103,232,249,0.12);
    color: rgb(207,250,254);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
  }

  .scope-node strong {
    font-size: 12px;
  }

  .scope-done {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 14px;
    height: 14px;
    color: rgb(134,239,172);
    opacity: 0;
  }

  .scope-node.state-done .scope-done,
  .scope-node.state-exited .scope-done {
    opacity: 1;
  }

  .scope-actions {
    display: flex;
    justify-content: center;
  }

  .scope-actions button,
  .scope-control-row button,
  .scope-icon-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(103,232,249,0.24);
    border-radius: 8px;
    background: rgba(15,23,42,0.82);
    color: rgb(203,213,225);
    padding: 8px 10px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .scope-actions button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .scope-button-icon {
    width: 14px;
    height: 14px;
  }

  .scope-control-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
  }

  .scope-control-row span {
    color: rgb(148,163,184);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
  }

  .empty-scope {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 118px;
    color: rgb(148,163,184);
    font-size: 13px;
  }

  .empty-icon {
    width: 18px;
    height: 18px;
  }
`;
