"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, Tag, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { cn, formatKes } from "@/lib/utils";

const PROMO_CODE = "SWEET10";
const PROMO_DISCOUNT = 0.1;
const ESTIMATED_DELIVERY_FEE = 400;

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const [promoInput, setPromoInput] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);

  const discount = appliedPromo ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const estimatedDeliveryFee = items.length > 0 ? ESTIMATED_DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal - discount) + estimatedDeliveryFee;

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === PROMO_CODE) {
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setAppliedPromo(null);
      setPromoError("That code isn't valid. Try SWEET10 for 10% off.");
    }
  }

  if (items.length === 0) {
    return (
      <section className="container-luxe py-16 lg:py-24">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border/70 bg-card px-8 py-16 text-center shadow-sm">
          <div className="flex size-16 items-center justify-center rounded-full bg-blush text-berry">
            <ShoppingBag className="size-7" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-2 text-balance text-muted-foreground">
            Looks like you haven&apos;t added any cakes yet. Explore our collection and find the
            perfect one for your moment.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/cakes">
              Browse Cakes <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-luxe py-12 lg:py-16">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-blush px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-berry">
          Your Selections
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
          Shopping <span className="italic text-berry">Cart</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} ready for checkout
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.id} className="flex-row gap-4 p-4 sm:p-5">
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-28">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
                {item.isCustom && (
                  <Badge variant="gold" className="absolute left-1.5 top-1.5 bg-cream/90 text-[10px]">
                    Custom
                  </Badge>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-semibold leading-tight text-foreground">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.size} &middot; {item.flavour}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="-m-1 rounded-full p-2.5 text-muted-foreground/70 transition-colors hover:bg-secondary hover:text-destructive"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="font-display font-semibold text-foreground">
                    {formatKes(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" asChild className="mt-2 w-fit">
            <Link href="/cakes">Continue Browsing</Link>
          </Button>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 gap-5 p-6">
            <CardHeader className="p-0">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-0">
              <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground" htmlFor="promo">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="promo"
                      placeholder="Enter code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="pl-10 uppercase"
                    />
                  </div>
                  <Button type="submit" variant="outline">
                    Apply
                  </Button>
                </div>
                {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-xs font-medium text-success">
                    &ldquo;{appliedPromo}&rdquo; applied — 10% off your subtotal.
                  </p>
                )}
              </form>

              <Separator />

              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatKes(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({appliedPromo})</span>
                    <span>&minus;{formatKes(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated delivery</span>
                  <span className="text-foreground">{formatKes(estimatedDeliveryFee)}</span>
                </div>
                <p className="text-xs text-muted-foreground/80">
                  Final delivery fee is calculated at checkout based on your zone.
                </p>
              </div>

              <Separator />

              <div className={cn("flex items-baseline justify-between")}>
                <span className="font-display text-base font-semibold text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-foreground">
                  {formatKes(total)}
                </span>
              </div>

              <Button size="lg" className="mt-1 w-full" asChild>
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="size-4" />
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-berry" />
                Payments secured via Safaricom Daraja API
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
