"use client";

import { Layers } from "lucide-react";
import { cn, formatKes } from "@/lib/utils";
import type { CakeSize } from "@/types";
import { SIZE_BASE_PRICE, SIZE_SERVINGS } from "./pricing";

const SIZES: CakeSize[] = ["0.5kg", "1kg", "2kg", "3kg", "Multi-tier", "Custom"];

export function StepSize({
  value,
  onChange,
}: {
  value: CakeSize | null;
  onChange: (v: CakeSize) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Choose your size</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a serving size — multi-tier cakes unlock multiple flavours per layer.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SIZES.map((size) => {
          const active = value === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md",
                active
                  ? "border-primary bg-blush shadow-md ring-2 ring-primary/30"
                  : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  active ? "bg-primary text-primary-foreground" : "bg-secondary text-berry"
                )}
              >
                <Layers className="size-5" />
              </div>
              <p className="font-display text-lg font-semibold text-foreground">{size}</p>
              <p className="text-xs text-muted-foreground">{SIZE_SERVINGS[size]}</p>
              <p className="text-sm font-semibold text-gold">
                from {formatKes(SIZE_BASE_PRICE[size])}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
