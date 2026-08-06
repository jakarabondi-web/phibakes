"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKes, cn } from "@/lib/utils";
import type { Cake } from "@/types";

export function CakeCard({ cake, className }: { cake: Cake; className?: string }) {
  return (
    <Link
      href={`/cakes/${cake.category}/${cake.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <Image
          src={cake.images[0]}
          alt={cake.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {cake.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="gold" className="bg-cream/90 text-berry backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
        {!cake.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50 backdrop-blur-[1px]">
            <Badge variant="destructive" className="bg-cream text-error">
              Currently Unavailable
            </Badge>
          </div>
        )}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button size="sm" className="w-full" variant="default">
            View Cake
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-foreground">
            {cake.name}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="font-medium text-foreground">{cake.rating.toFixed(1)}</span>
          <span>({cake.reviewCount})</span>
          <span className="mx-1 text-border">•</span>
          <Users className="size-3.5" />
          <span>{cake.servings.split(" ")[0]}</span>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-display text-lg font-bold text-berry">{formatKes(cake.price)}</span>
            {cake.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatKes(cake.compareAtPrice)}
              </span>
            )}
          </div>
          {cake.prepTimeHours > 0 ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {cake.prepTimeHours >= 24 ? `${Math.round(cake.prepTimeHours / 24)}d` : `${cake.prepTimeHours}h`}
            </span>
          ) : (
            <Badge variant="success">Ready Today</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
