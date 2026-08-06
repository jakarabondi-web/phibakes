"use client";

import * as React from "react";
import Image from "next/image";
import { FileText, CalendarDays, Users, IceCreamCone } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatKes } from "@/lib/utils";
import type { Quote } from "@/types";
import { QuoteStatusBadge } from "../_components/status-badge";

export function QuotesView({ quotes }: { quotes: Quote[] }) {
  const [selected, setSelected] = React.useState<Quote | null>(null);

  if (quotes.length === 0) {
    return (
      <Card className="p-10 py-12 text-center">
        <FileText className="mx-auto size-10 text-muted-foreground/50" />
        <p className="mt-3 font-display text-lg font-semibold">No custom quotes yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Request a custom cake design to get a quote.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q) => (
          <Card
            key={q.id}
            className="cursor-pointer gap-3 p-5 py-5 transition-shadow hover:shadow-md"
            onClick={() => setSelected(q)}
          >
            <div className="flex items-start justify-between gap-2 px-0">
              <div>
                <p className="font-display text-base font-semibold">{q.occasion}</p>
                <p className="text-xs text-muted-foreground">{q.code}</p>
              </div>
              <QuoteStatusBadge status={q.status} />
            </div>
            <div className="flex flex-col gap-1.5 px-0 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> Event {formatDate(q.eventDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" /> {q.guests} guests
              </span>
              <span className="flex items-center gap-1.5">
                <IceCreamCone className="size-3.5" /> {q.flavour}
              </span>
            </div>
            <p className="px-0 text-sm font-semibold text-primary">
              {q.quotedPrice ? formatKes(q.quotedPrice) : q.estimatedPrice ? `~${formatKes(q.estimatedPrice)}` : "Pending pricing"}
            </p>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.occasion} Quote</DialogTitle>
                <DialogDescription>
                  {selected.code} &middot; Requested {formatDate(selected.createdAt)}
                </DialogDescription>
              </DialogHeader>

              {selected.referenceImages && selected.referenceImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {selected.referenceImages.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                      <Image src={img} alt="Reference" fill sizes="200px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailRow label="Status">
                  <QuoteStatusBadge status={selected.status} />
                </DetailRow>
                <DetailRow label="Event Date" value={formatDate(selected.eventDate)} />
                <DetailRow label="Size" value={selected.size} />
                <DetailRow label="Guests" value={String(selected.guests)} />
                <DetailRow label="Flavour" value={selected.flavour} />
                <DetailRow label="Filling" value={selected.filling} />
              </div>

              <div className="text-sm">
                <p className="font-medium text-foreground">Decoration</p>
                <p className="mt-1 text-muted-foreground">{selected.decoration}</p>
              </div>

              {selected.specialInstructions && (
                <div className="text-sm">
                  <p className="font-medium text-foreground">Special instructions</p>
                  <p className="mt-1 text-muted-foreground">{selected.specialInstructions}</p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated price</span>
                <span className="font-medium">{selected.estimatedPrice ? formatKes(selected.estimatedPrice) : "—"}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Quoted price</span>
                <span className="text-primary">{selected.quotedPrice ? formatKes(selected.quotedPrice) : "Awaiting quote"}</span>
              </div>

              {selected.status === "Quoted" && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.info(`Quote ${selected.code} declined.`);
                      setSelected(null);
                    }}
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success(`Deposit request sent for ${selected.code} — check M-PESA for the STK prompt.`);
                      setSelected(null);
                    }}
                  >
                    Accept &amp; Pay Deposit
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{children ?? value}</p>
    </div>
  );
}
