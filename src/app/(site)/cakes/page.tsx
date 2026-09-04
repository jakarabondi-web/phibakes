import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { CatalogFilters } from "@/components/site/catalog-filters";
import { CATEGORIES, HERO_IMAGES } from "@/lib/data";
import { getCatalogCakes } from "@/lib/catalog";

// Reads live product data (lib/catalog.ts) but stays statically cached and
// fast — product-actions.ts revalidates this path on every catalog change,
// so it's never stale in practice, without paying force-dynamic's per-request
// cost on the highest-traffic storefront page.
export const metadata = {
  title: "Shop All Cakes | PhiBakes",
  description:
    "Browse PhiBakes' full collection of handcrafted wedding, birthday, graduation, corporate and celebration cakes — baked to order in Nairobi.",
};

export default async function CakesPage() {
  const cakes = await getCatalogCakes();
  return (
    <>
      <section className="relative overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-gradient-to-b from-blush/60 via-cream to-cream" />
        <div className="container-luxe relative grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <Badge variant="gold" className="px-3.5 py-1.5 text-xs">
              <Sparkles className="size-3.5" /> The Full Collection
            </Badge>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl">
              Shop All <span className="italic text-berry">Cakes</span>
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-muted-foreground">
              Every cake is handcrafted to order in our Kilimani studio — from same-day treats to
              multi-tier wedding centrepieces. Filter by category, flavour, and size to find your
              perfect match.
            </p>
          </div>
          <div className="relative hidden aspect-[16/10] w-full overflow-hidden rounded-[2rem] shadow-2xl lg:block">
            <Image
              src={HERO_IMAGES[1] ?? HERO_IMAGES[0]}
              alt="PhiBakes cake collection"
              fill
              sizes="45vw"
              className="object-cover"
              preload
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/30 py-6">
        <div className="container-luxe flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-muted-foreground">Jump to:</span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/cakes/${cat.slug}`}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-blush/50 hover:text-berry"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Full Catalog"
            title={`${cakes.length} Handcrafted Designs`}
            description="Use the filters below to narrow down by category, flavour, or size — or sort by price and rating."
          />
          <div className="mt-8">
            <CatalogFilters cakes={cakes} />
          </div>
        </div>
      </section>
    </>
  );
}
