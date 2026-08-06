"use client";

import * as React from "react";
import { ChevronUp, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatKes } from "@/lib/utils";
import type { BuilderState } from "./types";
import { calculateQuote } from "./pricing";

export function MobileSummaryBar({ state }: { state: BuilderState }) {
  const [open, setOpen] = React.useState(false);
  const { lines, total } = calculateQuote(state);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-card/95 px-5 py-3.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden"
      >
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-gold" /> Estimated price
        </span>
        <span className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-berry">{formatKes(total)}</span>
          <ChevronUp className="size-4 text-muted-foreground" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your cake, so far</DialogTitle>
            <DialogDescription>A live summary of your selections and estimate.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 text-sm">
            {state.occasion && <Row label="Occasion" value={state.occasion} />}
            {state.size && <Row label="Size" value={state.size} />}
            {state.flavours.length > 0 && <Row label="Flavour" value={state.flavours.join(", ")} />}
            {state.filling && <Row label="Filling" value={state.filling} />}
            {state.decoration.color && <Row label="Colour" value={state.decoration.color} />}
            {state.decoration.styles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {state.decoration.styles.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
            {state.event.date && <Row label="Event date" value={state.event.date} />}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 text-sm">
            {lines.map((l) => (
              <div key={l.label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{l.label}</span>
                <span className="font-medium text-foreground">{formatKes(l.amount)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-display text-base font-semibold text-foreground">
              Estimated total
            </span>
            <span className="font-display text-xl font-bold text-berry">{formatKes(total)}</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] truncate text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
