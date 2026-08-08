"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { saveZoneRate, deleteZoneRate, type ActionState } from "@/lib/admin/actions";
import type { ZoneRate } from "@/lib/platform-settings";

/** One row = one independent form, so saving a zone can't disturb its neighbours. */
function ZoneRow({ zone, canEdit }: { zone: ZoneRate; canEdit: boolean }) {
  const [saveState, saveAction, saving] = useActionState<ActionState, FormData>(saveZoneRate, {});
  const [delState, delAction, deleting] = useActionState<ActionState, FormData>(deleteZoneRate, {});

  React.useEffect(() => {
    if (saveState.ok) toast.success(`${zone.zone} updated`);
    else if (saveState.error) toast.error(saveState.error);
  }, [saveState, zone.zone]);

  React.useEffect(() => {
    if (delState.ok) toast.success(`${zone.zone} removed`);
    else if (delState.error) toast.error(delState.error);
  }, [delState, zone.zone]);

  const err = saveState.fieldErrors ?? {};

  return (
    <TableRow>
      <TableCell>
        <form id={`zone-${zone.id}`} action={saveAction} className="contents">
          <input type="hidden" name="id" value={zone.id} />
          <Input
            name="zone"
            defaultValue={zone.zone}
            disabled={!canEdit}
            aria-label={`Zone name for ${zone.zone}`}
            className="h-9 w-full min-w-32"
          />
        </form>
        {err.zone && <p className="mt-1 text-xs text-destructive">{err.zone}</p>}
      </TableCell>
      <TableCell>
        <Input
          form={`zone-${zone.id}`}
          name="fee"
          type="number"
          min={0}
          defaultValue={zone.fee}
          disabled={!canEdit}
          aria-label={`Delivery fee for ${zone.zone}`}
          className="h-9 w-28"
        />
        {err.fee && <p className="mt-1 text-xs text-destructive">{err.fee}</p>}
      </TableCell>
      <TableCell>
        <Input
          form={`zone-${zone.id}`}
          name="etaMinutes"
          type="number"
          min={5}
          defaultValue={zone.etaMinutes}
          disabled={!canEdit}
          aria-label={`Estimated minutes for ${zone.zone}`}
          className="h-9 w-24"
        />
        {err.etaMinutes && <p className="mt-1 text-xs text-destructive">{err.etaMinutes}</p>}
      </TableCell>
      <TableCell>
        <Switch
          form={`zone-${zone.id}`}
          name="isActive"
          defaultChecked={zone.isActive}
          disabled={!canEdit}
          aria-label={`${zone.zone} available for delivery`}
        />
      </TableCell>
      <TableCell className="text-right">
        {canEdit && (
          <div className="flex justify-end gap-1">
            <Button type="submit" form={`zone-${zone.id}`} size="sm" variant="outline" disabled={saving}>
              <Save className="size-3.5" />
              {saving ? "…" : "Save"}
            </Button>
            <form action={delAction}>
              <input type="hidden" name="id" value={zone.id} />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                disabled={deleting}
                aria-label={`Delete ${zone.zone}`}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </form>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

function AddZoneForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveZoneRate, {});
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) {
      toast.success("Zone added");
      formRef.current?.reset();
    } else if (state.error) toast.error(state.error);
  }, [state]);

  const err = state.fieldErrors ?? {};

  return (
    <form ref={formRef} action={action} className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-zone">New zone</Label>
        <Input id="new-zone" name="zone" placeholder="e.g. Kasarani" className="h-9 w-44" />
        {err.zone && <p className="text-xs text-destructive">{err.zone}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-fee">Fee</Label>
        <Input id="new-fee" name="fee" type="number" min={0} defaultValue={500} className="h-9 w-28" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-eta">ETA (min)</Label>
        <Input id="new-eta" name="etaMinutes" type="number" min={5} defaultValue={60} className="h-9 w-24" />
      </div>
      {/* Switch renders no input when unchecked, so a new zone defaults to active. */}
      <input type="hidden" name="isActive" value="on" />
      <Button type="submit" disabled={pending}>
        <Plus className="size-4" />
        {pending ? "Adding…" : "Add zone"}
      </Button>
    </form>
  );
}

export function DeliveryRatesPanel({
  zones,
  canEdit,
}: {
  zones: ZoneRate[];
  canEdit: boolean;
}) {
  return (
    <Card className="p-5">
      <CardHeader className="p-0">
        <CardTitle>Delivery Zones &amp; Rates</CardTitle>
        <CardDescription>
          What each zone costs at checkout. Turning a zone off removes it from the customer&apos;s
          options.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((z) => (
                <ZoneRow key={z.id} zone={z} canEdit={canEdit} />
              ))}
            </TableBody>
          </Table>
        </div>
        {canEdit && <AddZoneForm />}
      </CardContent>
    </Card>
  );
}
