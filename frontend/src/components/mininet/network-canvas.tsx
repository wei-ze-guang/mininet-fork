"use client";

import { Network, Router, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NetworkLink, NetworkNode } from "@/lib/mininet/types";

type Point = {
  x: number;
  y: number;
};

export type NetworkCanvasProps = {
  nodes: NetworkNode[];
  links: NetworkLink[];
  activePath?: string[];
  selectedNodeId?: string;
  selectedLinkId?: string;
  onNodeSelect?: (node: NetworkNode) => void;
  onLinkSelect?: (link: NetworkLink) => void;
};

const WIDTH = 960;
const HEIGHT = 520;

export function NetworkCanvas({
  nodes,
  links,
  activePath = [],
  selectedNodeId,
  selectedLinkId,
  onNodeSelect,
  onLinkSelect,
}: NetworkCanvasProps) {
  const positions = layoutNodes(nodes, links);
  const activeEdges = new Set(
    activePath.slice(0, -1).map((nodeId, index) => edgeKey(nodeId, activePath[index + 1])),
  );

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-lg border bg-background">
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Mininet topology"
      >
        <defs>
          <marker
            id="active-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary" />
          </marker>
        </defs>

        {links.map((link) => {
          const from = positions.get(link.from);
          const to = positions.get(link.to);
          if (!from || !to) {
            return null;
          }
          const isActive = activeEdges.has(edgeKey(link.from, link.to));
          const isSelected = selectedLinkId === link.id;
          return (
            <g key={link.id}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={cn(
                  "stroke-border transition-all",
                  isActive && "stroke-primary",
                  isSelected && "stroke-foreground",
                )}
                strokeWidth={isActive || isSelected ? 4 : 2}
                markerEnd={isActive ? "url(#active-arrow)" : undefined}
              />
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="cursor-pointer stroke-transparent"
                strokeWidth={18}
                onClick={() => onLinkSelect?.(link)}
              />
            </g>
          );
        })}

        {nodes.map((node) => {
          const point = positions.get(node.id);
          if (!point) {
            return null;
          }
          const isActive = activePath.includes(node.id);
          const isSelected = selectedNodeId === node.id;
          return (
            <NodeGlyph
              key={node.id}
              node={node}
              point={point}
              active={isActive}
              selected={isSelected}
              onClick={() => onNodeSelect?.(node)}
            />
          );
        })}
      </svg>

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <Badge variant="secondary">{nodes.length} 个节点</Badge>
        <Badge variant="outline">{links.length} 条链路</Badge>
      </div>
    </div>
  );
}

function NodeGlyph({
  node,
  point,
  active,
  selected,
  onClick,
}: {
  node: NetworkNode;
  point: Point;
  active: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const size = node.type === "router" ? 42 : node.type === "ovs" || node.type === "switch" ? 38 : 34;

  return (
    <g
      className="cursor-pointer"
      transform={`translate(${point.x} ${point.y})`}
      onClick={onClick}
    >
      <circle
        r={size}
        className={cn(
          "fill-card stroke-border transition-all",
          active && "fill-primary/10 stroke-primary",
          selected && "stroke-foreground",
        )}
        strokeWidth={active || selected ? 4 : 2}
      />
      <foreignObject x={-14} y={-19} width={28} height={28}>
        <NodeIcon node={node} />
      </foreignObject>
      <text
        y={size + 18}
        textAnchor="middle"
        className="fill-foreground text-[13px] font-medium"
      >
        {node.name}
      </text>
      <text
        y={size + 34}
        textAnchor="middle"
        className="fill-muted-foreground text-[11px]"
      >
        {node.type}
      </text>
    </g>
  );
}

function NodeIcon({ node }: { node: NetworkNode }) {
  if (node.type === "router" || node.type === "nat") {
    return <Router className="h-7 w-7 text-foreground" aria-hidden />;
  }
  if (node.type === "ovs" || node.type === "switch") {
    return <Network className="h-7 w-7 text-foreground" aria-hidden />;
  }
  return <Server className="h-7 w-7 text-foreground" aria-hidden />;
}

function layoutNodes(nodes: NetworkNode[], links: NetworkLink[]): Map<string, Point> {
  const positions = new Map<string, Point>();
  const routers = nodes.filter((node) => node.type === "router" || node.type === "nat");
  const switches = nodes
    .filter((node) => node.type === "ovs" || node.type === "switch")
    .sort((a, b) => a.name.localeCompare(b.name));
  const hosts = nodes
    .filter((node) => node.type === "host")
    .sort((a, b) => a.name.localeCompare(b.name));

  routers.forEach((node, index) => {
    positions.set(node.id, {
      x: WIDTH / 2 + (index - (routers.length - 1) / 2) * 130,
      y: 120,
    });
  });

  switches.forEach((node, index) => {
    positions.set(node.id, distribute(index, switches.length, 210));
  });

  const switchByHost = new Map<string, string>();
  for (const link of links) {
    const left = nodes.find((node) => node.id === link.from);
    const right = nodes.find((node) => node.id === link.to);
    if (!left || !right) {
      continue;
    }
    if (left.type === "host" && isSwitch(right)) {
      switchByHost.set(left.id, right.id);
    }
    if (right.type === "host" && isSwitch(left)) {
      switchByHost.set(right.id, left.id);
    }
  }

  const hostsBySwitch = new Map<string, NetworkNode[]>();
  for (const host of hosts) {
    const parent = switchByHost.get(host.id) ?? "unattached";
    const group = hostsBySwitch.get(parent) ?? [];
    group.push(host);
    hostsBySwitch.set(parent, group);
  }

  for (const [switchId, group] of hostsBySwitch.entries()) {
    const parent = positions.get(switchId);
    group.forEach((host, index) => {
      if (!parent) {
        positions.set(host.id, distribute(index, group.length, 410));
        return;
      }
      const offset = (index - (group.length - 1) / 2) * 90;
      positions.set(host.id, {
        x: parent.x + offset,
        y: 410,
      });
    });
  }

  return positions;
}

function distribute(index: number, total: number, y: number): Point {
  return {
    x: ((index + 1) * WIDTH) / (total + 1),
    y,
  };
}

function isSwitch(node: NetworkNode) {
  return node.type === "ovs" || node.type === "switch";
}

function edgeKey(left: string, right: string) {
  return [left, right].sort().join("::");
}
