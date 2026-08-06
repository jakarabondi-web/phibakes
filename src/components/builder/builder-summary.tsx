"use client";

import { Cake, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatKes } from "@/lib/utils";
import type { BuilderState } from "./types";
import { calculateQuote } from "./pricing";

export function BuilderSummary({ state }: { state: BuilderState }) {
  const { lines, total } = calculateQuote(state);
  const hasSelections = Boolean(state.occasion || state.size);

  return (
    <Card className="sticky top-24 hidden gap-4 p-6 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-2.5 px-0">
        <div className="flex size-9 items-center justify-center rounded-xl bg-blush text-berry">
          <Cake className="size-4.5" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-foreground">Your cake, so far</p>
          <p className="text-xs text-muted-foreground">Live summary</p>
        </div>
      </div>

      {!hasSelections ? (
        <p className="px-0 text-sm text-muted-foreground">
          Start building your cake and your selections will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 px-0 text-sm">
          {state.occasion && <SummaryLine label="Occasion" value={state.occasion} />}
          {state.size && <SummaryLine label="Size" value={state.size} />}
          {state.flavours.length > 0 && (
            <SummaryLine label="Flavour" value={state.flavours.join(", ")} />
          )}
          {state.filling && <SummaryLine label="Filling" value={state.filling} />}
          {state.decoration.color && <SummaryLine label="Colour" value={state.decoration.color} />}
          {state.decoration.styles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {state.decoration.styles.map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px]">
                  {s}
                </Badge>
              ))}
            </div>
          )}
          {state.event.date && <SummaryLine label="Event date" value={state.event.date} />}
        </div>
      )}

      <Separator className="mx-0 w-auto" />

      <div className="flex items-center justify-between px-0">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-gold" /> Estimated price
        </span>
        <span className="font-display text-xl font-bold text-berry">{formatKes(total)}</span>
      </div>
      {lines.length === 0 && (
        <p className="px-0 text-xs text-muted-foreground">
          Your estimate builds up as you complete each step.
        </p>
      )}
    </Card>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] truncate text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
