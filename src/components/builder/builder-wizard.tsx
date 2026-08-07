"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BuilderProgress } from "./builder-progress";
import { BuilderSummary } from "./builder-summary";
import { MobileSummaryBar } from "./mobile-summary-bar";
import { StepOccasion } from "./step-occasion";
import { StepSize } from "./step-size";
import { StepFlavour } from "./step-flavour";
import { StepFilling } from "./step-filling";
import { StepDecoration } from "./step-decoration";
import { StepPhotos } from "./step-photos";
import { StepEventInfo } from "./step-event-info";
import { StepQuote } from "./step-quote";
import { INITIAL_BUILDER_STATE, TOTAL_STEPS, type BuilderState } from "./types";

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

function canAdvance(step: number, state: BuilderState) {
  switch (step) {
    case 1:
      return state.occasion !== null;
    case 2:
      return state.size !== null;
    case 3:
      return state.flavours.length > 0;
    case 4:
      return state.filling !== null;
    case 5:
      return Boolean(state.decoration.color) || state.decoration.styles.length > 0;
    case 6:
      return true;
    case 7:
      return Boolean(
        state.event.date &&
          state.event.time &&
          (state.event.fulfilment === "pickup" || state.event.venueOrAddress.trim().length > 0)
      );
    default:
      return true;
  }
}

export function BuilderWizard() {
  const [state, setState] = React.useState<BuilderState>(INITIAL_BUILDER_STATE);
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(1);
  const cardTopRef = React.useRef<HTMLDivElement>(null);

  const valid = canAdvance(step, state);

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    requestAnimationFrame(() => {
      cardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleNext() {
    if (!valid || step >= TOTAL_STEPS) return;
    goTo(step + 1);
  }

  function handleBack() {
    if (step <= 1) return;
    goTo(step - 1);
  }

  function update<K extends keyof BuilderState>(key: K, value: BuilderState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div ref={cardTopRef} className="scroll-mt-24">
        <BuilderProgress step={step} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <Card className="overflow-hidden p-6 py-8 sm:p-10 sm:py-10">
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {step === 1 && (
                  <StepOccasion value={state.occasion} onChange={(v) => update("occasion", v)} />
                )}
                {step === 2 && <StepSize value={state.size} onChange={(v) => update("size", v)} />}
                {step === 3 && (
                  <StepFlavour
                    size={state.size}
                    value={state.flavours}
                    onChange={(v) => update("flavours", v)}
                  />
                )}
                {step === 4 && (
                  <StepFilling value={state.filling} onChange={(v) => update("filling", v)} />
                )}
                {step === 5 && (
                  <StepDecoration value={state.decoration} onChange={(v) => update("decoration", v)} />
                )}
                {step === 6 && (
                  <StepPhotos value={state.photos} onChange={(v) => update("photos", v)} />
                )}
                {step === 7 && (
                  <StepEventInfo value={state.event} onChange={(v) => update("event", v)} />
                )}
                {step === 8 && <StepQuote state={state} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < TOTAL_STEPS && (
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <Button onClick={handleNext} disabled={!valid}>
                Next <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
          {step === TOTAL_STEPS && (
            <div className="mt-10 flex items-center justify-start border-t border-border pt-6">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="size-4" /> Back
              </Button>
            </div>
          )}
        </Card>

        <BuilderSummary state={state} />
      </div>

      <MobileSummaryBar state={state} />
    </div>
  );
}
