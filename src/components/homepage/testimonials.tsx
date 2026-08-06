"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { TESTIMONIALS } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

const FEATURED = TESTIMONIALS.slice(0, 3);

export function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20">
      <div className="container-luxe">
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title="What Our Customers Say"
          accent="Say"
          className="mx-auto"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURED.map((t) => (
            <Card key={t.id} className="p-6 py-6">
              <div className="flex items-center gap-1 px-0">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    className={cn(
                      "size-4",
                      starIdx < t.rating ? "fill-gold text-gold" : "text-border"
                    )}
                  />
                ))}
              </div>
              <p className="mt-4 px-0 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 px-0">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {FEATURED.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Show testimonial ${i + 1} from ${t.name}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "size-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === active ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
