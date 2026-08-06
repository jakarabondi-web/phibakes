import type { CakeCategory } from "@/types";
import { cakeImage } from "./images";

export const CATEGORIES: CakeCategory[] = [
  {
    slug: "wedding",
    name: "Wedding Cakes",
    description: "Multi-tier masterpieces designed around your love story.",
    image: cakeImage(3),
    cakeCount: 4,
  },
  {
    slug: "birthday",
    name: "Birthday Cakes",
    description: "Playful to elegant — cakes that make the candles worth blowing out.",
    image: cakeImage(2),
    cakeCount: 4,
  },
  {
    slug: "graduation",
    name: "Graduation Cakes",
    description: "Celebrate the milestone with a cake as accomplished as you are.",
    image: cakeImage(13),
    cakeCount: 2,
  },
  {
    slug: "corporate",
    name: "Corporate Cakes",
    description: "Branded cakes and dessert tables for launches and office milestones.",
    image: cakeImage(10),
    cakeCount: 2,
  },
  {
    slug: "cupcakes",
    name: "Cupcakes",
    description: "Beautifully finished cupcakes, boxed for gifting or grazing tables.",
    image: cakeImage(5),
    cakeCount: 2,
  },
  {
    slug: "desserts",
    name: "Desserts",
    description: "Tarts, brownies, and pastries to complete any celebration.",
    image: cakeImage(6),
    cakeCount: 2,
  },
  {
    slug: "ready-today",
    name: "Ready Today",
    description: "In-studio favourites available for same-day pickup.",
    image: cakeImage(8),
    cakeCount: 3,
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
