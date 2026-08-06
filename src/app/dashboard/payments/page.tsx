import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentsView } from "@/components/dashboard/payments/payments-view";
import { ORDERS } from "@/lib/data/orders";

export const metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader title="Payments" description="All M-PESA, card, and cash payments across orders" />
      <PaymentsView orders={ORDERS} />
    </div>
  );
}
