import { getMyQuotes } from "../_lib/customer";
import { PageHeader } from "../_components/page-header";
import { QuotesView } from "./quotes-view";

export const metadata = { title: "Quotes" };

export default function QuotesPage() {
  const quotes = getMyQuotes();

  return (
    <div>
      <PageHeader
        title="Custom Cake Quotes"
        description="Track requests for bespoke designs and respond to pricing from our team."
      />
      <QuotesView quotes={quotes} />
    </div>
  );
}
