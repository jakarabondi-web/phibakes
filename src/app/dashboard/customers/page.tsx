import { Database } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { CustomersTable } from "@/components/dashboard/customers/customers-table";
import { getDashboardCustomers } from "@/lib/dashboard/customers";
import { databaseSetupHint } from "@/lib/db-status";

export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  const { customers, live } = await getDashboardCustomers();

  return (
    <div>
      <PageHeader
        title="Customers"
        description={
          live
            ? `${customers.length} registered ${customers.length === 1 ? "customer" : "customers"}`
            : `${customers.length} sample customers (demo data)`
        }
      />
      {!live && (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
          <span>
            These are sample customers — no database is connected. {databaseSetupHint()}
          </span>
        </p>
      )}
      {live && customers.length === 0 && (
        <p className="mb-5 rounded-xl border border-border bg-secondary/60 px-3.5 py-3 text-sm text-muted-foreground">
          No customers yet. People who register on the storefront will appear here.
        </p>
      )}
      <CustomersTable customers={customers} />
    </div>
  );
}
