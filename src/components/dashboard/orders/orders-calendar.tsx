"use client";

import * as React from "react";
import Link from "next/link";
import type { Order } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatKes } from "@/lib/utils";
import { STATUS_BADGE } from "@/components/dashboard/status-badge";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function OrdersCalendar({ orders }: { orders: Order[] }) {
  const [cursor, setCursor] = React.useState(() => new Date(2026, 7, 1)); // August 2026

  const byDate = React.useMemo(() => {
    const map = new Map<string, Order[]>();
    for (const o of orders) {
      const key = new Date(o.eventDate).toDateString();
      map.set(key, [...(map.get(key) ?? []), o]);
    }
    return map;
  }, [orders]);

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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">
          {cursor.toLocaleDateString("en-KE", { month: "long", year: "numeric" })}
        </h3>
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
          const dayOrders = byDate.get(date.toDateString()) ?? [];
          const isToday = date.toDateString() === new Date(2026, 7, 6).toDateString();
          return (
            <div
              key={i}
              className={`min-h-[92px] rounded-lg border p-1.5 text-left ${
                isToday ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <p className={`text-xs font-semibold ${isToday ? "text-primary" : "text-foreground"}`}>{date.getDate()}</p>
              <div className="mt-1 flex flex-col gap-0.5">
                {dayOrders.slice(0, 2).map((o) => (
                  <Link
                    key={o.id}
                    href={`/dashboard/orders/${o.code}`}
                    className="block truncate rounded bg-secondary px-1 py-0.5 text-[10px] font-medium text-secondary-foreground hover:bg-blush"
                    title={`${o.code} · ${o.customerName} · ${formatKes(o.total)}`}
                  >
                    {o.code}
                  </Link>
                ))}
                {dayOrders.length > 2 && (
                  <Badge variant="outline" className="w-fit text-[9px]">
                    +{dayOrders.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" /> Today
        </span>
        {Object.entries(STATUS_BADGE).slice(0, 4).map(([status]) => (
          <span key={status}>{status}</span>
        ))}
      </div>
    </Card>
  );
}
