"use client";

import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { Order, PaymentRecord } from "@/types";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateTime, formatKes } from "@/lib/utils";
import { CreditCard, RotateCcw, Wallet, Banknote, PiggyBank, AlertTriangle, Clock } from "lucide-react";

type Row = PaymentRecord & { orderCode: string; customerName: string };

const METHOD_ICON: Record<PaymentRecord["method"], LucideIcon> = {
  mpesa: Wallet,
  airtel: Wallet,
  card: CreditCard,
  paypal: CreditCard,
  cash: Banknote,
};

export function PaymentsView({ orders }: { orders: Order[] }) {
  const rows: Row[] = orders.flatMap((o) =>
    o.payments.map((p) => ({ ...p, orderCode: o.code, customerName: o.customerName }))
  );

  // Synthetic failed/pending entries for demo purposes — the seeded ORDERS
  // dataset only contains successful payments, but a real bakery will see
  // occasional M-PESA timeouts and reversals.
  rows.push(
    {
      id: "pay-demo-failed-1",
      type: "balance",
      method: "mpesa",
      amount: 10500,
      status: "failed",
      phone: "+254 733 444 555",
      date: "2026-08-05T14:20:00",
      orderCode: "PB-10235",
      customerName: "Faith Njeri",
    },
    {
      id: "pay-demo-pending-1",
      type: "deposit",
      method: "mpesa",
      amount: 4100,
      status: "pending",
      phone: "+254 733 121 212",
      date: "2026-08-06T09:05:00",
      orderCode: "PB-10238",
      customerName: "Peter Kariuki",
    }
  );

  const totalCollected = rows.filter((r) => r.status === "success").reduce((s, r) => s + r.amount, 0);
  const pending = rows.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const failed = rows.filter((r) => r.status === "failed");
  const outstanding = orders.reduce((s, o) => s + o.balanceDue, 0);

  const failedRows = failed;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Total Collected" value={formatKes(totalCollected)} icon={PiggyBank} />
        <KpiCard label="Pending" value={formatKes(pending)} icon={Clock} tone="warning" />
        <KpiCard label="Failed Payments" value={String(failedRows.length)} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="Outstanding Balance" value={formatKes(outstanding)} icon={Wallet} tone="warning" />
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Payments ({rows.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedRows.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <PaymentsTable rows={rows} />
        </TabsContent>
        <TabsContent value="failed" className="mt-4">
          {failedRows.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No failed payments — great news.</Card>
          ) : (
            <PaymentsTable rows={failedRows} showRetry />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PaymentsTable({ rows, showRetry }: { rows: Row[]; showRetry?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Receipt</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {showRetry && <TableHead className="text-right">Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const Icon = METHOD_ICON[r.method];
            return (
              <TableRow key={r.id}>
                <TableCell>
                  <Link href={`/dashboard/orders/${r.orderCode}`} className="font-medium text-primary hover:underline">
                    {r.orderCode}
                  </Link>
                </TableCell>
                <TableCell>{r.customerName}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <Icon className="size-3.5 text-muted-foreground" /> {r.method.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">{r.type}</TableCell>
                <TableCell className="text-muted-foreground">{r.mpesaReceipt ?? "—"}</TableCell>
                <TableCell className="font-medium">{formatKes(r.amount)}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "success" ? "success" : r.status === "failed" ? "destructive" : "warning"}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(r.date)}</TableCell>
                {showRetry && (
                  <TableCell className="text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      <RotateCcw className="size-3" /> Retry
                    </button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                No payments to show.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
