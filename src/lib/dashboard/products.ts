import "server-only";

import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { CATEGORIES } from "@/lib/data/categories";
import { CAKES } from "@/lib/data/cakes";
import type { CakeFlavour, CakeSize } from "@/types";
import { SIZE_LABEL } from "./product-constants";

export * from "./product-constants";

/**
 * Product catalog reads for the console.
 *
 * This is a management screen, not the storefront: with no database it shows
 * the built-in demo catalog read-only (same disabled-fields convention as
 * Settings and Staff), rather than orders/customers' stricter policy — there's
 * nothing here an owner could mistake for a real sale.
 *
 * The storefront pages themselves (/cakes, /cakes/[category]/[slug]) are a
 * separate, larger piece of work — they're statically built from the compiled
 * cake list today. Wiring them to read what's managed here is the natural
 * next step, not part of this screen.
 */

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  servings: string;
  prepTimeHours: number;
  isAvailable: boolean;
  productionPoints: number;
  sizes: CakeSize[];
  flavours: CakeFlavour[];
  images: string[];
  tags: string[];
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
};

export type ProductsResult = {
  products: ProductRow[];
  /** false = running on the built-in demo catalog (no database configured). */
  live: boolean;
};


type DbProduct = Prisma.ProductGetPayload<{ include: { category: { select: { slug: true; name: true } } } }>;

function mapProduct(row: DbProduct): ProductRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    categorySlug: row.category.slug,
    categoryName: row.category.name,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
    servings: row.servings,
    prepTimeHours: row.prepTimeHours,
    isAvailable: row.isAvailable,
    productionPoints: row.productionPoints,
    sizes: row.sizes.map((s) => SIZE_LABEL[s]),
    flavours: row.flavours as CakeFlavour[],
    images: row.images,
    tags: row.tags,
    ratingAvg: row.ratingAvg,
    ratingCount: row.ratingCount,
    createdAt: row.createdAt.toISOString(),
  };
}

function demoProducts(): ProductRow[] {
  return CAKES.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    categorySlug: c.category,
    categoryName: CATEGORIES.find((cat) => cat.slug === c.category)?.name ?? c.category,
    price: c.price,
    compareAtPrice: c.compareAtPrice ?? null,
    servings: c.servings,
    prepTimeHours: c.prepTimeHours,
    isAvailable: c.available,
    productionPoints: c.productionPoints,
    sizes: c.sizes,
    flavours: c.flavours,
    images: c.images,
    tags: c.tags,
    ratingAvg: c.rating,
    ratingCount: c.reviewCount,
    createdAt: "2026-01-01T00:00:00.000Z",
  }));
}

export const getDashboardProducts = cache(async (): Promise<ProductsResult> => {
  if (!isDatabaseConfigured()) return { products: demoProducts(), live: false };
  const rows = await prisma.product.findMany({
    include: { category: { select: { slug: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return { products: rows.map(mapProduct), live: true };
});

export const getDashboardProductById = cache(
  async (id: string): Promise<{ product: ProductRow | null; live: boolean }> => {
    if (!isDatabaseConfigured()) {
      return { product: demoProducts().find((p) => p.id === id) ?? null, live: false };
    }
    const row = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { slug: true, name: true } } },
    });
    return { product: row ? mapProduct(row) : null, live: true };
  }
);

/** Ensures the DB row for a fixed category slug exists, creating it from the
 * compiled-in definition if this is the first product ever assigned to it —
 * so product creation never depends on `npm run db:seed` having been run. */
export async function ensureCategory(slug: string) {
  const def = CATEGORIES.find((c) => c.slug === slug);
  if (!def) throw new Error(`Unknown category "${slug}".`);
  return prisma.category.upsert({
    where: { slug: def.slug },
    update: {},
    create: { slug: def.slug, name: def.name, description: def.description, imageUrl: def.image },
  });
}
