import { PageHeader } from "@/components/dashboard/page-header";
import { SuppliersView } from "@/components/dashboard/suppliers/suppliers-view";
import { SUPPLIERS } from "@/lib/data/suppliers";

export const metadata = { title: "Suppliers" };

export default function SuppliersPage() {
  return (
    <div>
      <PageHeader title="Suppliers" description={`${SUPPLIERS.length} active supply partners`} />
      <SuppliersView suppliers={SUPPLIERS} />
    </div>
  );
}
