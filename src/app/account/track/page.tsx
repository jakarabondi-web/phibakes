import { getMyOrders } from "../_lib/customer";
import { PageHeader } from "../_components/page-header";
import { TrackView } from "./track-view";

export const metadata = { title: "Track Order" };

export default function TrackPage() {
  const orders = [...getMyOrders()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <PageHeader title="Track Order" description="Follow your cake's journey from oven to doorstep, in real time." />
      <TrackView orders={orders} />
    </div>
  );
}
