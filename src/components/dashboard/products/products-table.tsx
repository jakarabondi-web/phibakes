"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatKes } from "@/lib/utils";
import { setProductAvailability, deleteProduct } from "@/lib/dashboard/product-actions";
import type { ProductRow } from "@/lib/dashboard/products";

export function ProductsTable({ products, canEdit }: { products: ProductRow[]; canEdit: boolean }) {
  const [rows, setRows] = React.useState(products);
  const [toDelete, setToDelete] = React.useState<ProductRow | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function toggleAvailability(product: ProductRow, next: boolean) {
    if (!canEdit) {
      toast.error("Only the owner can change product availability, and a database must be connected.");
      return;
    }
    setBusyId(product.id);
    setRows((prev) => prev.map((p) => (p.id === product.id ? { ...p, isAvailable: next } : p)));
    const result = await setProductAvailability(product.id, next);
    setBusyId(null);
    if (result.ok) {
      toast.success(`${product.name} is now ${next ? "available" : "unavailable"} on the storefront`);
    } else {
      // Roll back the optimistic flip.
      setRows((prev) => prev.map((p) => (p.id === product.id ? { ...p, isAvailable: !next } : p)));
      toast.error(result.error ?? "Couldn't update availability.");
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    const result = await deleteProduct(toDelete.id);
    setBusyId(null);
    if (result.ok) {
      setRows((prev) => prev.filter((p) => p.id !== toDelete.id));
      toast.success(`${toDelete.name} removed from the catalog`);
    } else {
      toast.error(result.error ?? "Couldn't delete that product.");
    }
    setToDelete(null);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">/{p.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{p.categoryName}</Badge>
                </TableCell>
                <TableCell className="font-medium tabular-nums">{formatKes(p.price)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.sizes.join(", ")}</TableCell>
                <TableCell>
                  <Switch
                    checked={p.isAvailable}
                    disabled={!canEdit || busyId === p.id}
                    onCheckedChange={(checked) => toggleAvailability(p, checked)}
                    aria-label={`${p.name} available for order`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {canEdit && (
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" asChild aria-label={`Edit ${p.name}`}>
                        <Link href={`/dashboard/products/${p.id}`}>
                          <Pencil className="size-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={busyId === p.id}
                        onClick={() => setToDelete(p)}
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No products yet. {canEdit && "Add your first one to get started."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {toDelete?.name}?</DialogTitle>
            <DialogDescription>
              This removes it from the storefront and the catalog permanently. Past orders that
              included it keep their own record and are not affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={busyId === toDelete?.id} onClick={confirmDelete}>
              {busyId === toDelete?.id ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
