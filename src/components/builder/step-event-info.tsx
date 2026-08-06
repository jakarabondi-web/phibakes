"use client";

import { Store, Truck } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EventCalendar } from "./event-calendar";
import { getDateAvailability } from "@/lib/booking";
import type { EventInfoState } from "./types";

export function StepEventInfo({
  value,
  onChange,
}: {
  value: EventInfoState;
  onChange: (v: EventInfoState) => void;
}) {
  const availability = value.date ? getDateAvailability(new Date(value.date).toISOString()) : null;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Event information</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us when and where your celebration is happening.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div>
          <Label className="mb-3">Event date</Label>
          <EventCalendar value={value.date} onChange={(date) => onChange({ ...value, date })} />
          {value.date && availability && (
            <p className="mt-3 text-xs text-muted-foreground">
              {formatDate(value.date)} — {availability.remaining} of {availability.capacity} production
              slots available.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="time">Preferred pickup/delivery time</Label>
              <Input
                id="time"
                type="time"
                className="mt-2"
                value={value.time}
                onChange={(e) => onChange({ ...value, time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="guests">Guest count</Label>
              <Input
                id="guests"
                type="number"
                min={1}
                placeholder="e.g. 40"
                className="mt-2"
                value={value.guests}
                onChange={(e) => onChange({ ...value, guests: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label className="mb-3">Fulfilment</Label>
            <RadioGroup
              value={value.fulfilment}
              onValueChange={(v) => onChange({ ...value, fulfilment: v as "pickup" | "delivery" })}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {(
                [
                  { v: "pickup", label: "Pickup", icon: Store, blurb: "Collect from our Kilimani studio" },
                  { v: "delivery", label: "Delivery", icon: Truck, blurb: "Nairobi-wide delivery" },
                ] as const
              ).map(({ v, label, icon: Icon, blurb }) => {
                const active = value.fulfilment === v;
                return (
                  <label
                    key={v}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200",
                      active
                        ? "border-primary bg-blush shadow-sm ring-2 ring-primary/30"
                        : "border-border bg-card hover:-translate-y-0.5 hover:shadow-sm"
                    )}
                  >
                    <RadioGroupItem value={v} className="mt-0.5" />
                    <div className="flex items-start gap-2.5">
                      <Icon className="mt-0.5 size-4 text-berry" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{blurb}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          <div className="animate-fade-in">
            <Label htmlFor="venue">
              {value.fulfilment === "delivery" ? "Delivery address" : "Venue (optional)"}
            </Label>
            <Input
              id="venue"
              className="mt-2"
              placeholder={
                value.fulfilment === "delivery"
                  ? "e.g. Apartment, street, area, Nairobi"
                  : "e.g. Where's the celebration happening?"
              }
              value={value.venueOrAddress}
              onChange={(e) => onChange({ ...value, venueOrAddress: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="instructions">Special instructions (optional)</Label>
            <Textarea
              id="instructions"
              className="mt-2"
              placeholder="Allergies, dietary needs, delivery instructions, anything else we should know..."
              value={value.instructions}
              onChange={(e) => onChange({ ...value, instructions: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
