"use client";

import Link from "next/link";
import { RotateCcw, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ReorderButton({ cakeName }: { cakeName: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => toast.success(`Added "${cakeName}" to your cart for reorder.`)}
    >
      <RotateCcw /> Reorder
    </Button>
  );
}

export function DownloadInvoiceButton() {
  return (
    <Button asChild>
      <Link href="/account/invoices">
        <Receipt /> Download Invoice
      </Link>
    </Button>
  );
}
