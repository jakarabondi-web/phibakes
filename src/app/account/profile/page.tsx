"use client";

import * as React from "react";
import { AlertTriangle, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/lib/profile/actions";
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
import { CURRENT_CUSTOMER } from "../_lib/customer";
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

export default function ProfilePage() {
  const [name, setName] = React.useState(CURRENT_CUSTOMER.name);
  const [email, setEmail] = React.useState(CURRENT_CUSTOMER.email);
  const [phone, setPhone] = React.useState(CURRENT_CUSTOMER.phone);
  const [profileState, profileAction, profilePending] = useActionState<ProfileState, FormData>(updateProfile, {});
  React.useEffect(() => {
    if (profileState.ok) toast.success("Profile updated successfully.");
    else if (profileState.error) toast.error(profileState.error);
  }, [profileState]);
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
              <AvatarImage src={CURRENT_CUSTOMER.avatar} alt={name} />
              <AvatarFallback className="text-lg">{initials(name)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </div>

          <form action={profileAction} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input id="profile-name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-email">Email Address</Label>
              <Input id="profile-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input id="profile-phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="sm:max-w-xs" />
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
          <form
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Password changed successfully.");
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="pw-current">Current Password</Label>
              <Input id="pw-current" type="password" placeholder="••••••••" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pw-new">New Password</Label>
              <Input id="pw-new" type="password" placeholder="••••••••" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pw-confirm">Confirm New Password</Label>
              <Input id="pw-confirm" type="password" placeholder="••••••••" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="outline">
                <KeyRound /> Update Password
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
