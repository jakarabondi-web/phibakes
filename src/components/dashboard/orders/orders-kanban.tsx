"use client";

import Link from "next/link";
import type { Order, OrderStatus } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatKes } from "@/lib/utils";
import { Calendar, GripVertical } from "lucide-react";

const KANBAN_COLUMNS: OrderStatus[] = [
  "Requested",
  "Quoted",
  "Deposit Pending",
  "Confirmed",
  "Baking",
  "Decorating",
  "Ready",
  "Out for Delivery",
  "Completed",
];

const COLUMN_ACCENT: Partial<Record<OrderStatus, string>> = {
  Requested: "border-t-muted-foreground/40",
  Quoted: "border-t-berry-light",
  "Deposit Pending": "border-t-warning",
  Confirmed: "border-t-gold",
  Baking: "border-t-gold",
  Decorating: "border-t-gold",
  Ready: "border-t-success",
  "Out for Delivery": "border-t-primary",
  Completed: "border-t-success",
};

export function OrdersKanban({ orders }: { orders: Order[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((status) => {
        const rows = orders.filter((o) => o.status === status);
        return (
          <div key={status} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold">{status}</h3>
              <Badge variant="secondary">{rows.length}</Badge>
            </div>
            <div className={`flex min-h-[120px] flex-col gap-2.5 rounded-xl border-t-4 bg-muted/40 p-2.5 ${COLUMN_ACCENT[status] ?? "border-t-border"}`}>
              {rows.map((o) => (
                <Link key={o.id} href={`/dashboard/orders/${o.code}`}>
                  <Card className="cursor-grab gap-2 p-3.5 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-primary">{o.code}</p>
                      <GripVertical className="size-3.5 text-muted-foreground/50" />
                    </div>
                    <p className="truncate text-sm font-medium">{o.customerName}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.items.map((i) => i.cakeName).join(", ")}</p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="size-3" /> {formatDate(o.eventDate)}
                      </span>
                      <span className="font-semibold">{formatKes(o.total)}</span>
                    </div>
                  </Card>
                </Link>
              ))}
              {rows.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">No orders</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
