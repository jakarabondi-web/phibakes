import { PageHeader } from "@/components/dashboard/page-header";
import { OrdersView } from "@/components/dashboard/orders/orders-view";
import { ORDERS } from "@/lib/data/orders";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div>
      <PageHeader title="Orders" description={`${ORDERS.length} orders across all statuses`} />
      <OrdersView orders={ORDERS} />
    </div>
  );
}
