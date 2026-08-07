"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFavourites } from "@/lib/favourites-context";
import { formatKes } from "@/lib/utils";

export default function FavouritesPage() {
  const { favourites, removeFavourite, clearFavourites, hydrated } = useFavourites();

  if (!hydrated) {
    return (
      <section className="container-luxe py-16 lg:py-24">
        <div className="h-40 animate-pulse rounded-2xl bg-muted/50" />
      </section>
    );
  }

  if (favourites.length === 0) {
    return (
      <section className="container-luxe py-16 lg:py-24">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border/70 bg-card px-8 py-16 text-center shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-full bg-blush text-berry">
            <Heart className="size-6" strokeWidth={1.8} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">No favourites yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any cake to save it here for later.
          </p>
          <Button asChild className="mt-8">
            <Link href="/cakes">Browse Cakes</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-luxe py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Your <span className="italic text-berry">Favourites</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {favourites.length} {favourites.length === 1 ? "cake" : "cakes"} saved for later.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearFavourites}>
          <Trash2 className="size-4" />
          Clear all
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {favourites.map((f) => (
          <Card key={f.cakeId} className="group relative gap-0 overflow-hidden p-0">
            <Link href={`/cakes/${f.category}/${f.slug}`} className="block">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="line-clamp-1 font-display text-base font-semibold">{f.name}</h2>
                <p className="mt-1 font-semibold text-berry">{formatKes(f.price)}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => removeFavourite(f.cakeId)}
              aria-label={`Remove ${f.name} from favourites`}
              className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-cream/90 text-berry shadow-sm backdrop-blur-sm transition-colors hover:bg-cream"
            >
              <Heart className="size-[18px] fill-berry" strokeWidth={1.9} />
            </button>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <Button asChild variant="outline">
          <Link href="/cakes">
            Keep browsing
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
