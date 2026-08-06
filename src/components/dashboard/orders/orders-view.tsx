"use client";

import type { Order } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/orders/orders-table";
import { OrdersKanban } from "@/components/dashboard/orders/orders-kanban";
import { OrdersCalendar } from "@/components/dashboard/orders/orders-calendar";

export function OrdersView({ orders }: { orders: Order[] }) {
  return (
    <Tabs defaultValue="table">
      <TabsList>
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>
      <TabsContent value="table" className="mt-4">
        <OrdersTable orders={orders} />
      </TabsContent>
      <TabsContent value="kanban" className="mt-4">
        <OrdersKanban orders={orders} />
      </TabsContent>
      <TabsContent value="calendar" className="mt-4">
        <OrdersCalendar orders={orders} />
      </TabsContent>
    </Tabs>
  );
}
