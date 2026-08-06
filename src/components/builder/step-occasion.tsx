"use client";

import { Cake, Heart, GraduationCap, Baby, Building2, Gem, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Occasion } from "./types";

const OCCASIONS: { value: Occasion; icon: typeof Cake; blurb: string }[] = [
  { value: "Birthday", icon: Cake, blurb: "Candles, colour, celebration" },
  { value: "Wedding", icon: Heart, blurb: "Multi-tier showpieces" },
  { value: "Graduation", icon: GraduationCap, blurb: "Cap, scroll & school colours" },
  { value: "Baby Shower", icon: Baby, blurb: "Soft palettes, gender reveals" },
  { value: "Corporate", icon: Building2, blurb: "Branded, logo-topped cakes" },
  { value: "Anniversary", icon: Gem, blurb: "Elegant, romantic designs" },
  { value: "Other", icon: Sparkles, blurb: "Tell us what you're planning" },
];

export function StepOccasion({
  value,
  onChange,
}: {
  value: Occasion | null;
  onChange: (v: Occasion) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">What&apos;s the occasion?</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose the moment you&apos;re celebrating — it helps us tailor the design and production timeline.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {OCCASIONS.map(({ value: v, icon: Icon, blurb }) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={cn(
                "group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md",
                active
                  ? "border-primary bg-blush shadow-md ring-2 ring-primary/30"
                  : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl transition-colors",
                  active ? "bg-primary text-primary-foreground" : "bg-secondary text-berry"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-foreground">{v}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{blurb}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
