"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDateAvailability } from "@/lib/booking";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_FORMAT = new Intl.DateTimeFormat("en-KE", { month: "long", year: "numeric" });

export function EventCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (isoDate: string) => void;
}) {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = React.useState(() => {
    const base = value ? new Date(value) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const firstDayOfWeek = viewMonth.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
  ];

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          disabled={viewMonth <= minMonth}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-30"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-sm font-semibold text-foreground">
          {MONTH_FORMAT.format(viewMonth)}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
        {WEEKDAYS.map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const iso = toISODate(date);
          const isPast = date < today;
          const availability = getDateAvailability(date.toISOString());
          const isFull = availability.isFullyBooked;
          const disabled = isPast || isFull;
          const selected = value === iso;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              title={
                isPast
                  ? "Past date"
                  : isFull
                    ? "Fully booked"
                    : `${availability.remaining} of ${availability.capacity} production points available`
              }
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors",
                disabled && "cursor-not-allowed text-muted-foreground/40 line-through",
                !disabled && !selected && "text-foreground hover:bg-secondary",
                selected && "bg-primary text-primary-foreground shadow-sm",
                !disabled && !selected && availability.remaining <= 3 && "ring-1 ring-inset ring-warning/60"
              )}
            >
              {date.getDate()}
              {!isPast && isFull && (
                <span className="absolute bottom-0.5 size-1 rounded-full bg-destructive" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-destructive" /> Fully booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full ring-1 ring-inset ring-warning/60" /> Limited slots
        </span>
      </div>
    </div>
  );
}
