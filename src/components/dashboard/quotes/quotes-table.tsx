"use client";

import * as React from "react";
import { toast } from "sonner";
import type { Quote } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteStatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatKes } from "@/lib/utils";

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const [active, setActive] = React.useState<Quote | null>(null);
  const [price, setPrice] = React.useState<string>("");

  function openQuote(q: Quote) {
    setActive(q);
    setPrice(String(q.quotedPrice ?? q.estimatedPrice ?? ""));
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Occasion</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimated</TableHead>
              <TableHead>Quoted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.code}</TableCell>
                <TableCell>{q.customerName}</TableCell>
                <TableCell>{q.occasion}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(q.eventDate)}</TableCell>
                <TableCell>
                  <QuoteStatusBadge status={q.status} />
                </TableCell>
                <TableCell>{q.estimatedPrice ? formatKes(q.estimatedPrice) : "—"}</TableCell>
                <TableCell>{q.quotedPrice ? formatKes(q.quotedPrice) : "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openQuote(q)}>
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="sm:max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {active.code} · {active.customerName}
                </DialogTitle>
                <DialogDescription>
                  {active.occasion}
                  {active.guests ? ` for ${active.guests} guests` : ""} on{" "}
                  {formatDate(active.eventDate)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Size" value={active.size} />
                <Info label="Flavour" value={active.flavour} />
                <Info label="Filling" value={active.filling} />
                <Info label="Decoration" value={active.decoration} />
              </div>
              {active.specialInstructions && (
                <p className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                  {active.specialInstructions}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Estimated Price</Label>
                  <p className="mt-1 font-semibold">
                    {active.estimatedPrice ? formatKes(active.estimatedPrice) : "—"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="quote-price" className="text-xs text-muted-foreground">
                    Set Quoted Price (KES)
                  </Label>
                  <Input
                    id="quote-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success(`Quote ${active.code} sent to ${active.customerName} for ${formatKes(Number(price) || 0)}`);
                    setActive(null);
                  }}
                >
                  Send Quote
                </Button>
                <Button
                  onClick={() => {
                    toast.success(`Quote ${active.code} converted to a new order`);
                    setActive(null);
                  }}
                >
                  Convert to Order
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
