import type { InventoryItem, ProductionTask, Customer } from "@/types";
import { AVATAR_IMAGES } from "./images";

export const INVENTORY: InventoryItem[] = [
  { id: "inv1", name: "Wheat Flour", category: "Dry Goods", unit: "kg", quantity: 82, reorderLevel: 40, costPerUnit: 140, supplier: "Unga Millers Ltd", status: "healthy" },
  { id: "inv2", name: "Free-range Eggs", category: "Perishable", unit: "trays", quantity: 6, reorderLevel: 8, costPerUnit: 450, supplier: "Kiambu Fresh Farms", expiryDate: "2026-08-14", status: "low" },
  { id: "inv3", name: "White Sugar", category: "Dry Goods", unit: "kg", quantity: 60, reorderLevel: 30, costPerUnit: 130, supplier: "Mumias Sugar Co.", status: "healthy" },
  { id: "inv4", name: "Unsalted Butter", category: "Dairy", unit: "kg", quantity: 9, reorderLevel: 15, costPerUnit: 780, supplier: "Brookside Dairy", expiryDate: "2026-08-20", status: "low" },
  { id: "inv5", name: "Fresh Cream", category: "Dairy", unit: "litres", quantity: 4, reorderLevel: 10, costPerUnit: 520, supplier: "Brookside Dairy", expiryDate: "2026-08-10", status: "critical" },
  { id: "inv6", name: "Dark Chocolate Couverture", category: "Confectionery", unit: "kg", quantity: 18, reorderLevel: 10, costPerUnit: 1450, supplier: "Cacao House Kenya", status: "healthy" },
  { id: "inv7", name: "Fondant Icing", category: "Confectionery", unit: "kg", quantity: 12, reorderLevel: 8, costPerUnit: 900, supplier: "Cake Craft Supplies", status: "healthy" },
  { id: "inv8", name: "Cake Boxes (10-inch)", category: "Packaging", unit: "pieces", quantity: 45, reorderLevel: 50, costPerUnit: 120, supplier: "PakSmart Kenya", status: "low" },
  { id: "inv9", name: "Cake Boards (Gold, 12-inch)", category: "Packaging", unit: "pieces", quantity: 30, reorderLevel: 20, costPerUnit: 90, supplier: "PakSmart Kenya", status: "healthy" },
  { id: "inv10", name: "Birthday Candles", category: "Decor", unit: "packs", quantity: 22, reorderLevel: 15, costPerUnit: 150, supplier: "PartyWorld Nairobi", status: "healthy" },
  { id: "inv11", name: "Gel Food Colouring Set", category: "Decor", unit: "sets", quantity: 3, reorderLevel: 5, costPerUnit: 2200, supplier: "Cake Craft Supplies", status: "critical" },
  { id: "inv12", name: "Vanilla Extract", category: "Dry Goods", unit: "litres", quantity: 5, reorderLevel: 4, costPerUnit: 3200, supplier: "Cacao House Kenya", status: "healthy" },
];

export const PRODUCTION_TASKS: ProductionTask[] = [
  { id: "pt1", orderCode: "PB-10231", cakeName: "Ivory Rose Wedding Tier", stage: "Decoration", assignedTo: "Chef Lydia", start: "2026-08-06T07:00:00", end: "2026-08-06T15:00:00", status: "in-progress" },
  { id: "pt2", orderCode: "PB-10234", cakeName: "Scholar's Cap Graduation Cake", stage: "Bake", assignedTo: "Chef Otieno", start: "2026-08-06T06:00:00", end: "2026-08-06T09:00:00", status: "in-progress" },
  { id: "pt3", orderCode: "PB-10233", cakeName: "Confetti Dream Birthday Cake", stage: "Delivery", assignedTo: "Rider — James", start: "2026-08-06T11:00:00", end: "2026-08-06T12:30:00", status: "in-progress" },
  { id: "pt4", orderCode: "PB-10232", cakeName: "Brand Launch Sheet Cake", stage: "Ingredient Prep", assignedTo: "Chef Otieno", start: "2026-08-07T06:00:00", end: "2026-08-07T08:00:00", status: "pending" },
  { id: "pt5", orderCode: "PB-10235", cakeName: "Executive Dessert Table", stage: "Ingredient Prep", assignedTo: "Chef Lydia", start: "2026-08-18T06:00:00", end: "2026-08-18T10:00:00", status: "pending" },
  { id: "pt6", orderCode: "PB-10236", cakeName: "Chocolate Drip Celebration Cake", stage: "Packaging", assignedTo: "Chef Otieno", start: "2026-07-28T09:00:00", end: "2026-07-28T09:30:00", status: "done" },
  { id: "pt7", orderCode: "PB-10237", cakeName: "Today's Red Velvet Cake", stage: "Cooling", assignedTo: "Chef Lydia", start: "2026-07-15T08:00:00", end: "2026-07-15T09:00:00", status: "done" },
  { id: "pt8", orderCode: "PB-10238", cakeName: "Golden Number Cake", stage: "Ingredient Prep", assignedTo: "Unassigned", start: "2026-08-24T06:00:00", end: "2026-08-24T08:00:00", status: "blocked" },
];

export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Wanjiru Kamau", email: "wanjiru.kamau@example.com", phone: "+254 712 345 678", avatar: AVATAR_IMAGES[0], joinedAt: "2025-02-14", totalOrders: 6, totalSpent: 132000, loyaltyPoints: 1320, tier: "Platinum", lastOrderAt: "2026-07-20" },
  { id: "c2", name: "Brian Otieno", email: "brian.otieno@example.com", phone: "+254 722 111 222", avatar: AVATAR_IMAGES[1], joinedAt: "2025-11-02", totalOrders: 3, totalSpent: 41500, loyaltyPoints: 415, tier: "Gold", lastOrderAt: "2026-08-02" },
  { id: "c3", name: "Amina Hassan", email: "amina.hassan@example.com", phone: "+254 733 444 555", avatar: AVATAR_IMAGES[2], joinedAt: "2026-01-20", totalOrders: 2, totalSpent: 12300, loyaltyPoints: 123, tier: "Silver", lastOrderAt: "2026-08-03" },
  { id: "c4", name: "David Mwangi", email: "david.mwangi@example.com", phone: "+254 700 987 654", avatar: AVATAR_IMAGES[3], joinedAt: "2026-03-11", totalOrders: 1, totalSpent: 7800, loyaltyPoints: 78, tier: "Bronze", lastOrderAt: "2026-08-04" },
  { id: "c5", name: "Faith Njeri", email: "faith.njeri@example.com", phone: "+254 711 222 333", avatar: AVATAR_IMAGES[4], joinedAt: "2025-06-18", totalOrders: 9, totalSpent: 210000, loyaltyPoints: 2100, tier: "Platinum", lastOrderAt: "2026-08-05" },
  { id: "c6", name: "Kevin Wafula", email: "kevin.wafula@example.com", phone: "+254 720 555 666", avatar: AVATAR_IMAGES[5], joinedAt: "2025-09-09", totalOrders: 4, totalSpent: 26400, loyaltyPoints: 264, tier: "Gold", lastOrderAt: "2026-07-28" },
];
