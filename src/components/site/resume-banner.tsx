"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKes } from "@/lib/utils";
import { getCartActivity, type CartActivity } from "@/lib/saved-carts";

const DISMISS_KEY = "phibakes.resume-dismissed-at";

/**
 * "Pick up where you left off" — shown when a returning visitor still has a
 * cart in progress. Deep-links to whichever stage they last reached so they
 * don't have to retrace their steps.
 */
export function ResumeBanner() {
  const [activity, setActivity] = React.useState<CartActivity | null>(null);

  React.useEffect(() => {
    const a = getCartActivity();
    if (!a || a.itemCount === 0) return;

    // Don't re-nag within the same session after an explicit dismiss.
    try {
      const dismissedAt = window.sessionStorage.getItem(DISMISS_KEY);
      if (dismissedAt) return;
    } catch {
      // sessionStorage unavailable — fall through and show the banner
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage read must happen post-mount
    setActivity(a);
  }, []);

  function dismiss() {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
    setActivity(null);
  }

  if (!activity) return null;

  const href = activity.lastStage === "checkout" ? "/checkout" : "/cart";
  const cta = activity.lastStage === "checkout" ? "Finish checkout" : "Back to cart";

  return (
    <div className="border-b border-gold/30 bg-gold/10">
      <div className="container-luxe flex flex-wrap items-center gap-3 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-berry">
          <ShoppingBag className="size-[18px]" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Pick up where you left off</p>
          <p className="text-xs text-muted-foreground">
            You have {activity.itemCount} {activity.itemCount === 1 ? "item" : "items"} worth{" "}
            {formatKes(activity.subtotal)} waiting.
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href={href}>
            {cta}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-cream hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
