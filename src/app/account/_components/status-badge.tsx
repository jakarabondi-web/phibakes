import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { OrderStatus, QuoteStatus } from "@/types";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const ORDER_STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  Requested: "outline",
  Quoted: "secondary",
  "Deposit Pending": "warning",
  Confirmed: "secondary",
  "Ingredients Ready": "secondary",
  Baking: "gold",
  Decorating: "gold",
  "Quality Check": "gold",
  Ready: "success",
  "Out for Delivery": "success",
  Delivered: "success",
  Completed: "success",
  Cancelled: "destructive",
};

const QUOTE_STATUS_VARIANT: Record<QuoteStatus, BadgeVariant> = {
  "Pending Review": "outline",
  Quoted: "gold",
  Accepted: "success",
  Declined: "destructive",
  Expired: "secondary",
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <Badge variant={ORDER_STATUS_VARIANT[status]} className={className}>
      {status}
    </Badge>
  );
}

export function QuoteStatusBadge({ status, className }: { status: QuoteStatus; className?: string }) {
  return (
    <Badge variant={QUOTE_STATUS_VARIANT[status]} className={className}>
      {status}
    </Badge>
  );
}

const PAYMENT_STATUS_VARIANT: Record<"success" | "failed" | "pending", BadgeVariant> = {
  success: "success",
  failed: "destructive",
  pending: "warning",
};

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: "success" | "failed" | "pending";
  className?: string;
}) {
  const label = status === "success" ? "Success" : status === "failed" ? "Failed" : "Pending";
  return (
    <Badge variant={PAYMENT_STATUS_VARIANT[status]} className={className}>
      {label}
    </Badge>
  );
}
