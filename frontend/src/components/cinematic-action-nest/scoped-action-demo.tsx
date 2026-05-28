"use client";

import {
  Check,
  CornerUpLeft,
  Layers,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Route,
  SkipBack,
  SkipForward,
  Zap,
} from "lucide-react";

import {
  createActionPluginRegistry,
  type ActionNodePlugin,
  type ActionRenderContext,
} from "./action-plugin";
import { type ActionNode as ActionTreeNode, type ActionRunnerSnapshot, type ActionStatus, useActionRunner } from "./action-runner";

const stageNodes = [
  {
    id: "physical",
    label: "物理层动作",
    role: "component",
    layer: "physical",
    kind: "stage-physical",
    summary: "01011010 -> bit stream",
    meta: { index: 0, tone: "cyan", icon: "zap", input: "01011010", output: "bit stream" },
  },
  {
    id: "link",
    label: "链路层动作",
    role: "component",
    layer: "link",
    kind: "stage-link",
    summary: "bit stream -> frame",
    meta: { index: 1, tone: "emerald", icon: "layers", input: "bit stream", output: "frame" },
  },
  {
    id: "next",
    label: "下一层动作",
    role: "component",
    kind: "stage-next",
    summary: "frame -> next object",
    meta: { index: 2, tone: "amber", icon: "route", input: "frame", output: "next object" },
  },
] satisfies ActionTreeNode<DemoData>[];

const nestedSteps = ["收到比特流", "数据链路层", "转发帧"];
const nestedActionIds = ["incoming-bits", "link-layer", "forward-frame"];
const secondActionIds = ["link-input-step", "ethernet-frame", "crc-check", "mac-lookup", "link-output-step"];

const actionTree = {
  id: "root",
  label: "当前动作容器",
  role: "component",
  kind: "action-container",
  children: [
    {
      id: "incoming-bits",
      label: "收到比特流",
      role: "data",
      layer: "physical",
      kind: "bit-stream",
      summary: "10110010",
      commit: appendCommit("收到比特流"),
      children: [
        { id: "bit-field-a", label: "1011", role: "field", layer: "physical", kind: "bits" },
        { id: "bit-field-b", label: "0010", role: "field", layer: "physical", kind: "bits" },
      ],
    },
    {
      id: "link-layer",
      label: "数据链路层",
      role: "component",
      layer: "link",
      kind: "layer",
      summary: "把比特流识别为以太网帧",
      input: {
        id: "link-layer-input",
        label: "输入：比特流",
        role: "input",
        layer: "link",
        kind: "interface",
        summary: "来自物理层的 0/1 比特流",
        children: [
          { id: "link-input-bits", label: "10110010", role: "data", layer: "physical", kind: "bit-stream" },
        ],
      },
      output: {
        id: "link-layer-output",
        label: "输出：以太网帧",
        role: "output",
        layer: "link",
        kind: "interface",
        summary: "准备交给下一跳或上一层的数据帧",
        children: [
          { id: "forwarded-ethernet-frame", label: "转发后的帧", role: "data", layer: "link", kind: "ethernet-frame" },
        ],
      },
      commit: appendCommit("链路层处理完成"),
      children: [
        {
          id: "link-input-step",
          label: "接收输入",
          role: "input",
          layer: "link",
          kind: "input-step",
          summary: "链路层从物理层接收比特流",
          commit: appendCommit("链路层接收输入"),
          children: [
            { id: "link-input-step-bits", label: "10110010", role: "data", layer: "physical", kind: "bit-stream" },
          ],
        },
        {
          id: "ethernet-frame",
          label: "以太网帧",
          role: "data",
          layer: "link",
          kind: "ethernet-frame",
          summary: "帧头 + 载荷 + FCS",
          commit: appendCommit("识别以太网帧"),
          children: [
            { id: "dst-mac", label: "目的 MAC", role: "field", layer: "link", kind: "mac-address" },
            { id: "src-mac", label: "源 MAC", role: "field", layer: "link", kind: "mac-address" },
            { id: "payload", label: "Payload", role: "field", layer: "link", kind: "payload" },
            { id: "fcs", label: "FCS", role: "field", layer: "link", kind: "checksum" },
          ],
        },
        { id: "crc-check", label: "CRC 校验", role: "operation", layer: "link", kind: "crc-check", commit: appendCommit("CRC 校验通过") },
        { id: "mac-lookup", label: "MAC 表查找", role: "operation", layer: "link", kind: "table-lookup", commit: appendCommit("MAC 表命中") },
        {
          id: "link-output-step",
          label: "输出结果",
          role: "output",
          layer: "link",
          kind: "output-step",
          summary: "链路层输出准备转发的以太网帧",
          commit: appendCommit("链路层输出结果"),
          children: [
            { id: "link-output-step-frame", label: "转发后的帧", role: "data", layer: "link", kind: "ethernet-frame" },
          ],
        },
      ],
    },
    { id: "forward-frame", label: "转发帧", role: "effect", layer: "link", kind: "forward", commit: appendCommit("帧已转发") },
  ],
} satisfies ActionTreeNode<DemoData>;

const initialDemoData = { committed: [] } satisfies DemoData;

type DemoData = {
  committed: string[];
};

function appendCommit(label: string) {
  return (data: unknown): DemoData => {
    const current = isDemoData(data) ? data : { committed: [] };
    return { committed: [...current.committed, label] };
  };
}

function isDemoData(data: unknown): data is DemoData {
  return typeof data === "object" && data !== null && Array.isArray((data as DemoData).committed);
}

type Runner = ActionRunnerSnapshot;
type LayoutNode = {
  depth: number;
  id: string;
  label: string;
  parentId?: string;
  x: number;
  y: number;
};

const defaultActionPlugin: ActionNodePlugin<DemoData> = {
  id: "default-action-node",
  match: () => true,
  renderExpanded: (ctx) => <DefaultExpandedNode ctx={ctx} />,
  renderFocused: (ctx) => <DefaultFocusedNode ctx={ctx} />,
  renderMiniMap: (ctx) => <DefaultMiniMapNode ctx={ctx} />,
  renderStage: (ctx) => <DefaultStageNode ctx={ctx} />,
};

const ethernetFramePlugin: ActionNodePlugin<DemoData> = {
  id: "ethernet-frame",
  match: (node) => node.kind === "ethernet-frame",
  renderExpanded: (ctx) => <DefaultExpandedNode ctx={ctx} />,
  renderFocused: (ctx) => <EthernetFrameFocusedNode ctx={ctx} />,
  renderMiniMap: (ctx) => <DefaultMiniMapNode ctx={ctx} />,
  renderStage: (ctx) => <DefaultStageNode ctx={ctx} />,
};

const actionPluginRegistry = createActionPluginRegistry<DemoData>([ethernetFramePlugin, defaultActionPlugin]);

export function ScopedActionDemo() {
  const runner = useActionRunner({
    root: actionTree,
    initialData: initialDemoData,
    stepMs: 620,
    pauseMs: 760,
  });
  const rootExpanded = runner.isExpanded("root");
  const secondExpanded = runner.isExpanded("link-layer");

  return (
    <section className={`nest-stage ${rootExpanded ? "is-root-expanded" : ""} ${secondExpanded ? "is-second-expanded" : ""}`}>
      <style>{styles}</style>

      <div className="nest-bg" />
      <div className="nest-grid" />

      <div className="nest-header">
        <div>
          <div className="nest-kicker">演示效果 / 浮层回退展开</div>
          <h2 className="nest-title">自动进入子组件，仍可暂停和回退</h2>
          <p className="nest-copy">
            保留居中展开的电影感：父动作播放到子组件时自动展开；用户可以随时暂停、上一步、下一步和重置稳定点。
          </p>
        </div>
        <ActionControls runner={runner} />
      </div>

      <div className="nest-scene">
        <AutoLayoutCanvas root={actionTree} runner={runner} />
        <PipelineRail />
        {stageNodes.map((node) => (
          <StageNode key={node.id} node={node} runner={runner} />
        ))}
        <CenterActionMachine runner={runner} />
      </div>
    </section>
  );
}

function ActionControls({ runner }: { runner: Runner }) {
  return (
    <div className="action-controls">
      <button className="control-button primary" onClick={runner.toggle} type="button">
        {runner.playing ? <Pause className="control-icon" /> : <Play className="control-icon" />}
        {runner.playing ? "全局暂停" : "全局继续"}
      </button>
      <button className="control-button" onClick={runner.stepBack} type="button">
        <SkipBack className="control-icon" />
        全局上一步
      </button>
      <button className="control-button" onClick={runner.stepForward} type="button">
        <SkipForward className="control-icon" />
        全局下一步
      </button>
      <button className="control-button" onClick={runner.reset} type="button">
        <RotateCcw className="control-icon" />
        全局重置
      </button>
      <div className="frame-counter">
        步骤 {runner.milestoneIndex + 1} / {runner.milestoneCount}
      </div>
    </div>
  );
}

function PipelineRail() {
  return (
    <div className="pipeline-rail">
      <div className="rail-base" />
      <div className="rail-light" />
      {["1", "0", "1", "0", "1", "1"].map((bit, index) => (
        <span className="rail-bit" style={{ animationDelay: `${index * 0.28}s` }} key={index}>
          {bit}
        </span>
      ))}
    </div>
  );
}

function createRenderContext(node: ActionTreeNode<DemoData>, runner: Runner): ActionRenderContext<DemoData> {
  const data = isDemoData(runner.data) ? runner.data : initialDemoData;

  return {
    active: runner.activeActionId === node.id,
    children: node.children ?? [],
    data,
    expanded: runner.isExpanded(node.id),
    input: node.input,
    node,
    output: node.output,
    runner,
    status: runner.getStatus(node.id),
  };
}

function StageIcon({ node }: { node: ActionTreeNode<DemoData> }) {
  const icon = typeof node.meta?.icon === "string" ? node.meta.icon : "";
  if (icon === "zap") {
    return <Zap className="node-icon" />;
  }
  if (icon === "route") {
    return <Route className="node-icon" />;
  }
  return <Layers className="node-icon" />;
}

function AutoLayoutCanvas({ root, runner }: { root: ActionTreeNode; runner: Runner }) {
  const layout = layoutActionTree(root);
  const nodeById = new Map(layout.map((node) => [node.id, node]));
  const activeNode = runner.activeActionId ? nodeById.get(runner.activeActionId) : undefined;
  const activeAction = runner.activeActionId ? runner.getNode(runner.activeActionId) : undefined;

  return (
    <div className="auto-canvas">
      <div className="canvas-head">
        <span>全局动作画布</span>
        <strong>{activeAction?.role ? `${activeAction.role} / ${activeNode?.label ?? ""}` : activeNode?.label ?? "等待进入"}</strong>
      </div>
      <svg className="canvas-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {layout.flatMap((node) => {
          const parent = node.parentId ? nodeById.get(node.parentId) : undefined;
          if (!parent) {
            return [];
          }
          const active = runner.activePath.includes(node.id) && runner.activePath.includes(parent.id);
          return (
            <line
              className={`canvas-edge ${active ? "is-active" : ""}`}
              key={`${parent.id}-${node.id}`}
              x1={parent.x}
              x2={node.x}
              y1={parent.y}
              y2={node.y}
            />
          );
        })}
      </svg>
      {layout.map((node) => {
        const active = runner.activeActionId === node.id;
        const inPath = runner.activePath.includes(node.id);
        const done = runner.isDone(node.id);
        const actionNode = runner.getNode(node.id);

        if (!actionNode) {
          return null;
        }

        const plugin = actionPluginRegistry.resolve(actionNode);
        const ctx = createRenderContext(actionNode, runner);

        return (
          <div key={node.id} style={{ left: `${node.x}%`, top: `${node.y}%` }} className="canvas-node-anchor">
            {plugin?.renderMiniMap?.({ ...ctx, active: active || ctx.active }) ?? (
              <DefaultMiniMapNode ctx={{ ...ctx, active: active || ctx.active }} inPath={inPath} done={done} depth={node.depth} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StageNode({
  node,
  runner,
}: {
  node: ActionTreeNode<DemoData>;
  runner: Runner;
}) {
  const ctx = createRenderContext(node, runner);
  const plugin = actionPluginRegistry.resolve(node);

  return plugin?.renderStage?.(ctx) ?? <DefaultStageNode ctx={ctx} />;
}

function CenterActionMachine({ runner }: { runner: Runner }) {
  const rootStatus = runner.getStatus("root");
  const data = isDemoData(runner.data) ? runner.data : { committed: [] };
  const activeNode = runner.activeActionId ? runner.getNode(runner.activeActionId) : undefined;

  return (
    <div className={`center-machine status-${rootStatus}`}>
      <div className="machine-glow" />
      <div className="machine-card">
        <div className="machine-head">
          <div>
            <div className="machine-title">当前动作容器</div>
            <div className="machine-subtitle">center {"->"} expand {"->"} run {"->"} collapse</div>
          </div>
          <div className="machine-head-tools">
            <ScopeControls runner={runner} scopeId="root" label="本层" />
            <div className="machine-icons">
              <Maximize2 className="machine-icon expand-icon" />
              <Minimize2 className="machine-icon collapse-icon" />
            </div>
          </div>
        </div>

        <div className="machine-body">
          <div className="nested-rail" />
          <div className="nested-pulse" />
          <SecondLevelMachine runner={runner} />
          <div className="nested-grid">
            {nestedSteps.map((step, index) => (
              <div className={moduleClassName("nested-module", runner.getStatus(nestedActionIds[index]))} key={step}>
                <Check className="done-mark" />
                <div className="nested-index">
                  {index + 1}
                </div>
                <div className="nested-label">{step}</div>
              </div>
            ))}
          </div>

          <FocusNodeInspector node={activeNode} runner={runner} />

          <div className="io-panel">
            <div className="io-row">
              <span>动作输入</span>
              <span className="io-code input">{activeNode?.summary ?? runner.activeActionId ?? "object.in"}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" />
            </div>
            <div className="io-row output-row">
              <span>已提交数据</span>
              <span className="io-code output">{data.committed.length} 项</span>
            </div>
            <div className="commit-log">{data.committed.at(-1) ?? "等待第一个提交点"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusNodeInspector({ node, runner }: { node: ActionTreeNode | undefined; runner: Runner }) {
  if (!node) {
    return null;
  }

  const status = runner.getStatus(node.id);
  const plugin = actionPluginRegistry.resolve(node);
  const data = isDemoData(runner.data) ? runner.data : initialDemoData;
  const ctx = {
    active: runner.activeActionId === node.id,
    children: node.children ?? [],
    data,
    expanded: runner.isExpanded(node.id),
    input: node.input,
    node,
    output: node.output,
    runner,
    status,
  } satisfies ActionRenderContext<DemoData>;

  return plugin?.renderFocused?.(ctx) ?? null;
}

function DefaultFocusedNode({ ctx }: { ctx: ActionRenderContext<DemoData> }) {
  const { children, node, runner } = ctx;
  const interfaces = [ctx.input, ctx.output].filter((interfaceNode): interfaceNode is ActionTreeNode<DemoData> => Boolean(interfaceNode));

  return (
    <div className={`focus-inspector role-${node.role ?? "component"}`}>
      <FocusNodeHeader node={node} />
      <div className="focus-inspector-summary">{node.summary ?? "当前节点没有专门数据展示器，使用默认节点结构展示。"}</div>
      <FocusInterfaces interfaces={interfaces} />
      <FocusChildren nodes={children} runner={runner} />
    </div>
  );
}

function EthernetFrameFocusedNode({ ctx }: { ctx: ActionRenderContext<DemoData> }) {
  return (
    <div className="focus-inspector role-data ethernet-frame-plugin">
      <FocusNodeHeader node={ctx.node} />
      <div className="focus-inspector-summary">{ctx.node.summary ?? "以太网帧由 MAC 首部、载荷和 FCS 组成。"}</div>
      <div className="ethernet-frame-view">
        {ctx.children.map((field) => (
          <div className={`ethernet-field state-${ctx.runner.getStatus(field.id)}`} key={field.id}>
            <span>{field.kind ?? "field"}</span>
            <strong>{field.label}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function FocusNodeHeader({ node }: { node: ActionTreeNode }) {
  return (
    <div className="focus-inspector-head">
      <div>
        <span>{node.role ?? "component"}</span>
        {node.layer ? <span>{node.layer}</span> : null}
        {node.kind ? <span>{node.kind}</span> : null}
      </div>
      <strong>{node.label}</strong>
    </div>
  );
}

function FocusInterfaces({ interfaces }: { interfaces: ActionTreeNode<DemoData>[] }) {
  if (!interfaces.length) {
    return null;
  }

  return (
    <div className="focus-interfaces">
      {interfaces.map((interfaceNode) => (
        <div className={`focus-interface role-${interfaceNode.role ?? "component"}`} key={interfaceNode.id}>
          <div>
            <span>{interfaceNode.role ?? "interface"}</span>
            <strong>{interfaceNode.label}</strong>
          </div>
          <small>{interfaceNode.summary ?? interfaceNode.kind ?? "ActionNode interface"}</small>
        </div>
      ))}
    </div>
  );
}

function FocusChildren({ nodes, runner }: { nodes: ActionTreeNode<DemoData>[]; runner: Runner }) {
  if (!nodes.length) {
    return null;
  }

  return (
    <div className="focus-children">
      {nodes.map((child) => (
        <div className={`focus-child role-${child.role ?? "component"} state-${runner.getStatus(child.id)}`} key={child.id}>
          <span className="focus-child-dot" />
          <strong>{child.label}</strong>
          <small>{child.role ?? "component"}</small>
        </div>
      ))}
    </div>
  );
}

function DefaultMiniMapNode({
  ctx,
  depth = 0,
  done = false,
  inPath,
}: {
  ctx: ActionRenderContext<DemoData>;
  depth?: number;
  done?: boolean;
  inPath?: boolean;
}) {
  const path = inPath ?? ctx.runner.activePath.includes(ctx.node.id);
  const completed = done || ctx.runner.isDone(ctx.node.id);

  return (
    <div
      className={`canvas-node depth-${depth} role-${ctx.node.role ?? "component"} state-${ctx.status} ${ctx.active ? "is-active" : ""} ${path ? "is-path" : ""} ${completed ? "is-done" : ""}`}
    >
      <span className="canvas-node-dot" />
      <span className="canvas-node-label">{ctx.node.label}</span>
    </div>
  );
}

function DefaultExpandedNode({ ctx }: { ctx: ActionRenderContext<DemoData> }) {
  return (
    <div className={moduleClassName("second-step", ctx.status)}>
      <Check className="second-done-mark" />
      <span>{ctx.node.meta?.order ? String(ctx.node.meta.order) : "-"}</span>
      <strong>{ctx.node.label}</strong>
      <small>{ctx.node.role ?? "action"}</small>
    </div>
  );
}

function DefaultStageNode({ ctx }: { ctx: ActionRenderContext<DemoData> }) {
  const index = typeof ctx.node.meta?.index === "number" ? ctx.node.meta.index : 0;
  const tone = typeof ctx.node.meta?.tone === "string" ? ctx.node.meta.tone : "cyan";
  const input = typeof ctx.node.meta?.input === "string" ? ctx.node.meta.input : "in";
  const output = typeof ctx.node.meta?.output === "string" ? ctx.node.meta.output : "out";

  return (
    <div className={`action-node action-node-${index} tone-${tone}`}>
      <div className="node-shell">
        <StageIcon node={ctx.node} />
      </div>
      <div className="node-name">{ctx.node.label}</div>
      <div className="node-io">
        {input} {"->"} {output}
      </div>
    </div>
  );
}

function SecondLevelMachine({ runner }: { runner: Runner }) {
  const expanded = runner.isExpanded("link-layer");

  return (
    <div className={`second-machine ${expanded ? "is-expanded" : ""}`}>
      <div className="second-backdrop" />
      <div className="second-card">
        <div className="second-head">
          <div>
            <div className="second-title">二级动作：数据链路层内部</div>
            <div className="second-subtitle">组件自己展示数据结构，字段和操作也是节点</div>
          </div>
          <div className="second-head-tools">
            <ScopeControls runner={runner} scopeId="link-layer" label="链路层" />
            <CornerUpLeft className="second-return-icon" />
          </div>
        </div>
        <div className="second-body">
          {secondActionIds.map((actionId, index) => {
            const node = runner.getNode(actionId);
            if (!node) {
              return null;
            }
            const ctx = createRenderContext({ ...node, meta: { ...node.meta, order: index + 1 } }, runner);
            const plugin = actionPluginRegistry.resolve(node);
            return <div key={actionId}>{plugin?.renderExpanded?.(ctx) ?? <DefaultExpandedNode ctx={ctx} />}</div>;
          })}
        </div>
        <div className="return-path">
          <div className="return-dot" />
          <span>返回上层动作容器</span>
        </div>
      </div>
    </div>
  );
}

function ScopeControls({ runner, scopeId, label }: { runner: Runner; scopeId: string; label: string }) {
  const progress = runner.getScopeProgress(scopeId);

  return (
    <div className="scope-controls">
      <span className="scope-label">{label}</span>
      <button className="scope-button" onClick={() => runner.stepBackInScope(scopeId)} type="button" title={`${label}上一步`}>
        <SkipBack className="scope-icon" />
      </button>
      <button className="scope-button" onClick={() => runner.stepForwardInScope(scopeId)} type="button" title={`${label}下一步`}>
        <SkipForward className="scope-icon" />
      </button>
      <button className="scope-button" onClick={() => runner.resetScope(scopeId)} type="button" title={`重置${label}`}>
        <RotateCcw className="scope-icon" />
      </button>
      <span className="scope-count">
        {progress.current}/{progress.total}
      </span>
    </div>
  );
}

function moduleClassName(base: string, status: ActionStatus) {
  return `${base} state-${status}`;
}

function layoutActionTree(root: ActionTreeNode): LayoutNode[] {
  const nodes: LayoutNode[] = [];
  const maxDepth = getMaxDepth(root);

  placeNode(root, 0, 8, 92);
  return nodes;

  function placeNode(node: ActionTreeNode, depth: number, minX: number, maxX: number, parentId?: string) {
    const children = node.children ?? [];
    const x = children.length ? getChildrenCenter(children, minX, maxX) : (minX + maxX) / 2;
    const y = maxDepth === 0 ? 50 : 20 + (depth / maxDepth) * 64;
    nodes.push({ depth, id: node.id, label: node.label, parentId, x, y });

    if (!children.length) {
      return;
    }

    const totalLeaves = children.reduce((sum, child) => sum + getLeafCount(child), 0);
    let cursor = minX;
    for (const child of children) {
      const leafCount = getLeafCount(child);
      const width = ((maxX - minX) * leafCount) / totalLeaves;
      placeNode(child, depth + 1, cursor, cursor + width, node.id);
      cursor += width;
    }
  }

  function getChildrenCenter(children: ActionTreeNode[], minX: number, maxX: number) {
    if (children.length === 1) {
      return (minX + maxX) / 2;
    }
    return (minX + maxX) / 2;
  }
}

function getLeafCount(node: ActionTreeNode): number {
  if (!node.children?.length) {
    return 1;
  }
  return node.children.reduce((sum, child) => sum + getLeafCount(child), 0);
}

function getMaxDepth(node: ActionTreeNode): number {
  if (!node.children?.length) {
    return 0;
  }
  return 1 + Math.max(...node.children.map(getMaxDepth));
}

const styles = `
  .nest-stage {
    position: relative;
    min-height: 760px;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 10px;
    background: #0b1020;
    color: rgb(241, 245, 249);
    padding: 24px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.35);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .nest-bg,
  .nest-grid {
    position: absolute;
    inset: 0;
  }

  .nest-bg {
    background:
      radial-gradient(circle at 50% 45%, rgba(34,211,238,0.20), transparent 36%),
      radial-gradient(circle at 75% 20%, rgba(251,191,36,0.14), transparent 30%),
      linear-gradient(180deg, #111827, #070b13);
  }

  .nest-grid {
    opacity: 0.13;
    background-image:
      linear-gradient(rgba(148,163,184,0.38) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148,163,184,0.38) 1px, transparent 1px);
    background-size: 36px 36px;
  }

  .nest-header {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  .nest-kicker {
    color: rgba(165, 243, 252, 0.82);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.24em;
  }

  .nest-title {
    margin: 8px 0 0;
    color: rgb(248, 250, 252);
    font-size: 24px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: 0;
  }

  .nest-copy {
    margin: 10px 0 0;
    max-width: 760px;
    color: rgb(203, 213, 225);
    font-size: 14px;
    line-height: 1.65;
  }

  .nest-loop {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(103,232,249,0.2);
    border-radius: 8px;
    background: rgba(2,6,23,0.55);
    padding: 8px 12px;
    color: rgb(203,213,225);
    font-size: 12px;
    white-space: nowrap;
  }

  .nest-loop-icon {
    width: 16px;
    height: 16px;
    color: rgb(103,232,249);
  }

  .action-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
    max-width: 520px;
  }

  .control-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(103,232,249,0.22);
    border-radius: 8px;
    background: rgba(2,6,23,0.56);
    color: rgb(203,213,225);
    padding: 8px 10px;
    font: inherit;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    transition: border-color 160ms ease, background 160ms ease, color 160ms ease, transform 160ms ease;
  }

  .control-button:hover {
    border-color: rgba(103,232,249,0.55);
    background: rgba(8,47,73,0.75);
    color: rgb(240,253,250);
    transform: translateY(-1px);
  }

  .control-button.primary {
    border-color: rgba(45,212,191,0.62);
    background: rgba(20,184,166,0.18);
    color: rgb(204,251,241);
  }

  .control-icon {
    width: 14px;
    height: 14px;
  }

  .frame-counter {
    min-width: 58px;
    border: 1px solid rgba(148,163,184,0.22);
    border-radius: 8px;
    background: rgba(15,23,42,0.72);
    color: rgb(148,163,184);
    padding: 8px 10px;
    text-align: center;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
  }

  .nest-scene {
    position: relative;
    z-index: 10;
    height: 590px;
    margin-top: 40px;
  }

  .auto-canvas {
    position: absolute;
    left: 0;
    top: 4px;
    z-index: 4;
    width: min(430px, 42%);
    height: 250px;
    overflow: hidden;
    border: 1px solid rgba(148,163,184,0.20);
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(15,23,42,0.76), rgba(2,6,23,0.44));
    box-shadow: 0 18px 46px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
    backdrop-filter: blur(4px);
  }

  .canvas-head {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 10px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: rgb(148,163,184);
    font-size: 11px;
  }

  .canvas-head strong {
    overflow: hidden;
    color: rgb(226,232,240);
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .canvas-edges {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .canvas-edge {
    stroke: rgba(100,116,139,0.44);
    stroke-width: 0.36;
    transition: stroke 220ms ease, stroke-width 220ms ease, filter 220ms ease;
    vector-effect: non-scaling-stroke;
  }

  .canvas-edge.is-active {
    stroke: rgba(34,211,238,0.88);
    stroke-width: 0.72;
    filter: drop-shadow(0 0 4px rgba(34,211,238,0.8));
  }

  .canvas-node-anchor {
    position: absolute;
    z-index: 2;
    transform: translate(-50%, -50%);
  }

  .canvas-node {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 118px;
    min-height: 28px;
    border: 1px solid rgba(100,116,139,0.42);
    border-radius: 8px;
    background: rgba(15,23,42,0.86);
    color: rgb(148,163,184);
    padding: 5px 8px;
    font-size: 10px;
    font-weight: 750;
    line-height: 1;
    box-shadow: 0 10px 22px rgba(0,0,0,0.24);
    transform: scale(0.88);
    transform-origin: center;
    transition: border-color 220ms ease, background 220ms ease, color 220ms ease, opacity 220ms ease, transform 220ms ease, box-shadow 220ms ease;
  }

  .canvas-node.depth-0 {
    color: rgb(226,232,240);
    transform: scale(0.96);
  }

  .canvas-node.is-path {
    border-color: rgba(103,232,249,0.48);
    background: rgba(8,47,73,0.84);
    color: rgb(207,250,254);
    opacity: 1;
    transform: scale(1.02);
  }

  .canvas-node.is-active {
    border-color: rgba(34,211,238,0.95);
    background: linear-gradient(180deg, rgba(14,116,144,0.95), rgba(8,47,73,0.98));
    color: rgb(240,253,250);
    box-shadow: 0 0 28px rgba(34,211,238,0.28), 0 16px 34px rgba(0,0,0,0.34);
    transform: scale(1.18);
  }

  .canvas-node.is-done:not(.is-active) {
    border-color: rgba(34,197,94,0.44);
    background: rgba(20,83,45,0.34);
    color: rgb(187,247,208);
  }

  .canvas-node.role-data {
    border-style: dashed;
  }

  .canvas-node.role-input {
    border-color: rgba(96,165,250,0.42);
  }

  .canvas-node.role-output {
    border-color: rgba(52,211,153,0.44);
  }

  .canvas-node.role-field {
    border-radius: 999px;
    padding-inline: 10px;
  }

  .canvas-node.role-operation {
    border-color: rgba(251,191,36,0.40);
  }

  .canvas-node.role-effect {
    border-color: rgba(52,211,153,0.44);
  }

  .canvas-node-dot {
    width: 7px;
    height: 7px;
    flex: 0 0 auto;
    border-radius: 999px;
    background: rgb(100,116,139);
    box-shadow: 0 0 0 rgba(100,116,139,0);
  }

  .canvas-node.is-path .canvas-node-dot {
    background: rgb(34,211,238);
    box-shadow: 0 0 12px rgba(34,211,238,0.85);
  }

  .canvas-node.is-done:not(.is-active) .canvas-node-dot {
    background: rgb(34,197,94);
    box-shadow: 0 0 10px rgba(34,197,94,0.6);
  }

  .canvas-node.role-data .canvas-node-dot {
    background: rgb(96,165,250);
  }

  .canvas-node.role-input .canvas-node-dot {
    background: rgb(96,165,250);
  }

  .canvas-node.role-output .canvas-node-dot {
    background: rgb(52,211,153);
  }

  .canvas-node.role-field .canvas-node-dot {
    background: rgb(168,85,247);
  }

  .canvas-node.role-operation .canvas-node-dot {
    background: rgb(251,191,36);
  }

  .canvas-node-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pipeline-rail {
    position: absolute;
    left: 50%;
    top: 72px;
    width: 74%;
    height: 420px;
    transform: translateX(-50%);
  }

  .rail-base {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 4px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: rgba(51,65,85,0.72);
  }

  .rail-light {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 16px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, rgba(34,211,238,0.7), transparent);
    filter: blur(12px);
    animation: rail-breathe 3.8s ease-in-out infinite;
  }

  .rail-bit {
    position: absolute;
    top: calc(50% - 13px);
    display: grid;
    width: 26px;
    height: 26px;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(103,232,249,0.7);
    background: rgba(8,47,73,0.94);
    color: rgb(207,250,254);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    box-shadow: 0 0 18px rgba(34,211,238,0.74);
    animation: rail-bit 5.8s linear infinite;
  }

  .action-node {
    position: absolute;
    top: 192px;
    width: 180px;
    transform: translateX(-50%);
    animation: node-cycle 9s ease-in-out infinite;
  }

  .action-node-0 {
    left: 18%;
    animation-delay: 0s;
  }

  .action-node-1 {
    left: 50%;
    animation-delay: 3s;
  }

  .action-node-2 {
    left: 82%;
    animation-delay: 6s;
  }

  .node-shell {
    position: relative;
    display: grid;
    width: 78px;
    height: 78px;
    place-items: center;
    margin: 0 auto;
    border-radius: 18px;
    border: 1px solid rgba(148,163,184,0.4);
    background: linear-gradient(145deg, rgba(30,41,59,0.98), rgba(2,6,23,0.98));
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 38px rgba(0,0,0,0.38);
  }

  .node-icon {
    width: 28px;
    height: 28px;
  }

  .node-name {
    margin-top: 12px;
    text-align: center;
    color: rgb(248,250,252);
    font-size: 14px;
    font-weight: 800;
  }

  .node-io {
    margin-top: 4px;
    text-align: center;
    color: rgb(148,163,184);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
  }

  .tone-cyan .node-shell {
    color: rgb(103,232,249);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px rgba(34,211,238,0.18), 0 20px 38px rgba(0,0,0,0.38);
  }

  .tone-emerald .node-shell {
    color: rgb(110,231,183);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px rgba(16,185,129,0.18), 0 20px 38px rgba(0,0,0,0.38);
  }

  .tone-amber .node-shell {
    color: rgb(252,211,77);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px rgba(245,158,11,0.18), 0 20px 38px rgba(0,0,0,0.38);
  }

  .center-machine {
    position: absolute;
    left: 50%;
    top: 272px;
    width: 520px;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%) perspective(1000px) rotateX(7deg) scale(0.76);
    transform-origin: center top;
    transition: opacity 320ms ease, transform 420ms ease;
  }

  .center-machine.status-expanded,
  .center-machine.status-waiting-child,
  .center-machine.status-done,
  .center-machine.status-collapsing {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) perspective(1000px) rotateX(7deg) scale(1);
  }

  .center-machine.status-collapsing {
    opacity: 0;
    transform: translateX(-50%) perspective(1000px) rotateX(7deg) scale(0.72);
  }

  .machine-glow {
    position: absolute;
    inset: 12% 8%;
    border-radius: 24px;
    background: rgba(34,211,238,0.28);
    filter: blur(34px);
    animation: rail-breathe 2.2s ease-in-out infinite;
  }

  .machine-card {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(103,232,249,0.28);
    background: linear-gradient(180deg, rgba(30,41,59,0.97), rgba(2,6,23,0.98));
    box-shadow: 0 34px 82px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.12);
  }

  .machine-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(71,85,105,0.5);
    padding: 12px 20px;
  }

  .machine-title {
    color: rgb(248,250,252);
    font-size: 14px;
    font-weight: 800;
  }

  .machine-subtitle {
    margin-top: 2px;
    color: rgb(148,163,184);
    font-size: 11px;
  }

  .machine-icons {
    display: flex;
    gap: 8px;
    color: rgb(165,243,252);
  }

  .machine-head-tools,
  .second-head-tools {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .machine-icon {
    width: 16px;
    height: 16px;
  }

  .scope-controls {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: 1px solid rgba(148,163,184,0.24);
    border-radius: 8px;
    background: rgba(2,6,23,0.56);
    padding: 4px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  }

  .scope-label,
  .scope-count {
    color: rgb(148,163,184);
    font-size: 10px;
    line-height: 1;
    white-space: nowrap;
  }

  .scope-label {
    padding: 0 4px 0 5px;
  }

  .scope-count {
    min-width: 28px;
    border-left: 1px solid rgba(148,163,184,0.22);
    padding-left: 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .scope-button {
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border: 1px solid transparent;
    border-radius: 6px;
    background: rgba(15,23,42,0.7);
    color: rgb(203,213,225);
    cursor: pointer;
    transition: border-color 160ms ease, background 160ms ease, color 160ms ease, transform 160ms ease;
  }

  .scope-button:hover {
    border-color: rgba(103,232,249,0.55);
    background: rgba(8,47,73,0.9);
    color: rgb(240,253,250);
    transform: translateY(-1px);
  }

  .scope-icon {
    width: 12px;
    height: 12px;
  }

  .machine-body {
    position: relative;
    padding: 20px;
  }

  .nested-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .nested-rail {
    position: absolute;
    left: 44px;
    right: 44px;
    top: 54px;
    height: 2px;
    background: linear-gradient(90deg, rgba(34,211,238,0.2), rgba(34,211,238,0.9), rgba(16,185,129,0.8));
  }

  .nested-pulse {
    position: absolute;
    left: 38px;
    top: 43px;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: rgb(34,211,238);
    box-shadow: 0 0 26px rgba(34,211,238,0.95);
    opacity: 0.55;
    transition: left 420ms ease, opacity 220ms ease, transform 220ms ease;
  }

  .is-root-expanded .nested-pulse {
    opacity: 1;
  }

  .second-machine {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 8;
    width: 360px;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.58);
    transform-origin: center;
    transition: opacity 280ms ease, transform 360ms ease;
  }

  .second-machine.is-expanded {
    opacity: 1;
    pointer-events: auto;
    transform: translate(-50%, -50%) scale(1);
  }

  .second-backdrop {
    position: absolute;
    inset: -22px;
    border-radius: 22px;
    background: rgba(15,23,42,0.74);
    box-shadow: 0 0 0 999px rgba(2,6,23,0.28);
    backdrop-filter: blur(1px);
  }

  .second-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(251,191,36,0.35);
    border-radius: 11px;
    background: linear-gradient(180deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98));
    box-shadow: 0 26px 70px rgba(0,0,0,0.55), 0 0 34px rgba(251,191,36,0.16);
  }

  .second-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(100,116,139,0.45);
    padding: 12px 14px;
  }

  .second-title {
    color: rgb(254,243,199);
    font-size: 13px;
    font-weight: 800;
  }

  .second-subtitle {
    margin-top: 2px;
    color: rgb(148,163,184);
    font-size: 10px;
  }

  .second-return-icon {
    width: 18px;
    height: 18px;
    color: rgb(252,211,77);
    animation: return-icon-pulse 1.2s ease-in-out infinite;
  }

  .second-body {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    padding: 16px;
  }

  .second-body > div {
    min-width: 0;
  }

  .second-step {
    position: relative;
    display: grid;
    min-height: 82px;
    place-items: center;
    gap: 6px;
    border: 1px solid rgba(100,116,139,0.72);
    border-radius: 8px;
    background: rgba(2,6,23,0.72);
    color: rgb(226,232,240);
    padding: 10px;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    transition: border-color 220ms ease, background 220ms ease, box-shadow 220ms ease, transform 220ms ease;
  }

  .second-step.state-entering,
  .second-step.state-running {
    border-color: rgba(251,191,36,0.82);
    box-shadow: 0 0 20px rgba(251,191,36,0.20);
    transform: translateY(-4px);
  }

  .second-step.state-done,
  .second-step.state-exited {
    border-color: rgba(34,197,94,0.58);
    background: rgba(20,83,45,0.30);
    box-shadow: inset 0 0 0 1px rgba(34,197,94,0.14);
  }

  .second-done-mark {
    position: absolute;
    right: 6px;
    top: 6px;
    width: 13px;
    height: 13px;
    color: rgb(134,239,172);
    opacity: 0;
    transform: scale(0.55);
    filter: drop-shadow(0 0 6px rgba(34,197,94,0.8));
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .second-step.state-done .second-done-mark,
  .second-step.state-exited .second-done-mark {
    opacity: 1;
    transform: scale(1);
  }

  .second-step span {
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border-radius: 999px;
    background: rgba(251,191,36,0.18);
    color: rgb(254,243,199);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
  }

  .second-step strong {
    color: rgb(248,250,252);
    font-size: 11px;
  }

  .second-step small {
    color: rgb(148,163,184);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9px;
    text-transform: uppercase;
  }

  .return-path {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-top: 1px solid rgba(100,116,139,0.45);
    padding: 10px 14px;
    color: rgb(203,213,225);
    font-size: 11px;
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .second-machine:not(.is-expanded) .return-path {
    opacity: 1;
  }

  .return-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: rgb(251,191,36);
    box-shadow: 0 0 16px rgba(251,191,36,0.85);
  }

  .nested-module {
    position: relative;
    min-height: 92px;
    border-radius: 8px;
    border: 1px solid rgba(71,85,105,0.9);
    background: rgba(15,23,42,0.82);
    padding: 12px 8px;
    transition: border-color 220ms ease, background 220ms ease, box-shadow 220ms ease, transform 220ms ease;
  }

  .nested-module.state-entering,
  .nested-module.state-running,
  .nested-module.state-expanded,
  .nested-module.state-waiting-child {
    border-color: rgba(103,232,249,0.88);
    background: rgba(8,47,73,0.86);
    box-shadow: 0 0 22px rgba(34,211,238,0.24);
    transform: translateY(-6px);
  }

  .nested-module.state-done,
  .nested-module.state-exited {
    border-color: rgba(34,197,94,0.58);
    background: rgba(20,83,45,0.34);
    box-shadow: inset 0 0 0 1px rgba(34,197,94,0.14);
  }

  .done-mark {
    position: absolute;
    right: 7px;
    top: 7px;
    width: 14px;
    height: 14px;
    color: rgb(134,239,172);
    opacity: 0;
    transform: scale(0.55);
    filter: drop-shadow(0 0 6px rgba(34,197,94,0.8));
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .nested-module.state-done .done-mark,
  .nested-module.state-exited .done-mark {
    opacity: 1;
    transform: scale(1);
  }

  .nested-index {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    margin: 0 auto 8px;
    border: 1px solid rgba(103,232,249,0.3);
    border-radius: 6px;
    background: rgba(103,232,249,0.1);
    color: rgb(207,250,254);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
  }

  .nested-label {
    text-align: center;
    color: rgb(248,250,252);
    font-size: 11px;
    font-weight: 800;
  }

  .io-panel {
    margin-top: 20px;
    border: 1px solid rgba(71,85,105,0.5);
    border-radius: 8px;
    background: rgba(2,6,23,0.7);
    padding: 12px;
  }

  .focus-inspector {
    margin-top: 16px;
    border: 1px solid rgba(71,85,105,0.48);
    border-radius: 8px;
    background: rgba(2,6,23,0.62);
    padding: 12px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .focus-inspector.role-data {
    border-style: dashed;
    border-color: rgba(96,165,250,0.46);
    background: rgba(30,64,175,0.14);
  }

  .focus-inspector.role-field {
    border-color: rgba(168,85,247,0.42);
    background: rgba(88,28,135,0.14);
  }

  .focus-inspector.role-operation {
    border-color: rgba(251,191,36,0.40);
    background: rgba(120,53,15,0.14);
  }

  .focus-inspector.role-effect {
    border-color: rgba(52,211,153,0.42);
    background: rgba(6,78,59,0.14);
  }

  .focus-inspector-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .focus-inspector-head div {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .focus-inspector-head span {
    border: 1px solid rgba(148,163,184,0.22);
    border-radius: 999px;
    background: rgba(15,23,42,0.72);
    color: rgb(148,163,184);
    padding: 4px 7px;
    font-size: 9px;
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
  }

  .focus-inspector-head strong {
    overflow: hidden;
    color: rgb(248,250,252);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .focus-inspector-summary {
    margin-top: 8px;
    color: rgb(203,213,225);
    font-size: 11px;
    line-height: 1.55;
  }

  .focus-interfaces {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 10px;
  }

  .focus-interface {
    border: 1px solid rgba(100,116,139,0.42);
    border-radius: 8px;
    background: rgba(15,23,42,0.62);
    padding: 9px;
  }

  .focus-interface.role-input {
    border-color: rgba(96,165,250,0.44);
    background: rgba(30,64,175,0.16);
  }

  .focus-interface.role-output {
    border-color: rgba(52,211,153,0.44);
    background: rgba(6,78,59,0.16);
  }

  .focus-interface div {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .focus-interface span {
    border-radius: 999px;
    background: rgba(2,6,23,0.56);
    color: rgb(165,243,252);
    padding: 3px 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9px;
    line-height: 1;
    text-transform: uppercase;
  }

  .focus-interface strong {
    overflow: hidden;
    color: rgb(248,250,252);
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .focus-interface small {
    display: block;
    margin-top: 7px;
    color: rgb(148,163,184);
    font-size: 10px;
    line-height: 1.45;
  }

  .focus-children {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    margin-top: 10px;
  }

  .focus-child {
    position: relative;
    display: grid;
    min-height: 54px;
    align-content: center;
    gap: 5px;
    border: 1px solid rgba(100,116,139,0.46);
    border-radius: 8px;
    background: rgba(15,23,42,0.66);
    padding: 8px 8px 8px 22px;
  }

  .focus-child.state-entering,
  .focus-child.state-running,
  .focus-child.state-expanded,
  .focus-child.state-waiting-child {
    border-color: rgba(103,232,249,0.74);
    box-shadow: 0 0 18px rgba(34,211,238,0.16);
  }

  .focus-child.state-done,
  .focus-child.state-exited {
    border-color: rgba(34,197,94,0.48);
    background: rgba(20,83,45,0.24);
  }

  .focus-child-dot {
    position: absolute;
    left: 8px;
    top: 50%;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: rgb(100,116,139);
    transform: translateY(-50%);
  }

  .focus-child.role-data .focus-child-dot {
    background: rgb(96,165,250);
  }

  .focus-child.role-input .focus-child-dot {
    background: rgb(96,165,250);
  }

  .focus-child.role-output .focus-child-dot {
    background: rgb(52,211,153);
  }

  .focus-child.role-field .focus-child-dot {
    background: rgb(168,85,247);
  }

  .focus-child.role-operation .focus-child-dot {
    background: rgb(251,191,36);
  }

  .focus-child strong {
    overflow: hidden;
    color: rgb(248,250,252);
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .focus-child small {
    color: rgb(148,163,184);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9px;
    text-transform: uppercase;
  }

  .ethernet-frame-plugin {
    border-color: rgba(96,165,250,0.54);
  }

  .ethernet-frame-view {
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 1.7fr 0.9fr;
    gap: 6px;
    margin-top: 10px;
  }

  .ethernet-field {
    display: grid;
    min-height: 58px;
    align-content: center;
    gap: 6px;
    border: 1px solid rgba(96,165,250,0.34);
    border-radius: 8px;
    background: rgba(30,64,175,0.18);
    padding: 8px;
    text-align: center;
  }

  .ethernet-field.state-entering,
  .ethernet-field.state-running,
  .ethernet-field.state-expanded,
  .ethernet-field.state-waiting-child {
    border-color: rgba(103,232,249,0.78);
    box-shadow: 0 0 18px rgba(34,211,238,0.18);
  }

  .ethernet-field.state-done,
  .ethernet-field.state-exited {
    border-color: rgba(34,197,94,0.50);
    background: rgba(20,83,45,0.24);
  }

  .ethernet-field span {
    color: rgb(147,197,253);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9px;
    text-transform: uppercase;
  }

  .ethernet-field strong {
    color: rgb(248,250,252);
    font-size: 10px;
  }

  .io-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgb(203,213,225);
    font-size: 12px;
  }

  .output-row {
    margin-top: 8px;
  }

  .io-code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .io-code.input {
    color: rgb(165,243,252);
  }

  .io-code.output {
    color: rgb(167,243,208);
  }

  .commit-log {
    margin-top: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(148,163,184);
    font-size: 11px;
  }

  .progress-track {
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: rgb(30,41,59);
    margin-top: 8px;
  }

  .progress-fill {
    height: 100%;
    width: 0;
    border-radius: 999px;
    background: linear-gradient(90deg, rgb(34,211,238), rgb(16,185,129));
    box-shadow: 0 0 18px rgba(34,211,238,0.65);
    width: 0;
    transition: width 420ms ease;
  }

  .status-expanded .progress-fill {
    width: 18%;
  }

  .status-waiting-child .progress-fill {
    width: 58%;
  }

  .status-done .progress-fill,
  .status-collapsing .progress-fill {
    width: 100%;
  }

  .expand-icon {
    animation: icon-expand 9s ease-in-out infinite;
  }

  .collapse-icon {
    animation: icon-collapse 9s ease-in-out infinite;
  }

  @keyframes rail-breathe {
    0%, 100% { opacity: 0.34; }
    50% { opacity: 1; }
  }

  @keyframes rail-bit {
    0% { left: -2%; opacity: 0; transform: scale(0.72); }
    8% { opacity: 1; }
    92% { opacity: 1; }
    100% { left: 98%; opacity: 0; transform: scale(1.06); }
  }

  @keyframes node-cycle {
    0%, 100% { opacity: 0.58; transform: translateX(-50%) translateY(0) scale(0.94); filter: saturate(0.8); }
    18%, 48% { opacity: 1; transform: translateX(-50%) translateY(-36px) scale(1.14); filter: saturate(1.4); }
    58% { opacity: 0.72; transform: translateX(-50%) translateY(0) scale(0.96); }
  }

  @keyframes return-icon-pulse {
    0%, 44%, 100% { opacity: 0.4; transform: translateX(0); }
    48%, 55% { opacity: 1; transform: translateX(-4px); }
  }

  @keyframes icon-expand {
    0%, 16%, 72%, 100% { opacity: 0.35; }
    22%, 44% { opacity: 1; }
  }

  @keyframes icon-collapse {
    0%, 48%, 100% { opacity: 0.35; }
    58%, 70% { opacity: 1; }
  }
`;
