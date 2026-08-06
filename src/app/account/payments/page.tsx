import { getMyOrders, getMyPayments } from "../_lib/customer";
import { PageHeader } from "../_components/page-header";
import { PaymentsView } from "./payments-view";

export const metadata = { title: "Payments" };

export default function PaymentsPage() {
  const orders = getMyOrders();
  const payments = [...getMyPayments()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const totalPaid = orders.reduce((sum, o) => sum + o.amountPaid, 0);
  const outstanding = orders.reduce((sum, o) => sum + o.balanceDue, 0);

  return (
    <div>
      <PageHeader title="Payments" description="M-PESA and card payment history across all your orders." />
      <PaymentsView payments={payments} totalPaid={totalPaid} outstanding={outstanding} />
    </div>
  );
}
