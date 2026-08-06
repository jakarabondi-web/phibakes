import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import type { CakeCategorySlug } from "@/types";

// Popular Categories grid intentionally excludes "ready-today" — that
// category gets its own dedicated homepage section elsewhere.
const FEATURED_SLUGS: CakeCategorySlug[] = [
  "birthday",
  "wedding",
  "graduation",
  "corporate",
  "cupcakes",
  "desserts",
];

const CATEGORY_IMAGES: Record<string, string> = {
  birthday: "/images/categories/birthday-cake.png",
  wedding: "/images/categories/wedding-cake.png",
  graduation: "/images/categories/graduation-cake.png",
  corporate: "/images/categories/corporate-cake.png",
  cupcakes: "/images/categories/cupcakes.png",
  desserts: "/images/categories/desserts.png",
};

export function CategoryGrid() {
  const categories = FEATURED_SLUGS.map((slug) => CATEGORIES.find((c) => c.slug === slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  return (
    <section className="py-16 sm:py-20">
      <div className="container-luxe">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Popular Categories
          </h2>
          <Link
            href="/cakes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-berry-hover"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/cakes/${cat.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={CATEGORY_IMAGES[cat.slug] ?? cat.image}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-center justify-center p-3 text-center">
                <h3 className="font-display text-sm font-semibold leading-snug text-foreground sm:text-base">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
