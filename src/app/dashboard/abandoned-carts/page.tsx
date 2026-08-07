import { PageHeader } from "@/components/dashboard/page-header";
import { AbandonedCartsView } from "@/components/dashboard/abandoned-carts/abandoned-carts-view";
import { ABANDONED_CARTS } from "@/lib/data/abandoned-carts";

export const metadata = { title: "Abandoned Carts" };

export default function AbandonedCartsPage() {
  const open = ABANDONED_CARTS.filter((c) => !c.recovered).length;
  return (
    <div>
      <PageHeader
        title="Abandoned Carts"
        description={`${open} carts left without checking out — follow up to win them back`}
      />
      <AbandonedCartsView />
    </div>
  );
}
