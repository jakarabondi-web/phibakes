"use client";

import * as React from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ROLES = ["Owner", "Manager", "Baker", "Rider", "Support"] as const;
const PERMISSIONS = [
  "View Orders",
  "Edit Orders",
  "Manage Inventory",
  "Manage Staff",
  "View Reports",
  "Manage Payments & Settings",
];

const DEFAULT_MATRIX: Record<(typeof ROLES)[number], Set<string>> = {
  Owner: new Set(PERMISSIONS),
  Manager: new Set(["View Orders", "Edit Orders", "Manage Inventory", "View Reports"]),
  Baker: new Set(["View Orders", "Manage Inventory"]),
  Rider: new Set(["View Orders"]),
  Support: new Set(["View Orders", "Edit Orders"]),
};

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration guard
  React.useEffect(() => setMounted(true), []);
  const [matrix, setMatrix] = React.useState(DEFAULT_MATRIX);
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: true,
    push: false,
    slack: false,
  });

  function togglePermission(role: (typeof ROLES)[number], perm: string) {
    setMatrix((prev) => {
      const next = { ...prev, [role]: new Set(prev[role]) };
      if (next[role].has(perm)) next[role].delete(perm);
      else next[role].add(perm);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <CardHeader className="p-0 flex-row items-center gap-2">
          {mounted && theme === "dark" ? <Moon className="size-4 text-berry" /> : <Sun className="size-4 text-gold" />}
          <div>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Owner console theme</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-4 flex items-center justify-between p-0">
          <Label htmlFor="dark-toggle">Dark mode</Label>
          <Switch
            id="dark-toggle"
            checked={mounted && theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </CardContent>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Where the team receives order and inventory alerts</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-3 p-0">
          {(
            [
              ["email", "Email"],
              ["sms", "SMS"],
              ["push", "Push notifications"],
              ["slack", "Slack channel"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`notif-${key}`}>{label}</Label>
              <Switch
                id={`notif-${key}`}
                checked={notifications[key]}
                onCheckedChange={(checked) => {
                  setNotifications((n) => ({ ...n, [key]: checked }));
                  toast.success(`${label} notifications ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Role-Based Permissions</CardTitle>
          <CardDescription>Who can do what across the console</CardDescription>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role} className="text-center">
                    {role}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSIONS.map((perm) => (
                <TableRow key={perm}>
                  <TableCell className="font-medium">{perm}</TableCell>
                  {ROLES.map((role) => (
                    <TableCell key={role} className="text-center">
                      <Checkbox
                        checked={matrix[role].has(perm)}
                        disabled={role === "Owner"}
                        onCheckedChange={() => togglePermission(role, perm)}
                        // Each cell sits at a permission x role intersection; without
                        // a name a screen reader announces 30 unlabelled checkboxes.
                        aria-label={`${perm} permission for ${role}`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => toast.success("Permission matrix saved")}>Save Permissions</Button>
        </div>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>M-PESA Daraja API</CardTitle>
          <CardDescription>
            Production credentials from the Safaricom Daraja portal — used to process deposits and balance payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          <div>
            <Label htmlFor="mpesa-key">Consumer Key</Label>
            <Input id="mpesa-key" type="password" placeholder="••••••••••••••••" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="mpesa-secret">Consumer Secret</Label>
            <Input id="mpesa-secret" type="password" placeholder="••••••••••••••••" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="mpesa-shortcode">Business Shortcode</Label>
            <Input id="mpesa-shortcode" placeholder="e.g. 174379" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="mpesa-passkey">Passkey</Label>
            <Input id="mpesa-passkey" type="password" placeholder="••••••••••••••••" className="mt-1.5" />
          </div>
        </CardContent>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => toast.success("M-PESA credentials saved securely")}>Save Credentials</Button>
        </div>
      </Card>
    </div>
  );
}
