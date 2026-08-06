// Curated Unsplash photography — premium bakery / cake imagery.
// In production these are replaced by Cloudflare R2-hosted studio photography.
function u(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const CAKE_IMAGES = [
  u("photo-1578985545062-69928b1d9587"), // chocolate drip cake
  u("photo-1535141192574-5d4897c12636"), // cake slice
  u("photo-1621303837174-89787a7d4729"), // birthday cake
  u("photo-1607478900766-efe13248b125"), // wedding cake tiers
  u("photo-1519869325930-281384150729"), // elegant cake
  u("photo-1587248720327-8eb72564be1e"), // cupcakes
  u("photo-1470124182917-cc6e71b22ecc"), // dessert table
  u("photo-1464349095431-e9a21285b5f3"), // layered cake
  u("photo-1558301211-0d8c8ddee6ec"), // pink cake
  u("photo-1486427944299-d1955d23e34d"), // rustic cake
  u("photo-1541783245831-57d6fb0926d3"), // bakery display
  u("photo-1571115177098-24ec42ed204d"), // floral cake
  u("photo-1546069901-ba9599a7e63c"), // celebration cake
  u("photo-1524351199678-941a58a3df50"), // cake with berries
  u("photo-1626803775151-61d756612f97"), // gold cake
  u("photo-1587668178277-295251f900ce"), // cake close up
  u("photo-1602351447937-745cb720612f"), // dessert
  u("photo-1533134242443-d4fd215305ad"), // red velvet
];

export const HERO_IMAGES = [
  u("photo-1607478900766-efe13248b125", 1800),
  u("photo-1519869325930-281384150729", 1800),
  u("photo-1578985545062-69928b1d9587", 1800),
];

// Rotating hero showcase — the studio's signature shot first, then twelve
// distinct cake styles from the stock library. Every remote ID here was
// verified alive through the production image optimizer before inclusion.
export const HERO_SHOWCASE: { src: string; alt: string }[] = [
  {
    src: "/images/hero/hero-cake-scene.png",
    alt: "Two-tier white celebration cake with burgundy roses and a gold drip",
  },
  { src: u("photo-1607478900766-efe13248b125", 1600), alt: "Tiered white wedding cake with elegant piping" },
  { src: u("photo-1578985545062-69928b1d9587", 1600), alt: "Chocolate drip celebration cake" },
  { src: u("photo-1558301211-0d8c8ddee6ec", 1600), alt: "Blush pink buttercream cake" },
  { src: u("photo-1571115177098-24ec42ed204d", 1600), alt: "Floral cake dressed with fresh blooms" },
  { src: u("photo-1626803775151-61d756612f97", 1600), alt: "Gold-accented luxury cake" },
  { src: u("photo-1621303837174-89787a7d4729", 1600), alt: "Birthday cake with festive decorations" },
  { src: u("photo-1533134242443-d4fd215305ad", 1600), alt: "Red velvet layer cake" },
  { src: u("photo-1524351199678-941a58a3df50", 1600), alt: "Cake crowned with fresh berries" },
  { src: u("photo-1519869325930-281384150729", 1600), alt: "Elegant single-tier cake" },
  { src: u("photo-1546069901-ba9599a7e63c", 1600), alt: "Colourful celebration cake" },
  { src: u("photo-1486427944299-d1955d23e34d", 1600), alt: "Rustic naked cake with natural styling" },
  { src: u("photo-1464349095431-e9a21285b5f3", 1600), alt: "Layered cream cake" },
];

export const GALLERY_IMAGES = CAKE_IMAGES;

export const AVATAR_IMAGES = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=200&q=80",
];

export function cakeImage(index: number) {
  return CAKE_IMAGES[index % CAKE_IMAGES.length];
}
