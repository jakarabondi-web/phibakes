"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatKes } from "@/lib/utils";
import { CAKES } from "@/lib/data/cakes";
import { PageHeader } from "../_components/page-header";

const WISHLIST_IDS = CAKES.slice(2, 8).map((c) => c.id);

export default function WishlistPage() {
  const [ids, setIds] = React.useState<Set<string>>(new Set(WISHLIST_IDS));
  const cakes = CAKES.filter((c) => ids.has(c.id));

  function remove(id: string, name: string) {
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success(`Removed "${name}" from your wishlist.`);
  }

  return (
    <div>
      <PageHeader title="Wishlist" description="Cakes you've saved for later." />

      {cakes.length === 0 ? (
        <Card className="p-10 py-12 text-center">
          <Heart className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 font-display text-lg font-semibold">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Save cakes you love to order them later.</p>
          <Button className="mt-5" asChild>
            <Link href="/cakes">Browse Cakes</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cakes.map((cake) => (
            <Card key={cake.id} className="overflow-hidden p-0 py-0">
              <div className="relative aspect-square w-full">
                <Image src={cake.images[0]} alt={cake.name} fill sizes="240px" className="object-cover" />
                <button
                  onClick={() => remove(cake.id, cake.name)}
                  aria-label="Remove from wishlist"
                  className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="truncate font-display text-sm font-semibold">{cake.name}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 fill-gold text-gold" /> {cake.rating.toFixed(1)} ({cake.reviewCount})
                </div>
                <p className="mt-1.5 text-sm font-semibold text-primary">{formatKes(cake.price)}</p>
                <Button size="sm" className="mt-3 w-full" asChild>
                  <Link href={`/cakes/${cake.category}/${cake.slug}`}>Order Now</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
