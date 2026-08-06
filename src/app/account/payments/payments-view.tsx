"use client";

import { Wallet, CreditCard, Banknote, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDateTime, formatKes } from "@/lib/utils";
import { PaymentStatusBadge } from "../_components/status-badge";
import type { FlatPayment } from "../_lib/customer";

const METHOD_ICON = { mpesa: Wallet, card: CreditCard, cash: Banknote };

export function PaymentsView({
  payments,
  totalPaid,
  outstanding,
}: {
  payments: FlatPayment[];
  totalPaid: number;
  outstanding: number;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5 py-5">
          <p className="px-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Paid</p>
          <p className="mt-2 px-0 font-display text-2xl font-bold text-success">{formatKes(totalPaid)}</p>
        </Card>
        <Card className="p-5 py-5">
          <p className="px-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">Outstanding Balance</p>
          <p className={`mt-2 px-0 font-display text-2xl font-bold ${outstanding > 0 ? "text-destructive" : ""}`}>
            {formatKes(outstanding)}
          </p>
        </Card>
      </div>

      <h2 className="mb-4 mt-8 font-display text-lg font-semibold">Payment History</h2>

      {payments.length === 0 ? (
        <Card className="p-10 py-12 text-center">
          <Wallet className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 font-display text-lg font-semibold">No payments yet</p>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => {
              const Icon = METHOD_ICON[p.method];
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.orderCode}</TableCell>
                  <TableCell className="capitalize">{p.type}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5">
                      <Icon className="size-4 text-muted-foreground" /> {p.method.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{p.mpesaReceipt ?? "—"}</TableCell>
                  <TableCell>{formatDateTime(p.date)}</TableCell>
                  <TableCell>{formatKes(p.amount)}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status === "failed" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`Retrying payment for ${p.orderCode}...`)}
                      >
                        <RefreshCw /> Retry
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
