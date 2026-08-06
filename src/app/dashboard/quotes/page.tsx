import { PageHeader } from "@/components/dashboard/page-header";
import { QuotesTable } from "@/components/dashboard/quotes/quotes-table";
import { QUOTES } from "@/lib/data/quotes";

export const metadata = { title: "Quotes" };

export default function QuotesPage() {
  return (
    <div>
      <PageHeader title="Quotes" description={`${QUOTES.length} custom cake quote requests`} />
      <QuotesTable quotes={QUOTES} />
    </div>
  );
}
