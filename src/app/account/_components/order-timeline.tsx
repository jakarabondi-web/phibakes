import { Check } from "lucide-react";
import { ORDER_STATUS_FLOW } from "@/types";
import type { Order } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";

export function OrderTimeline({ order }: { order: Order }) {
  const isCancelled = order.status === "Cancelled";
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const timelineMap = new Map(order.timeline.map((t) => [t.status, t]));

  return (
    <ol className="relative">
      {ORDER_STATUS_FLOW.map((status, i) => {
        const entry = timelineMap.get(status);
        const done = !isCancelled && i <= currentIdx;
        const isCurrent = !isCancelled && i === currentIdx;
        const isLast = i === ORDER_STATUS_FLOW.length - 1;

        return (
          <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px",
                  done && i < currentIdx ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
                isCurrent && "ring-4 ring-gold/25"
              )}
            >
              {done ? <Check className="size-4" /> : i + 1}
            </span>
            <div className="flex-1 pt-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {status}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {entry ? formatDateTime(entry.date) : "Pending"}
                {entry?.note ? ` — ${entry.note}` : ""}
              </p>
            </div>
          </li>
        );
      })}
      {isCancelled && (
        <li className="mt-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          This order was cancelled.
        </li>
      )}
    </ol>
  );
}
