"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ActionStatus = "pending" | "entering" | "expanded" | "running" | "waiting-child" | "done" | "collapsing" | "exited";

export type ActionLifecycleEventType =
  | "enter"
  | "expand"
  | "run"
  | "child-enter"
  | "child-done"
  | "done"
  | "collapse"
  | "exit";

export type ActionNode<TData = unknown> = {
  id: string;
  label: string;
  children?: ActionNode<TData>[];
  commit?: (data: TData) => TData;
};

export type ActionLifecycleEvent = {
  actionId: string;
  parentId?: string;
  type: ActionLifecycleEventType;
};

export type ActionRunnerOptions = {
  root: ActionNode;
  autoPlay?: boolean;
  initialData?: unknown;
  loop?: boolean;
  stepMs?: number;
  pauseMs?: number;
  onEvent?: (event: ActionLifecycleEvent) => void;
};

export type ActionRunnerSnapshot = {
  activeActionId?: string;
  activePath: string[];
  currentEvent: ActionLifecycleEvent;
  data: unknown;
  expandedActionIds: Set<string>;
  doneActionIds: Set<string>;
  statusById: Map<string, ActionStatus>;
  eventLog: ActionLifecycleEvent[];
  frameCount: number;
  frameIndex: number;
  getStatus: (actionId: string) => ActionStatus;
  isExpanded: (actionId: string) => boolean;
  isDone: (actionId: string) => boolean;
  isInActivePath: (actionId: string) => boolean;
  milestoneCount: number;
  milestoneIndex: number;
  pause: () => void;
  play: () => void;
  playing: boolean;
  reset: () => void;
  seek: (nextFrameIndex: number) => void;
  seekMilestone: (nextMilestoneIndex: number) => void;
  stepFrameBack: () => void;
  stepFrameForward: () => void;
  stepBack: () => void;
  stepForward: () => void;
  toggle: () => void;
};

type TimelineFrame = {
  data: unknown;
  delay: number;
  event: ActionLifecycleEvent;
  milestoneIndex?: number;
  statusById: Map<string, ActionStatus>;
  expandedActionIds: Set<string>;
  doneActionIds: Set<string>;
  activePath: string[];
  activeActionId?: string;
};

export function useActionRunner({
  autoPlay = true,
  initialData,
  root,
  loop = true,
  stepMs = 620,
  pauseMs = 900,
  onEvent,
}: ActionRunnerOptions): ActionRunnerSnapshot {
  const timeline = useMemo(
    () => buildActionTimeline(root, stepMs, pauseMs, initialData),
    [initialData, pauseMs, root, stepMs],
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const eventLog = useMemo(
    () => timeline.slice(Math.max(0, frameIndex - 5), frameIndex + 1).map((frame) => frame.event),
    [frameIndex, timeline],
  );

  useEffect(() => {
    const frame = timeline[frameIndex];
    onEvent?.(frame.event);

    if (!playing) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFrameIndex((current) => {
        if (current < timeline.length - 1) {
          return current + 1;
        }
        return loop ? 0 : current;
      });
    }, frame.delay);

    return () => window.clearTimeout(timeout);
  }, [frameIndex, loop, onEvent, playing, timeline]);

  const frame = timeline[frameIndex];
  const frameCount = timeline.length;
  const milestoneFrames = useMemo(
    () => timeline.flatMap((timelineFrame, index) => (timelineFrame.milestoneIndex !== undefined ? [index] : [])),
    [timeline],
  );
  const milestoneIndex = frame.milestoneIndex ?? findPreviousMilestoneIndex(frameIndex, milestoneFrames);
  const milestoneCount = milestoneFrames.length;
  const getStatus = useCallback(
    (actionId: string) => frame.statusById.get(actionId) ?? "pending",
    [frame.statusById],
  );

  const isExpanded = useCallback(
    (actionId: string) => frame.expandedActionIds.has(actionId),
    [frame.expandedActionIds],
  );

  const isDone = useCallback(
    (actionId: string) => frame.doneActionIds.has(actionId),
    [frame.doneActionIds],
  );

  const isInActivePath = useCallback(
    (actionId: string) => frame.activePath.includes(actionId),
    [frame.activePath],
  );

  const seek = useCallback(
    (nextFrameIndex: number) => {
      setFrameIndex(Math.max(0, Math.min(nextFrameIndex, frameCount - 1)));
    },
    [frameCount],
  );

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((current) => !current), []);
  const reset = useCallback(() => {
    setPlaying(false);
    setFrameIndex(0);
  }, []);
  const stepFrameForward = useCallback(() => {
    setPlaying(false);
    setFrameIndex((current) => Math.min(current + 1, frameCount - 1));
  }, [frameCount]);
  const stepFrameBack = useCallback(() => {
    setPlaying(false);
    setFrameIndex((current) => Math.max(current - 1, 0));
  }, []);
  const seekMilestone = useCallback(
    (nextMilestoneIndex: number) => {
      setPlaying(false);
      const nextFrame = milestoneFrames[Math.max(0, Math.min(nextMilestoneIndex, milestoneFrames.length - 1))];
      setFrameIndex(nextFrame ?? 0);
    },
    [milestoneFrames],
  );
  const stepForward = useCallback(() => {
    setPlaying(false);
    const nextFrame = milestoneFrames.find((candidate) => candidate > frameIndex) ?? (loop ? milestoneFrames[0] : undefined);
    if (nextFrame !== undefined) {
      setFrameIndex(nextFrame);
    }
  }, [frameIndex, loop, milestoneFrames]);
  const stepBack = useCallback(() => {
    setPlaying(false);
    const previousFrames = milestoneFrames.filter((candidate) => candidate < frameIndex);
    const previousFrame = previousFrames.at(-1);
    if (previousFrame !== undefined) {
      setFrameIndex(previousFrame);
      return;
    }
    setFrameIndex(0);
  }, [frameIndex, milestoneFrames]);

  return {
    activeActionId: frame.activeActionId,
    activePath: frame.activePath,
    currentEvent: frame.event,
    data: frame.data,
    expandedActionIds: frame.expandedActionIds,
    doneActionIds: frame.doneActionIds,
    frameCount,
    frameIndex,
    statusById: frame.statusById,
    eventLog,
    getStatus,
    isExpanded,
    isDone,
    isInActivePath,
    milestoneCount,
    milestoneIndex,
    pause,
    play,
    playing,
    reset,
    seek,
    seekMilestone,
    stepFrameBack,
    stepFrameForward,
    stepBack,
    stepForward,
    toggle,
  };
}

export function buildActionTimeline(
  root: ActionNode,
  stepMs: number,
  pauseMs: number,
  initialData?: unknown,
): TimelineFrame[] {
  const frames: TimelineFrame[] = [];
  let data = initialData;
  let milestoneIndex = 0;
  const statusById = new Map<string, ActionStatus>();
  const expandedActionIds = new Set<string>();
  const doneActionIds = new Set<string>();

  visit(root, undefined, []);
  return frames;

  function visit(action: ActionNode, parentId: string | undefined, parentPath: string[]) {
    const path = [...parentPath, action.id];

    setStatus(action.id, "entering");
    frames.push(snapshot({ actionId: action.id, parentId, type: "enter" }, action.id, path, stepMs));

    if (action.children?.length) {
      expandedActionIds.add(action.id);
      setStatus(action.id, "expanded");
      frames.push(snapshot({ actionId: action.id, parentId, type: "expand" }, action.id, path, stepMs));

      for (const child of action.children) {
        setStatus(action.id, "waiting-child");
        frames.push(snapshot({ actionId: child.id, parentId: action.id, type: "child-enter" }, child.id, [...path, child.id], stepMs));
        visit(child, action.id, path);
        frames.push(snapshot({ actionId: child.id, parentId: action.id, type: "child-done" }, action.id, path, stepMs));
      }

      data = action.commit?.(data) ?? data;
      setStatus(action.id, "done");
      doneActionIds.add(action.id);
      frames.push(snapshot({ actionId: action.id, parentId, type: "done" }, action.id, path, pauseMs, true));

      setStatus(action.id, "collapsing");
      frames.push(snapshot({ actionId: action.id, parentId, type: "collapse" }, action.id, path, stepMs));
      expandedActionIds.delete(action.id);
    } else {
      setStatus(action.id, "running");
      frames.push(snapshot({ actionId: action.id, parentId, type: "run" }, action.id, path, stepMs));

      data = action.commit?.(data) ?? data;
      setStatus(action.id, "done");
      doneActionIds.add(action.id);
      frames.push(snapshot({ actionId: action.id, parentId, type: "done" }, action.id, path, pauseMs, true));
    }

    setStatus(action.id, "exited");
    frames.push(snapshot({ actionId: action.id, parentId, type: "exit" }, parentId, parentPath, stepMs));
  }

  function setStatus(actionId: string, status: ActionStatus) {
    statusById.set(actionId, status);
  }

  function snapshot(
    event: ActionLifecycleEvent,
    activeActionId: string | undefined,
    activePath: string[],
    delay: number,
    milestone = false,
  ): TimelineFrame {
    return {
      activeActionId,
      activePath,
      data,
      delay,
      doneActionIds: new Set(doneActionIds),
      event,
      expandedActionIds: new Set(expandedActionIds),
      milestoneIndex: milestone ? milestoneIndex++ : undefined,
      statusById: new Map(statusById),
    };
  }
}

function findPreviousMilestoneIndex(frameIndex: number, milestoneFrames: number[]) {
  const previous = milestoneFrames.findLastIndex((candidate) => candidate <= frameIndex);
  return Math.max(previous, 0);
}
