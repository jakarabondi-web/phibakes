import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  tone?: "default" | "warning" | "destructive";
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="gap-3 rounded-[var(--radius-dashboard)] p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            tone === "destructive"
              ? "bg-destructive/10 text-destructive"
              : tone === "warning"
                ? "bg-warning/15 text-[#8a6410]"
                : "bg-primary/10 text-primary"
          )}
        >
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
    </Card>
  );
}
