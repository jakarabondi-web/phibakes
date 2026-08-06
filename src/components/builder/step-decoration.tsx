"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { DecorationState, DecorationStyle } from "./types";

const COLOR_SWATCHES = [
  { name: "Blush", hex: "#f4c9d6" },
  { name: "Berry", hex: "#7a294b" },
  { name: "Gold", hex: "#c69a5b" },
  { name: "Ivory", hex: "#fff8f0" },
  { name: "Chocolate", hex: "#4a3028" },
  { name: "Sage", hex: "#a3b18a" },
  { name: "Sky", hex: "#a7c7e7" },
  { name: "Lavender", hex: "#c9b8e0" },
  { name: "Charcoal", hex: "#262326" },
  { name: "Coral", hex: "#f4978e" },
];

const STYLES: { value: DecorationStyle; blurb: string }[] = [
  { value: "Fondant", blurb: "Smooth sculpted finish" },
  { value: "Buttercream", blurb: "Soft textured piping" },
  { value: "Text", blurb: "A message on the cake" },
  { value: "Topper", blurb: "Cake topper accent" },
  { value: "Candles", blurb: "Celebration candles" },
  { value: "Flowers", blurb: "Fresh or sugar flowers" },
];

export function StepDecoration({
  value,
  onChange,
}: {
  value: DecorationState;
  onChange: (v: DecorationState) => void;
}) {
  function toggleStyle(style: DecorationStyle) {
    const styles = value.styles.includes(style)
      ? value.styles.filter((s) => s !== style)
      : [...value.styles, style];
    onChange({ ...value, styles });
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Design the decoration</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Set the colour palette, theme, and finishing details for your cake.
      </p>

      <div className="mt-8">
        <Label className="mb-3">Colour palette</Label>
        <div className="flex flex-wrap gap-3">
          {COLOR_SWATCHES.map((c) => {
            const active = value.color === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onChange({ ...value, color: c.name })}
                className="flex flex-col items-center gap-1.5"
                title={c.name}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 shadow-sm transition-transform",
                    active ? "scale-110 border-primary" : "border-white/60 hover:scale-105"
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {active && (
                    <Check
                      className={cn(
                        "size-4",
                        ["Ivory", "Blush", "Gold"].includes(c.name) ? "text-charcoal" : "text-white"
                      )}
                    />
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 max-w-md">
        <Label htmlFor="theme">Theme (optional)</Label>
        <Input
          id="theme"
          className="mt-2"
          placeholder="e.g. Tropical florals, Safari, Minimalist gold"
          value={value.theme}
          onChange={(e) => onChange({ ...value, theme: e.target.value })}
        />
      </div>

      <div className="mt-8">
        <Label className="mb-3">Decoration style</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STYLES.map(({ value: s, blurb }) => {
            const checked = value.styles.includes(s);
            return (
              <label
                key={s}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-sm",
                  checked
                    ? "border-primary bg-blush shadow-sm ring-2 ring-primary/30"
                    : "border-border bg-card"
                )}
              >
                <Checkbox checked={checked} onCheckedChange={() => toggleStyle(s)} className="mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{s}</p>
                  <p className="text-xs text-muted-foreground">{blurb}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {value.styles.includes("Text") && (
        <div className="mt-6 max-w-md animate-fade-in">
          <Label htmlFor="message">Cake message</Label>
          <Input
            id="message"
            className="mt-2"
            placeholder="e.g. Happy 30th, Sarah!"
            maxLength={60}
            value={value.message}
            onChange={(e) => onChange({ ...value, message: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
