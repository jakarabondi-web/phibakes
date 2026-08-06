import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin, Store, Wallet, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateTime, formatKes } from "@/lib/utils";
import { getMyOrder } from "../../_lib/customer";
import { OrderStatusBadge, PaymentStatusBadge } from "../../_components/status-badge";
import { OrderTimeline } from "../../_components/order-timeline";
import { ReorderButton, DownloadInvoiceButton } from "../_components/order-actions";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = getMyOrder(code);
  return { title: order ? `Order ${order.code}` : "Order" };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = getMyOrder(code);
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/account/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{order.code}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)} &middot; Event date {formatDate(order.eventDate)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ReorderButton cakeName={order.items[0]?.cakeName ?? order.code} />
          <DownloadInvoiceButton />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="p-6 py-6">
            <h2 className="px-0 font-display text-lg font-semibold">Order Status</h2>
            <div className="mt-5 px-0">
              <OrderTimeline order={order} />
            </div>
          </Card>

          <Card className="p-6 py-6">
            <h2 className="px-0 font-display text-lg font-semibold">Items</h2>
            <div className="mt-4 flex flex-col gap-4 px-0">
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
            <div className="flex flex-col gap-1.5 px-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatKes(order.total)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatKes(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 py-6">
            <h2 className="px-0 font-display text-lg font-semibold">Payment History</h2>
            {order.payments.length === 0 ? (
              <p className="mt-3 px-0 text-sm text-muted-foreground">No payments recorded yet.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-3 px-0">
                {order.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
                        {p.method === "mpesa" ? <Wallet className="size-4" /> : <CreditCard className="size-4" />}
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
                      <PaymentStatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
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
                <span className={order.balanceDue > 0 ? "text-destructive" : ""}>
                  {formatKes(order.balanceDue)}
                </span>
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
              {order.assignedStaff && (
                <p className="text-muted-foreground">
                  Assigned baker: <span className="text-foreground">{order.assignedStaff}</span>
                </p>
              )}
              {order.notes && (
                <p className="text-muted-foreground">
                  Notes: <span className="text-foreground">{order.notes}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
