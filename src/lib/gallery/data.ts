import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { CAKE_IMAGES } from "@/lib/data/images";
import { GALLERY_CATEGORIES, type GalleryCategorySlug } from "./media";

/**
 * Gallery reads. Falls back to the vendored stock photos when there's no
 * database or no rows yet, the same graceful-degrade convention used
 * everywhere else (see lib/platform-settings.ts) — a fresh clone or a
 * database with nothing uploaded yet still shows a populated gallery instead
 * of an empty page.
 */

export type GalleryItemView = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  posterUrl: string | null;
  caption: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
};

const DEMO_CAPTIONS = [
  "Three-tier wedding cake with sugar florals",
  "Birthday celebration cake",
  "Branded corporate launch cake",
  "Graduation cake in faculty colours",
  "Signature cupcake box",
];

function demoItems(): GalleryItemView[] {
  const cycle: GalleryCategorySlug[] = GALLERY_CATEGORIES.map((c) => c.slug);
  const items: GalleryItemView[] = [];
  let idx = 0;
  for (let r = 0; r < 3; r++) {
    for (let i = 0; i < CAKE_IMAGES.length; i++) {
      items.push({
        id: `demo-${r}-${i}`,
        type: "IMAGE",
        url: CAKE_IMAGES[i],
        posterUrl: null,
        caption: DEMO_CAPTIONS[idx % DEMO_CAPTIONS.length],
        category: cycle[idx % cycle.length],
        isPublished: true,
        createdAt: new Date(2026, 0, 1).toISOString(),
      });
      idx++;
    }
  }
  return items;
}

function mapRow(row: {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  posterUrl: string | null;
  caption: string;
  category: string;
  isPublished: boolean;
  createdAt: Date;
}): GalleryItemView {
  return {
    id: row.id,
    type: row.type,
    url: row.url,
    posterUrl: row.posterUrl,
    caption: row.caption,
    category: row.category,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Published items for the public /gallery page. */
export const getPublicGalleryItems = cache(async (): Promise<GalleryItemView[]> => {
  if (!isDatabaseConfigured()) return demoItems();
  try {
    const rows = await prisma.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.length > 0 ? rows.map(mapRow) : demoItems();
  } catch (err) {
    console.error("[gallery] public read failed, using demo items:", err);
    return demoItems();
  }
});

/** Everything, published or not, for the dashboard manager. */
export const getAllGalleryItems = cache(async (): Promise<GalleryItemView[]> => {
  if (!isDatabaseConfigured()) return demoItems();
  try {
    const rows = await prisma.galleryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.length > 0 ? rows.map(mapRow) : demoItems();
  } catch (err) {
    console.error("[gallery] admin read failed, using demo items:", err);
    return demoItems();
  }
});
