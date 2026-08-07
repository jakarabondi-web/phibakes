import Link from "next/link";
import { ClipboardList, Wallet, PiggyBank, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { TopCakes } from "@/components/dashboard/top-cakes";
import { ProductionCalendarWidget } from "@/components/dashboard/production-calendar-widget";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SalesTrendChart } from "@/components/dashboard/charts/sales-trend-chart";
import { OrdersStatusChart } from "@/components/dashboard/charts/orders-status-chart";
import { RevenueCategoryChart } from "@/components/dashboard/charts/revenue-category-chart";
import { CustomerGrowthChart } from "@/components/dashboard/charts/customer-growth-chart";
import { OrdersOverviewChart } from "@/components/dashboard/charts/orders-overview-chart";
import { formatKes, formatDate } from "@/lib/utils";
import { STATUS_BADGE } from "@/components/dashboard/status-badge";
import {
  getOverviewStats,
  getSalesTrend,
  getOrdersByStatus,
  getRevenueByCategory,
  getCustomerGrowth,
  getTodaysProduction,
  getUpcomingDeliveries,
  getOrdersOverviewSeries,
  REFERENCE_DATE,
} from "@/lib/dashboard-data";

export const metadata = { title: "Overview" };

export default function DashboardOverviewPage() {
  const stats = getOverviewStats();
  const sales = getSalesTrend(30);
  const byStatus = getOrdersByStatus();
  const byCategory = getRevenueByCategory();
  const growth = getCustomerGrowth();
  const todaysProduction = getTodaysProduction();
  const upcomingDeliveries = getUpcomingDeliveries();
  const ordersOverview = getOrdersOverviewSeries(14);

  return (
    <div>
      <PageHeader
        title="Overview"
        description={`${formatDate(REFERENCE_DATE, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} — here's how the bakery is doing today.`}
        actions={
          <Button asChild>
            <Link href="/dashboard/orders">
              View all orders <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label="Today's Orders"
          value={String(stats.todaysOrders)}
          icon={ClipboardList}
          delta={12}
          pastel="lavender"
        />
        <KpiCard label="Revenue" value={formatKes(stats.revenueThisMonth)} icon={Wallet} delta={8.4} pastel="mint" />
        <KpiCard
          label="Deposits"
          value={formatKes(stats.depositsCollected)}
          icon={PiggyBank}
          delta={10.2}
          pastel="pink"
        />
        <KpiCard
          label="Outstanding"
          value={formatKes(stats.outstandingBalance)}
          icon={Wallet}
          tone="warning"
          delta={-5.4}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="gap-4 rounded-[var(--radius-dashboard)] p-5 xl:col-span-1">
          <div>
            <p className="font-display text-lg font-semibold leading-tight">Orders Overview</p>
            <p className="text-sm text-muted-foreground">Placed vs. delivered, last 14 days</p>
          </div>
          <OrdersOverviewChart data={ordersOverview} />
        </Card>
        <TopCakes />
        <ProductionCalendarWidget />
      </div>

      <h2 className="mt-8 mb-4 font-display text-xl font-semibold text-foreground">More Insights</h2>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily revenue, last 30 days</CardDescription>
          </CardHeader>
          <SalesTrendChart data={sales} />
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Current pipeline distribution</CardDescription>
          </CardHeader>
          <OrdersStatusChart data={byStatus} />
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Which collections earn the most</CardDescription>
          </CardHeader>
          <RevenueCategoryChart data={byCategory} />
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>Cumulative registered customers</CardDescription>
          </CardHeader>
          <CustomerGrowthChart data={growth} />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0 flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Production</CardTitle>
              <CardDescription>Tasks scheduled for 6 August</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/production">
                View board <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <Separator />
          <div className="flex flex-col divide-y divide-border">
            {todaysProduction.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No tasks scheduled today.</p>
            )}
            {todaysProduction.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.cakeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.orderCode} · {t.stage} · {t.assignedTo}
                  </p>
                </div>
                <Badge variant={t.status === "blocked" ? "destructive" : t.status === "done" ? "success" : "secondary"}>
                  {t.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0 flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Deliveries</CardTitle>
              <CardDescription>Sorted by nearest event date</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/delivery">
                Delivery board <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <Separator />
          <div className="flex flex-col divide-y divide-border">
            {upcomingDeliveries.map((o) => (
              <Link
                key={o.id}
                href={`/dashboard/orders/${o.code}`}
                className="flex items-center justify-between gap-3 py-3 hover:bg-secondary/40 -mx-1 px-1 rounded-md transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {o.code} · {o.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.deliveryZone ?? "Nairobi"} · {formatDate(o.eventDate)}
                  </p>
                </div>
                <Badge variant={STATUS_BADGE[o.status]}>{o.status}</Badge>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
