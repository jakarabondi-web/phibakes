import { PageHeader } from "@/components/dashboard/page-header";
import { DeliveryView } from "@/components/dashboard/delivery/delivery-view";
import { ORDERS } from "@/lib/data/orders";

export const metadata = { title: "Delivery" };

export default function DeliveryPage() {
  const deliveries = ORDERS.filter((o) => o.fulfilment === "delivery" && o.status !== "Cancelled");

  return (
    <div>
      <PageHeader title="Delivery" description="Zones, fees, rider assignment, and proof of delivery" />
      <DeliveryView orders={deliveries} />
    </div>
  );
}
