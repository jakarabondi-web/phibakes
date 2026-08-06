import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAvailabilityForRange } from "@/lib/booking";
import { REFERENCE_MONTH, REFERENCE_YEAR } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type Status = "available" | "busy" | "full";

function statusFor(day: { remaining: number; capacity: number; isFullyBooked: boolean }): Status {
  if (day.isFullyBooked) return "full";
  if (day.remaining > day.capacity * 0.6) return "available";
  return "busy";
}

const DOT_CLASS: Record<Status, string> = {
  available: "bg-success",
  busy: "bg-gold",
  full: "bg-primary",
};

const STATUS_LABEL: Record<Status, string> = {
  available: "Available",
  busy: "Busy",
  full: "Fully booked",
};

export function ProductionCalendarWidget() {
  const startISO = `${REFERENCE_YEAR}-${String(REFERENCE_MONTH).padStart(2, "0")}-01`;
  const daysInMonth = new Date(REFERENCE_YEAR, REFERENCE_MONTH, 0).getDate();
  const availability = getAvailabilityForRange(startISO, daysInMonth);
  const leadingBlanks = new Date(startISO).getUTCDay();
  const monthLabel = new Date(startISO).toLocaleDateString("en-KE", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Card className="gap-4 rounded-[var(--radius-dashboard)] p-5">
      <div>
        <p className="font-display text-lg font-semibold leading-tight">Production Calendar</p>
        <p className="text-sm text-muted-foreground">{monthLabel}</p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {availability.map((day, i) => {
          const status = statusFor(day);
          return (
            <div
              key={day.date}
              title={`${day.label} · ${STATUS_LABEL[status]}`}
              className="flex flex-col items-center gap-1 rounded-md py-1 text-xs"
            >
              <span className="text-foreground/80">{i + 1}</span>
              <span className={cn("size-1.5 rounded-full", DOT_CLASS[status])} />
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-success" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-gold" /> Busy
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-primary" /> Fully Booked
        </span>
      </div>

      <Link
        href="/dashboard/calendar"
        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        View full calendar <ArrowRight className="size-3" />
      </Link>
    </Card>
  );
}
