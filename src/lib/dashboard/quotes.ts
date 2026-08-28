import "server-only";

import { cache } from "react";
import type { QuoteStatus as DbQuoteStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { QUOTES } from "@/lib/data/quotes";
import type { Quote, QuoteStatus } from "@/types";

/**
 * Dashboard quote reads. Same policy as orders (see ./orders.ts): demo quotes
 * only when no database is configured, an honest empty list once one is, and
 * a thrown error over silently wrong data.
 */

export type QuotesResult = {
  quotes: Quote[];
  live: boolean;
};

/** DB enum "PENDING_REVIEW" <-> view label "Pending Review". */
export function quoteStatusLabel(db: DbQuoteStatus): QuoteStatus {
  return db
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") as QuoteStatus;
}

export function quoteStatusEnum(label: QuoteStatus): DbQuoteStatus {
  return label.toUpperCase().replace(/ /g, "_") as DbQuoteStatus;
}

const QUOTE_INCLUDE = {
  customer: { include: { user: { select: { name: true } } } },
} satisfies Prisma.QuoteInclude;

type DbQuote = Prisma.QuoteGetPayload<{ include: typeof QUOTE_INCLUDE }>;

function mapQuote(row: DbQuote): Quote {
  return {
    id: row.id,
    code: row.code,
    customerName: row.customer.user.name,
    occasion: row.occasion,
    size: row.size,
    flavour: row.flavour,
    filling: row.filling,
    decoration: row.decoration,
    eventDate: row.eventDate.toISOString(),
    guests: row.guests ?? undefined,
    status: quoteStatusLabel(row.status),
    estimatedPrice: row.estimatedPrice ? Number(row.estimatedPrice) : undefined,
    quotedPrice: row.quotedPrice ? Number(row.quotedPrice) : undefined,
    createdAt: row.createdAt.toISOString(),
    referenceImages: row.referenceImages,
    specialInstructions: row.specialInstructions ?? undefined,
  };
}

export const getDashboardQuotes = cache(async (): Promise<QuotesResult> => {
  if (!isDatabaseConfigured()) return { quotes: QUOTES, live: false };
  const rows = await prisma.quote.findMany({
    include: QUOTE_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return { quotes: rows.map(mapQuote), live: true };
});
