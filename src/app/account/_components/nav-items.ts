import {
  LayoutDashboard,
  Package,
  Truck,
  FileText,
  Receipt,
  CreditCard,
  MapPin,
  Heart,
  Gift,
  Bell,
  LifeBuoy,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ACCOUNT_NAV: NavItem[] = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/track", label: "Track Order", icon: Truck },
  { href: "/account/quotes", label: "Quotes", icon: FileText },
  { href: "/account/invoices", label: "Invoices", icon: Receipt },
  { href: "/account/payments", label: "Payments", icon: CreditCard },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/rewards", label: "Rewards", icon: Gift },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/support", label: "Support", icon: LifeBuoy },
  { href: "/account/profile", label: "Profile", icon: UserCog },
];
