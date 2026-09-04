import { getCatalogFeaturedCakes } from "@/lib/catalog";
import { FeaturedCakeCard } from "./featured-cake-card";

/** Cakes tagged "Featured" by whoever manages the catalog — live or demo
 * alike, see lib/catalog.ts. A Server Component so the fetch runs on the
 * server; only the individual card (which needs the cart hook) is a client
 * boundary, in featured-cake-card.tsx. */
export async function FeaturedCakes() {
  const cakes = await getCatalogFeaturedCakes(4);
  if (cakes.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-luxe">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Featured <span className="italic text-berry">Cakes</span>
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cakes.map((cake) => (
            <FeaturedCakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      </div>
    </section>
  );
}
