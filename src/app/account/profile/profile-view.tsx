"use client";

import * as React from "react";
import { AlertTriangle, Camera, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { useActionState } from "react";
import {
  updateProfile,
  changePassword,
  updateAvatar,
  type ProfileState,
} from "@/lib/profile/actions";
import { fileToAvatarDataUrl, AvatarImageError } from "@/lib/image-resize";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { initials } from "@/lib/utils";
import { PageHeader } from "../_components/page-header";

const EVENTS = ["Order Confirmed", "Payment Received", "Balance Due", "Cake Ready", "Delivery Updates", "Promotions"];
const CHANNELS = ["Email", "SMS", "WhatsApp", "Push"] as const;

function defaultPrefs() {
  const prefs: Record<string, Record<(typeof CHANNELS)[number], boolean>> = {};
  for (const event of EVENTS) {
    prefs[event] = { Email: true, SMS: event !== "Promotions", WhatsApp: true, Push: false };
  }
  return prefs;
}

export type ProfileInitial = {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
};

export function ProfileView({ initial }: { initial: ProfileInitial }) {
  const [name, setName] = React.useState(initial.name);
  const [email, setEmail] = React.useState(initial.email);
  const [phone, setPhone] = React.useState(initial.phone);
  const [profileState, profileAction, profilePending] = useActionState<ProfileState, FormData>(updateProfile, {});
  React.useEffect(() => {
    if (profileState.ok) toast.success("Profile updated successfully.");
    else if (profileState.error) toast.error(profileState.error);
  }, [profileState]);
  const pErr = profileState.fieldErrors ?? {};

  const [pwState, pwAction, pwPending] = useActionState<ProfileState, FormData>(changePassword, {});
  const pwFormRef = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (pwState.ok) {
      toast.success("Password changed successfully.");
      pwFormRef.current?.reset();
    } else if (pwState.error) toast.error(pwState.error);
  }, [pwState]);
  const wErr = pwState.fieldErrors ?? {};

  const [avatarUrl, setAvatarUrl] = React.useState(initial.avatarUrl);
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

  const [prefs, setPrefs] = React.useState(defaultPrefs());
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  function toggle(event: string, channel: (typeof CHANNELS)[number]) {
    setPrefs((prev) => ({
      ...prev,
      [event]: { ...prev[event], [channel]: !prev[event][channel] },
    }));
  }

  return (
    <div>
      <PageHeader title="Profile Settings" description="Manage your personal information and preferences." />

      <div className="flex flex-col gap-6">
        {/* Personal info */}
        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your name, email, and phone number.</CardDescription>
          </CardHeader>

          <div className="mt-5 flex items-center gap-4">
            <Avatar className="size-16">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback className="text-lg">{initials(name)}</AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarPick}
              aria-label="Choose a profile photo"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={avatarPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="size-3.5" />
              {avatarPending ? "Uploading…" : "Change Photo"}
            </Button>
          </div>

          <form action={profileAction} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input id="profile-name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
              {pErr.name && <p className="text-xs text-destructive">{pErr.name}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-email">Email Address</Label>
              <Input id="profile-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {pErr.email && <p className="text-xs text-destructive">{pErr.email}</p>}
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input id="profile-phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="sm:max-w-xs" />
              {pErr.phone && <p className="text-xs text-destructive">{pErr.phone}</p>}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={profilePending}>
                <Save /> {profilePending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Password */}
        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </CardHeader>
          <form ref={pwFormRef} action={pwAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="pw-current">Current Password</Label>
              <Input id="pw-current" name="currentPassword" type="password" autoComplete="current-password" placeholder="••••••••" />
              {wErr.currentPassword && <p className="text-xs text-destructive">{wErr.currentPassword}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pw-new">New Password</Label>
              <Input id="pw-new" name="newPassword" type="password" autoComplete="new-password" placeholder="••••••••" />
              {wErr.newPassword ? (
                <p className="text-xs text-destructive">{wErr.newPassword}</p>
              ) : (
                <p className="text-xs text-muted-foreground">At least 8 characters, with a letter and a number.</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pw-confirm">Confirm New Password</Label>
              <Input id="pw-confirm" name="confirmPassword" type="password" autoComplete="new-password" placeholder="••••••••" />
              {wErr.confirmPassword && <p className="text-xs text-destructive">{wErr.confirmPassword}</p>}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="outline" disabled={pwPending}>
                <KeyRound /> {pwPending ? "Updating…" : "Update Password"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Notification preferences */}
        <Card className="p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you&apos;d like to hear from us for each event.</CardDescription>
          </CardHeader>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  {CHANNELS.map((c) => (
                    <TableHead key={c} className="text-center">
                      {c}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {EVENTS.map((event) => (
                  <TableRow key={event}>
                    <TableCell className="font-medium">{event}</TableCell>
                    {CHANNELS.map((channel) => (
                      <TableCell key={channel} className="text-center">
                        <Switch
                          checked={prefs[event][channel]}
                          onCheckedChange={() => toggle(event, channel)}
                          aria-label={`${channel} notifications for ${event}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30 p-6 py-6">
          <CardHeader className="p-0">
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Permanently delete your account and all associated data.</CardDescription>
          </CardHeader>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-md text-sm text-muted-foreground">
              This will permanently remove your order history, saved addresses, wishlist, and loyalty
              points. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <AlertTriangle /> Delete Account
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This is permanent and cannot be undone. All orders, points, and saved data will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteOpen(false);
                toast.error("Account deletion is disabled in this demo.");
              }}
            >
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
