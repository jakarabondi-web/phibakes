"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Plus } from "lucide-react";
import type { InventoryItem } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate, formatKes } from "@/lib/utils";

const STATUS_VARIANT = { healthy: "success", low: "warning", critical: "destructive" } as const;

function isExpiringSoon(dateISO?: string) {
  if (!dateISO) return false;
  const days = (new Date(dateISO).getTime() - new Date("2026-08-06").getTime()) / 86400000;
  return days <= 10;
}

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  const critical = items.filter((i) => i.status === "critical");
  const low = items.filter((i) => i.status === "low");

  return (
    <div>
      {(critical.length > 0 || low.length > 0) && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="font-medium text-destructive">
              {critical.length} item(s) critically low, {low.length} running low
            </p>
            <p className="text-muted-foreground">
              {critical.map((i) => i.name).join(", ") || "—"}
              {critical.length > 0 && low.length > 0 ? " · " : ""}
              {low.length > 0 && `Watch: ${low.map((i) => i.name).join(", ")}`}
            </p>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <AddItemDialog />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Cost/Unit</TableHead>
              <TableHead>Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const pct = Math.min(100, Math.round((item.quantity / (item.reorderLevel * 2)) * 100));
              const expiring = isExpiringSoon(item.expiryDate);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="min-w-[160px]">
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-1.5 w-24" />
                      <span className="text-xs text-muted-foreground">
                        {item.quantity}/{item.reorderLevel} {item.unit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[item.status]}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.supplier}</TableCell>
                  <TableCell>{formatKes(item.costPerUnit)}</TableCell>
                  <TableCell>
                    {item.expiryDate ? (
                      <span className={expiring ? "font-medium text-destructive" : "text-muted-foreground"}>
                        {formatDate(item.expiryDate)}
                        {expiring && " ⚠"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AddItemDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>Track a new ingredient or supply in stock.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Inventory item added");
            setOpen(false);
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" placeholder="e.g. Almond Flour" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="item-qty">Quantity</Label>
              <Input id="item-qty" type="number" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="item-unit">Unit</Label>
              <Input id="item-unit" placeholder="kg" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="item-reorder">Reorder Level</Label>
              <Input id="item-reorder" type="number" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="item-cost">Cost / Unit (KES)</Label>
              <Input id="item-cost" type="number" required className="mt-1.5" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="item-supplier">Supplier</Label>
              <Input id="item-supplier" required className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
