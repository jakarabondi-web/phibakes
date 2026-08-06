import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUS_FLOW } from "@/types";
import { cakeImage } from "./images";

function timelineUpTo(status: OrderStatus, createdAt: string) {
  const idx = ORDER_STATUS_FLOW.indexOf(status);
  const base = new Date(createdAt).getTime();
  return ORDER_STATUS_FLOW.slice(0, idx + 1).map((s, i) => ({
    status: s,
    date: new Date(base + i * 1000 * 60 * 60 * 6).toISOString(),
  }));
}

type Seed = {
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  cakeName: string;
  image: number;
  status: OrderStatus;
  total: number;
  paidRatio: number;
  fulfilment: "pickup" | "delivery";
  deliveryZone?: string;
  eventDate: string;
  createdAt: string;
  productionPoints: number;
  assignedStaff?: string;
};

const SEEDS: Seed[] = [
  {
    code: "PB-10231",
    customerName: "Wanjiru Kamau",
    customerPhone: "+254 712 345 678",
    customerEmail: "wanjiru.kamau@example.com",
    cakeName: "Ivory Rose Wedding Tier",
    image: 3,
    status: "Decorating",
    total: 45000,
    paidRatio: 0.5,
    fulfilment: "delivery",
    deliveryZone: "Karen",
    eventDate: "2026-08-15",
    createdAt: "2026-07-20",
    productionPoints: 8,
    assignedStaff: "Chef Lydia",
  },
  {
    code: "PB-10232",
    customerName: "Brian Otieno",
    customerPhone: "+254 722 111 222",
    customerEmail: "brian.otieno@example.com",
    cakeName: "Brand Launch Sheet Cake",
    image: 10,
    status: "Confirmed",
    total: 12500,
    paidRatio: 1,
    fulfilment: "delivery",
    deliveryZone: "Westlands",
    eventDate: "2026-08-10",
    createdAt: "2026-08-02",
    productionPoints: 3,
    assignedStaff: "Chef Otieno",
  },
  {
    code: "PB-10233",
    customerName: "Amina Hassan",
    customerPhone: "+254 733 444 555",
    customerEmail: "amina.hassan@example.com",
    cakeName: "Confetti Dream Birthday Cake",
    image: 2,
    status: "Out for Delivery",
    total: 6500,
    paidRatio: 1,
    fulfilment: "delivery",
    deliveryZone: "Westlands",
    eventDate: "2026-08-06",
    createdAt: "2026-08-03",
    productionPoints: 1,
    assignedStaff: "Chef Lydia",
  },
  {
    code: "PB-10234",
    customerName: "David Mwangi",
    customerPhone: "+254 700 987 654",
    customerEmail: "david.mwangi@example.com",
    cakeName: "Scholar's Cap Graduation Cake",
    image: 13,
    status: "Baking",
    total: 7800,
    paidRatio: 0.5,
    fulfilment: "pickup",
    eventDate: "2026-08-09",
    createdAt: "2026-08-04",
    productionPoints: 3,
    assignedStaff: "Chef Otieno",
  },
  {
    code: "PB-10235",
    customerName: "Faith Njeri",
    customerPhone: "+254 711 222 333",
    customerEmail: "faith.njeri@example.com",
    cakeName: "Executive Dessert Table",
    image: 6,
    status: "Deposit Pending",
    total: 21000,
    paidRatio: 0,
    fulfilment: "delivery",
    deliveryZone: "CBD",
    eventDate: "2026-08-20",
    createdAt: "2026-08-05",
    productionPoints: 5,
  },
  {
    code: "PB-10236",
    customerName: "Kevin Wafula",
    customerPhone: "+254 720 555 666",
    customerEmail: "kevin.wafula@example.com",
    cakeName: "Chocolate Drip Celebration Cake",
    image: 0,
    status: "Delivered",
    total: 5800,
    paidRatio: 1,
    fulfilment: "delivery",
    deliveryZone: "Kilimani",
    eventDate: "2026-07-28",
    createdAt: "2026-07-24",
    productionPoints: 1,
    assignedStaff: "Chef Lydia",
  },
  {
    code: "PB-10237",
    customerName: "Grace Achieng",
    customerPhone: "+254 701 888 999",
    customerEmail: "grace.achieng@example.com",
    cakeName: "Today's Red Velvet Cake",
    image: 15,
    status: "Completed",
    total: 4600,
    paidRatio: 1,
    fulfilment: "pickup",
    eventDate: "2026-07-15",
    createdAt: "2026-07-15",
    productionPoints: 1,
  },
  {
    code: "PB-10238",
    customerName: "Peter Kariuki",
    customerPhone: "+254 733 121 212",
    customerEmail: "peter.kariuki@example.com",
    cakeName: "Golden Number Cake",
    image: 14,
    status: "Requested",
    total: 8200,
    paidRatio: 0,
    fulfilment: "delivery",
    deliveryZone: "Lavington",
    eventDate: "2026-08-25",
    createdAt: "2026-08-06",
    productionPoints: 1,
  },
];

export const ORDERS: Order[] = SEEDS.map((s, i) => {
  const total = s.total;
  const depositAmount = Math.round(total * 0.5);
  const amountPaid = Math.round(total * s.paidRatio);
  return {
    id: `order-${i + 1}`,
    code: s.code,
    customerName: s.customerName,
    customerPhone: s.customerPhone,
    customerEmail: s.customerEmail,
    items: [
      {
        id: `item-${i + 1}`,
        cakeName: s.cakeName,
        image: cakeImage(s.image),
        size: "1kg",
        flavour: "Chocolate",
        quantity: 1,
        price: total,
      },
    ],
    status: s.status,
    total,
    depositAmount,
    amountPaid,
    balanceDue: Math.max(0, total - amountPaid),
    fulfilment: s.fulfilment,
    deliveryAddress: s.deliveryZone ? `${s.deliveryZone}, Nairobi` : undefined,
    deliveryZone: s.deliveryZone,
    eventDate: s.eventDate,
    createdAt: s.createdAt,
    assignedStaff: s.assignedStaff,
    productionPoints: s.productionPoints,
    payments:
      amountPaid > 0
        ? [
            {
              id: `pay-${i + 1}-1`,
              type: s.paidRatio >= 1 ? "full" : "deposit",
              method: "mpesa",
              amount: amountPaid,
              status: "success",
              mpesaReceipt: `S${(10000 + i * 37).toString(36).toUpperCase()}KE`,
              phone: s.customerPhone,
              date: s.createdAt,
            },
          ]
        : [],
    timeline: timelineUpTo(s.status, s.createdAt),
  };
});

export function getOrderByCode(code: string) {
  return ORDERS.find((o) => o.code.toLowerCase() === code.toLowerCase());
}
