"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand, PlayCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GALLERY_CATEGORIES } from "@/lib/gallery/media";
import type { GalleryItemView } from "@/lib/gallery/data";

const FILTERS = [{ slug: "all", label: "All Work" }, ...GALLERY_CATEGORIES] as const;
type FilterSlug = (typeof FILTERS)[number]["slug"];

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-square"];

/** R2-hosted media is a photo we didn't vendor into the app, so next/image's
 * built-in optimizer can't reach it without remotePatterns config we don't
 * control the domain for ahead of time — use a plain img there, and only
 * next/image for the local vendored demo stock. */
function isLocalAsset(src: string) {
  return src.startsWith("/");
}

export function GalleryGrid({ items }: { items: GalleryItemView[] }) {
  const [filter, setFilter] = useState<FilterSlug>("all");
  const [lightbox, setLightbox] = useState<GalleryItemView | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category === filter)),
    [items, filter]
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
        {filtered.map((item, idx) => {
          const aspect = ASPECTS[idx % ASPECTS.length];
          return (
            <button
              key={item.id}
              onClick={() => setLightbox(item)}
              className={`group relative block w-full overflow-hidden rounded-2xl shadow-sm break-inside-avoid ${aspect} cursor-pointer`}
            >
              {item.type === "VIDEO" ? (
                <video
                  src={item.url}
                  muted
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : isLocalAsset(item.url) ? (
                <Image
                  src={item.url}
                  alt={item.caption}
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 32vw, 48vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- external R2 URL, no remotePatterns configured
                <img
                  src={item.url}
                  alt={item.caption}
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {item.type === "VIDEO" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="size-10 text-cream drop-shadow-lg" />
                </div>
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex w-full items-center justify-between gap-2 p-3">
                  <span className="text-left text-xs font-medium text-cream">{item.caption}</span>
                  <Expand className="size-4 shrink-0 text-cream" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{lightbox?.caption ?? "Gallery item"}</DialogTitle>
          {lightbox && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[16/10]">
              {lightbox.type === "VIDEO" ? (
                <video
                  src={lightbox.url}
                  controls
                  autoPlay
                  className="absolute inset-0 size-full bg-charcoal object-contain"
                />
              ) : isLocalAsset(lightbox.url) ? (
                <Image src={lightbox.url} alt={lightbox.caption} fill sizes="90vw" className="object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- external R2 URL, no remotePatterns configured
                <img src={lightbox.url} alt={lightbox.caption} className="absolute inset-0 size-full object-cover" />
              )}
              {lightbox.type !== "VIDEO" && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5">
                  <p className="text-sm font-medium text-cream">{lightbox.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
