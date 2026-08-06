"use client";

import * as React from "react";
import { toast } from "sonner";
import { Cake, Gift, Mail, Plus, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

const COUPONS = [
  { code: "SWEET10", type: "Percentage", value: "10%", uses: 142, limit: 500, expires: "2026-09-30", active: true },
  { code: "WEDDING5K", type: "Fixed", value: "KES 5,000", uses: 18, limit: 50, expires: "2026-12-31", active: true },
  { code: "FIRSTORDER", type: "Percentage", value: "15%", uses: 320, limit: 1000, expires: "2026-08-31", active: true },
  { code: "LAUNCH2025", type: "Fixed", value: "KES 1,000", uses: 87, limit: 100, expires: "2026-01-31", active: false },
];

const CAMPAIGNS = [
  { name: "August Wedding Season", audience: "All customers", sent: 2400, openRate: 38, status: "Sent" },
  { name: "Birthday Month Reminder", audience: "Birthday this month", sent: 156, openRate: 61, status: "Sent" },
  { name: "Back to School Cupcakes", audience: "Corporate segment", sent: 340, openRate: 29, status: "Scheduled" },
  { name: "Festive Season Preview", audience: "Platinum & Gold tier", sent: 0, openRate: 0, status: "Draft" },
];

export function MarketingView() {
  const [couponOpen, setCouponOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <CardHeader className="p-0 flex-row items-center justify-between">
          <div>
            <CardTitle>Coupons &amp; Promo Codes</CardTitle>
            <CardDescription>Discount codes available at checkout</CardDescription>
          </div>
          <Dialog open={couponOpen} onOpenChange={setCouponOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" /> New Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Coupon</DialogTitle>
                <DialogDescription>Set up a new promo code for customers.</DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Coupon created");
                  setCouponOpen(false);
                }}
              >
                <div>
                  <Label htmlFor="coupon-code">Code</Label>
                  <Input id="coupon-code" placeholder="e.g. HOLIDAY20" required className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="coupon-value">Discount Value</Label>
                    <Input id="coupon-value" placeholder="10% or KES 1000" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="coupon-limit">Usage Limit</Label>
                    <Input id="coupon-limit" type="number" required className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="coupon-expiry">Expiry Date</Label>
                  <Input id="coupon-expiry" type="date" required className="mt-1.5" />
                </div>
                <DialogFooter>
                  <Button type="submit">Create Coupon</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COUPONS.map((c) => (
                <TableRow key={c.code}>
                  <TableCell className="font-mono font-medium">{c.code}</TableCell>
                  <TableCell className="text-muted-foreground">{c.type}</TableCell>
                  <TableCell>{c.value}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.uses} / {c.limit}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(c.expires)}</TableCell>
                  <TableCell>
                    <Badge variant={c.active ? "success" : "outline"}>{c.active ? "Active" : "Expired"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0 flex-row items-center gap-2">
            <Cake className="size-4 text-berry" />
            <div>
              <CardTitle>Birthday Offers</CardTitle>
              <CardDescription>Automatic discount emailed on a customer&apos;s birth month</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-4 p-0 text-sm">
            <div className="flex items-center justify-between">
              <Label htmlFor="birthday-toggle">Enable birthday offers</Label>
              <Switch id="birthday-toggle" defaultChecked onCheckedChange={() => toast.success("Preference saved")} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium">15% off, valid 7 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Customers eligible this month</span>
              <span className="font-medium">23</span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0 flex-row items-center gap-2">
            <Gift className="size-4 text-gold" />
            <div>
              <CardTitle>Loyalty Points Program</CardTitle>
              <CardDescription>Points earned per KES spent, redeemable in-app</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-4 p-0 text-sm">
            <div className="flex items-center justify-between">
              <Label>Earn rate</Label>
              <span className="font-medium">1 pt / KES 100</span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Redemption threshold</Label>
              <span className="font-medium">500 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="loyalty-toggle">Program active</Label>
              <Switch id="loyalty-toggle" defaultChecked onCheckedChange={() => toast.success("Preference saved")} />
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0 flex-row items-center gap-2">
            <Users className="size-4 text-berry" />
            <div>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>KES 1,000 credit for both referrer and friend</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="mt-4 grid grid-cols-3 gap-3 p-0 text-center">
            <div>
              <p className="font-display text-2xl font-bold">86</p>
              <p className="text-xs text-muted-foreground">Referrals sent</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">34</p>
              <p className="text-xs text-muted-foreground">Converted</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">39%</p>
              <p className="text-xs text-muted-foreground">Conversion rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0 flex-row items-center gap-2">
            <Mail className="size-4 text-berry" />
            <div>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>Recent and scheduled sends</CardDescription>
            </div>
          </CardHeader>
          <div className="mt-4 flex flex-col divide-y divide-border">
            {CAMPAIGNS.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.audience}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant={c.status === "Sent" ? "success" : c.status === "Scheduled" ? "gold" : "outline"}>
                    {c.status}
                  </Badge>
                  {c.sent > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.sent} sent · {c.openRate}% open
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
