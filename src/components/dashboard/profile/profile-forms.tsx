"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Save, KeyRound, AlertCircle, Info, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";
import { updateProfile, changePassword, updateAvatar, type ProfileState } from "@/lib/profile/actions";
import { fileToAvatarDataUrl, AvatarImageError } from "@/lib/image-resize";

type Me = {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string | null;
};

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
      {children}
    </p>
  );
}

function ErrorLine({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}

export function ProfileForms({
  me,
  editable,
  reason,
}: {
  me: Me;
  editable: boolean;
  reason?: string;
}) {
  const [pState, pAction, pPending] = useActionState<ProfileState, FormData>(updateProfile, {});
  const [wState, wAction, wPending] = useActionState<ProfileState, FormData>(changePassword, {});
  const pwFormRef = React.useRef<HTMLFormElement>(null);

  const [avatarUrl, setAvatarUrl] = React.useState(me.avatarUrl ?? null);
  const [avatarPending, startAvatarTransition] = React.useTransition();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again after an error
    if (!file) return;

    let dataUrl: string;
    try {
      dataUrl = await fileToAvatarDataUrl(file);
    } catch (err) {
      toast.error(err instanceof AvatarImageError ? err.message : "Couldn't process that image.");
      return;
    }

    // Calling a Server Action from outside a <form action> should be wrapped in
    // a transition — that's what gives Next.js the pending state and makes it
    // refresh the topbar's server-rendered avatar once this resolves.
    startAvatarTransition(async () => {
      const result = await updateAvatar(dataUrl);
      if (result.ok) {
        setAvatarUrl(dataUrl);
        toast.success("Photo updated");
      } else {
        toast.error(result.error ?? "Couldn't update your photo.");
      }
    });
  }

  React.useEffect(() => {
    if (pState.ok) toast.success("Profile updated");
    else if (pState.error) toast.error(pState.error);
  }, [pState]);

  React.useEffect(() => {
    if (wState.ok) {
      toast.success("Password changed");
      pwFormRef.current?.reset();
    } else if (wState.error) toast.error(wState.error);
  }, [wState]);

  const pErr = pState.fieldErrors ?? {};
  const wErr = wState.fieldErrors ?? {};

  return (
    <div className="flex flex-col gap-5">
      {!editable && reason && <Notice>{reason}</Notice>}

      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Your Details</CardTitle>
          <CardDescription>Name and contact details shown across the console</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 p-0">
          <div className="mb-5 flex items-center gap-4">
            <Avatar className="size-14">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
              <AvatarFallback>{initials(me.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{me.name}</p>
              <Badge variant="gold" className="mt-1">
                {me.role}
              </Badge>
              {editable && (
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarPick}
                    aria-label="Choose a profile photo"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={avatarPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="size-3.5" />
                    {avatarPending ? "Uploading…" : "Change photo"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <form action={pAction} className="flex flex-col gap-4">
            {pState.error && <ErrorLine>{pState.error}</ErrorLine>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="pf-name">Full name</Label>
                <Input id="pf-name" name="name" defaultValue={me.name} disabled={!editable} required />
                {pErr.name && <p className="text-xs text-destructive">{pErr.name}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-email">Email</Label>
                <Input
                  id="pf-email"
                  name="email"
                  type="email"
                  defaultValue={me.email}
                  disabled={!editable}
                  required
                />
                {pErr.email && <p className="text-xs text-destructive">{pErr.email}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-phone">Phone</Label>
                <Input
                  id="pf-phone"
                  name="phone"
                  inputMode="tel"
                  defaultValue={me.phone}
                  disabled={!editable}
                  placeholder="07XX XXX XXX"
                />
                {pErr.phone && <p className="text-xs text-destructive">{pErr.phone}</p>}
              </div>
            </div>

            {editable && (
              <div className="flex justify-end">
                <Button type="submit" disabled={pPending}>
                  <Save className="size-4" />
                  {pPending ? "Saving…" : "Save profile"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Password</CardTitle>
          <CardDescription>Change the password you use to sign in</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 p-0">
          <form ref={pwFormRef} action={wAction} className="flex flex-col gap-4">
            {wState.error && <ErrorLine>{wState.error}</ErrorLine>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="pf-current">Current password</Label>
                <Input
                  id="pf-current"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  disabled={!editable}
                />
                {wErr.currentPassword && (
                  <p className="text-xs text-destructive">{wErr.currentPassword}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-new">New password</Label>
                <Input
                  id="pf-new"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={!editable}
                />
                {wErr.newPassword ? (
                  <p className="text-xs text-destructive">{wErr.newPassword}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters, with a letter and a number.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-confirm">Confirm new password</Label>
                <Input
                  id="pf-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={!editable}
                />
                {wErr.confirmPassword && (
                  <p className="text-xs text-destructive">{wErr.confirmPassword}</p>
                )}
              </div>
            </div>

            {editable && (
              <div className="flex justify-end">
                <Button type="submit" variant="outline" disabled={wPending}>
                  <KeyRound className="size-4" />
                  {wPending ? "Updating…" : "Change password"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
