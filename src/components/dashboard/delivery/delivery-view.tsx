"use client";

import * as React from "react";
import { toast } from "sonner";
import { Camera, MapPin, PenLine, ShieldCheck } from "lucide-react";
import type { Order } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatKes } from "@/lib/utils";
import { STAFF } from "@/lib/data/staff";

const ZONES = [
  { zone: "CBD", fee: 400, etaMins: 35 },
  { zone: "Westlands", fee: 500, etaMins: 40 },
  { zone: "Kilimani", fee: 450, etaMins: 30 },
  { zone: "Karen", fee: 900, etaMins: 55 },
  { zone: "Lavington", fee: 600, etaMins: 40 },
  { zone: "Runda / Muthaiga", fee: 950, etaMins: 55 },
  { zone: "Kasarani", fee: 750, etaMins: 50 },
  { zone: "Ngong Road corridor", fee: 550, etaMins: 35 },
];

const DELIVERY_STATUSES = ["Pending", "Assigned", "In Transit", "Delivered"] as const;
type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

const RIDERS = STAFF.filter((s) => s.role === "Rider");

export function DeliveryView({ orders }: { orders: Order[] }) {
  const [assignments, setAssignments] = React.useState<Record<string, string>>({});
  const [statuses, setStatuses] = React.useState<Record<string, DeliveryStatus>>(
    Object.fromEntries(
      orders.map((o) => [o.id, o.status === "Out for Delivery" ? "In Transit" : o.status === "Delivered" ? "Delivered" : "Pending"])
    )
  );

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Delivery Zones &amp; Fees</CardTitle>
          <CardDescription>Nairobi delivery pricing by zone</CardDescription>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Delivery Fee</TableHead>
                <TableHead>Typical ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ZONES.map((z) => (
                <TableRow key={z.zone}>
                  <TableCell className="font-medium">{z.zone}</TableCell>
                  <TableCell>{formatKes(z.fee)}</TableCell>
                  <TableCell className="text-muted-foreground">{z.etaMins} mins</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0">
          <CardTitle>Today&apos;s Deliveries</CardTitle>
          <CardDescription>Assign riders and track delivery status</CardDescription>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Rider</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.code}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="size-3.5" /> {o.deliveryZone ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={assignments[o.id] ?? "unassigned"}
                      onValueChange={(v) => {
                        setAssignments((a) => ({ ...a, [o.id]: v }));
                        setStatuses((s) => ({ ...s, [o.id]: "Assigned" }));
                        toast.success(`${v} assigned to ${o.code}`);
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {RIDERS.map((r) => (
                          <SelectItem key={r.id} value={r.name}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={statuses[o.id]}
                      onValueChange={(v) => {
                        setStatuses((s) => ({ ...s, [o.id]: v as DeliveryStatus }));
                        toast.success(`${o.code} marked "${v}"`);
                      }}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0 flex-row items-center gap-2">
          <ShieldCheck className="size-4 text-berry" />
          <div>
            <CardTitle>Proof of Delivery</CardTitle>
            <CardDescription>How riders confirm a successful handoff</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 gap-4 p-0 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center">
            <Camera className="size-6 text-berry" />
            <p className="text-sm font-medium">Photo Confirmation</p>
            <p className="text-xs text-muted-foreground">Rider snaps a photo of the cake at the doorstep.</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center">
            <PenLine className="size-6 text-berry" />
            <p className="text-sm font-medium">Digital Signature</p>
            <p className="text-xs text-muted-foreground">Recipient signs on the rider&apos;s handset.</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center">
            <Badge variant="gold" className="mb-1">
              4821
            </Badge>
            <p className="text-sm font-medium">OTP Verification</p>
            <p className="text-xs text-muted-foreground">Customer shares a one-time code sent via SMS.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
