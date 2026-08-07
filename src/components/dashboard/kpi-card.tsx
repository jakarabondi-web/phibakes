import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Pastel = "pink" | "mint" | "lavender" | "peach" | "coral";

const PASTEL_STYLE: Record<Pastel, { bg: string; icon: string; fg: string }> = {
  pink: { bg: "bg-[var(--pastel-pink)]", icon: "bg-[var(--pastel-pink-icon)]", fg: "text-[var(--pastel-pink-fg)]" },
  mint: { bg: "bg-[var(--pastel-mint)]", icon: "bg-[var(--pastel-mint-icon)]", fg: "text-[var(--pastel-mint-fg)]" },
  lavender: {
    bg: "bg-[var(--pastel-lavender)]",
    icon: "bg-[var(--pastel-lavender-icon)]",
    fg: "text-[var(--pastel-lavender-fg)]",
  },
  peach: { bg: "bg-[var(--pastel-peach)]", icon: "bg-[var(--pastel-peach-icon)]", fg: "text-[var(--pastel-peach-fg)]" },
  coral: { bg: "bg-[var(--pastel-coral)]", icon: "bg-[var(--pastel-coral-icon)]", fg: "text-[var(--pastel-coral-fg)]" },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  tone = "default",
  pastel,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  tone?: "default" | "warning" | "destructive";
  /** Explicit pastel tint; defaults from `tone` when omitted. */
  pastel?: Pastel;
}) {
  const positive = (delta ?? 0) >= 0;
  const resolvedPastel = pastel ?? (tone === "destructive" ? "coral" : tone === "warning" ? "peach" : "pink");
  const style = PASTEL_STYLE[resolvedPastel];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-dashboard)] p-5 shadow-[var(--shadow-card)]",
        style.bg
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", style.icon, style.fg)}>
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className="font-sans text-2xl font-bold tabular-nums text-foreground sm:text-[1.75rem]">{value}</p>
      {typeof delta === "number" && (
        <p
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            positive ? "text-success" : "text-destructive"
          )}
        >
          {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {Math.abs(delta)}% {deltaLabel ?? "vs last period"}
        </p>
      )}
    </div>
  );
}
