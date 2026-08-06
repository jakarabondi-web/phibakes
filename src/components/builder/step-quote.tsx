"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, MessageCircleQuestion, PartyPopper, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { cn, formatDate, formatKes } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { cakeImage } from "@/lib/data/images";
import type { BuilderState } from "./types";
import { calculateQuote } from "./pricing";

export function StepQuote({ state }: { state: BuilderState }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [submitted, setSubmitted] = React.useState(false);
  const [refCode] = React.useState(
    () => `PBQ-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-3)}`
  );
  const [copied, setCopied] = React.useState(false);
  const cartItemIdRef = React.useRef(0);

  const breakdown = calculateQuote(state);
  const cakeName = `Custom ${state.occasion ?? "Celebration"} Cake${
    state.size ? ` — ${state.size}` : ""
  }`;

  function handleAddToCart() {
    cartItemIdRef.current += 1;
    addItem({
      id: `custom-${refCode}-${cartItemIdRef.current}`,
      cakeId: "custom-cake",
      name: cakeName,
      image: cakeImage(3),
      size: state.size ?? "Custom",
      flavour: state.flavours.join(", ") || "To be confirmed",
      price: breakdown.total,
      quantity: 1,
      isCustom: true,
    });
    router.push("/cart");
  }

  function handleManualQuote() {
    setSubmitted(true);
  }

  function copyRef() {
    navigator.clipboard?.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-6 text-center"
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <PartyPopper className="size-8" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold text-foreground">
          Your quote request is in!
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Our design team will review your custom cake brief and get back to you with a final quote
          within 24 hours.
        </p>

        <button
          type="button"
          onClick={copyRef}
          className="mt-6 flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2.5 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          {refCode}
          <Copy className="size-3.5" />
        </button>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {copied ? "Copied to clipboard!" : "Reference code — save this for tracking"}
        </p>

        <Card className="mt-8 w-full max-w-md gap-3 p-6 py-6 text-left">
          <p className="px-0 text-xs font-semibold uppercase tracking-wider text-berry">Next steps</p>
          <ul className="mt-1 flex flex-col gap-3 px-0 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              We&apos;ll review your design brief and reference photos.
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              You&apos;ll receive a final quote by email or WhatsApp within 24 hours.
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              Track this request anytime from your account dashboard using the code above.
            </li>
          </ul>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="outline" onClick={() => router.push("/")}>
            Back to home
          </Button>
          <Button size="lg" onClick={() => router.push("/cakes")}>
            Browse our collection
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Your instant quote</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Here&apos;s a transparent estimate based on your selections. Add it straight to your cart, or
        send it to our team for a bespoke manual quote.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <Card className="gap-4 p-6 py-6">
            <p className="px-0 font-display text-sm font-semibold text-berry">Price breakdown</p>
            <div className="flex flex-col gap-3 px-0">
              {breakdown.lines.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Complete the earlier steps to see your price build up here.
                </p>
              )}
              {breakdown.lines.map((line) => (
                <div key={line.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{line.label}</span>
                  <span className="font-medium text-foreground">{formatKes(line.amount)}</span>
                </div>
              ))}
            </div>
            <Separator className="mx-0 w-auto" />
            <div className="flex items-center justify-between px-0">
              <span className="font-display text-lg font-semibold text-foreground">
                Estimated total
              </span>
              <span className="font-display text-2xl font-bold text-berry">
                {formatKes(breakdown.total)}
              </span>
            </div>
            <p className="px-0 text-xs text-muted-foreground">
              Final pricing may vary slightly after our decorators review your reference photos and
              full brief. A 50% deposit secures your production slot.
            </p>
          </Card>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                "group flex flex-col items-start gap-3 rounded-2xl border border-primary bg-blush p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ShoppingCart className="size-5" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  Add to Cart &amp; Checkout
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Lock in this instant estimate and proceed straight to secure checkout.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleManualQuote}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-berry">
                <MessageCircleQuestion className="size-5" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  Send for Manual Quote
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Prefer a human touch? Our design team will review and confirm final pricing.
                </p>
              </div>
            </button>
          </div>
        </div>

        <Card className="h-fit gap-4 p-6 py-6">
          <p className="px-0 font-display text-sm font-semibold text-berry">Order summary</p>
          <dl className="flex flex-col gap-2.5 px-0 text-sm">
            <SummaryRow label="Occasion" value={state.occasion} />
            <SummaryRow label="Size" value={state.size} />
            <SummaryRow label="Flavour(s)" value={state.flavours.join(", ")} />
            <SummaryRow label="Filling" value={state.filling} />
            <SummaryRow label="Colour" value={state.decoration.color} />
            <SummaryRow
              label="Style"
              value={state.decoration.styles.join(", ")}
            />
            <SummaryRow label="Photos" value={state.photos.length ? `${state.photos.length} attached` : ""} />
            <SummaryRow label="Event date" value={state.event.date ? formatDate(state.event.date) : ""} />
            <SummaryRow label="Fulfilment" value={state.event.fulfilment === "delivery" ? "Delivery" : "Pickup"} />
          </dl>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}
