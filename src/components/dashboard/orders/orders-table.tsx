"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUpDown, Download, Search, UserPlus } from "lucide-react";
import type { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderStatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatKes, initials } from "@/lib/utils";
import { ORDER_STATUS_FLOW } from "@/types";

type SortKey = "code" | "customerName" | "total" | "eventDate";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = React.useState<SortKey>("eventDate");
  const [sortDir, setSortDir] = React.useState<1 | -1>(1);

  const filtered = React.useMemo(() => {
    let rows = orders;
    if (statusFilter !== "all") rows = rows.filter((o) => o.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (o) =>
          o.code.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items.some((i) => i.cakeName.toLowerCase().includes(q))
      );
    }
    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "total") cmp = a.total - b.total;
      else if (sortKey === "eventDate") cmp = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      else cmp = a[sortKey].localeCompare(b[sortKey]);
      return cmp * sortDir;
    });
    return rows;
  }, [orders, statusFilter, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(filtered.map((o) => o.id)) : new Set());
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id));

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search code, customer, cake…"
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ORDER_STATUS_FLOW.concat("Cancelled").map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5">
          <p className="text-sm font-medium">{selected.size} order(s) selected</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success(`Assigned staff to ${selected.size} order(s)`)}
            >
              <UserPlus className="size-3.5" /> Assign Staff
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success(`Exported ${selected.size} order(s)`)}>
              <Download className="size-3.5" /> Export
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={allSelected} onCheckedChange={(c) => toggleAll(!!c)} aria-label="Select all" />
              </TableHead>
              <SortableHead label="Order" active={sortKey === "code"} dir={sortDir} onClick={() => toggleSort("code")} />
              <SortableHead
                label="Customer"
                active={sortKey === "customerName"}
                dir={sortDir}
                onClick={() => toggleSort("customerName")}
              />
              <TableHead>Cake</TableHead>
              <TableHead>Status</TableHead>
              <SortableHead label="Total" active={sortKey === "total"} dir={sortDir} onClick={() => toggleSort("total")} />
              <SortableHead
                label="Event Date"
                active={sortKey === "eventDate"}
                dir={sortDir}
                onClick={() => toggleSort("eventDate")}
              />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id} data-state={selected.has(o.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox checked={selected.has(o.id)} onCheckedChange={(c) => toggleOne(o.id, !!c)} aria-label="Select row" />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/orders/${o.code}`} className="text-primary hover:underline">
                    {o.code}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px]">{initials(o.customerName)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{o.customerName}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {o.items.map((i) => i.cakeName).join(", ")}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={o.status} />
                </TableCell>
                <TableCell>{formatKes(o.total)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(o.eventDate)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/orders/${o.code}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No orders match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SortableHead({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: 1 | -1;
  onClick: () => void;
}) {
  return (
    <TableHead>
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        {label}
        <ArrowUpDown className={`size-3 ${active ? "text-foreground" : ""} ${active && dir === -1 ? "rotate-180" : ""}`} />
      </button>
    </TableHead>
  );
}
