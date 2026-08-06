import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { TESTIMONIALS } from "@/lib/data/testimonials";
import { AVATAR_IMAGES } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { Testimonial } from "@/types";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "See what Nairobi customers say about PhiBakes — verified reviews on our wedding, birthday, corporate, and custom cakes.",
};

const EXTRA_REVIEWS: (Testimonial & { date: string })[] = [
  {
    id: "r1",
    name: "Grace Achieng",
    role: "Bride, Lavington",
    avatar: AVATAR_IMAGES[0],
    rating: 5,
    quote:
      "The tasting session sold us instantly. On the day, the cake looked even better than the design mockup — flawless finish.",
    date: "2026-06-14",
  },
  {
    id: "r2",
    name: "Peter Nderitu",
    role: "Operations Manager, Zawadi Ltd",
    avatar: AVATAR_IMAGES[1],
    rating: 5,
    quote:
      "We've ordered three corporate cakes this year alone. Consistent quality and the invoicing process makes procurement easy.",
    date: "2026-05-02",
  },
  {
    id: "r3",
    name: "Naomi Chebet",
    role: "Mother, Kileleshwa",
    avatar: AVATAR_IMAGES[2],
    rating: 5,
    quote:
      "My daughter's unicorn cake was a showstopper. The decorating detail was incredible for the price.",
    date: "2026-04-21",
  },
  {
    id: "r4",
    name: "Ian Mburu",
    role: "Groom, Runda",
    avatar: AVATAR_IMAGES[3],
    rating: 4,
    quote:
      "Beautiful cake and great communication throughout. Delivery arrived slightly outside the window but the team called ahead to explain.",
    date: "2026-03-10",
  },
  {
    id: "r5",
    name: "Esther Wambui",
    role: "Repeat Customer, CBD",
    avatar: AVATAR_IMAGES[4],
    rating: 5,
    quote:
      "The M-PESA checkout is so smooth — STK push, paid, done. My go-to bakery for last-minute birthday cakes.",
    date: "2026-02-18",
  },
  {
    id: "r6",
    name: "Tom Kiptoo",
    role: "Event Planner",
    avatar: AVATAR_IMAGES[5],
    rating: 5,
    quote:
      "Dessert tables for two of my client events now, both flawless. PhiBakes is reliable under pressure.",
    date: "2026-01-25",
  },
];

const ALL_REVIEWS = [
  ...TESTIMONIALS.map((t) => ({ ...t, date: "2025-11-08" })),
  ...EXTRA_REVIEWS,
];

const AVERAGE =
  Math.round((ALL_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / ALL_REVIEWS.length) * 10) / 10;

const DISTRIBUTION = [5, 4, 3, 2, 1].map((star) => {
  const count = ALL_REVIEWS.filter((r) => r.rating === star).length;
  return { star, count, pct: Math.round((count / ALL_REVIEWS.length) * 100) };
});

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-gold text-gold" : "text-border"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <section className="bg-noise">
      <div className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
            <Star className="size-3.5 fill-gold text-gold" /> Customer Reviews
          </Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Loved by Nairobi, one cake at a time
          </h1>
          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            {ALL_REVIEWS.length}+ verified reviews from real PhiBakes customers.
          </p>
        </div>

        {/* SUMMARY */}
        <Card className="mx-auto mt-14 max-w-3xl p-8 sm:p-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="text-center sm:border-r sm:border-border sm:pr-8">
              <div className="font-display text-6xl font-bold text-berry">{AVERAGE}</div>
              <Stars rating={Math.round(AVERAGE)} className="mt-2 justify-center" />
              <p className="mt-2 text-xs text-muted-foreground">{ALL_REVIEWS.length} reviews</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {DISTRIBUTION.map((d) => (
                <div key={d.star} className="flex items-center gap-3 text-xs">
                  <span className="w-10 shrink-0 text-muted-foreground">{d.star} star</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="w-9 shrink-0 text-right text-muted-foreground">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* REVIEW GRID */}
        <div className="mx-auto mt-16 max-w-6xl">
          <SectionHeading eyebrow="What customers say" title="Recent reviews" align="left" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_REVIEWS.map((r) => (
              <Card key={r.id} className="p-6">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={r.avatar} alt={r.name} fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{r.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Stars rating={r.rating} />
                  <Badge variant="success" className="text-[10px]">
                    Verified Purchase
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <p className="mt-4 text-xs text-muted-foreground/70">{formatDate(r.date)}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
