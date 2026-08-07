"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFavourites } from "@/lib/favourites-context";
import type { Cake } from "@/types";

/**
 * Heart toggle for saving a cake. Rendered inside cake cards (which are
 * themselves links), so it stops propagation to avoid navigating on click.
 */
export function FavouriteButton({
  cake,
  className,
  size = "default",
}: {
  cake: Pick<Cake, "id" | "slug" | "category" | "name" | "images" | "price">;
  className?: string;
  size?: "default" | "sm";
}) {
  const { isFavourite, toggleFavourite, hydrated } = useFavourites();
  const active = isFavourite(cake.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nowFavourite = toggleFavourite({
      cakeId: cake.id,
      slug: cake.slug,
      category: cake.category,
      name: cake.name,
      image: cake.images[0],
      price: cake.price,
    });
    toast[nowFavourite ? "success" : "message"](
      nowFavourite ? `Saved ${cake.name} to favourites` : `Removed ${cake.name} from favourites`
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${cake.name} from favourites` : `Save ${cake.name} to favourites`}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-cream/90 text-berry shadow-sm backdrop-blur-sm transition-colors hover:bg-cream",
        size === "sm" ? "size-8" : "size-9",
        className
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "size-4" : "size-[18px]",
          // Before hydration we can't know the saved state; render the outline
          // so the icon never flips visibly on mount.
          hydrated && active ? "fill-berry text-berry" : "text-berry"
        )}
        strokeWidth={1.9}
      />
    </button>
  );
}
