"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatKes } from "@/lib/utils";
import type { Order } from "@/types";
import { OrderStatusBadge } from "../../_components/status-badge";
import { isActiveOrder } from "../../_lib/customer";

const FILTERS = ["All", "Active", "Delivered", "Completed", "Cancelled"] as const;

export function OrdersView({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = React.useState("");

  const filtered = orders.filter((o) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Active"
          ? isActiveOrder(o)
          : o.status === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.code.toLowerCase().includes(q) ||
      o.items.some((i) => i.cakeName.toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="flex-wrap">
            {FILTERS.map((f) => (
              <TabsTrigger key={f} value={f}>
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order code or cake..."
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-6 p-10 py-12 text-center">
          <Package className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 font-display text-lg font-semibold">No orders found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different filter or search term.</p>
        </Card>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {filtered.map((order) => {
            const cake = order.items[0];
            return (
              <Link key={order.id} href={`/account/orders/${order.code}`}>
                <Card className="flex-row items-center gap-4 p-4 py-4 transition-shadow hover:shadow-md sm:p-5 sm:py-5">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20">
                    <Image src={cake.image} alt={cake.cakeName} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 px-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="truncate font-display text-base font-semibold">{cake.cakeName}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.code} &middot; Ordered {formatDate(order.createdAt)} &middot; Event {formatDate(order.eventDate)}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-primary">{formatKes(order.total)}</p>
                  </div>
                  <ChevronRight className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
