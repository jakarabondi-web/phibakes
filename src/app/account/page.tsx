import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Package,
  Sparkles,
  Star,
  CalendarClock,
  Wand2,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ORDER_STATUS_FLOW } from "@/types";
import { formatDate, formatKes } from "@/lib/utils";
import { CURRENT_CUSTOMER, getMyOrders, isActiveOrder } from "./_lib/customer";
import { OrderStatusBadge } from "./_components/status-badge";
import { PageHeader } from "./_components/page-header";

export const metadata = { title: "Dashboard" };

export default function AccountDashboardPage() {
  const orders = getMyOrders();
  const activeOrders = orders.filter(isActiveOrder);
  const firstName = CURRENT_CUSTOMER.name.split(" ")[0];

  const nextEvent = [...orders]
    .filter((o) => new Date(o.eventDate).getTime() >= Date.now())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())[0];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={`${CURRENT_CUSTOMER.tier} member since ${formatDate(CURRENT_CUSTOMER.joinedAt, { month: "long", year: "numeric" })}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/cakes">
                <ShoppingBag /> Browse Cakes
              </Link>
            </Button>
            <Button asChild>
              <Link href="/custom-cake-builder">
                <Wand2 /> Design Custom Cake
              </Link>
            </Button>
          </div>
        }
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Orders" value={String(activeOrders.length)} icon={Package} />
        <StatCard label="Loyalty Points" value={CURRENT_CUSTOMER.loyaltyPoints.toLocaleString()} icon={Sparkles} accent="gold" />
        <StatCard label="Membership Tier" value={CURRENT_CUSTOMER.tier} icon={Star} accent="gold" />
        <StatCard label="Total Orders" value={String(CURRENT_CUSTOMER.totalOrders)} icon={ShoppingBag} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current orders */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Current Orders</h2>
            <Link href="/account/orders" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>

          {activeOrders.length === 0 ? (
            <Card className="p-8 py-10 text-center">
              <Package className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 font-display text-lg font-semibold">No active orders</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ready for your next celebration? Browse our collection or design something custom.
              </p>
              <Button className="mt-5" asChild>
                <Link href="/cakes">Browse Cakes</Link>
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {activeOrders.map((order) => {
                const idx = ORDER_STATUS_FLOW.indexOf(order.status);
                const pct = Math.round(((idx + 1) / ORDER_STATUS_FLOW.length) * 100);
                const cake = order.items[0];
                return (
                  <Card key={order.id} className="overflow-hidden p-0 py-0 sm:flex-row sm:items-stretch">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row">
                      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-32">
                        <Image src={cake.image} alt={cake.cakeName} fill sizes="128px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-base font-semibold">{cake.cakeName}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.code} &middot; Event {formatDate(order.eventDate)}
                            </p>
                          </div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="mt-4">
                          <Progress value={pct} />
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            Step {idx + 1} of {ORDER_STATUS_FLOW.length} &middot; {formatKes(order.total)}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/account/orders/${order.code}`}>Track Order</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: upcoming + quick actions */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 py-5">
            <div className="flex items-center gap-2 px-0">
              <CalendarClock className="size-4.5 text-berry" />
              <h3 className="font-display text-base font-semibold">Upcoming Event</h3>
            </div>
            {nextEvent ? (
              <div className="mt-4 px-0">
                <p className="text-sm font-semibold">{nextEvent.items[0]?.cakeName}</p>
                <p className="mt-1 text-2xl font-bold text-primary">{formatDate(nextEvent.eventDate, { weekday: "long", day: "numeric", month: "long" })}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {Math.max(0, Math.ceil((new Date(nextEvent.eventDate).getTime() - Date.now()) / 86400000))} days to go &middot; {nextEvent.code}
                </p>
              </div>
            ) : (
              <p className="mt-3 px-0 text-sm text-muted-foreground">No upcoming events scheduled.</p>
            )}
          </Card>

          <Card className="p-5 py-5">
            <h3 className="px-0 font-display text-base font-semibold">Quick Actions</h3>
            <div className="mt-4 flex flex-col gap-2 px-0">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/cakes">
                  <RotateCcw /> Order Again
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/custom-cake-builder">
                  <Wand2 /> Design Custom Cake
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/account/rewards">
                  <Sparkles /> View Rewards
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-blush/60 to-cream p-5 py-5">
            <h3 className="px-0 font-display text-base font-semibold">Recent Activity</h3>
            <ul className="mt-3 flex flex-col gap-3 px-0 text-sm">
              {orders.slice(0, 3).map((o) => (
                <li key={o.id} className="flex items-start justify-between gap-2 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{o.items[0]?.cakeName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-1 px-0" asChild>
              <Link href="/account/orders">
                See order history <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "gold";
}) {
  return (
    <Card className="p-5 py-5">
      <div className="flex items-center justify-between px-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <span
          className={
            accent === "gold"
              ? "flex size-9 items-center justify-center rounded-full bg-gold/15 text-gold"
              : "flex size-9 items-center justify-center rounded-full bg-blush text-berry"
          }
        >
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 px-0 font-display text-2xl font-bold">{value}</p>
    </Card>
  );
}
