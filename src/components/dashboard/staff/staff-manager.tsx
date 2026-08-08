"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Bike } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, initials } from "@/lib/utils";
import { saveStaff, deleteStaff, setStaffActive, type ActionState } from "@/lib/admin/actions";
import type { StaffRow } from "@/lib/staff-directory";

const ROLES = [
  { value: "MANAGER", label: "Manager" },
  { value: "BAKER", label: "Baker" },
  { value: "DECORATOR", label: "Decorator" },
  { value: "DELIVERY_RIDER", label: "Rider" },
  { value: "SUPPORT", label: "Customer Support" },
] as const;

const ROLE_VARIANT: Record<string, "gold" | "secondary" | "default" | "success" | "outline"> = {
  MANAGER: "gold",
  BAKER: "secondary",
  DECORATOR: "default",
  DELIVERY_RIDER: "success",
  SUPPORT: "outline",
};

function roleLabel(v: string) {
  return ROLES.find((r) => r.value === v)?.label ?? v;
}

function StaffDialog({
  member,
  open,
  onOpenChange,
}: {
  member: StaffRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveStaff, {});
  // Rider fields only apply to riders, so the form tracks the selected role
  // rather than the saved one — switching to Rider must reveal them immediately.
  // The parent keys this component by member id, so it remounts with the right
  // initial role instead of syncing it back through an effect.
  const [role, setRole] = React.useState<string>(member?.role ?? "BAKER");

  React.useEffect(() => {
    if (state.ok) {
      toast.success(member ? "Team member updated" : "Team member added");
      onOpenChange(false);
    } else if (state.error) toast.error(state.error);
  }, [state, member, onOpenChange]);

  const err = state.fieldErrors ?? {};
  const isRider = role === "DELIVERY_RIDER";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>{member ? `Edit ${member.name}` : "Add team member"}</DialogTitle>
            <DialogDescription>
              {member
                ? "Update their details, role, or dispatch information."
                : "They'll set their own password using the reset link on the sign-in page."}
            </DialogDescription>
          </DialogHeader>

          {member && <input type="hidden" name="id" value={member.id} />}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="sm-name">Full name</Label>
              <Input id="sm-name" name="name" defaultValue={member?.name} required />
              {err.name && <p className="text-xs text-destructive">{err.name}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-email">Email</Label>
              <Input id="sm-email" name="email" type="email" defaultValue={member?.email} required />
              {err.email && <p className="text-xs text-destructive">{err.email}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-phone">Phone</Label>
              <Input id="sm-phone" name="phone" inputMode="tel" defaultValue={member?.phone} placeholder="07XX XXX XXX" />
              {err.phone && <p className="text-xs text-destructive">{err.phone}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-role">Role</Label>
              <Select name="role" value={role} onValueChange={setRole}>
                <SelectTrigger id="sm-role" aria-label="Role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5">
              <Label htmlFor="sm-active" className="cursor-pointer">
                Active
              </Label>
              <Switch id="sm-active" name="isActive" defaultChecked={member?.isActive ?? true} />
            </div>

            {isRider && (
              <>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Bike className="size-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Dispatch details</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sm-vehicle">Vehicle</Label>
                  <Input id="sm-vehicle" name="vehicleType" defaultValue={member?.vehicleType ?? ""} placeholder="Motorbike" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sm-plate">Number plate</Label>
                  <Input id="sm-plate" name="vehiclePlate" defaultValue={member?.vehiclePlate ?? ""} placeholder="KMD 123A" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sm-max">Max concurrent deliveries</Label>
                  <Input id="sm-max" name="maxConcurrent" type="number" min={1} max={20} defaultValue={member?.maxConcurrent ?? 3} />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="sm-notes">Notes (optional)</Label>
              <Input id="sm-notes" name="notes" defaultValue={member?.notes ?? ""} />
            </div>
          </div>

          <DialogFooter className="mt-5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : member ? "Save changes" : "Add member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MemberCard({ m, canEdit, onEdit }: { m: StaffRow; canEdit: boolean; onEdit: () => void }) {
  const [delState, delAction, deleting] = useActionState<ActionState, FormData>(deleteStaff, {});
  const [actState, actAction] = useActionState<ActionState, FormData>(setStaffActive, {});

  React.useEffect(() => {
    if (delState.ok) toast.success(`${m.name} removed`);
    else if (delState.error) toast.error(delState.error);
  }, [delState, m.name]);

  React.useEffect(() => {
    if (actState.error) toast.error(actState.error);
  }, [actState]);

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            {m.avatarUrl && <AvatarImage src={m.avatarUrl} alt="" />}
            <AvatarFallback>{initials(m.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{m.name}</p>
            <Badge variant={ROLE_VARIANT[m.role] ?? "outline"} className="mt-1">
              {roleLabel(m.role)}
            </Badge>
          </div>
        </div>
        {canEdit && m.persisted && (
          <form action={actAction}>
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="isActive" value={String(!m.isActive)} />
            <Switch
              checked={m.isActive}
              onCheckedChange={(v) => {
                const fd = new FormData();
                fd.set("id", m.id);
                fd.set("isActive", String(v));
                actAction(fd);
              }}
              aria-label={`${m.name} is ${m.isActive ? "active" : "inactive"}`}
            />
          </form>
        )}
      </div>

      <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
        <span>{m.phone || "No phone on file"}</span>
        <span>{m.email}</span>
        {m.role === "DELIVERY_RIDER" && (m.vehicleType || m.vehiclePlate) && (
          <span className="mt-1 flex items-center gap-1.5 text-foreground">
            <Bike className="size-3.5" />
            {[m.vehicleType, m.vehiclePlate].filter(Boolean).join(" · ")}
            {m.maxConcurrent ? ` · up to ${m.maxConcurrent}` : ""}
          </span>
        )}
        <span className="mt-1 text-xs">Joined {formatDate(m.hiredAt)}</span>
      </div>

      {canEdit && (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={onEdit} disabled={!m.persisted}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
          {m.persisted && (
            <form action={delAction}>
              <input type="hidden" name="id" value={m.id} />
              <Button size="sm" variant="ghost" type="submit" disabled={deleting} aria-label={`Remove ${m.name}`}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </form>
          )}
        </div>
      )}
    </Card>
  );
}

export function StaffManager({ staff, canEdit }: { staff: StaffRow[]; canEdit: boolean }) {
  const [editing, setEditing] = React.useState<StaffRow | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(m: StaffRow) {
    setEditing(m);
    setDialogOpen(true);
  }

  const riders = staff.filter((s) => s.role === "DELIVERY_RIDER");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {staff.length} team {staff.length === 1 ? "member" : "members"}
          {riders.length > 0 && ` · ${riders.length} ${riders.length === 1 ? "rider" : "riders"}`}
        </p>
        {canEdit && (
          <Button size="sm" onClick={openNew}>
            <Plus className="size-4" /> Add team member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {staff.map((m) => (
          <MemberCard key={m.id} m={m} canEdit={canEdit} onEdit={() => openEdit(m)} />
        ))}
      </div>

      <StaffDialog
        key={editing?.id ?? "new"}
        member={editing}
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditing(null);
        }}
      />
    </div>
  );
}
