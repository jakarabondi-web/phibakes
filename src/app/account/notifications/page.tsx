"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCheck, Bell as BellIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDateTime } from "@/lib/utils";
import { NOTIFICATIONS, NOTIFICATION_ICONS } from "../_lib/notifications";
import { PageHeader } from "../_components/page-header";

export default function NotificationsPage() {
  const [items, setItems] = React.useState(NOTIFICATIONS);
  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unread > 0 ? `You have ${unread} unread notification${unread === 1 ? "" : "s"}.` : "You're all caught up."}
        action={
          unread > 0 ? (
            <Button variant="outline" onClick={markAllRead}>
              <CheckCheck /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <Card className="p-10 py-12 text-center">
          <BellIcon className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 font-display text-lg font-semibold">No notifications</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((n) => {
            const Icon = NOTIFICATION_ICONS[n.type];
            const content = (
              <Card
                className={cn(
                  "flex-row items-start gap-3.5 p-4 py-4 transition-colors",
                  !n.read && "border-primary/30 bg-blush/40"
                )}
                onClick={() => markRead(n.id)}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    n.read ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1 px-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                    {!n.read && <span className="mt-1 size-2 shrink-0 rounded-full bg-gold" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground/80">{formatDateTime(n.date)}</p>
                </div>
              </Card>
            );

            return n.href ? (
              <Link key={n.id} href={n.href} onClick={() => markRead(n.id)}>
                {content}
              </Link>
            ) : (
              <div key={n.id} className="cursor-pointer" onClick={() => markRead(n.id)}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
