"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Truck,
  Store,
  ShieldCheck,
  Smartphone,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart-context";
import { cn, formatKes } from "@/lib/utils";
import { DELIVERY_ZONES, getDeliveryFee, STUDIO_ADDRESS, STUDIO_HOURS } from "@/lib/delivery";

const PROMO_CODE = "SWEET10";
const PROMO_DISCOUNT = 0.1;

type Fulfilment = "delivery" | "pickup";
type PaymentPlan = "deposit" | "full";
type StkPhase = "idle" | "sending" | "pending" | "success" | "failed";

type FormErrors = Partial<Record<
  "name" | "email" | "phone" | "address" | "zone" | "eventDate" | "mpesaPhone",
  string
>>;

const KENYAN_PHONE_RE = /^(?:\+254|0)(7\d{8}|1\d{8})$/;

function normalizePhone(raw: string) {
  return raw.replace(/\s+/g, "");
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Customer info
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Fulfilment
  const [fulfilment, setFulfilment] = React.useState<Fulfilment>("delivery");
  const [address, setAddress] = React.useState("");
  const [zone, setZone] = React.useState<string>("");
  const [eventDate, setEventDate] = React.useState("");

  // Promo (carried from cart, re-enterable here)
  const [promoInput, setPromoInput] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);

  // Payment
  const [paymentPlan, setPaymentPlan] = React.useState<PaymentPlan>("deposit");
  const [mpesaPhone, setMpesaPhone] = React.useState("");

  const [errors, setErrors] = React.useState<FormErrors>({});

  // STK dialog
  const [stkOpen, setStkOpen] = React.useState(false);
  const [stkPhase, setStkPhase] = React.useState<StkPhase>("idle");
  const [receipt, setReceipt] = React.useState<string | null>(null);
  const [orderCode, setOrderCode] = React.useState<string | null>(null);
  const stkTimers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    if (phone && !mpesaPhone) setMpesaPhone(phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  React.useEffect(() => {
    return () => {
      stkTimers.current.forEach(clearTimeout);
    };
  }, []);

  const discount = appliedPromo ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const deliveryFee = fulfilment === "delivery" ? getDeliveryFee(zone) : 0;
  const total = Math.max(0, subtotal - discount) + deliveryFee;
  const depositAmount = Math.round(total * 0.5);
  const amountDue = paymentPlan === "deposit" ? depositAmount : total;

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === PROMO_CODE) {
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setAppliedPromo(null);
      setPromoError("Invalid code. Try SWEET10 for 10% off.");
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!KENYAN_PHONE_RE.test(normalizePhone(phone)))
      next.phone = "Use a Kenyan number, e.g. 0712 345 678.";
    if (fulfilment === "delivery") {
      if (!address.trim()) next.address = "Enter your delivery address.";
      if (!zone) next.zone = "Select a delivery zone.";
    }
    if (!eventDate) next.eventDate = "Choose your event date.";
    if (!KENYAN_PHONE_RE.test(normalizePhone(mpesaPhone)))
      next.mpesaPhone = "Enter a valid M-PESA number, e.g. 0712 345 678.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function openStkFlow() {
    if (items.length === 0) return;
    if (!validate()) {
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStkOpen(true);
    runStkSequence();
  }

  function runStkSequence() {
    setStkPhase("sending");
    setReceipt(null);

    const t1 = setTimeout(() => {
      setStkPhase("pending");
      const t2 = setTimeout(() => {
        const success = Math.random() < 0.9;
        if (success) {
          const code = `S${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now()
            .toString()
            .slice(-4)}`;
          setReceipt(code);
          setStkPhase("success");
          const generatedOrderCode = `PB-${Math.floor(10000 + Math.random() * 89999)}`;
          setOrderCode(generatedOrderCode);
        } else {
          setStkPhase("failed");
        }
      }, 3200);
      stkTimers.current.push(t2);
    }, 2500);
    stkTimers.current.push(t1);
  }

  function handleRetry() {
    runStkSequence();
  }

  function handleDone() {
    clearCart();
    const params = new URLSearchParams({
      code: orderCode ?? "PB-00000",
      receipt: receipt ?? "",
      amount: String(amountDue),
      plan: paymentPlan,
    });
    router.push(`/checkout/confirmation?${params.toString()}`);
  }

  if (items.length === 0) {
    return (
      <section className="container-luxe py-16 lg:py-24">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border/70 bg-card px-8 py-16 text-center shadow-sm">
          <div className="flex size-16 items-center justify-center rounded-full bg-blush text-berry">
            <Lock className="size-7" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
            Nothing to check out
          </h1>
          <p className="mt-2 text-balance text-muted-foreground">
            Your cart is empty. Add a cake first, then come back to check out securely.
          </p>
          <Button size="lg" className="mt-8" onClick={() => router.push("/cakes")}>
            Browse Cakes
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-luxe py-12 lg:py-16">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-blush px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-berry">
          Secure Checkout
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
          Complete Your Order
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-berry" />
          Payments secured via Safaricom Daraja API &middot; your details are never shared.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Customer Info */}
          <Card className="gap-5 p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-berry text-xs text-primary-foreground">
                  1
                </span>
                Customer Details
              </CardTitle>
              <CardDescription>Who should we prepare this order for?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wanjiru Kamau"
                  aria-invalid={!!errors.name}
                  data-error={!!errors.name}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  data-error={!!errors.email}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  aria-invalid={!!errors.phone}
                  data-error={!!errors.phone}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="eventDate">Event / collection date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  aria-invalid={!!errors.eventDate}
                  data-error={!!errors.eventDate}
                />
                {errors.eventDate && (
                  <p className="text-xs text-destructive">{errors.eventDate}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="notes">Special instructions (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, message on cake, gate code, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Fulfilment */}
          <Card className="gap-5 p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-berry text-xs text-primary-foreground">
                  2
                </span>
                Delivery or Pickup
              </CardTitle>
              <CardDescription>Choose how you&apos;d like to receive your order.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-0">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfilment("delivery")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                    fulfilment === "delivery"
                      ? "border-primary bg-blush/60 shadow-sm"
                      : "border-border hover:bg-secondary"
                  )}
                >
                  <Truck
                    className={cn(
                      "size-5",
                      fulfilment === "delivery" ? "text-berry" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-sm font-semibold">Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfilment("pickup")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                    fulfilment === "pickup"
                      ? "border-primary bg-blush/60 shadow-sm"
                      : "border-border hover:bg-secondary"
                  )}
                >
                  <Store
                    className={cn(
                      "size-5",
                      fulfilment === "pickup" ? "text-berry" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-sm font-semibold">Studio Pickup</span>
                </button>
              </div>

              {fulfilment === "delivery" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label htmlFor="address">Delivery address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, building, apartment no."
                      aria-invalid={!!errors.address}
                      data-error={!!errors.address}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">{errors.address}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="zone">Delivery zone</Label>
                    <Select value={zone} onValueChange={setZone}>
                      <SelectTrigger id="zone" aria-invalid={!!errors.zone} data-error={!!errors.zone}>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_ZONES.map((z) => (
                          <SelectItem key={z.zone} value={z.zone}>
                            {z.zone} &middot; {formatKes(z.fee)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.zone && <p className="text-xs text-destructive">{errors.zone}</p>}
                  </div>
                  <div className="flex items-end">
                    {zone && (
                      <p className="text-sm text-muted-foreground">
                        Estimated delivery fee:{" "}
                        <span className="font-semibold text-foreground">
                          {formatKes(getDeliveryFee(zone))}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="text-sm font-semibold text-foreground">{STUDIO_ADDRESS}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Opening hours: {STUDIO_HOURS}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order summary (mobile shows before payment for context, desktop in sidebar too) */}
          <Card className="gap-5 p-6 lg:hidden">
            <CardHeader className="p-0">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <OrderItemsList items={items} />
          </Card>

          {/* Payment plan */}
          <Card className="gap-5 p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-berry text-xs text-primary-foreground">
                  3
                </span>
                Payment Plan
              </CardTitle>
              <CardDescription>Pay a 50% deposit now, or settle in full today.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RadioGroup
                value={paymentPlan}
                onValueChange={(v) => setPaymentPlan(v as PaymentPlan)}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                    paymentPlan === "deposit"
                      ? "border-primary bg-blush/60 shadow-sm"
                      : "border-border hover:bg-secondary"
                  )}
                >
                  <RadioGroupItem value="deposit" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pay 50% Deposit</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatKes(depositAmount)} now, balance due on delivery/pickup.
                    </p>
                  </div>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                    paymentPlan === "full"
                      ? "border-primary bg-blush/60 shadow-sm"
                      : "border-border hover:bg-secondary"
                  )}
                >
                  <RadioGroupItem value="full" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pay in Full</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatKes(total)} now. Nothing left to pay.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* M-PESA */}
          <Card className="gap-5 p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-berry text-xs text-primary-foreground">
                  4
                </span>
                Pay with M-PESA
              </CardTitle>
              <CardDescription>
                We&apos;ll send a Lipa na M-PESA prompt straight to your phone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-0">
              <div className="flex flex-col gap-1.5 sm:max-w-xs">
                <Label htmlFor="mpesaPhone">M-PESA phone number</Label>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="mpesaPhone"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="pl-10"
                    aria-invalid={!!errors.mpesaPhone}
                    data-error={!!errors.mpesaPhone}
                  />
                </div>
                {errors.mpesaPhone && (
                  <p className="text-xs text-destructive">{errors.mpesaPhone}</p>
                )}
              </div>

              <div className="rounded-xl border border-gold/30 bg-gold/10 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Amount due now: {formatKes(amountDue)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {paymentPlan === "deposit"
                    ? `Balance of ${formatKes(total - depositAmount)} due on delivery/pickup.`
                    : "Full amount — nothing left to pay."}
                </p>
              </div>

              <Button size="lg" className="w-full sm:w-auto" onClick={openStkFlow}>
                <Smartphone className="size-4" />
                Pay {formatKes(amountDue)} with M-PESA
              </Button>

              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-berry" />
                Payments secured via Safaricom Daraja API. We never store your M-PESA PIN.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar summary */}
        <div className="hidden lg:col-span-1 lg:block">
          <Card className="sticky top-24 gap-5 p-6">
            <CardHeader className="p-0">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <OrderItemsList items={items} />
            <CardContent className="flex flex-col gap-4 p-0">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <Input
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="uppercase"
                />
                <Button type="submit" variant="outline">
                  Apply
                </Button>
              </form>
              {promoError && <p className="text-xs text-destructive">{promoError}</p>}
              {appliedPromo && (
                <p className="text-xs font-medium text-success">
                  &ldquo;{appliedPromo}&rdquo; applied — 10% off.
                </p>
              )}

              <Separator />

              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatKes(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>&minus;{formatKes(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>{fulfilment === "delivery" ? "Delivery fee" : "Pickup fee"}</span>
                  <span className="text-foreground">
                    {fulfilment === "delivery" ? formatKes(deliveryFee) : "Free"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex items-baseline justify-between">
                <span className="font-display text-base font-semibold text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-foreground">
                  {formatKes(total)}
                </span>
              </div>

              <div className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Due now ({paymentPlan === "deposit" ? "50% deposit" : "full"})</span>
                  <span className="font-semibold text-foreground">{formatKes(amountDue)}</span>
                </div>
                {paymentPlan === "deposit" && (
                  <div className="mt-1 flex justify-between">
                    <span>Balance due later</span>
                    <span className="font-semibold text-foreground">
                      {formatKes(total - depositAmount)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StkDialog
        open={stkOpen}
        onOpenChange={(open) => {
          // Prevent closing mid-flow; allow closing only from terminal states via explicit actions
          if (!open && (stkPhase === "sending" || stkPhase === "pending")) return;
          setStkOpen(open);
        }}
        phase={stkPhase}
        phone={normalizePhone(mpesaPhone)}
        amount={amountDue}
        receipt={receipt}
        orderCode={orderCode}
        onRetry={handleRetry}
        onDone={handleDone}
      />
    </section>
  );
}

function OrderItemsList({ items }: { items: ReturnType<typeof useCart>["items"] }) {
  return (
    <CardContent className="flex flex-col gap-3 p-0">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.size} &middot; {item.flavour} &middot; x{item.quantity}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-foreground">
            {formatKes(item.price * item.quantity)}
          </p>
        </div>
      ))}
    </CardContent>
  );
}

function StkDialog({
  open,
  onOpenChange,
  phase,
  phone,
  amount,
  receipt,
  orderCode,
  onRetry,
  onDone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: StkPhase;
  phone: string;
  amount: number;
  receipt: string | null;
  orderCode: string | null;
  onRetry: () => void;
  onDone: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={phase === "failed" || phase === "success"}
        className="text-center"
      >
        {phase === "sending" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-blush">
              <Smartphone className="size-7 text-berry" />
              <span className="absolute inset-0 animate-ping rounded-full bg-berry/20" />
            </div>
            <DialogHeader>
              <DialogTitle>Sending STK Push&hellip;</DialogTitle>
              <DialogDescription>
                Contacting Safaricom to send a payment request to {phone || "your phone"}.
              </DialogDescription>
            </DialogHeader>
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {phase === "pending" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-gold/15">
              <Loader2 className="size-7 animate-spin text-gold" />
            </div>
            <DialogHeader>
              <DialogTitle>Check your phone</DialogTitle>
              <DialogDescription>
                Enter your M-PESA PIN on the prompt sent to <strong>{phone}</strong> to authorise{" "}
                {formatKes(amount)}.
              </DialogDescription>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">This can take up to 60 seconds.</p>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-8 text-success" />
            </div>
            <DialogHeader>
              <DialogTitle>Payment Successful</DialogTitle>
              <DialogDescription>
                {formatKes(amount)} received. Your order is confirmed.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full rounded-xl border border-border bg-secondary/50 p-4 text-left text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">M-PESA Receipt</span>
                <span className="font-mono font-semibold text-foreground">{receipt}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Order Code</span>
                <span className="font-mono font-semibold text-foreground">{orderCode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-foreground">{formatKes(amount)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={onDone}>
              Continue <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        {phase === "failed" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="size-8 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle>Payment Not Completed</DialogTitle>
              <DialogDescription>
                The request timed out or was cancelled on your phone. No funds were deducted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="w-full sm:justify-center">
              <Button size="lg" onClick={onRetry} className="w-full sm:w-auto">
                <RefreshCw className="size-4" />
                Retry Payment
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
