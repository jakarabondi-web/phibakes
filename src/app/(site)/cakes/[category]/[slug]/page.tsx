import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Star, Users, Clock, ShieldCheck, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/site/section-heading";
import { CakeCard } from "@/components/site/cake-card";
import { CakeGallery } from "@/components/site/cake-gallery";
import { CakeOptions } from "@/components/site/cake-options";
import { formatDate, formatKes, initials, cn } from "@/lib/utils";
import { CAKES, getCakeBySlug, getRelatedCakes, getCategory } from "@/lib/data";

export function generateStaticParams() {
  return CAKES.map((cake) => ({ category: cake.category, slug: cake.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const cake = getCakeBySlug(slug);
  if (!cake) return {};
  return {
    title: `${cake.name} | PhiBakes`,
    description: cake.description,
    openGraph: {
      title: cake.name,
      description: cake.description,
      images: cake.images[0] ? [cake.images[0]] : undefined,
    },
  };
}

function StarRow({ rating, size = "size-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(size, i < Math.round(rating) ? "fill-gold text-gold" : "text-border")}
        />
      ))}
    </div>
  );
}

export default async function CakeDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const cake = getCakeBySlug(slug);
  if (!cake || cake.category !== categorySlug) notFound();

  const category = getCategory(cake.category);
  const related = getRelatedCakes(cake, 4);

  return (
    <>
      <div className="container-luxe py-6">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-berry">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/cakes" className="transition-colors hover:text-berry">
            Cakes
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/cakes/${cake.category}`} className="transition-colors hover:text-berry">
            {category?.name ?? cake.category}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">{cake.name}</span>
        </nav>
      </div>

      {/* PRODUCT */}
      <section className="pb-16">
        <div className="container-luxe grid grid-cols-1 gap-12 lg:grid-cols-2">
          <CakeGallery images={cake.images} name={cake.name} />

          <div>
            <div className="flex flex-wrap gap-1.5">
              {cake.tags.map((tag) => (
                <Badge key={tag} variant="gold">
                  {tag}
                </Badge>
              ))}
              {cake.available ? (
                <Badge variant="success">Available</Badge>
              ) : (
                <Badge variant="destructive">Currently Unavailable</Badge>
              )}
            </div>

            <h1 className="mt-4 text-balance font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {cake.name}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <StarRow rating={cake.rating} />
                <span className="font-semibold text-foreground">{cake.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">
                ({cake.reviewCount} review{cake.reviewCount === 1 ? "" : "s"})
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-berry">
                {formatKes(cake.price)}
              </span>
              {cake.compareAtPrice && (
                <span className="text-base text-muted-foreground line-through">
                  {formatKes(cake.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-berry" /> Serves {cake.servings}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-berry" />
                {cake.prepTimeHours > 0
                  ? cake.prepTimeHours >= 24
                    ? `${Math.round(cake.prepTimeHours / 24)}-day prep`
                    : `${cake.prepTimeHours}hr prep`
                  : "Ready today"}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-berry" /> Secure M-PESA checkout
              </span>
            </div>

            <Separator className="my-6" />

            <CakeOptions cake={cake} />
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="border-t border-border/70 py-16">
        <div className="container-luxe grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">About this cake</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{cake.description}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-secondary/30 p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              Good to know
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-berry" />
                Handcrafted to order in our Kilimani studio.
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-berry" />
                {cake.productionPoints}-stage production &amp; quality check process.
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-berry" />
                Secure a slot with a 50% M-PESA deposit at checkout.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-t border-border/70 py-16">
        <div className="container-luxe">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Customer Reviews"
              title={`${cake.rating.toFixed(1)} out of 5`}
              description={`Based on ${cake.reviewCount} verified reviews`}
            />
            <StarRow rating={cake.rating} size="size-5" />
          </div>

          {cake.reviews.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {cake.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {review.avatar && <AvatarImage src={review.avatar} alt={review.customerName} />}
                        <AvatarFallback>{initials(review.customerName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          {review.customerName}
                          {review.verified && (
                            <Badge variant="success" className="px-1.5 py-0 text-[10px]">
                              Verified
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <StarRow rating={review.rating} size="size-3.5" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {review.photos.map((photo, i) => (
                        <div key={i} className="relative size-16 overflow-hidden rounded-lg">
                          <Image src={photo} alt="Customer photo" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {review.ownerReply && (
                    <div className="mt-4 rounded-xl bg-blush/40 p-4">
                      <p className="text-xs font-semibold text-berry">Reply from PhiBakes</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                        {review.ownerReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-muted-foreground">No reviews yet for this cake.</p>
          )}
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="border-t border-border/70 bg-secondary/30 py-16">
          <div className="container-luxe">
            <SectionHeading eyebrow="Complete the celebration" title="You may also like" />
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((relatedCake) => (
                <CakeCard key={relatedCake.id} cake={relatedCake} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
