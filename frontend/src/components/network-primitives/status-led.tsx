import { cn } from "@/lib/utils";

export type StatusLedState = "down" | "link" | "activity" | "warning" | "error";

export type StatusLedProps = {
  status: StatusLedState;
  size?: "xs" | "sm" | "md";
  pulse?: boolean;
  label?: string;
  className?: string;
};

export function StatusLed({
  status,
  size = "sm",
  pulse,
  label,
  className,
}: StatusLedProps) {
  const shouldPulse = pulse ?? status === "activity";

  return (
    <span
      aria-label={label}
      title={label}
      className={cn(
        "inline-block shrink-0 rounded-full border border-black/30",
        size === "xs" && "size-1.5",
        size === "sm" && "size-2",
        size === "md" && "size-2.5",
        status === "down" && "bg-red-800 shadow-[0_0_5px_rgba(153,27,27,0.65)]",
        status === "link" && "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.85)]",
        status === "activity" && "bg-lime-300 shadow-[0_0_9px_rgba(190,242,100,0.95)]",
        status === "warning" && "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]",
        status === "error" && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]",
        shouldPulse && "animate-pulse",
        className,
      )}
    />
  );
}
