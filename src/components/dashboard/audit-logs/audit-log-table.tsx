"use client";

import * as React from "react";
import type { AuditLogEntry, AuditAction } from "@/lib/data/audit-log";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";

const ACTIONS: AuditAction[] = ["Create", "Update", "Delete", "Status Change", "Login"];

const ACTION_VARIANT: Record<AuditAction, "success" | "gold" | "destructive" | "secondary" | "outline"> = {
  Create: "success",
  Update: "gold",
  Delete: "destructive",
  "Status Change": "secondary",
  Login: "outline",
};

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  const [actionFilter, setActionFilter] = React.useState("all");

  const filtered = entries.filter((e) => actionFilter === "all" || e.action === actionFilter);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.actor}</TableCell>
                <TableCell>
                  <Badge variant={ACTION_VARIANT[e.action]}>{e.action}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{e.entity}</TableCell>
                <TableCell className="max-w-[320px] truncate">{e.detail}</TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(e.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
