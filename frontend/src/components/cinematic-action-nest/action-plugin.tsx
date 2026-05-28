"use client";

import { type ReactNode } from "react";

import { type ActionNode, type ActionRunnerSnapshot, type ActionStatus } from "./action-runner";

export type ActionRenderContext<TData = unknown> = {
  active: boolean;
  children: ActionNode<TData>[];
  data: TData;
  expanded: boolean;
  input?: ActionNode<TData>;
  node: ActionNode<TData>;
  output?: ActionNode<TData>;
  runner: ActionRunnerSnapshot;
  status: ActionStatus;
};

export type ActionNodePlugin<TData = unknown> = {
  id: string;
  match: (node: ActionNode<TData>) => boolean;
  renderExpanded?: (ctx: ActionRenderContext<TData>) => ReactNode;
  renderFocused?: (ctx: ActionRenderContext<TData>) => ReactNode;
  renderMiniMap?: (ctx: ActionRenderContext<TData>) => ReactNode;
  renderStage?: (ctx: ActionRenderContext<TData>) => ReactNode;
};

export type ActionPluginRegistry<TData = unknown> = {
  register: (plugin: ActionNodePlugin<TData>) => void;
  resolve: (node: ActionNode<TData>) => ActionNodePlugin<TData> | undefined;
};

export function createActionPluginRegistry<TData = unknown>(plugins: ActionNodePlugin<TData>[] = []): ActionPluginRegistry<TData> {
  const registered = [...plugins];

  return {
    register(plugin) {
      registered.unshift(plugin);
    },
    resolve(node) {
      return registered.find((plugin) => plugin.match(node));
    },
  };
}
