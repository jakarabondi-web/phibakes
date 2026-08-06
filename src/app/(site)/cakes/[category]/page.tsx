import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { CakeCard } from "@/components/site/cake-card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, getCategory, getCakesByCategory } from "@/lib/data";

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};
  return {
    title: `${category.name} | PhiBakes`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const cakes = getCakesByCategory(category.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-noise">
        <div className="container-luxe relative py-6">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-berry">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/cakes" className="transition-colors hover:text-berry">
              Cakes
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-foreground">{category.name}</span>
          </nav>
        </div>
        <div className="relative">
          <div className="relative h-64 w-full overflow-hidden sm:h-80">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10" />
          </div>
          <div className="container-luxe absolute inset-0 flex flex-col justify-end pb-8">
            <Badge variant="gold" className="w-fit bg-gold/90 text-charcoal">
              {cakes.length} Designs
            </Badge>
            <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl font-bold text-cream sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-xl text-balance text-cream/85">{category.description}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Collection"
            title={`Explore ${category.name}`}
            description={`Handcrafted, made-to-order designs from our ${category.name.toLowerCase()} range.`}
          />
          {cakes.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {cakes.map((cake) => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="font-display text-lg font-semibold text-foreground">
                No cakes available in this category yet
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Check back soon, or browse our full collection instead.
              </p>
              <Link
                href="/cakes"
                className="mt-6 text-sm font-semibold text-berry underline-offset-4 hover:underline"
              >
                View all cakes
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
