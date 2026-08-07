import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  CalendarDays,
  ChefHat,
  Boxes,
  BookOpen,
  Truck,
  Wallet,
  BarChart3,
  Megaphone,
  Image as ImageIcon,
  Star,
  UserCog,
  Bike,
  Settings,
  ScrollText,
  ShoppingCart,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [{ label: "Overview", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/dashboard/orders", icon: ClipboardList },
      { label: "Quotes", href: "/dashboard/quotes", icon: FileText },
      { label: "Customers", href: "/dashboard/customers", icon: Users },
      { label: "Payments", href: "/dashboard/payments", icon: Wallet },
      { label: "Abandoned Carts", href: "/dashboard/abandoned-carts", icon: ShoppingCart },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { label: "Production", href: "/dashboard/production", icon: ChefHat },
      { label: "Inventory", href: "/dashboard/inventory", icon: Boxes },
      { label: "Recipes", href: "/dashboard/recipes", icon: BookOpen },
      { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
      { label: "Delivery", href: "/dashboard/delivery", icon: Bike },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { label: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
      { label: "Gallery", href: "/dashboard/gallery", icon: ImageIcon },
      { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Staff", href: "/dashboard/staff", icon: UserCog },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
      { label: "Audit Logs", href: "/dashboard/audit-logs", icon: ScrollText },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
