"use client";

import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { STEP_LABELS, TOTAL_STEPS } from "./types";

export function BuilderProgress({ step }: { step: number }) {
  const percent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-berry">
          Step {step} of {TOTAL_STEPS}
        </p>
        <p className="font-display text-sm font-semibold text-foreground">
          {STEP_LABELS[step - 1]}
        </p>
      </div>
      <Progress value={percent} className="mt-3" />
      <div className="mt-3 hidden items-center justify-between gap-1 sm:flex">
        {STEP_LABELS.map((label, i) => {
          const idx = i + 1;
          const done = idx < step;
          const active = idx === step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && !done && "border-gold bg-gold/15 text-gold",
                  !active && !done && "border-border text-muted-foreground"
                )}
              >
                {done ? <Check className="size-3.5" /> : idx}
              </div>
              <span
                className={cn(
                  "text-center text-[10px] leading-tight text-muted-foreground",
                  active && "font-semibold text-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
