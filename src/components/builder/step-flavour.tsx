"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CakeFlavour, CakeSize } from "@/types";

const FLAVOURS: CakeFlavour[] = [
  "Vanilla",
  "Chocolate",
  "Red Velvet",
  "Black Forest",
  "White Forest",
  "Carrot",
  "Marble",
  "Lemon",
  "Blueberry",
  "Fruit Cake",
];

export function StepFlavour({
  size,
  value,
  onChange,
}: {
  size: CakeSize | null;
  value: CakeFlavour[];
  onChange: (v: CakeFlavour[]) => void;
}) {
  const multi = size === "Multi-tier";

  function toggle(f: CakeFlavour) {
    if (multi) {
      onChange(value.includes(f) ? value.filter((v) => v !== f) : [...value, f]);
    } else {
      onChange([f]);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Pick your flavour</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {multi
          ? "Multi-tier cakes can mix flavours across layers — select as many as you like."
          : "Choose one primary flavour for your cake."}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {FLAVOURS.map((f) => {
          const active = value.includes(f);
          return (
            <button
              key={f}
              type="button"
              onClick={() => toggle(f)}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-sm",
                active
                  ? "border-primary bg-blush text-berry shadow-sm ring-2 ring-primary/30"
                  : "border-border bg-card text-foreground"
              )}
            >
              {active && <Check className="size-3.5 shrink-0" />}
              {f}
            </button>
          );
        })}
      </div>
      {multi && value.length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          {value.length} flavour{value.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
