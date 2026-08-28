import { Database } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentsView } from "@/components/dashboard/payments/payments-view";
import { getDashboardOrders } from "@/lib/dashboard/orders";
import { databaseSetupHint } from "@/lib/db-status";

export const metadata = { title: "Payments" };

export default async function PaymentsPage() {
  // Payments hang off orders, so this reuses the same (memoized) read.
  const { orders, live } = await getDashboardOrders();

  return (
    <div>
      <PageHeader
        title="Payments"
        description={
          live
            ? "All M-PESA, card, and cash payments across orders"
            : "Sample payments (demo data)"
        }
      />
      {!live && (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
          <span>These are sample payments — no database is connected. {databaseSetupHint()}</span>
        </p>
      )}
      <PaymentsView orders={orders} live={live} />
    </div>
  );
}
