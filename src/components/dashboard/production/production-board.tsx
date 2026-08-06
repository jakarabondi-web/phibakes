"use client";

import Link from "next/link";
import type { ProductionTask } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { initials } from "@/lib/utils";

const STAGES: ProductionTask["stage"][] = [
  "Ingredient Prep",
  "Bake",
  "Cooling",
  "Decoration",
  "Packaging",
  "Delivery",
];

const STATUS_VARIANT: Record<ProductionTask["status"], "secondary" | "gold" | "success" | "destructive"> = {
  pending: "secondary",
  "in-progress": "gold",
  done: "success",
  blocked: "destructive",
};

function timeWindow(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => d.toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit" });
  return `${fmt(s)} – ${fmt(e)}`;
}

export function ProductionBoard({ tasks }: { tasks: ProductionTask[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const rows = tasks.filter((t) => t.stage === stage);
        return (
          <div key={stage} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold">{stage}</h3>
              <Badge variant="secondary">{rows.length}</Badge>
            </div>
            <div className="flex min-h-[140px] flex-col gap-2.5 rounded-xl bg-muted/40 p-2.5">
              {rows.map((t) => (
                <Link key={t.id} href={`/dashboard/orders/${t.orderCode}`}>
                  <Card className="gap-2 p-3.5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-primary">{t.orderCode}</p>
                      <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge>
                    </div>
                    <p className="truncate text-sm font-medium">{t.cakeName}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {timeWindow(t.start, t.end)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Avatar className="size-5">
                          <AvatarFallback className="text-[9px]">{initials(t.assignedTo)}</AvatarFallback>
                        </Avatar>
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{t.assignedTo}</p>
                  </Card>
                </Link>
              ))}
              {rows.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No tasks</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
