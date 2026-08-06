import Image from "next/image";
import { PageHeader } from "@/components/dashboard/page-header";
import { ExportMenu } from "@/components/dashboard/export-menu";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalesTrendChart } from "@/components/dashboard/charts/sales-trend-chart";
import { RevenueCategoryChart } from "@/components/dashboard/charts/revenue-category-chart";
import { MonthlyGrowthChart } from "@/components/dashboard/charts/monthly-growth-chart";
import { formatKes } from "@/lib/utils";
import {
  getReportSummary,
  getSalesTrend,
  getRevenueByCategory,
  getMonthlyGrowth,
  getPopularCakes,
} from "@/lib/dashboard-data";
import { Wallet, TrendingUp, PiggyBank, Boxes, Repeat, ShoppingBag } from "lucide-react";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  const summary = getReportSummary();
  const sales = getSalesTrend(30);
  const byCategory = getRevenueByCategory();
  const growth = getMonthlyGrowth();
  const popular = getPopularCakes(6);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Sales, profitability, and growth across the bakery"
        actions={<ExportMenu />}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Revenue" value={formatKes(summary.totalRevenue)} icon={Wallet} />
        <KpiCard
          label={`Est. Profit (${summary.estimatedMarginPct}%)`}
          value={formatKes(summary.estimatedProfit)}
          icon={TrendingUp}
        />
        <KpiCard label="Deposits Collected" value={formatKes(summary.depositsCollected)} icon={PiggyBank} />
        <KpiCard label="Outstanding" value={formatKes(summary.outstanding)} icon={Wallet} tone="warning" />
        <KpiCard label="Inventory Valuation" value={formatKes(summary.inventoryValuation)} icon={Boxes} />
        <KpiCard label="Avg. Order Value" value={formatKes(summary.avgOrderValue)} icon={ShoppingBag} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Sales — Last 30 Days</CardTitle>
            <CardDescription>Daily revenue trend</CardDescription>
          </CardHeader>
          <SalesTrendChart data={sales} />
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>Revenue trajectory, last 6 months</CardDescription>
          </CardHeader>
          <MonthlyGrowthChart data={growth} />
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <RevenueCategoryChart data={byCategory} />
        </Card>
        <Card className="flex flex-col gap-4 p-5">
          <CardHeader className="p-0 flex-row items-center gap-2">
            <Repeat className="size-4 text-berry" />
            <div>
              <CardTitle>Repeat Customers</CardTitle>
              <CardDescription>Customers with more than 1 order</CardDescription>
            </div>
          </CardHeader>
          <div className="flex flex-1 items-center gap-6">
            <p className="font-display text-4xl font-bold text-primary">{summary.repeatCustomerRate}%</p>
            <p className="text-sm text-muted-foreground">
              {summary.repeatCustomers} of the tracked customer base has ordered more than once —
              a strong signal of loyalty for a premium cake studio.
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <CardHeader className="p-0 flex-row items-center justify-between">
          <div>
            <CardTitle>Popular Cakes</CardTitle>
            <CardDescription>Ranked by order frequency</CardDescription>
          </div>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Cake</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popular.map((p, i) => (
                <TableRow key={p.cake.id}>
                  <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-9 shrink-0 overflow-hidden rounded-lg">
                        <Image src={p.cake.images[0]} alt={p.cake.name} fill sizes="36px" className="object-cover" />
                      </div>
                      <span className="font-medium">{p.cake.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {p.cake.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.orders}</TableCell>
                  <TableCell>{formatKes(p.cake.price)}</TableCell>
                  <TableCell>{p.cake.rating.toFixed(1)} ★</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
