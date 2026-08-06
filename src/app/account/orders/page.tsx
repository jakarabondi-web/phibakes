import { getMyOrders } from "../_lib/customer";
import { PageHeader } from "../_components/page-header";
import { OrdersView } from "./_components/orders-view";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  const orders = [...getMyOrders()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <PageHeader title="Order History" description="Every cake you've ordered from PhiBakes, in one place." />
      <OrdersView orders={orders} />
    </div>
  );
}
