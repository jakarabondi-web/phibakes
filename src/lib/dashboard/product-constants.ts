import type { CakeSize as DbCakeSize } from "@prisma/client";
import { CATEGORIES } from "@/lib/data/categories";
import type { CakeFlavour, CakeSize } from "@/types";

/**
 * Product constants shared between server (reads, actions) and client (the
 * form). No "server-only" here on purpose — this file has no database or
 * session dependency, just fixed lookup tables, so it's safe to import from
 * the client form component directly.
 */

/** DB enum <-> the size labels used across the storefront and cart. */
export const SIZE_LABEL: Record<DbCakeSize, CakeSize> = {
  HALF_KG: "0.5kg",
  ONE_KG: "1kg",
  TWO_KG: "2kg",
  THREE_KG: "3kg",
  MULTI_TIER: "Multi-tier",
  CUSTOM: "Custom",
};

export const SIZE_ENUM: Record<CakeSize, DbCakeSize> = {
  "0.5kg": "HALF_KG",
  "1kg": "ONE_KG",
  "2kg": "TWO_KG",
  "3kg": "THREE_KG",
  "Multi-tier": "MULTI_TIER",
  Custom: "CUSTOM",
};

export const ALL_SIZES = Object.keys(SIZE_ENUM) as CakeSize[];

export const ALL_FLAVOURS: CakeFlavour[] = [
  "Vanilla",
  "Chocolate",
  "Red Velvet",
  "Black Forest",
  "White Forest",
  "Carrot",
  "Marble",
  "Lemon",
  "Blueberry",
  "Fruit Cake",
];

/** The fixed category taxonomy the whole site's URLs and nav are built on
 * (see lib/data/categories.ts) — products are assigned to one of these, not
 * an arbitrary owner-typed category, so a typo can't silently create a
 * category page nothing links to. */
export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }));
