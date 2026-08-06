import { getMyOrders } from "../_lib/customer";
import { PageHeader } from "../_components/page-header";
import { InvoicesView } from "./invoices-view";

export const metadata = { title: "Invoices" };

export default function InvoicesPage() {
  const orders = [...getMyOrders()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <PageHeader title="Invoices" description="Download itemized invoices for every order." />
      <InvoicesView orders={orders} />
    </div>
  );
}
