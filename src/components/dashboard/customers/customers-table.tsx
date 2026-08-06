"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Customer } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatKes, initials } from "@/lib/utils";

const TIER_VARIANT: Record<Customer["tier"], "secondary" | "gold" | "success" | "default"> = {
  Bronze: "secondary",
  Silver: "secondary",
  Gold: "gold",
  Platinum: "default",
};

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = React.useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers…" className="pl-9" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Loyalty Points</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/dashboard/customers/${c.id}`} className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback>{initials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-primary hover:underline">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={TIER_VARIANT[c.tier]}>{c.tier}</Badge>
                </TableCell>
                <TableCell>{c.totalOrders}</TableCell>
                <TableCell className="font-medium">{formatKes(c.totalSpent)}</TableCell>
                <TableCell>{c.loyaltyPoints.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(c.joinedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
