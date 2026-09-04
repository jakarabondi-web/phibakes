"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatKes } from "@/lib/utils";
import type { Cake } from "@/types";

/** Split out from featured-cakes.tsx because it needs the cart hook —
 * the section around it fetches live data server-side and stays a Server
 * Component, so only this card (rendered with plain serializable props)
 * is a client boundary. */
export function FeaturedCakeCard({ cake }: { cake: Cake }) {
  const { addItem } = useCart();
  const defaultSize = cake.sizes[0] ?? "Custom";
  const defaultFlavour = cake.flavours[0] ?? "Vanilla";

  const handleAddToCart = () => {
    addItem({
      id: `${cake.id}-${defaultSize}-${defaultFlavour}`,
      cakeId: cake.id,
      name: cake.name,
      image: cake.images[0],
      size: defaultSize,
      flavour: defaultFlavour,
      price: cake.price,
    });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/cakes/${cake.category}/${cake.slug}`} className="block p-3 pb-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={cake.images[0]}
            alt={cake.name}
            fill
            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/cakes/${cake.category}/${cake.slug}`}>
          <h3 className="line-clamp-1 font-display text-base font-semibold leading-snug text-foreground">
            {cake.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="font-medium text-foreground">{cake.rating.toFixed(1)}</span>
          <span>({cake.reviewCount})</span>
          <span className="mx-1 text-border">•</span>
          <Users className="size-3.5" />
          <span>{cake.servings.split(" ")[0]}</span>
          <span className="mx-1 text-border">•</span>
          <Clock className="size-3.5" />
          <span>{cake.prepTimeHours > 0 ? `${cake.prepTimeHours} hrs prep` : "Ready today"}</span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-berry">
            {formatKes(cake.price)}
          </span>
          {cake.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatKes(cake.compareAtPrice)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="mt-2 w-full text-xs font-semibold uppercase tracking-wider"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
