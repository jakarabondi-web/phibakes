/**
 * Kenyan mobile number validation & carrier detection.
 *
 * Kenya uses 9 significant digits after the 0/+254 prefix, across two ranges:
 * the legacy 7xx range and the newer 1xx range (allocated as 7xx filled up).
 * Carrier matters here because mobile-money rails are carrier-bound: an
 * M-PESA STK push only reaches a Safaricom line, and Airtel Money only an
 * Airtel line — so we detect the network and let the UI route accordingly
 * rather than pushing to a number that can never receive the prompt.
 *
 * Prefix allocations per the Communications Authority of Kenya numbering plan.
 */

export type KenyanCarrier = "safaricom" | "airtel" | "telkom" | "equitel" | "faiba";

export type ParsedKenyanPhone = {
  /** Digits after the country code, e.g. "712345678" (9 digits). */
  national: string;
  /** E.164 form for API calls, e.g. "+254712345678". */
  e164: string;
  /** Daraja/STK form (no plus), e.g. "254712345678". */
  msisdn: string;
  /** Display form, e.g. "0712 345 678". */
  formatted: string;
  carrier: KenyanCarrier | null;
};

/**
 * Prefix ranges are expressed as the first 3 digits of the national number.
 * Ranges are inclusive on both ends.
 */
const CARRIER_RANGES: { carrier: KenyanCarrier; ranges: [number, number][] }[] = [
  {
    carrier: "safaricom",
    ranges: [
      [110, 115],
      [700, 729],
      [740, 743],
      [745, 746],
      [748, 748],
      [757, 759],
      [768, 769],
      [790, 799],
    ],
  },
  {
    carrier: "airtel",
    ranges: [
      [100, 102],
      [730, 739],
      [750, 756],
      [762, 762],
      [780, 789],
    ],
  },
  { carrier: "telkom", ranges: [[770, 779]] },
  { carrier: "equitel", ranges: [[763, 765]] },
  { carrier: "faiba", ranges: [[747, 747]] },
];

export const CARRIER_LABEL: Record<KenyanCarrier, string> = {
  safaricom: "Safaricom",
  airtel: "Airtel",
  telkom: "Telkom",
  equitel: "Equitel",
  faiba: "Faiba",
};

/** Which networks can actually receive a mobile-money prompt from us. */
export const MOBILE_MONEY_CARRIERS: KenyanCarrier[] = ["safaricom", "airtel"];

export function carrierFor(national: string): KenyanCarrier | null {
  if (national.length !== 9) return null;
  const prefix = Number(national.slice(0, 3));
  for (const { carrier, ranges } of CARRIER_RANGES) {
    if (ranges.some(([lo, hi]) => prefix >= lo && prefix <= hi)) return carrier;
  }
  return null;
}

/**
 * Accepts the shapes Kenyans actually type: 0712345678, 712345678,
 * +254712345678, 254712345678, and any of those with spaces, dashes or
 * parentheses. Returns null if the number isn't a valid Kenyan mobile.
 */
export function parseKenyanPhone(raw: string): ParsedKenyanPhone | null {
  if (!raw) return null;
  // Strip everything except digits and a leading +
  let s = raw.trim().replace(/[\s().-]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  if (!/^\d+$/.test(s)) return null;

  let national: string;
  if (s.startsWith("254")) national = s.slice(3);
  else if (s.startsWith("0")) national = s.slice(1);
  else national = s;

  // Must be exactly 9 digits starting with 7 or 1
  if (!/^[71]\d{8}$/.test(national)) return null;

  const carrier = carrierFor(national);
  if (!carrier) return null; // digit-shaped but not an allocated mobile prefix

  return {
    national,
    e164: `+254${national}`,
    msisdn: `254${national}`,
    formatted: `0${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`,
    carrier,
  };
}

export function isValidKenyanPhone(raw: string): boolean {
  return parseKenyanPhone(raw) !== null;
}

/**
 * Validation message tuned to *why* it failed, so the customer can fix it
 * without guessing — a generic "invalid number" is the usual checkout killer.
 */
export function kenyanPhoneError(raw: string, opts?: { mobileMoneyOnly?: boolean }): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return "Enter your phone number.";

  const parsed = parseKenyanPhone(trimmed);
  if (!parsed) {
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 9) return "That number looks too short — Kenyan mobiles have 9 digits after the 0.";
    if (digits.length > 12) return "That number looks too long. Try 07xx xxx xxx or +254 7xx xxx xxx.";
    return "Enter a valid Kenyan mobile number, e.g. 0712 345 678 or 0110 123 456.";
  }

  if (opts?.mobileMoneyOnly && !MOBILE_MONEY_CARRIERS.includes(parsed.carrier!)) {
    return `${CARRIER_LABEL[parsed.carrier!]} lines can't receive mobile-money prompts. Use a Safaricom or Airtel number, or pay by card.`;
  }

  return null;
}
