// Curated bakery / cake photography, vendored locally under public/images/stock
// and public/images/avatars so the site has no runtime dependency on an
// external image host.
export const CAKE_IMAGES = [
  "/images/stock/cake-01.jpg", // chocolate drip cake
  "/images/stock/cake-02.jpg", // cake slice
  "/images/stock/cake-03.jpg", // birthday cake
  "/images/stock/cake-04.jpg", // wedding cake tiers
  "/images/stock/cake-05.jpg", // elegant cake
  "/images/stock/cake-06.jpg", // cupcakes
  "/images/stock/cake-07.jpg", // dessert table
  "/images/stock/cake-08.jpg", // layered cake
  "/images/stock/cake-09.jpg", // pink cake
  "/images/stock/cake-10.jpg", // rustic cake
  "/images/stock/cake-11.jpg", // bakery display
  "/images/stock/cake-12.jpg", // floral cake
  "/images/stock/cake-13.jpg", // celebration cake
  "/images/stock/cake-14.jpg", // cake with berries
  "/images/stock/cake-15.jpg", // gold cake
  "/images/stock/cake-16.jpg", // cake close up
  "/images/stock/cake-17.jpg", // dessert
  "/images/stock/cake-18.jpg", // red velvet
];

export const HERO_IMAGES = [CAKE_IMAGES[3], CAKE_IMAGES[4], CAKE_IMAGES[0]];

// Rotating hero showcase — the studio's signature shot first, then twelve
// distinct cake styles from the vendored photo library.
export const HERO_SHOWCASE: { src: string; alt: string }[] = [
  {
    src: "/images/hero/hero-cake-scene.png",
    alt: "Two-tier white celebration cake with burgundy roses and a gold drip",
  },
  { src: CAKE_IMAGES[3], alt: "Tiered white wedding cake with elegant piping" },
  { src: CAKE_IMAGES[0], alt: "Chocolate drip celebration cake" },
  { src: CAKE_IMAGES[8], alt: "Blush pink buttercream cake" },
  { src: CAKE_IMAGES[11], alt: "Floral cake dressed with fresh blooms" },
  { src: CAKE_IMAGES[14], alt: "Gold-accented luxury cake" },
  { src: CAKE_IMAGES[2], alt: "Birthday cake with festive decorations" },
  { src: CAKE_IMAGES[17], alt: "Red velvet layer cake" },
  { src: CAKE_IMAGES[13], alt: "Cake crowned with fresh berries" },
  { src: CAKE_IMAGES[4], alt: "Elegant single-tier cake" },
  { src: CAKE_IMAGES[12], alt: "Colourful celebration cake" },
  { src: CAKE_IMAGES[9], alt: "Rustic naked cake with natural styling" },
  { src: CAKE_IMAGES[7], alt: "Layered cream cake" },
];

export const GALLERY_IMAGES = CAKE_IMAGES;

export const AVATAR_IMAGES = [
  "/images/avatars/avatar-01.jpg",
  "/images/avatars/avatar-02.jpg",
  "/images/avatars/avatar-03.jpg",
  "/images/avatars/avatar-04.jpg",
  "/images/avatars/avatar-05.jpg",
  "/images/avatars/avatar-06.jpg",
];

export function cakeImage(index: number) {
  return CAKE_IMAGES[index % CAKE_IMAGES.length];
}
