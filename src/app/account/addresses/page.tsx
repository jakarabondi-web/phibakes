"use client";

import * as React from "react";
import { MapPin, Plus, Pencil, Trash2, Home, Building2, Star } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "../_components/page-header";

type Address = {
  id: string;
  label: string;
  line: string;
  zone: string;
  phone: string;
  isDefault: boolean;
};

const INITIAL: Address[] = [
  {
    id: "a1",
    label: "Home",
    line: "12 Rose Avenue, Karen",
    zone: "Karen",
    phone: "+254 712 345 678",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Office",
    line: "Rahimtulla Tower, 3rd Floor, Upper Hill",
    zone: "Upper Hill",
    phone: "+254 712 345 678",
    isDefault: false,
  },
];

const EMPTY_FORM = { label: "", line: "", zone: "", phone: "" };

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>(INITIAL);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(addr: Address) {
    setEditingId(addr.id);
    setForm({ label: addr.label, line: addr.line, zone: addr.zone, phone: addr.phone });
    setDialogOpen(true);
  }

  function save() {
    if (!form.label.trim() || !form.line.trim()) {
      toast.error("Please fill in a label and address.");
      return;
    }
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
      toast.success("Address updated.");
    } else {
      setAddresses((prev) => [
        ...prev,
        { id: `a${Date.now()}`, ...form, isDefault: prev.length === 0 },
      ]);
      toast.success("Address added.");
    }
    setDialogOpen(false);
  }

  function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
    toast.success("Address removed.");
  }

  function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated.");
  }

  return (
    <div>
      <PageHeader
        title="Saved Addresses"
        description="Manage delivery addresses for faster checkout."
        action={
          <Button onClick={openAdd}>
            <Plus /> Add Address
          </Button>
        }
      />

      {addresses.length === 0 ? (
        <Card className="p-10 py-12 text-center">
          <MapPin className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 font-display text-lg font-semibold">No saved addresses</p>
          <Button className="mt-4" onClick={openAdd}>
            <Plus /> Add your first address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => {
            const Icon = addr.label.toLowerCase() === "home" ? Home : addr.label.toLowerCase() === "office" ? Building2 : MapPin;
            return (
              <Card key={addr.id} className="p-5 py-5">
                <div className="flex items-start justify-between gap-2 px-0">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-full bg-blush text-berry">
                      <Icon className="size-4.5" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold">{addr.label}</p>
                      {addr.isDefault && (
                        <Badge variant="gold" className="mt-0.5">
                          <Star className="size-3" /> Default
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-3 px-0 text-sm text-muted-foreground">{addr.line}</p>
                <p className="mt-1 px-0 text-xs text-muted-foreground">{addr.zone} &middot; {addr.phone}</p>
                <div className="mt-4 flex flex-wrap gap-2 px-0">
                  {!addr.isDefault && (
                    <Button size="sm" variant="outline" onClick={() => setDefault(addr.id)}>
                      Set as default
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openEdit(addr)}>
                    <Pencil /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(addr.id)}>
                    <Trash2 /> Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Address" : "Add Address"}</DialogTitle>
            <DialogDescription>Used for delivery quotes and dispatch.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addr-label">Label</Label>
              <Input id="addr-label" placeholder="e.g. Home, Office" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addr-line">Address</Label>
              <Textarea id="addr-line" placeholder="Street, building, area" value={form.line} onChange={(e) => setForm({ ...form, line: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-zone">Delivery Zone</Label>
                <Input id="addr-zone" placeholder="e.g. Karen" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-phone">Phone</Label>
                <Input id="addr-phone" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editingId ? "Save Changes" : "Add Address"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete address?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteId && remove(deleteId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
