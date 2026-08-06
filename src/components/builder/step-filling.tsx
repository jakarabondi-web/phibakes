"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Filling } from "./types";

const FILLINGS: { value: Filling; blurb: string }[] = [
  { value: "Buttercream", blurb: "Classic, smooth & light" },
  { value: "Ganache", blurb: "Rich, glossy chocolate" },
  { value: "Cream Cheese", blurb: "Tangy & indulgent" },
  { value: "Fruit", blurb: "Fresh seasonal compote" },
  { value: "Caramel", blurb: "Buttery salted caramel" },
  { value: "Jam", blurb: "Classic fruit preserve" },
];

export function StepFilling({
  value,
  onChange,
}: {
  value: Filling | null;
  onChange: (v: Filling) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Select a filling</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The layer of flavour between each sponge — pick what pairs best with your flavour.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FILLINGS.map(({ value: f, blurb }) => {
          const active = value === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => onChange(f)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-sm",
                active
                  ? "border-primary bg-blush shadow-sm ring-2 ring-primary/30"
                  : "border-border bg-card"
              )}
            >
              <div>
                <p className="font-semibold text-foreground">{f}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{blurb}</p>
              </div>
              {active && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
