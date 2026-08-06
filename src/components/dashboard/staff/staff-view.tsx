"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { StaffMember } from "@/lib/data/staff";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate, initials } from "@/lib/utils";

const ROLE_VARIANT: Record<StaffMember["role"], "gold" | "secondary" | "default" | "success" | "outline"> = {
  "Head Baker": "gold",
  Baker: "secondary",
  Decorator: "default",
  Rider: "success",
  "Customer Support": "outline",
};

export function StaffView({ staff }: { staff: StaffMember[] }) {
  const [members, setMembers] = React.useState(staff);
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" /> Invite Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Staff Member</DialogTitle>
              <DialogDescription>They&apos;ll receive an email invite to join the console.</DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Invitation sent");
                setOpen(false);
              }}
            >
              <div>
                <Label htmlFor="staff-name">Full Name</Label>
                <Input id="staff-name" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="staff-email">Email</Label>
                <Input id="staff-email" type="email" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="staff-role">Role</Label>
                <Select defaultValue="Baker">
                  <SelectTrigger className="mt-1.5 w-full" id="staff-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Head Baker", "Baker", "Decorator", "Rider", "Customer Support"] as const).map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invite</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarImage src={m.avatar} alt={m.name} />
                  <AvatarFallback>{initials(m.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{m.name}</p>
                  <Badge variant={ROLE_VARIANT[m.role]} className="mt-1">
                    {m.role}
                  </Badge>
                </div>
              </div>
              <Switch
                checked={m.active}
                onCheckedChange={(checked) => {
                  setMembers((prev) => prev.map((p) => (p.id === m.id ? { ...p, active: checked } : p)));
                  toast.success(`${m.name} marked ${checked ? "active" : "inactive"}`);
                }}
              />
            </div>
            <div className="mt-4 flex flex-col gap-1 text-xs text-muted-foreground">
              <p>{m.phone}</p>
              <p>{m.email}</p>
              <p>
                Joined {formatDate(m.joinedAt)} · {m.ordersHandled} orders handled
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
