import { PageHeader } from "@/components/dashboard/page-header";
import { ProductionBoard } from "@/components/dashboard/production/production-board";
import { PRODUCTION_TASKS } from "@/lib/data/inventory";

export const metadata = { title: "Production" };

export default function ProductionPage() {
  return (
    <div>
      <PageHeader title="Production Board" description="Every task across the kitchen, grouped by stage." />
      <ProductionBoard tasks={PRODUCTION_TASKS} />
    </div>
  );
}
