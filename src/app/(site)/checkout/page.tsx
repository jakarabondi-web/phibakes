import { CheckoutForm } from "./checkout-form";
import { getPlatformSettings, getZoneRates } from "@/lib/platform-settings";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  // Loaded server-side so the deposit percentage, delivery rates, and
  // free-delivery threshold reflect whatever the owner last saved.
  const [settings, zones] = await Promise.all([getPlatformSettings(), getZoneRates()]);
  return <CheckoutForm settings={settings} zones={zones} />;
}
