import "server-only";

import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { SIZE_LABEL } from "@/lib/dashboard/product-constants";
import {
  CAKES,
  getCakeBySlug as getDemoCakeBySlug,
  getCakesByCategory as getDemoCakesByCategory,
  getRelatedCakes as getDemoRelatedCakes,
} from "@/lib/data/cakes";
import type { Cake, CakeCategorySlug } from "@/types";

/**
 * Storefront catalog reads — the public-facing counterpart to
 * lib/dashboard/products.ts, which is the console's management view of the
 * same table.
 *
 * Policy: fall back to the compiled-in demo cakes only when there's no
 * database configured at all (a fresh clone, local exploration) — matching
 * orders and customers, not the gallery's fall-back-on-empty. Once a
 * database exists, an empty result is empty: a bakery that has genuinely
 * removed every product should show an honest "nothing available" state,
 * not silently keep selling cakes that don't exist. In practice this rarely
 * shows up, because the build seeds the existing catalog into the database
 * automatically the first time one is connected (see
 * scripts/deploy-migrate.mjs) — it only shows up if an owner deliberately
 * empties the catalog.
 */

const CATALOG_INCLUDE = { category: { select: { slug: true } } } satisfies Prisma.ProductInclude;
type DbProductWithCategory = Prisma.ProductGetPayload<{ include: typeof CATALOG_INCLUDE }>;

/** Shared by both the storefront pages here and the /api/cakes routes, so
 * the two can't drift into returning differently-shaped data. */
export function mapProductToCake(row: DbProductWithCategory): Cake {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category.slug as CakeCategorySlug,
    images: row.images,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : undefined,
    servings: row.servings,
    prepTimeHours: row.prepTimeHours,
    available: row.isAvailable,
    flavours: row.flavours as Cake["flavours"],
    sizes: row.sizes.map((s) => SIZE_LABEL[s]),
    rating: row.ratingAvg,
    reviewCount: row.ratingCount,
    description: row.description,
    tags: row.tags,
    productionPoints: row.productionPoints,
    // Real reviews aren't wired to the storefront yet — an empty list here
    // is honest (a new product really does have none), not a placeholder.
    reviews: [],
  };
}

/** Only cakes a customer can actually order — the console's own list
 * (lib/dashboard/products.ts) intentionally shows unavailable ones too, so
 * staff can re-enable them; the storefront never should. */
const AVAILABLE_ONLY = { isAvailable: true } satisfies Prisma.ProductWhereInput;

export const getCatalogCakes = cache(async (): Promise<Cake[]> => {
  if (!isDatabaseConfigured()) return CAKES;
  const rows = await prisma.product.findMany({
    where: AVAILABLE_ONLY,
    include: CATALOG_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProductToCake);
});

export const getCatalogCakesByCategory = cache(async (categorySlug: string): Promise<Cake[]> => {
  if (!isDatabaseConfigured()) return getDemoCakesByCategory(categorySlug);
  const rows = await prisma.product.findMany({
    where: { ...AVAILABLE_ONLY, category: { slug: categorySlug } },
    include: CATALOG_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProductToCake);
});

export const getCatalogCakeBySlug = cache(async (slug: string): Promise<Cake | null> => {
  if (!isDatabaseConfigured()) return getDemoCakeBySlug(slug) ?? null;
  // Unlike the listing reads, a direct link to a specific cake still resolves
  // even if it's currently marked unavailable — "sold out" is a real page a
  // customer can land on, not a 404.
  const row = await prisma.product.findUnique({ where: { slug }, include: CATALOG_INCLUDE });
  return row ? mapProductToCake(row) : null;
});

export const getCatalogRelatedCakes = cache(
  async (cake: Cake, limit = 4): Promise<Cake[]> => {
    if (!isDatabaseConfigured()) return getDemoRelatedCakes(cake, limit);
    const rows = await prisma.product.findMany({
      where: { ...AVAILABLE_ONLY, category: { slug: cake.category }, id: { not: cake.id } },
      include: CATALOG_INCLUDE,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapProductToCake);
  }
);

/** Homepage "Featured Cakes" — tagged "Featured" by whoever manages the
 * catalog, live or demo alike, rather than a hardcoded name list that only
 * ever matched the four specific demo products. */
export const getCatalogFeaturedCakes = cache(async (limit = 4): Promise<Cake[]> => {
  if (!isDatabaseConfigured()) {
    return CAKES.filter((c) => c.tags.includes("Featured")).slice(0, limit);
  }
  const rows = await prisma.product.findMany({
    where: { ...AVAILABLE_ONLY, tags: { has: "Featured" } },
    include: CATALOG_INCLUDE,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProductToCake);
});

/** Homepage "Ready Today" — the ready-today category if it has entries,
 * otherwise any available cake, matching the demo data's own fallback. */
export const getCatalogReadyTodayCakes = cache(async (limit = 8): Promise<Cake[]> => {
  if (!isDatabaseConfigured()) {
    const byCategory = CAKES.filter((c) => c.category === "ready-today");
    const list = byCategory.length > 0 ? byCategory : CAKES.filter((c) => c.available);
    return list.slice(0, limit);
  }
  const byCategory = await prisma.product.findMany({
    where: { ...AVAILABLE_ONLY, category: { slug: "ready-today" } },
    include: CATALOG_INCLUDE,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  if (byCategory.length > 0) return byCategory.map(mapProductToCake);

  const anyAvailable = await prisma.product.findMany({
    where: AVAILABLE_ONLY,
    include: CATALOG_INCLUDE,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return anyAvailable.map(mapProductToCake);
});
