import { Database } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { OrdersView } from "@/components/dashboard/orders/orders-view";
import { getDashboardOrders } from "@/lib/dashboard/orders";
import { databaseSetupHint } from "@/lib/db-status";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const { orders, live } = await getDashboardOrders();

  return (
    <div>
      <PageHeader
        title="Orders"
        description={
          live
            ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} across all statuses`
            : `${orders.length} sample orders (demo data)`
        }
      />
      {!live && (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
          <span>
            These are sample orders — no database is connected, so nothing here is real and
            status changes won&apos;t save. {databaseSetupHint()}
          </span>
        </p>
      )}
      {live && orders.length === 0 && (
        <p className="mb-5 rounded-xl border border-border bg-secondary/60 px-3.5 py-3 text-sm text-muted-foreground">
          No orders yet. New orders from the storefront checkout will appear here.
        </p>
      )}
      <OrdersView orders={orders} />
    </div>
  );
}
