import { PageHeader } from "@/components/dashboard/page-header";
import { CustomersTable } from "@/components/dashboard/customers/customers-table";
import { CUSTOMERS } from "@/lib/data/inventory";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <div>
      <PageHeader title="Customers" description={`${CUSTOMERS.length} registered customers`} />
      <CustomersTable customers={CUSTOMERS} />
    </div>
  );
}
