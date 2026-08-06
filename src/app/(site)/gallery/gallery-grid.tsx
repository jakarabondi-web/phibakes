"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CAKE_IMAGES } from "@/lib/data";

const FILTERS = [
  { slug: "all", label: "All Work" },
  { slug: "wedding", label: "Wedding" },
  { slug: "birthday", label: "Birthday" },
  { slug: "corporate", label: "Corporate" },
  { slug: "graduation", label: "Graduation" },
  { slug: "cupcakes", label: "Cupcakes & Desserts" },
] as const;

type FilterSlug = (typeof FILTERS)[number]["slug"];

const CATEGORY_CYCLE: FilterSlug[] = ["wedding", "birthday", "corporate", "graduation", "cupcakes"];

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-square"];

type GalleryItem = {
  id: string;
  src: string;
  category: FilterSlug;
  aspect: string;
  caption: string;
};

const CAPTIONS = [
  "Three-tier wedding cake with sugar florals",
  "Birthday celebration cake",
  "Branded corporate launch cake",
  "Graduation cake in faculty colours",
  "Signature cupcake box",
];

function buildGallery(): GalleryItem[] {
  const items: GalleryItem[] = [];
  const repeats = 3;
  let idx = 0;
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < CAKE_IMAGES.length; i++) {
      const category = CATEGORY_CYCLE[idx % CATEGORY_CYCLE.length];
      items.push({
        id: `${r}-${i}`,
        src: CAKE_IMAGES[i],
        category,
        aspect: ASPECTS[idx % ASPECTS.length],
        caption: CAPTIONS[idx % CAPTIONS.length],
      });
      idx++;
    }
  }
  return items;
}

const GALLERY = buildGallery();

export function GalleryGrid() {
  const [filter, setFilter] = useState<FilterSlug>("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? GALLERY : GALLERY.filter((item) => item.category === filter)),
    [filter]
  );

  return (
    <div>
      <div className="flex justify-center">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterSlug)}>
          <TabsList className="flex-wrap h-auto gap-1 p-1.5">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.slug} value={f.slug} className="flex-none px-4">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => setLightbox(item)}
            className={`group relative block w-full overflow-hidden rounded-2xl shadow-sm break-inside-avoid ${item.aspect} cursor-pointer`}
          >
            <Image
              src={item.src}
              alt={item.caption}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 32vw, 48vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex w-full items-center justify-between gap-2 p-3">
                <span className="text-left text-xs font-medium text-cream">{item.caption}</span>
                <Expand className="size-4 shrink-0 text-cream" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{lightbox?.caption ?? "Cake photo"}</DialogTitle>
          {lightbox && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[16/10]">
              <Image
                src={lightbox.src}
                alt={lightbox.caption}
                fill
                sizes="90vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5">
                <p className="text-sm font-medium text-cream">{lightbox.caption}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
