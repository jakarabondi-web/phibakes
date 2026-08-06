// Mock delivery-fee table for Nairobi zones, priced roughly by distance
// from the PhiBakes studio in Kilimani.

export type DeliveryZone = {
  zone: string;
  fee: number;
  etaMinutes: number;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  { zone: "Kilimani", fee: 300, etaMinutes: 40 },
  { zone: "Kileleshwa", fee: 350, etaMinutes: 45 },
  { zone: "Lavington", fee: 400, etaMinutes: 50 },
  { zone: "CBD", fee: 450, etaMinutes: 55 },
  { zone: "Westlands", fee: 500, etaMinutes: 60 },
  { zone: "Langata", fee: 600, etaMinutes: 65 },
  { zone: "Karen", fee: 700, etaMinutes: 75 },
  { zone: "Runda", fee: 800, etaMinutes: 80 },
];

export function getDeliveryFee(zone: string | undefined | null): number {
  if (!zone) return 0;
  const match = DELIVERY_ZONES.find((z) => z.zone.toLowerCase() === zone.toLowerCase());
  return match?.fee ?? 0;
}

export const STUDIO_ADDRESS = "PhiBakes Studio, Kilimani Ring Road, off Argwings Kodhek, Nairobi";
export const STUDIO_HOURS = "Mon – Sat, 8:00am – 7:00pm  ·  Sun, 10:00am – 4:00pm";
