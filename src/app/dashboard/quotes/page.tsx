import { Database } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { QuotesTable } from "@/components/dashboard/quotes/quotes-table";
import { getDashboardQuotes } from "@/lib/dashboard/quotes";
import { databaseSetupHint } from "@/lib/db-status";

export const metadata = { title: "Quotes" };

export default async function QuotesPage() {
  const { quotes, live } = await getDashboardQuotes();

  return (
    <div>
      <PageHeader
        title="Quotes"
        description={
          live
            ? `${quotes.length} custom cake quote ${quotes.length === 1 ? "request" : "requests"}`
            : `${quotes.length} sample quote requests (demo data)`
        }
      />
      {!live && (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
          <span>
            These are sample quotes — no database is connected, so pricing and converting
            won&apos;t save. {databaseSetupHint()}
          </span>
        </p>
      )}
      {live && quotes.length === 0 && (
        <p className="mb-5 rounded-xl border border-border bg-secondary/60 px-3.5 py-3 text-sm text-muted-foreground">
          No quote requests yet. Custom cake builder submissions will appear here.
        </p>
      )}
      <QuotesTable quotes={quotes} live={live} />
    </div>
  );
}
