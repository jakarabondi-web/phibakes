import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CAKES } from "@/lib/data/cakes";
import { ORDERS } from "@/lib/data/orders";
import type { Cake } from "@/types";

// Illustrative best-seller lineup from the reference design (Red Velvet,
// Chocolate Fudge, Vanilla, Black Forest, Lemon) mapped to the closest real
// seeded cakes in the catalogue — fuzzy-matched by name, falling back to a
// flavour match for cakes that aren't literally named that (e.g. "Black
// Forest" only appears as a flavour, not a cake name).
const TARGET_KEYWORDS = ["red velvet", "chocolate", "vanilla", "black forest", "lemon"];

function findCakeForKeyword(keyword: string, used: Set<string>): Cake | undefined {
  const byName = CAKES.find((c) => !used.has(c.id) && c.name.toLowerCase().includes(keyword));
  if (byName) return byName;
  return CAKES.find((c) => !used.has(c.id) && c.flavours.some((f) => f.toLowerCase().includes(keyword)));
}

function soldCountFor(cake: Cake) {
  const real = ORDERS.reduce(
    (sum, o) => sum + o.items.filter((item) => item.cakeName === cake.name).reduce((s, item) => s + item.quantity, 0),
    0
  );
  // The seed dataset only has a handful of orders, so real line-item counts
  // are a thin signal. Once it's too small to be meaningful, fall back to a
  // deterministic number derived from the cake's rating/review count — no
  // Math.random, so this stays stable across renders and static builds.
  if (real >= 8) return real;
  return Math.max(real, Math.round(cake.reviewCount * (cake.rating / 5) * 0.6));
}

function buildTopCakes() {
  const used = new Set<string>();
  const picks: Cake[] = [];
  for (const keyword of TARGET_KEYWORDS) {
    const cake = findCakeForKeyword(keyword, used);
    if (cake) {
      used.add(cake.id);
      picks.push(cake);
    }
  }
  return picks
    .map((cake) => ({ cake, sold: soldCountFor(cake) }))
    .sort((a, b) => b.sold - a.sold);
}

export function TopCakes() {
  const items = buildTopCakes();

  return (
    <Card className="gap-4 rounded-[var(--radius-dashboard)] p-5">
      <div>
        <p className="font-display text-lg font-semibold leading-tight">Top Cakes</p>
        <p className="text-sm text-muted-foreground">Best sellers this season</p>
      </div>
      <div className="flex flex-col divide-y divide-border">
        {items.map(({ cake, sold }, i) => (
          <div key={cake.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="w-4 shrink-0 text-xs font-semibold text-muted-foreground">{i + 1}</span>
            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
              <Image src={cake.images[0]} alt={cake.name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{cake.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">{cake.category.replace("-", " ")}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-primary">{sold} sold</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
