"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKes, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Cake } from "@/types";

// Multipliers are relative to the "1kg" size where applicable, so browsing
// larger/smaller sizes shows a sensible price change. Cakes priced per
// tier/design (wedding multi-tier, custom) keep a flat price across sizes.
const SIZE_MULTIPLIERS: Record<string, number> = {
  "0.5kg": 0.6,
  "1kg": 1,
  "2kg": 1.85,
  "3kg": 2.6,
  "Multi-tier": 1,
  Custom: 1,
};

export function CakeOptions({ cake }: { cake: Cake }) {
  const { addItem } = useCart();
  const [flavour, setFlavour] = React.useState(cake.flavours[0]);
  const [size, setSize] = React.useState(cake.sizes[0]);
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  const usesRelativePricing = cake.sizes.includes("1kg");
  const unitPrice = usesRelativePricing
    ? Math.round(cake.price * (SIZE_MULTIPLIERS[size] ?? 1))
    : cake.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      id: `${cake.id}-${size}-${flavour}`,
      cakeId: cake.id,
      name: cake.name,
      image: cake.images[0],
      size,
      flavour,
      price: unitPrice,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2.5 text-sm font-semibold text-foreground">
          Flavour <span className="font-normal text-muted-foreground">— {flavour}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {cake.flavours.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFlavour(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                f === flavour
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-blush/40"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-foreground">
          Size <span className="font-normal text-muted-foreground">— {size}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {cake.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                s === size
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-blush/40"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm font-semibold text-foreground">Quantity</p>
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-2 border-t border-border/70 pt-5">
        <span className="font-display text-2xl font-bold text-berry">{formatKes(totalPrice)}</span>
        {quantity > 1 && (
          <span className="text-sm text-muted-foreground">({formatKes(unitPrice)} each)</span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={!cake.available}
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check className="size-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" />
              {cake.available ? "Add to Cart" : "Currently Unavailable"}
            </>
          )}
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/custom-cake-builder">Design Similar as Custom</Link>
        </Button>
      </div>
    </div>
  );
}
