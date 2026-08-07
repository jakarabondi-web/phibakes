import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { FavouritesProvider } from "@/lib/favourites-context";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PhiBakes — Beautiful cakes, baked for your moment.",
    template: "%s | PhiBakes",
  },
  description:
    "Nairobi's premium cake studio. Order signature cakes, design a custom cake, and track your order from oven to doorstep — pay securely with M-PESA.",
  keywords: [
    "cakes Nairobi",
    "custom cake Kenya",
    "wedding cake Nairobi",
    "birthday cake delivery",
    "PhiBakes",
  ],
  metadataBase: new URL("https://phibakes.co.ke"),
  openGraph: {
    title: "PhiBakes — Beautiful cakes, baked for your moment.",
    description:
      "Nairobi's premium cake studio. Order, customize, and track your cake — pay with M-PESA.",
    siteName: "PhiBakes",
    locale: "en_KE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1518" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <CartProvider>
            <FavouritesProvider>
              {children}
              <Toaster position="bottom-right" richColors closeButton />
            </FavouritesProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
