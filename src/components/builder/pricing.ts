import type { BuilderState } from "./types";
import type { CakeSize } from "@/types";

// Base price per size, in KES — reflects ingredient volume + bake/decorate time.
export const SIZE_BASE_PRICE: Record<CakeSize, number> = {
  "0.5kg": 2500,
  "1kg": 4000,
  "2kg": 7500,
  "3kg": 11000,
  "Multi-tier": 18000,
  Custom: 9000,
};

export const SIZE_SERVINGS: Record<CakeSize, string> = {
  "0.5kg": "Serves 4-6",
  "1kg": "Serves 8-10",
  "2kg": "Serves 16-20",
  "3kg": "Serves 25-30",
  "Multi-tier": "Serves 40+",
  Custom: "Tell us your headcount",
};

// Flat surcharge per decoration style, KES.
const DECORATION_SURCHARGE: Record<string, number> = {
  Fondant: 1500,
  Buttercream: 0, // baseline finish, no surcharge
  Text: 500,
  Topper: 800,
  Candles: 300,
  Flowers: 1200,
};

export type PriceBreakdownLine = {
  label: string;
  amount: number;
};

export type PriceBreakdown = {
  lines: PriceBreakdownLine[];
  total: number;
};

/**
 * Transparent, additive pricing model:
 *   base (by size)
 * + extra-flavour surcharge (10% of base per flavour beyond the first — multi-tier layering)
 * + decoration surcharges (flat per selected style)
 * + reference-photo customisation fee (small flat fee once photos are supplied,
 *   covering the extra design-matching effort)
 */
export function calculateQuote(state: BuilderState): PriceBreakdown {
  const lines: PriceBreakdownLine[] = [];

  const base = state.size ? SIZE_BASE_PRICE[state.size] : 0;
  if (state.size) {
    lines.push({ label: `Base price (${state.size})`, amount: base });
  }

  const extraFlavours = Math.max(0, state.flavours.length - 1);
  if (extraFlavours > 0) {
    const flavourSurcharge = Math.round(base * 0.1 * extraFlavours);
    lines.push({
      label: `Extra flavours (${extraFlavours} × 10%)`,
      amount: flavourSurcharge,
    });
  }

  if (state.filling && state.filling !== "Buttercream") {
    lines.push({ label: `${state.filling} filling`, amount: 400 });
  }

  for (const style of state.decoration.styles) {
    const amount = DECORATION_SURCHARGE[style] ?? 0;
    if (amount > 0) {
      lines.push({ label: `${style} decoration`, amount });
    }
  }

  if (state.decoration.message.trim()) {
    lines.push({ label: "Custom message piping", amount: 300 });
  }

  if (state.photos.length > 0) {
    lines.push({ label: "Design-matching (reference photos)", amount: 800 });
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { lines, total };
}
