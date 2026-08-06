import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, Phone, Gift, Star } from "lucide-react";
import { CUSTOMERS } from "@/lib/data/inventory";
import { ORDERS } from "@/lib/data/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatKes, initials } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = CUSTOMERS.find((c) => c.id === id);
  return { title: customer ? customer.name : "Customer" };
}

const TIER_VARIANT = { Bronze: "secondary", Silver: "secondary", Gold: "gold", Platinum: "default" } as const;

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = CUSTOMERS.find((c) => c.id === id);
  if (!customer) notFound();

  const orders = ORDERS.filter((o) => o.customerName === customer.name).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <Link
        href="/dashboard/customers"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to customers
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={customer.avatar} alt={customer.name} />
          <AvatarFallback className="text-lg">{initials(customer.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{customer.name}</h1>
            <Badge variant={TIER_VARIANT[customer.tier]}>{customer.tier}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Customer since {formatDate(customer.joinedAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Cake</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Event Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>
                        <Link href={`/dashboard/orders/${o.code}`} className="font-medium text-primary hover:underline">
                          {o.code}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate text-muted-foreground">
                        {o.items.map((i) => i.cakeName).join(", ")}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={o.status} />
                      </TableCell>
                      <TableCell>{formatKes(o.total)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(o.eventDate)}</TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No orders on record for this customer.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="mt-3 flex flex-col gap-2 p-0 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 text-berry" /> {customer.email}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 text-berry" /> {customer.phone}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Lifetime Value</CardTitle>
            </CardHeader>
            <CardContent className="mt-3 flex flex-col gap-2 p-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-medium">{customer.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-medium">{formatKes(customer.totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Order</span>
                <span className="font-medium">
                  {formatKes(Math.round(customer.totalSpent / Math.max(1, customer.totalOrders)))}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 py-6">
            <CardHeader className="p-0 flex-row items-center gap-2">
              <Gift className="size-4 text-gold" />
              <CardTitle>Loyalty</CardTitle>
            </CardHeader>
            <CardContent className="mt-3 flex flex-col gap-2 p-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points Balance</span>
                <span className="font-medium">{customer.loyaltyPoints.toLocaleString()} pts</span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-gold text-gold" />
                Earns 1 point per KES 100 spent — redeemable from 500 pts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
