"use client";

import * as React from "react";
import { MessageSquare, Mail, Send, Clock, CheckCircle2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatKes, formatDateTime, cn } from "@/lib/utils";
import {
  ABANDONED_CARTS,
  defaultFollowUpMessage,
  type AbandonedCart,
  type FollowUpChannel,
} from "@/lib/data/abandoned-carts";

const CHANNELS: { value: FollowUpChannel; label: string; icon: typeof Mail }[] = [
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { value: "email", label: "Email", icon: Mail },
];

function hoursSince(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000));
}

export function AbandonedCartsView() {
  const [carts, setCarts] = React.useState<AbandonedCart[]>(ABANDONED_CARTS);
  const [active, setActive] = React.useState<AbandonedCart | null>(null);
  const [channel, setChannel] = React.useState<FollowUpChannel>("sms");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const open = Boolean(active);
  const openCarts = carts.filter((c) => !c.recovered);
  const recovered = carts.filter((c) => c.recovered);
  const valueAtRisk = openCarts.reduce((sum, c) => sum + c.subtotal, 0);
  const notContacted = openCarts.filter((c) => c.followUps.length === 0);

  function startFollowUp(cart: AbandonedCart, ch: FollowUpChannel = "sms") {
    setActive(cart);
    setChannel(ch);
    setMessage(defaultFollowUpMessage(cart, ch));
  }

  function switchChannel(ch: FollowUpChannel) {
    setChannel(ch);
    if (active) setMessage(defaultFollowUpMessage(active, ch));
  }

  async function handleSend() {
    if (!active) return;
    setSending(true);
    try {
      // The SMS/email services degrade gracefully without live credentials, so
      // this records the follow-up either way and reports what actually happened.
      const res = await fetch("/api/marketing/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: active.id,
          channel,
          to: channel === "email" ? active.customerEmail : active.customerPhone,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));

      setCarts((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? { ...c, followUps: [...c.followUps, { channel, sentAt: new Date().toISOString() }] }
            : c
        )
      );

      if (data?.simulated) {
        toast.success(`Follow-up logged for ${active.customerName}`, {
          description: "Simulated — add live SMS/email credentials to actually deliver it.",
        });
      } else {
        toast.success(`Follow-up sent to ${active.customerName}`);
      }
      setActive(null);
    } catch {
      toast.error("Couldn't send that follow-up. Try again.");
    } finally {
      setSending(false);
    }
  }

  function markRecovered(cart: AbandonedCart) {
    setCarts((prev) => prev.map((c) => (c.id === cart.id ? { ...c, recovered: true } : c)));
    toast.success(`Marked ${cart.customerName}'s cart as recovered.`);
  }

  function renderTable(rows: AbandonedCart[], showActions: boolean) {
    if (rows.length === 0) {
      return (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing here right now.
        </p>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Cart</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Idle</TableHead>
            <TableHead>Follow-ups</TableHead>
            {showActions && <TableHead className="text-right">Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((cart) => {
            const idle = hoursSince(cart.updatedAt);
            return (
              <TableRow key={cart.id}>
                <TableCell>
                  <p className="font-medium text-foreground">{cart.customerName}</p>
                  <p className="text-xs text-muted-foreground">{cart.customerPhone}</p>
                </TableCell>
                <TableCell className="max-w-[240px]">
                  <p className="truncate text-sm">{cart.items[0]?.name}</p>
                  {cart.items.length > 1 && (
                    <p className="text-xs text-muted-foreground">
                      +{cart.items.length - 1} more
                    </p>
                  )}
                </TableCell>
                <TableCell className="font-semibold">{formatKes(cart.subtotal)}</TableCell>
                <TableCell>
                  <Badge variant={cart.lastStage === "checkout" ? "gold" : "secondary"}>
                    {cart.lastStage === "checkout" ? "Reached checkout" : "In cart"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-sm",
                      idle > 24 ? "font-semibold text-destructive" : "text-muted-foreground"
                    )}
                  >
                    {idle}h
                  </span>
                </TableCell>
                <TableCell>
                  {cart.followUps.length === 0 ? (
                    <span className="text-xs text-muted-foreground">None yet</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {cart.followUps.length} sent &middot; last{" "}
                      {hoursSince(cart.followUps[cart.followUps.length - 1].sentAt)}h ago
                    </span>
                  )}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => startFollowUp(cart)}>
                        <Send className="size-3.5" />
                        Follow up
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => markRecovered(cart)}>
                        <CheckCircle2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open carts" value={String(openCarts.length)} icon={ShoppingCart} />
        <KpiCard label="Value at risk" value={formatKes(valueAtRisk)} icon={Clock} />
        <KpiCard label="Not yet contacted" value={String(notContacted.length)} icon={Send} />
        <KpiCard label="Recovered" value={String(recovered.length)} icon={CheckCircle2} />
      </div>

      <Card className="overflow-hidden p-0">
        <Tabs defaultValue="open">
          <div className="border-b border-border px-4 pt-4">
            <TabsList>
              <TabsTrigger value="open">Open ({openCarts.length})</TabsTrigger>
              <TabsTrigger value="recovered">Recovered ({recovered.length})</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="open" className="m-0">
            {renderTable(openCarts, true)}
          </TabsContent>
          <TabsContent value="recovered" className="m-0">
            {renderTable(recovered, false)}
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={open} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Follow up with {active?.customerName}</DialogTitle>
            <DialogDescription>
              {active && (
                <>
                  {formatKes(active.subtotal)} cart, idle {hoursSince(active.updatedAt)}h &middot;
                  last seen {formatDateTime(active.updatedAt)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              {CHANNELS.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => switchChannel(c.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-xl border p-2.5 text-sm font-medium transition-colors",
                      channel === c.value
                        ? "border-primary bg-secondary text-primary"
                        : "border-border hover:bg-secondary/60"
                    )}
                  >
                    <Icon className="size-4" />
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl bg-secondary/50 px-3.5 py-2.5 text-xs text-muted-foreground">
              Sending to{" "}
              <span className="font-medium text-foreground">
                {channel === "email" ? active?.customerEmail : active?.customerPhone}
              </span>
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={channel === "email" ? 8 : 4}
              aria-label="Follow-up message"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActive(null)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={sending || !message.trim()}>
              <Send className="size-4" />
              {sending ? "Sending…" : "Send follow-up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
