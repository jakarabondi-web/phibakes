import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { OrderStatus, QuoteStatus } from "@/types";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export const STATUS_BADGE: Record<OrderStatus, BadgeVariant> = {
  Requested: "outline",
  Quoted: "secondary",
  "Deposit Pending": "warning",
  Confirmed: "gold",
  "Ingredients Ready": "secondary",
  Baking: "gold",
  Decorating: "gold",
  "Quality Check": "warning",
  Ready: "success",
  "Out for Delivery": "default",
  Delivered: "success",
  Completed: "success",
  Cancelled: "destructive",
};

export const QUOTE_STATUS_BADGE: Record<QuoteStatus, BadgeVariant> = {
  "Pending Review": "warning",
  Quoted: "gold",
  Accepted: "success",
  Declined: "destructive",
  Expired: "outline",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_BADGE[status]}>{status}</Badge>;
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <Badge variant={QUOTE_STATUS_BADGE[status]}>{status}</Badge>;
}
