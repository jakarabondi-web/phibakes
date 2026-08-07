"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { MapPin, Store, Wallet, CreditCard, Banknote, Check, ChevronRight, type LucideIcon } from "lucide-react";
import type { Order, PaymentRecord } from "@/types";
import { ORDER_STATUS_FLOW } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatDateTime, formatKes } from "@/lib/utils";
import { STAFF_NAMES } from "@/lib/data/staff";

const PAYMENT_ICON: Record<PaymentRecord["method"], LucideIcon> = {
  mpesa: Wallet,
  airtel: Wallet,
  card: CreditCard,
  paypal: CreditCard,
  cash: Banknote,
};

export function OrderDetailPanel({ order }: { order: Order }) {
  const [status, setStatus] = React.useState(order.status);
  const [assignedStaff, setAssignedStaff] = React.useState(order.assignedStaff ?? "unassigned");
  const [internalNotes, setInternalNotes] = React.useState(order.internalNotes ?? "");

  const currentIdx = ORDER_STATUS_FLOW.indexOf(status);
  const nextStatus = currentIdx >= 0 && currentIdx < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[currentIdx + 1] : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card className="p-6 py-6">
          <CardHeader className="p-0 flex-row items-center justify-between">
            <div>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Advance the order through the production pipeline</CardDescription>
            </div>
            <OrderStatusBadge status={status} />
          </CardHeader>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {ORDER_STATUS_FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                    i <= currentIdx
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {i <= currentIdx && <Check className="size-3" />}
                  {s}
                </span>
                {i < ORDER_STATUS_FLOW.length - 1 && <ChevronRight className="size-3 text-muted-foreground/40" />}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Select value={status} onValueChange={(v) => setStatus(v as Order["status"])}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_FLOW.concat("Cancelled").map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {nextStatus && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus(nextStatus);
                  toast.success(`Order advanced to "${nextStatus}"`);
                }}
              >
                Advance to {nextStatus}
              </Button>
            )}
            <Button
              onClick={() => toast.success(`Order ${order.code} status saved as "${status}"`)}
            >
              Save Status
            </Button>
          </div>
        </Card>

        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <div className="mt-4 flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.cakeName} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.cakeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} &middot; {item.flavour} &middot; Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 font-semibold">{formatKes(item.price)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-5" />
          <div className="flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{formatKes(order.total)}</span>
          </div>
        </Card>

        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          {order.payments.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {order.payments.map((p) => {
                const Icon = PAYMENT_ICON[p.method];
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {p.type} &middot; {p.method.toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(p.date)}
                          {p.mpesaReceipt ? ` · ${p.mpesaReceipt}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatKes(p.amount)}</p>
                      <Badge variant={p.status === "success" ? "success" : p.status === "failed" ? "destructive" : "warning"}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Internal Notes</CardTitle>
            <CardDescription>Visible to bakery staff only — never shown to the customer</CardDescription>
          </CardHeader>
          <div className="mt-4 flex flex-col gap-3">
            <Textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add internal notes about this order…"
              rows={4}
            />
            <Button
              size="sm"
              className="self-start"
              onClick={() => toast.success("Internal notes saved")}
            >
              Save Notes
            </Button>
          </div>
          {order.notes && (
            <>
              <Separator className="my-4" />
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Customer Notes</Label>
              <p className="mt-1.5 text-sm">{order.notes}</p>
            </>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="mt-3 flex flex-col gap-1.5 p-0 text-sm">
            <p className="font-medium">{order.customerName}</p>
            <p className="text-muted-foreground">{order.customerPhone}</p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
          </CardContent>
        </Card>

        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="mt-3 flex flex-col gap-2 p-0 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{formatKes(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deposit (50%)</span>
              <span className="font-medium">{formatKes(order.depositAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium text-success">{formatKes(order.amountPaid)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold">
              <span>Balance Due</span>
              <span className={order.balanceDue > 0 ? "text-destructive" : ""}>{formatKes(order.balanceDue)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Fulfilment</CardTitle>
          </CardHeader>
          <CardContent className="mt-3 flex flex-col gap-3 p-0 text-sm">
            <div className="flex items-start gap-3">
              {order.fulfilment === "delivery" ? (
                <MapPin className="mt-0.5 size-4 shrink-0 text-berry" />
              ) : (
                <Store className="mt-0.5 size-4 shrink-0 text-berry" />
              )}
              <div>
                <p className="font-medium capitalize">{order.fulfilment}</p>
                <p className="text-muted-foreground">
                  {order.fulfilment === "delivery" ? order.deliveryAddress : "PhiBakes Studio, Kilimani"}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Event date: <span className="text-foreground">{formatDate(order.eventDate)}</span>
            </p>
            <p className="text-muted-foreground">
              Production points: <span className="text-foreground">{order.productionPoints}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Assign Staff</CardTitle>
          </CardHeader>
          <CardContent className="mt-3 flex flex-col gap-3 p-0">
            <Select
              value={assignedStaff}
              onValueChange={(v) => {
                setAssignedStaff(v);
                toast.success(`Assigned ${v === "unassigned" ? "no one" : v} to ${order.code}`);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {STAFF_NAMES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
