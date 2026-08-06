import { INVENTORY } from "./inventory";

export type Supplier = {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  itemsSupplied: string[];
};

const CONTACTS: Record<string, { contactPerson: string; phone: string; email: string }> = {
  "Unga Millers Ltd": { contactPerson: "Samuel Kioko", phone: "+254 722 400 100", email: "sales@ungamillers.co.ke" },
  "Kiambu Fresh Farms": { contactPerson: "Rose Wanjiku", phone: "+254 711 300 220", email: "orders@kiambufresh.co.ke" },
  "Mumias Sugar Co.": { contactPerson: "Daniel Ouma", phone: "+254 733 550 340", email: "trade@mumiassugar.co.ke" },
  "Brookside Dairy": { contactPerson: "Esther Muthoni", phone: "+254 700 210 990", email: "b2b@brookside.co.ke" },
  "Cacao House Kenya": { contactPerson: "Peter Njenga", phone: "+254 720 880 115", email: "hello@cacaohouseke.com" },
  "Cake Craft Supplies": { contactPerson: "Linda Achieng", phone: "+254 712 660 480", email: "supply@cakecraft.co.ke" },
  "PakSmart Kenya": { contactPerson: "Victor Mutiso", phone: "+254 701 990 230", email: "info@paksmart.co.ke" },
  "PartyWorld Nairobi": { contactPerson: "Cynthia Wafula", phone: "+254 733 120 660", email: "orders@partyworldnbo.co.ke" },
};

const uniqueSuppliers = Array.from(new Set(INVENTORY.map((i) => i.supplier)));

export const SUPPLIERS: Supplier[] = uniqueSuppliers.map((name) => ({
  name,
  ...(CONTACTS[name] ?? { contactPerson: "—", phone: "—", email: "—" }),
  itemsSupplied: INVENTORY.filter((i) => i.supplier === name).map((i) => i.name),
}));
