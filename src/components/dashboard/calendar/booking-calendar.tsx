"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDateAvailability, DAILY_CAPACITY } from "@/lib/booking";
import { ORDERS } from "@/lib/data/orders";
import { formatKes } from "@/lib/utils";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = new Date(2026, 7, 6);

export function BookingCalendar() {
  const [cursor, setCursor] = React.useState(new Date(2026, 7, 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) => {
    const dayNum = i - startOffset + 1;
    return dayNum > 0 ? new Date(year, month, dayNum) : null;
  });

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">
            {cursor.toLocaleDateString("en-KE", { month: "long", year: "numeric" })}
          </h3>
          <p className="text-xs text-muted-foreground">
            Daily production capacity: {DAILY_CAPACITY} points/day — bookings that would exceed it are blocked.
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const iso = date.toISOString();
          const availability = getDateAvailability(iso);
          const isToday = date.toDateString() === TODAY.toDateString();
          const dayOrders = ORDERS.filter(
            (o) => new Date(o.eventDate).toDateString() === date.toDateString() && o.status !== "Cancelled"
          );
          const pct = Math.min(100, Math.round((availability.booked / availability.capacity) * 100));

          return (
            <Popover key={i}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex min-h-[86px] flex-col rounded-lg border p-2 text-left transition-colors hover:border-primary/50",
                    availability.isFullyBooked ? "border-destructive/40 bg-destructive/5" : "border-border",
                    isToday && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{date.getDate()}</span>
                    {availability.isFullyBooked && (
                      <Badge variant="destructive" className="px-1.5 py-0 text-[9px]">
                        Full
                      </Badge>
                    )}
                  </div>
                  <div className="mt-auto flex flex-col gap-1">
                    <Progress value={pct} className="h-1.5" />
                    <span className="text-[10px] text-muted-foreground">
                      {availability.booked}/{availability.capacity} pts
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <p className="text-sm font-semibold">
                  {date.toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {availability.booked} of {availability.capacity} production points booked
                  {availability.isFullyBooked ? " — fully booked" : ` · ${availability.remaining} remaining`}
                </p>
                {dayOrders.length > 0 ? (
                  <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-2.5">
                    {dayOrders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between text-xs">
                        <span className="font-medium">
                          {o.code} · {o.customerName}
                        </span>
                        <span className="text-muted-foreground">{formatKes(o.total)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">No orders scheduled.</p>
                )}
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </Card>
  );
}
