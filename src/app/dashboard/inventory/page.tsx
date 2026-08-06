import { PageHeader } from "@/components/dashboard/page-header";
import { InventoryTable } from "@/components/dashboard/inventory/inventory-table";
import { INVENTORY } from "@/lib/data/inventory";

export const metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <div>
      <PageHeader title="Inventory" description={`${INVENTORY.length} tracked ingredients & supplies`} />
      <InventoryTable items={INVENTORY} />
    </div>
  );
}
