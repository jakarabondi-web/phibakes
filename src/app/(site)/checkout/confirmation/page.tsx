"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ClipboardList, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatKes } from "@/lib/utils";

function ConfirmationContent() {
  const params = useSearchParams();
  const code = params.get("code") ?? "PB-00000";
  const receipt = params.get("receipt") ?? "";
  const amount = Number(params.get("amount") ?? 0);
  const plan = params.get("plan") ?? "deposit";

  return (
    <section className="container-luxe py-16 lg:py-24">
      <div className="mx-auto max-w-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Order <span className="italic text-berry">Confirmed!</span>
          </h1>
          <p className="mt-3 text-balance text-muted-foreground">
            Thank you — we&apos;ve received your payment and your order is now in our production
            queue. A confirmation has been sent to your email.
          </p>
        </div>

        <Card className="mt-8 gap-4 p-6">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-4 text-berry" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-0 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order code</span>
              <span className="font-mono font-semibold text-foreground">{code}</span>
            </div>
            {receipt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">M-PESA receipt</span>
                <span className="font-mono font-semibold text-foreground">{receipt}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment plan</span>
              <span className="font-semibold text-foreground">
                {plan === "deposit" ? "50% Deposit" : "Paid in Full"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-semibold text-foreground">Amount paid</span>
              <span className="font-display text-lg font-bold text-foreground">
                {formatKes(amount)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-berry" />
          <p>
            You can follow every step of your order — from baking to delivery — using your order
            code on our public tracker, or check your account dashboard any time.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href={`/track-order?code=${encodeURIComponent(code)}`}>
              Track Your Order <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/account/orders">View in Dashboard</Link>
          </Button>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-berry" />
          Payments secured via Safaricom Daraja API
        </p>
      </div>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <React.Suspense fallback={null}>
      <ConfirmationContent />
    </React.Suspense>
  );
}
