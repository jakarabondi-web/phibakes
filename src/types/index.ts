export type CakeCategorySlug =
  | "wedding"
  | "birthday"
  | "graduation"
  | "corporate"
  | "cupcakes"
  | "desserts"
  | "ready-today";

export type CakeCategory = {
  slug: CakeCategorySlug;
  name: string;
  description: string;
  image: string;
  cakeCount: number;
};

export type CakeSize = "0.5kg" | "1kg" | "2kg" | "3kg" | "Multi-tier" | "Custom";

export type CakeFlavour =
  | "Vanilla"
  | "Chocolate"
  | "Red Velvet"
  | "Black Forest"
  | "White Forest"
  | "Carrot"
  | "Marble"
  | "Lemon"
  | "Blueberry"
  | "Fruit Cake";

export type CakeReview = {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  verified: boolean;
  ownerReply?: string;
};

export type Cake = {
  id: string;
  slug: string;
  name: string;
  category: CakeCategorySlug;
  images: string[];
  price: number;
  compareAtPrice?: number;
  servings: string;
  prepTimeHours: number;
  available: boolean;
  flavours: CakeFlavour[];
  sizes: CakeSize[];
  rating: number;
  reviewCount: number;
  description: string;
  tags: string[];
  productionPoints: number;
  reviews: CakeReview[];
};

export type OrderStatus =
  | "Requested"
  | "Quoted"
  | "Deposit Pending"
  | "Confirmed"
  | "Ingredients Ready"
  | "Baking"
  | "Decorating"
  | "Quality Check"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Completed"
  | "Cancelled";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "Requested",
  "Quoted",
  "Deposit Pending",
  "Confirmed",
  "Ingredients Ready",
  "Baking",
  "Decorating",
  "Quality Check",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Completed",
];

export type FulfilmentType = "pickup" | "delivery";

export type OrderItem = {
  id: string;
  cakeName: string;
  image: string;
  size: string;
  flavour: string;
  quantity: number;
  price: number;
  isCustom?: boolean;
};

export type PaymentRecord = {
  id: string;
  type: "deposit" | "balance" | "full";
  method: "mpesa" | "airtel" | "card" | "paypal" | "cash";
  amount: number;
  status: "pending" | "success" | "failed";
  mpesaReceipt?: string;
  phone?: string;
  date: string;
};

export type Order = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  depositAmount: number;
  amountPaid: number;
  balanceDue: number;
  fulfilment: FulfilmentType;
  deliveryAddress?: string;
  deliveryZone?: string;
  eventDate: string;
  createdAt: string;
  assignedStaff?: string;
  productionPoints: number;
  notes?: string;
  internalNotes?: string;
  payments: PaymentRecord[];
  timeline: { status: OrderStatus; date: string; note?: string }[];
};

export type QuoteStatus = "Pending Review" | "Quoted" | "Accepted" | "Declined" | "Expired";

export type Quote = {
  id: string;
  code: string;
  customerName: string;
  occasion: string;
  size: string;
  flavour: string;
  filling: string;
  decoration: string;
  eventDate: string;
  guests?: number;
  status: QuoteStatus;
  estimatedPrice?: number;
  quotedPrice?: number;
  createdAt: string;
  referenceImages?: string[];
  specialInstructions?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  costPerUnit: number;
  supplier: string;
  expiryDate?: string;
  status: "healthy" | "low" | "critical";
};

export type ProductionTask = {
  id: string;
  orderCode: string;
  cakeName: string;
  stage: "Ingredient Prep" | "Bake" | "Cooling" | "Decoration" | "Packaging" | "Delivery";
  assignedTo: string;
  start: string;
  end: string;
  status: "pending" | "in-progress" | "done" | "blocked";
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  lastOrderAt?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
};
