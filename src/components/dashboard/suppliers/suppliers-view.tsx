"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail, Phone, Plus, User } from "lucide-react";
import type { Supplier } from "@/lib/data/suppliers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export function SuppliersView({ suppliers }: { suppliers: Supplier[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Supplier</DialogTitle>
              <DialogDescription>Register a new ingredient or packaging supplier.</DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Supplier added");
                setOpen(false);
              }}
            >
              <div>
                <Label htmlFor="sup-name">Company Name</Label>
                <Input id="sup-name" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="sup-contact">Contact Person</Label>
                <Input id="sup-contact" required className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sup-phone">Phone</Label>
                  <Input id="sup-phone" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="sup-email">Email</Label>
                  <Input id="sup-email" type="email" required className="mt-1.5" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Supplier</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suppliers.map((s) => (
          <Card key={s.name} className="p-5">
            <CardHeader className="p-0">
              <CardTitle className="text-base">{s.name}</CardTitle>
            </CardHeader>
            <CardContent className="mt-3 flex flex-col gap-2 p-0 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <User className="size-3.5 text-berry" /> {s.contactPerson}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5 text-berry" /> {s.phone}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5 text-berry" /> {s.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.itemsSupplied.map((item) => (
                  <Badge key={item} variant="secondary" className="text-[10px]">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
