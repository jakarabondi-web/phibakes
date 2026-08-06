"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  PackageSearch,
  CheckCircle2,
  Circle,
  Truck,
  Store,
  MapPin,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getOrderByCode } from "@/lib/data/orders";
import { ORDER_STATUS_FLOW, type Order } from "@/types";
import { cn, formatKes, formatDate, formatDateTime } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";

  const [code, setCode] = React.useState(initialCode);
  const [contact, setContact] = React.useState("");
  const [order, setOrder] = React.useState<Order | null>(null);
  const [searched, setSearched] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const doSearch = React.useCallback((searchCode: string, searchContact: string) => {
    const trimmedCode = searchCode.trim();
    if (!trimmedCode) {
      setError("Enter your order code to track your cake.");
      setOrder(null);
      setSearched(true);
      return;
    }
    const found = getOrderByCode(trimmedCode);
    setSearched(true);
    if (!found) {
      setOrder(null);
      setError("We couldn't find an order with that code. Double-check and try again.");
      return;
    }
    if (searchContact.trim()) {
      const c = searchContact.trim().toLowerCase();
      const matches =
        found.customerEmail.toLowerCase() === c ||
        found.customerPhone.replace(/\s+/g, "") === c.replace(/\s+/g, "");
      if (!matches) {
        setOrder(null);
        setError("The phone or email doesn't match our records for this order code.");
        return;
      }
    }
    setOrder(found);
    setError(null);
  }, []);

  React.useEffect(() => {
    // Auto-run the search once when arriving via a ?code= deep link.
    if (initialCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      doSearch(initialCode, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doSearch(code, contact);
  }

  return (
    <section className="container-luxe py-12 lg:py-16">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-blush px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-berry">
          Order Tracker
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
          Track Your <span className="italic text-berry">Cake</span>
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-balance text-muted-foreground">
          Enter your order code to see live progress — from confirmation to delivery.
        </p>
      </div>

      <Card className="mx-auto max-w-xl gap-5 p-6">
        <CardHeader className="p-0">
          <CardTitle>Find Your Order</CardTitle>
          <CardDescription>
            Your order code was sent via SMS/email after checkout, e.g. PB-10231.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">Order code</Label>
              <div className="relative">
                <PackageSearch className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="PB-10231"
                  className="pl-10 uppercase"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact">Phone or email (optional, for verification)</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="0712 345 678 or you@example.com"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              <Search className="size-4" />
              Track Order
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && error && (
        <div className="mx-auto mt-8 flex max-w-xl items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {order && <OrderResult order={order} />}

      <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-berry" />
        Payments secured via Safaricom Daraja API
      </p>
    </section>
  );
}

function OrderResult({ order }: { order: Order }) {
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-6">
      {/* Header */}
      <Card className="gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order Code
            </p>
            <p className="font-mono text-xl font-bold text-foreground">{order.code}</p>
          </div>
          <Badge variant={isCancelled ? "destructive" : "gold"} className="px-3 py-1 text-sm">
            {order.status}
          </Badge>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="font-medium text-foreground">{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Event date</p>
            <p className="flex items-center gap-1 font-medium text-foreground">
              <CalendarDays className="size-3.5" /> {formatDate(order.eventDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fulfilment</p>
            <p className="flex items-center gap-1 font-medium text-foreground">
              {order.fulfilment === "delivery" ? (
                <Truck className="size-3.5" />
              ) : (
                <Store className="size-3.5" />
              )}
              {order.fulfilment === "delivery" ? "Delivery" : "Pickup"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {order.fulfilment === "delivery" ? "Zone" : "Location"}
            </p>
            <p className="flex items-center gap-1 font-medium text-foreground">
              <MapPin className="size-3.5" />
              {order.deliveryZone ?? "Kilimani Studio"}
            </p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="gap-5 p-6">
        <CardHeader className="p-0">
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isCancelled ? (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <AlertCircle className="size-5 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">
                This order has been cancelled. Contact us if you believe this is an error.
              </p>
            </div>
          ) : (
            <ol className="flex flex-col">
              {ORDER_STATUS_FLOW.map((status, i) => {
                const isDone = i < currentIdx;
                const isCurrent = i === currentIdx;
                const isFuture = i > currentIdx;
                const timelineEntry = order.timeline.find((t) => t.status === status);
                const isLast = i === ORDER_STATUS_FLOW.length - 1;

                return (
                  <li key={status} className="relative flex gap-4 pb-7 last:pb-0">
                    {!isLast && (
                      <span
                        className={cn(
                          "absolute left-[11px] top-6 h-full w-px",
                          isDone ? "bg-berry" : "bg-border"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                        isDone && "bg-berry text-primary-foreground",
                        isCurrent && "bg-gold text-charcoal ring-4 ring-gold/25",
                        isFuture && "bg-secondary text-muted-foreground/50"
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Circle className={cn("size-2.5", isCurrent && "fill-charcoal")} />
                      )}
                    </span>
                    <div className="flex-1 pt-0.5">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          isFuture ? "text-muted-foreground/60" : "text-foreground",
                          isCurrent && "text-berry"
                        )}
                      >
                        {status}
                      </p>
                      {timelineEntry ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDateTime(timelineEntry.date)}
                          {timelineEntry.note ? ` — ${timelineEntry.note}` : ""}
                        </p>
                      ) : isCurrent ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">In progress</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Items & payment */}
      <Card className="gap-5 p-6">
        <CardHeader className="p-0">
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image}
                    alt={item.cakeName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.cakeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} &middot; {item.flavour} &middot; x{item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-foreground">
                  {formatKes(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-foreground">{formatKes(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount paid</span>
              <span className="font-semibold text-success">{formatKes(order.amountPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Balance due</span>
              <span
                className={cn(
                  "font-semibold",
                  order.balanceDue > 0 ? "text-destructive" : "text-foreground"
                )}
              >
                {formatKes(order.balanceDue)}
              </span>
            </div>
          </div>

          {order.fulfilment === "delivery" && order.deliveryAddress && (
            <>
              <Separator />
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-berry" />
                <div>
                  <p className="font-medium text-foreground">Delivery address</p>
                  <p className="text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <React.Suspense fallback={null}>
      <TrackOrderContent />
    </React.Suspense>
  );
}
