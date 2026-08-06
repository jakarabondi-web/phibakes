import type { Cake, CakeReview } from "@/types";
import { cakeImage, AVATAR_IMAGES } from "./images";
import { slugify } from "@/lib/utils";

function reviews(seed: number, names: string[]): CakeReview[] {
  const comments = [
    "Absolutely stunning and tasted even better than it looked. PhiBakes nailed the brief perfectly.",
    "Ordered for my daughter's birthday — the cake arrived on time and the decoration was flawless.",
    "Rich, moist, not too sweet. Guests kept asking where I got it from.",
    "The custom design matched my inspiration photo almost exactly. Will order again.",
    "Delivery was smooth and the cake held up perfectly for the outdoor event.",
  ];
  return names.map((name, i) => ({
    id: `rev-${seed}-${i}`,
    customerName: name,
    avatar: AVATAR_IMAGES[(seed + i) % AVATAR_IMAGES.length],
    rating: 4 + ((seed + i) % 2 === 0 ? 1 : 0),
    date: new Date(2026, 5 - i, 10 + i).toISOString(),
    comment: comments[(seed + i) % comments.length],
    verified: true,
    ownerReply:
      i === 0
        ? "Thank you so much for trusting us with your celebration — it means the world to our team! 💛"
        : undefined,
  }));
}

const NAME_POOL = [
  "Wanjiru K.",
  "Brian O.",
  "Amina H.",
  "David M.",
  "Faith N.",
  "Kevin W.",
  "Grace A.",
  "Peter K.",
];

type Seed = {
  name: string;
  category: Cake["category"];
  price: number;
  compareAtPrice?: number;
  servings: string;
  prepTimeHours: number;
  flavours: Cake["flavours"];
  sizes: Cake["sizes"];
  productionPoints: number;
  description: string;
  tags: string[];
  imageIdx: number[];
  available?: boolean;
  /** Overrides the computed Unsplash `imageIdx` lookup with explicit local paths. */
  images?: string[];
  /** Overrides the formulaic rating/reviewCount for products with known reference values. */
  rating?: number;
  reviewCount?: number;
};

const SEEDS: Seed[] = [
  {
    name: "Ivory Rose Wedding Tier",
    category: "wedding",
    price: 45000,
    compareAtPrice: 52000,
    servings: "80–100 guests",
    prepTimeHours: 72,
    flavours: ["Vanilla", "Red Velvet", "Chocolate"],
    sizes: ["Multi-tier", "Custom"],
    productionPoints: 8,
    description:
      "A three-tier wedding centrepiece finished in hand-piped buttercream roses and edible gold leaf. Each tier can carry a different flavour so every guest finds their favourite.",
    tags: ["Bestseller", "Multi-tier"],
    imageIdx: [3, 4, 10],
  },
  {
    name: "Gilded Botanical Wedding Cake",
    category: "wedding",
    price: 58000,
    servings: "100–120 guests",
    prepTimeHours: 96,
    flavours: ["Vanilla", "Lemon", "Marble"],
    sizes: ["Multi-tier", "Custom"],
    productionPoints: 8,
    description:
      "Four elegant tiers in smooth fondant, dressed with sugar florals and gold brushwork for a garden-luxe wedding aesthetic.",
    tags: ["Premium"],
    imageIdx: [4, 3, 11],
  },
  {
    name: "Classic White Fondant Wedding Cake",
    category: "wedding",
    price: 38000,
    servings: "60–70 guests",
    prepTimeHours: 60,
    flavours: ["Vanilla", "Chocolate"],
    sizes: ["Multi-tier"],
    productionPoints: 8,
    description:
      "Timeless two-tier fondant cake with delicate piping detail — a graceful choice for intimate weddings.",
    tags: ["Popular"],
    imageIdx: [10, 4],
  },
  {
    name: "Berry Blush Wedding Cake",
    category: "wedding",
    price: 49000,
    servings: "80 guests",
    prepTimeHours: 72,
    flavours: ["Red Velvet", "Vanilla"],
    sizes: ["Multi-tier", "Custom"],
    productionPoints: 8,
    description: "Soft blush ombré buttercream with fresh berry accents — romantic and modern.",
    tags: ["New"],
    imageIdx: [8, 3],
  },
  {
    name: "Confetti Dream Birthday Cake",
    category: "birthday",
    price: 6500,
    servings: "10–12 slices",
    prepTimeHours: 24,
    flavours: ["Vanilla", "Chocolate", "Marble"],
    sizes: ["1kg", "2kg"],
    productionPoints: 1,
    description:
      "A joyful funfetti sponge with rainbow sprinkles, finished with a smooth buttercream and personalised topper.",
    tags: ["Bestseller", "Kids Favourite"],
    imageIdx: [2, 5],
  },
  {
    name: "Golden Number Cake",
    category: "birthday",
    price: 8200,
    servings: "12–15 slices",
    prepTimeHours: 24,
    flavours: ["Chocolate", "Red Velvet"],
    sizes: ["1kg", "2kg", "3kg"],
    productionPoints: 1,
    description:
      "A striking number-shaped cake in gold drip finish — the showstopper for milestone birthdays.",
    tags: ["Trending"],
    imageIdx: [14, 0],
  },
  {
    name: "Chocolate Drip Celebration Cake",
    category: "birthday",
    price: 5800,
    servings: "8–10 slices",
    prepTimeHours: 20,
    flavours: ["Chocolate", "Black Forest"],
    sizes: ["0.5kg", "1kg", "2kg"],
    productionPoints: 1,
    description: "Decadent chocolate sponge layered with ganache and a glossy chocolate drip.",
    tags: ["Bestseller"],
    imageIdx: [0, 1],
  },
  {
    name: "Floral Garden Birthday Cake",
    category: "birthday",
    price: 7400,
    servings: "10–12 slices",
    prepTimeHours: 24,
    flavours: ["Vanilla", "Lemon", "Blueberry"],
    sizes: ["1kg", "2kg"],
    productionPoints: 1,
    description: "Soft pastel buttercream piped with delicate sugar flowers, ideal for garden parties.",
    tags: ["New"],
    imageIdx: [11, 6],
  },
  {
    name: "Scholar's Cap Graduation Cake",
    category: "graduation",
    price: 7800,
    servings: "12–15 slices",
    prepTimeHours: 30,
    flavours: ["Chocolate", "Vanilla"],
    sizes: ["1kg", "2kg", "3kg"],
    productionPoints: 3,
    description: "A graduation cap topper on a clean fondant base, personalised with year and university colours.",
    tags: ["Popular"],
    imageIdx: [13, 9],
  },
  {
    name: "Achievement Ombré Cake",
    category: "graduation",
    price: 6900,
    servings: "10–12 slices",
    prepTimeHours: 24,
    flavours: ["Marble", "Carrot"],
    sizes: ["1kg", "2kg"],
    productionPoints: 3,
    description: "An ombré buttercream cake finished with a gold '2026' topper — a fresh, modern way to celebrate.",
    tags: [],
    imageIdx: [9, 13],
  },
  {
    name: "Brand Launch Sheet Cake",
    category: "corporate",
    price: 12500,
    servings: "30–35 slices",
    prepTimeHours: 36,
    flavours: ["Chocolate", "Vanilla", "Red Velvet"],
    sizes: ["2kg", "3kg", "Custom"],
    productionPoints: 3,
    description: "A full-sheet cake with edible logo print — perfect for product launches and office parties.",
    tags: ["Corporate Favourite"],
    imageIdx: [10, 7],
  },
  {
    name: "Executive Dessert Table",
    category: "corporate",
    price: 21000,
    servings: "50 guests (mixed desserts)",
    prepTimeHours: 40,
    flavours: ["Chocolate", "Vanilla", "Lemon"],
    sizes: ["Custom"],
    productionPoints: 5,
    description: "A curated dessert table of mini cakes, tarts and cupcakes styled to your brand colours.",
    tags: ["Premium"],
    imageIdx: [6, 5],
  },
  {
    name: "Signature Vanilla Cupcakes (Box of 12)",
    category: "cupcakes",
    price: 2400,
    servings: "12 cupcakes",
    prepTimeHours: 12,
    flavours: ["Vanilla", "Chocolate", "Red Velvet"],
    sizes: ["Custom"],
    productionPoints: 1,
    description: "Light, fluffy cupcakes topped with hand-piped swirls — sold by the dozen, mixed flavours available.",
    tags: ["Bestseller"],
    imageIdx: [5, 16],
  },
  {
    name: "Salted Caramel Cupcakes (Box of 12)",
    category: "cupcakes",
    price: 2800,
    servings: "12 cupcakes",
    prepTimeHours: 12,
    flavours: ["Chocolate", "Marble"],
    sizes: ["Custom"],
    productionPoints: 1,
    description: "Moist chocolate cupcakes filled with salted caramel and topped with a caramel drizzle.",
    tags: ["New"],
    imageIdx: [16, 5],
  },
  {
    name: "Classic Chocolate Brownies (Box of 9)",
    category: "desserts",
    price: 1800,
    servings: "9 pieces",
    prepTimeHours: 8,
    flavours: ["Chocolate"],
    sizes: ["Custom"],
    productionPoints: 1,
    description: "Fudgy, dense brownies with a crackly top — a fan favourite for grazing tables.",
    tags: ["Popular"],
    imageIdx: [17, 0],
  },
  {
    name: "Lemon Tart Selection (Box of 6)",
    category: "desserts",
    price: 2600,
    servings: "6 pieces",
    prepTimeHours: 10,
    flavours: ["Lemon"],
    sizes: ["Custom"],
    productionPoints: 1,
    description: "Buttery pastry shells filled with tangy lemon curd and torched meringue.",
    tags: [],
    imageIdx: [6, 17],
  },
  {
    name: "Classic Chocolate Cake",
    category: "ready-today",
    price: 3000,
    servings: "8–10 slices",
    prepTimeHours: 0,
    flavours: ["Chocolate"],
    sizes: ["1kg"],
    productionPoints: 1,
    description: "Baked this morning and ready for same-day pickup at our Kilimani studio.",
    tags: ["Ready Today", "Same Day"],
    imageIdx: [],
    images: ["/images/categories/birthday-cake.png"],
    available: true,
  },
  {
    name: "Red Velvet Slice",
    category: "ready-today",
    price: 2800,
    servings: "1 generous slice",
    prepTimeHours: 0,
    flavours: ["Red Velvet"],
    sizes: ["Custom"],
    productionPoints: 1,
    description: "Velvety layers with cream cheese frosting, available for pickup within the hour.",
    tags: ["Ready Today"],
    imageIdx: [],
    images: ["/images/categories/desserts.png"],
    available: true,
  },
  {
    name: "Vanilla Cupcakes (6pcs)",
    category: "ready-today",
    price: 2800,
    servings: "6 cupcakes",
    prepTimeHours: 0,
    flavours: ["Vanilla"],
    sizes: ["Custom"],
    productionPoints: 1,
    description: "A grab-and-go box of six vanilla cupcakes, freshly finished this morning.",
    tags: ["Ready Today"],
    imageIdx: [],
    images: ["/images/categories/cupcakes.png"],
    available: true,
  },
  // The next four are the site's flagship "Featured Cakes" — named and priced
  // to match the studio's reference design exactly, with local photography.
  // The "Featured favourites" lineup from the Option 1 reference board —
  // names, "From KES" prices, and photography match the board exactly.
  {
    name: "Velvet Rose",
    category: "birthday",
    price: 2500,
    servings: "10–12 servings",
    prepTimeHours: 24,
    flavours: ["Chocolate", "Vanilla"],
    sizes: ["1kg", "2kg"],
    productionPoints: 3,
    description:
      "A chocolate-drip celebration cake crowned with gold candles, truffles and piped rosettes — our most-loved birthday centrepiece.",
    tags: ["Bestseller", "Featured"],
    imageIdx: [],
    images: ["/images/categories/birthday-cake.png"],
    rating: 4.8,
    reviewCount: 128,
  },
  {
    name: "Golden Vanilla",
    category: "wedding",
    price: 3200,
    servings: "12–16 servings",
    prepTimeHours: 48,
    flavours: ["Vanilla"],
    sizes: ["2kg", "Multi-tier"],
    productionPoints: 3,
    description:
      "Two ivory tiers dressed in hand-crafted sugar florals with gold accents — a graceful choice for engagements and intimate weddings.",
    tags: ["Popular", "Featured"],
    imageIdx: [],
    images: ["/images/categories/wedding-cake.png"],
    rating: 4.9,
    reviewCount: 96,
  },
  {
    name: "Celebration Bloom",
    category: "graduation",
    price: 3900,
    servings: "12–14 servings",
    prepTimeHours: 24,
    flavours: ["Vanilla", "Marble"],
    sizes: ["1kg", "2kg"],
    productionPoints: 3,
    description:
      "A quilted ivory cake with gold pearl detailing, finished with a fondant graduation cap and scroll — made for milestone moments.",
    tags: ["Popular", "Featured"],
    imageIdx: [],
    images: ["/images/categories/graduation-cake.png"],
    rating: 4.8,
    reviewCount: 73,
  },
  {
    name: "Cocoa Luxe",
    category: "corporate",
    price: 4600,
    servings: "12–14 servings",
    prepTimeHours: 24,
    flavours: ["Chocolate", "Marble"],
    sizes: ["1kg", "2kg"],
    productionPoints: 3,
    description:
      "A modern art-panel cake in burgundy chocolate and brushed gold — a striking bespoke design for launches and statement events.",
    tags: ["Bestseller", "Featured"],
    imageIdx: [],
    images: ["/images/categories/corporate-cake.png"],
    rating: 4.8,
    reviewCount: 111,
  },
];

export const CAKES: Cake[] = SEEDS.map((s, i) => ({
  id: `cake-${i + 1}`,
  slug: slugify(s.name),
  name: s.name,
  category: s.category,
  images: s.images ?? s.imageIdx.map((idx) => cakeImage(idx)),
  price: s.price,
  compareAtPrice: s.compareAtPrice,
  servings: s.servings,
  prepTimeHours: s.prepTimeHours,
  available: s.available ?? true,
  flavours: s.flavours,
  sizes: s.sizes,
  rating: s.rating ?? 4.6 + ((i % 3) * 0.1),
  reviewCount: s.reviewCount ?? 18 + i * 7,
  description: s.description,
  tags: s.tags,
  productionPoints: s.productionPoints,
  reviews: reviews(i, NAME_POOL.slice(i % 4, (i % 4) + 3).length >= 2 ? NAME_POOL.slice(i % 4, (i % 4) + 3) : NAME_POOL.slice(0, 3)),
}));

export function getCakeBySlug(slug: string) {
  return CAKES.find((c) => c.slug === slug);
}

export function getCakesByCategory(category: string) {
  return CAKES.filter((c) => c.category === category);
}

export function getRelatedCakes(cake: Cake, limit = 4) {
  return CAKES.filter((c) => c.category === cake.category && c.id !== cake.id).slice(0, limit);
}

export function getFeaturedCakes(limit = 8) {
  return CAKES.filter((c) => c.tags.includes("Bestseller") || c.tags.includes("Popular")).slice(0, limit);
}
