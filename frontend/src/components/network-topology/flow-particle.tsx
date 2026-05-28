import { cn } from "@/lib/utils";

export type FlowParticleTone = "forward" | "reverse" | "control" | "data" | "error";

export type FlowParticleProps = {
  active?: boolean;
  tone?: FlowParticleTone;
  reverse?: boolean;
  bits?: string;
  delayMs?: number;
  durationMs?: number;
  className?: string;
};

const toneClassNames: Record<FlowParticleTone, string> = {
  forward: "fill-cyan-200 drop-shadow-[0_0_6px_rgba(103,232,249,0.9)]",
  reverse: "fill-amber-200 drop-shadow-[0_0_6px_rgba(252,211,77,0.9)]",
  control: "fill-amber-200 drop-shadow-[0_0_6px_rgba(252,211,77,0.9)]",
  data: "fill-emerald-200 drop-shadow-[0_0_6px_rgba(110,231,183,0.9)]",
  error: "fill-red-200 drop-shadow-[0_0_6px_rgba(248,113,113,0.9)]",
};

export function FlowParticle({
  active = true,
  tone = "forward",
  reverse,
  bits = "1010",
  delayMs = 0,
  durationMs = 1800,
  className,
}: FlowParticleProps) {
  if (!active) {
    return null;
  }

  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full overflow-visible", className)}
      preserveAspectRatio="none"
      viewBox="0 0 100 14"
    >
      <text
        className={cn("font-mono text-[5px] font-bold tracking-[0.2em]", toneClassNames[tone])}
        dominantBaseline="middle"
        textAnchor="middle"
        x={reverse ? "100" : "0"}
        y="7"
      >
        {bits}
        <animate
          attributeName="x"
          begin={`${delayMs}ms`}
          dur={`${durationMs}ms`}
          repeatCount="indefinite"
          values={reverse ? "100;0" : "0;100"}
        />
      </text>
    </svg>
  );
}
