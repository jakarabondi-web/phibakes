"use client";

import * as React from "react";
import { Receipt, Download } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatKes } from "@/lib/utils";
import type { Order } from "@/types";
import { CURRENT_CUSTOMER } from "../_lib/customer";

type InvoiceStatus = "Paid" | "Partial" | "Unpaid";

function invoiceStatus(order: Order): InvoiceStatus {
  if (order.amountPaid >= order.total) return "Paid";
  if (order.amountPaid > 0) return "Partial";
  return "Unpaid";
}

const STATUS_VARIANT: Record<InvoiceStatus, "success" | "warning" | "destructive"> = {
  Paid: "success",
  Partial: "warning",
  Unpaid: "destructive",
};

export function InvoicesView({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = React.useState<Order | null>(null);

  if (orders.length === 0) {
    return (
      <Card className="p-10 py-12 text-center">
        <Receipt className="mx-auto size-10 text-muted-foreground/50" />
        <p className="mt-3 font-display text-lg font-semibold">No invoices yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Invoices are generated automatically once you place an order.</p>
      </Card>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status = invoiceStatus(order);
            return (
              <TableRow key={order.id} className="cursor-pointer" onClick={() => setSelected(order)}>
                <TableCell className="font-medium">INV-{order.code.replace("PB-", "")}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.code}</TableCell>
                <TableCell>{formatKes(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`Downloading invoice INV-${order.code.replace("PB-", "")}...`);
                    }}
                  >
                    <Download /> PDF
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader className="items-center text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold">
                  P
                </span>
                <DialogTitle className="mt-2">PhiBakes</DialogTitle>
                <p className="text-xs text-muted-foreground">Kilimani Studio, Nairobi &middot; hello@phibakes.co.ke</p>
              </DialogHeader>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Invoice #</p>
                  <p className="font-medium">INV-{selected.code.replace("PB-", "")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selected.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Billed To</p>
                  <p className="font-medium">{CURRENT_CUSTOMER.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Order</p>
                  <p className="font-medium">{selected.code}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2 text-sm">
                {selected.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.cakeName} &middot; {item.size} ({item.quantity}x)
                    </span>
                    <span className="font-medium">{formatKes(item.price)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{formatKes(selected.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium text-success">{formatKes(selected.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Balance Due</span>
                  <span>{formatKes(selected.balanceDue)}</span>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => toast.success("Downloading invoice PDF...")}>
                  <Download /> Download PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
