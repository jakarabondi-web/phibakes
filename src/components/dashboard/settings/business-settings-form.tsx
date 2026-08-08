"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveSettings, type ActionState } from "@/lib/admin/actions";
import type { PlatformSettingsValues } from "@/lib/platform-settings";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function BusinessSettingsForm({
  settings,
  canEdit,
}: {
  settings: PlatformSettingsValues;
  canEdit: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveSettings, {});

  React.useEffect(() => {
    if (state.ok) toast.success("Settings saved");
    else if (state.error) toast.error(state.error);
  }, [state]);

  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Public details shown on the storefront and receipts</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          <Field id="businessName" label="Business name" error={err.businessName}>
            <Input id="businessName" name="businessName" defaultValue={settings.businessName} disabled={!canEdit} />
          </Field>
          <Field id="supportPhone" label="Support phone" error={err.supportPhone}>
            <Input id="supportPhone" name="supportPhone" defaultValue={settings.supportPhone} disabled={!canEdit} />
          </Field>
          <Field id="supportEmail" label="Support email" error={err.supportEmail}>
            <Input id="supportEmail" name="supportEmail" type="email" defaultValue={settings.supportEmail} disabled={!canEdit} />
          </Field>
          <Field id="studioHours" label="Opening hours" error={err.studioHours}>
            <Input id="studioHours" name="studioHours" defaultValue={settings.studioHours} disabled={!canEdit} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="studioAddress" label="Studio address" error={err.studioAddress}>
              <Input id="studioAddress" name="studioAddress" defaultValue={settings.studioAddress} disabled={!canEdit} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Orders &amp; Pricing</CardTitle>
          <CardDescription>
            These drive what customers are quoted at checkout
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            id="depositPercent"
            label="Deposit %"
            hint="Taken up front at checkout"
            error={err.depositPercent}
          >
            <Input id="depositPercent" name="depositPercent" type="number" min={0} max={100}
              defaultValue={settings.depositPercent} disabled={!canEdit} />
          </Field>
          <Field
            id="dailyCapacity"
            label="Daily capacity"
            hint="Production points per day"
            error={err.dailyCapacity}
          >
            <Input id="dailyCapacity" name="dailyCapacity" type="number" min={1}
              defaultValue={settings.dailyCapacity} disabled={!canEdit} />
          </Field>
          <Field
            id="minLeadTimeHours"
            label="Minimum lead time (hours)"
            hint="How far ahead orders must be placed"
            error={err.minLeadTimeHours}
          >
            <Input id="minLeadTimeHours" name="minLeadTimeHours" type="number" min={0}
              defaultValue={settings.minLeadTimeHours} disabled={!canEdit} />
          </Field>
          <Field id="taxPercent" label="Tax / VAT %" error={err.taxPercent}>
            <Input id="taxPercent" name="taxPercent" type="number" min={0} max={100}
              defaultValue={settings.taxPercent} disabled={!canEdit} />
          </Field>
          <Field
            id="freeDeliveryAbove"
            label="Free delivery above"
            hint="Leave blank to disable"
            error={err.freeDeliveryAbove}
          >
            <Input id="freeDeliveryAbove" name="freeDeliveryAbove" type="number" min={0}
              defaultValue={settings.freeDeliveryAbove ?? ""} disabled={!canEdit} />
          </Field>
          <Field id="currency" label="Currency" error={err.currency}>
            <Input id="currency" name="currency" defaultValue={settings.currency} disabled={!canEdit} />
          </Field>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3.5 sm:col-span-2 lg:col-span-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Accepting new orders</p>
              <p className="text-xs text-muted-foreground">
                Turn off to pause checkout during a busy period or a closure.
              </p>
            </div>
            <Switch
              name="acceptingOrders"
              defaultChecked={settings.acceptingOrders}
              disabled={!canEdit}
              aria-label="Accepting new orders"
            />
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            <Save className="size-4" />
            {pending ? "Saving…" : "Save settings"}
          </Button>
        </div>
      )}
    </form>
  );
}
