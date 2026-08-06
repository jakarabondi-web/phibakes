import { AVATAR_IMAGES } from "./images";

export type StaffRole = "Head Baker" | "Baker" | "Decorator" | "Rider" | "Customer Support";

export type StaffMember = {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  avatar: string;
  active: boolean;
  joinedAt: string;
  ordersHandled: number;
};

export const STAFF: StaffMember[] = [
  {
    id: "st1",
    name: "Chef Lydia",
    role: "Head Baker",
    phone: "+254 711 200 100",
    email: "lydia@phibakes.co.ke",
    avatar: AVATAR_IMAGES[0],
    active: true,
    joinedAt: "2023-03-01",
    ordersHandled: 214,
  },
  {
    id: "st2",
    name: "Chef Otieno",
    role: "Baker",
    phone: "+254 722 300 200",
    email: "otieno@phibakes.co.ke",
    avatar: AVATAR_IMAGES[1],
    active: true,
    joinedAt: "2023-08-15",
    ordersHandled: 168,
  },
  {
    id: "st3",
    name: "Faith Nyambura",
    role: "Decorator",
    phone: "+254 733 400 300",
    email: "faith.n@phibakes.co.ke",
    avatar: AVATAR_IMAGES[2],
    active: true,
    joinedAt: "2024-01-10",
    ordersHandled: 96,
  },
  {
    id: "st4",
    name: "Rider — James",
    role: "Rider",
    phone: "+254 700 555 400",
    email: "james.rider@phibakes.co.ke",
    avatar: AVATAR_IMAGES[3],
    active: true,
    joinedAt: "2024-05-22",
    ordersHandled: 302,
  },
  {
    id: "st5",
    name: "Rider — Mercy",
    role: "Rider",
    phone: "+254 700 555 401",
    email: "mercy.rider@phibakes.co.ke",
    avatar: AVATAR_IMAGES[4],
    active: false,
    joinedAt: "2024-09-02",
    ordersHandled: 87,
  },
  {
    id: "st6",
    name: "Grace Achieng",
    role: "Customer Support",
    phone: "+254 720 600 500",
    email: "grace.support@phibakes.co.ke",
    avatar: AVATAR_IMAGES[5],
    active: true,
    joinedAt: "2023-11-30",
    ordersHandled: 410,
  },
];

export const STAFF_NAMES = STAFF.map((s) => s.name);
