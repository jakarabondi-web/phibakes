"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatKes } from "@/lib/utils";
import type { Order } from "@/types";
import { OrderStatusBadge } from "../_components/status-badge";
import { OrderTimeline } from "../_components/order-timeline";

export function TrackView({ orders }: { orders: Order[] }) {
  const [code, setCode] = React.useState(orders[0]?.code ?? "");
  const order = orders.find((o) => o.code === code);

  if (orders.length === 0) {
    return (
      <Card className="p-10 py-12 text-center">
        <PackageSearch className="mx-auto size-10 text-muted-foreground/50" />
        <p className="mt-3 font-display text-lg font-semibold">Nothing to track yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Place an order to see live tracking here.</p>
      </Card>
    );
  }

  return (
    <div>
      <Card className="p-5 py-5">
        <label className="px-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Select an order
        </label>
        <div className="mt-2 px-0">
          <Select value={code} onValueChange={setCode}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Choose an order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((o) => (
                <SelectItem key={o.code} value={o.code}>
                  {o.code} — {o.items[0]?.cakeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {order && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 py-6 lg:col-span-2">
            <div className="flex items-center justify-between px-0">
              <h2 className="font-display text-lg font-semibold">Live Status</h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-5 px-0">
              <OrderTimeline order={order} />
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0 py-0">
              <div className="relative h-40 w-full">
                <Image src={order.items[0].image} alt={order.items[0].cakeName} fill sizes="360px" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-display text-base font-semibold">{order.items[0].cakeName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{order.code}</p>
                <p className="mt-3 text-sm">
                  Event date <span className="font-medium">{formatDate(order.eventDate)}</span>
                </p>
                <p className="mt-1 text-sm">
                  Total <span className="font-medium">{formatKes(order.total)}</span>
                </p>
                <Link
                  href={`/account/orders/${order.code}`}
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  View full order details →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
