import {
  Wallet,
  FileCheck2,
  PackageCheck,
  AlertCircle,
  Cookie,
  Truck,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type NotificationType =
  | "deposit"
  | "quote"
  | "confirmed"
  | "balance"
  | "ready"
  | "delivery"
  | "delivered"
  | "quality";

export type PortalNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  href?: string;
};

export const NOTIFICATION_ICONS: Record<NotificationType, LucideIcon> = {
  deposit: Wallet,
  quote: FileCheck2,
  confirmed: PackageCheck,
  balance: AlertCircle,
  ready: Cookie,
  delivery: Truck,
  delivered: CheckCircle2,
  quality: Sparkles,
};

export const NOTIFICATIONS: PortalNotification[] = [
  {
    id: "n1",
    type: "quality",
    title: "Your cake is in Quality Check",
    message: "Ivory Rose Wedding Tier (PB-10231) has moved to Decorating and is nearly ready.",
    date: "2026-08-06T08:30:00",
    read: false,
    href: "/account/orders/PB-10231",
  },
  {
    id: "n2",
    type: "deposit",
    title: "Deposit received",
    message: "We've received your KES 22,500 deposit for order PB-10231 via M-PESA.",
    date: "2026-07-20T14:12:00",
    read: false,
    href: "/account/payments",
  },
  {
    id: "n3",
    type: "quote",
    title: "Your custom quote is ready",
    message: "Quote PBQ-5502 has been priced at KES 16,500 — review and accept to secure your date.",
    date: "2026-08-01T09:05:00",
    read: false,
    href: "/account/quotes",
  },
  {
    id: "n4",
    type: "confirmed",
    title: "Order confirmed",
    message: "Your order PB-10231 is confirmed and scheduled for production.",
    date: "2026-07-21T10:00:00",
    read: true,
    href: "/account/orders/PB-10231",
  },
  {
    id: "n5",
    type: "balance",
    title: "Balance due soon",
    message: "A balance of KES 22,500 is due on PB-10231 before your event date of 15 Aug.",
    date: "2026-08-04T17:45:00",
    read: true,
    href: "/account/payments",
  },
  {
    id: "n6",
    type: "ready",
    title: "Cake ready for pickup reminder",
    message: "Reminder: cakes ordered for pickup should be collected within 4 hours of readiness.",
    date: "2026-07-30T12:00:00",
    read: true,
  },
  {
    id: "n7",
    type: "delivery",
    title: "Out for delivery",
    message: "A past order was out for delivery and arrived on schedule to Karen.",
    date: "2026-07-22T11:20:00",
    read: true,
  },
  {
    id: "n8",
    type: "delivered",
    title: "Delivered — enjoy your cake!",
    message: "Your Chocolate Drip Celebration Cake was delivered successfully. Leave a review?",
    date: "2026-07-28T13:15:00",
    read: true,
  },
  {
    id: "n9",
    type: "quote",
    title: "Welcome to PhiBakes Rewards",
    message: "You're enrolled in our loyalty programme — earn 1 point for every KES 100 spent.",
    date: "2026-02-14T09:00:00",
    read: true,
  },
];

export function unreadCount() {
  return NOTIFICATIONS.filter((n) => !n.read).length;
}
