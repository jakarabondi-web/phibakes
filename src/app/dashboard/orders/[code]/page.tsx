import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getOrderByCode } from "@/lib/data/orders";
import { formatDate } from "@/lib/utils";
import { OrderDetailPanel } from "@/components/dashboard/orders/order-detail-panel";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = getOrderByCode(code);
  return { title: order ? `Order ${order.code}` : "Order" };
}

export default async function DashboardOrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = getOrderByCode(code);
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/dashboard/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{order.code}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)} &middot; Event date {formatDate(order.eventDate)}
          </p>
        </div>
      </div>

      <OrderDetailPanel order={order} />
    </div>
  );
}
