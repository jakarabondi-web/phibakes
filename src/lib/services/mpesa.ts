// M-PESA Daraja (Safaricom) integration service.
//
// PRODUCTION SETUP — set these in your environment (see .env.example):
//   MPESA_CONSUMER_KEY     — app Consumer Key from the Daraja developer portal
//   MPESA_CONSUMER_SECRET  — app Consumer Secret
//   MPESA_SHORTCODE        — your Paybill/Till shortcode (Lipa Na M-PESA Online shortcode)
//   MPESA_PASSKEY           — Lipa Na M-PESA Online Passkey issued for the shortcode
//   MPESA_CALLBACK_URL     — publicly reachable HTTPS URL Safaricom will POST results to
//                            (should point at /api/mpesa/callback on your deployed domain)
//   MPESA_ENV               — "sandbox" | "production" — selects the Daraja API base URL
//
// Reference (conceptually): developer.safaricom.co.ke — "Daraja API", specifically the
// OAuth (/oauth/v1/generate), Lipa Na M-PESA Online (STK Push) (/mpesa/stkpush/v1/processrequest),
// and STK Push Query (/mpesa/stkpushquery/v1/query) endpoints.
//
// Everything below degrades gracefully to a "simulation mode" when MPESA_CONSUMER_KEY is
// unset (e.g. in this sandbox / local dev without Daraja credentials), so route handlers
// that call into this service never throw unhandled exceptions and always return a
// well-shaped JSON response.

const SANDBOX_BASE_URL = "https://sandbox.safaricom.co.ke";
const PRODUCTION_BASE_URL = "https://api.safaricom.co.ke";

function getBaseUrl() {
  return process.env.MPESA_ENV === "production" ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
}

function isConfigured() {
  return Boolean(
    process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_SHORTCODE &&
      process.env.MPESA_PASSKEY
  );
}

function mockCheckoutRequestId() {
  return `ws_CO_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Formats the Daraja timestamp: yyyyMMddHHmmss */
export function generateTimestamp(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

/** Base64(Shortcode + Passkey + Timestamp) per Daraja Lipa Na M-PESA Online spec. */
export function generatePassword(shortcode: string, passkey: string, timestamp: string) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

/**
 * OAuth token exchange — POST Basic-Auth'd request to /oauth/v1/generate.
 * Returns null (rather than throwing) when credentials are not configured or the
 * request fails, so callers can fall back to simulation mode.
 */
export async function getAccessToken(): Promise<string | null> {
  if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
    return null;
  }
  try {
    const credentials = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const res = await fetch(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch (err) {
    console.error("[mpesa] getAccessToken failed:", err);
    return null;
  }
}

export type StkPushParams = {
  phone: string; // 2547XXXXXXXX
  amount: number;
  accountReference: string;
  transactionDesc: string;
  orderId: string;
};

export type StkPushResult =
  | {
      simulated: false;
      merchantRequestId: string;
      checkoutRequestId: string;
      responseCode: string;
      responseDescription: string;
      customerMessage: string;
    }
  | {
      simulated: true;
      checkoutRequestId: string;
      merchantRequestId: string;
      message: string;
    };

/**
 * Initiates a Lipa Na M-PESA Online (STK Push) request.
 * POSTs to /mpesa/stkpush/v1/processrequest. If MPESA_CONSUMER_KEY (or any required
 * credential) is missing, or the live call fails, returns a `{ simulated: true, ... }`
 * result instead of throwing — callers should persist this as a PENDING payment either way.
 */
export async function initiateStkPush(params: StkPushParams): Promise<StkPushResult> {
  const { phone, amount, accountReference, transactionDesc } = params;

  if (!isConfigured()) {
    return {
      simulated: true,
      checkoutRequestId: mockCheckoutRequestId(),
      merchantRequestId: `mock-merchant-${Date.now()}`,
      message:
        "M-PESA credentials not configured — running in simulation mode. Set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY and MPESA_CALLBACK_URL in your environment to go live.",
    };
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        simulated: true,
        checkoutRequestId: mockCheckoutRequestId(),
        merchantRequestId: `mock-merchant-${Date.now()}`,
        message: "Unable to obtain a Daraja access token — falling back to simulation mode.",
      };
    }

    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);

    const res = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || data.errorCode) {
      return {
        simulated: true,
        checkoutRequestId: mockCheckoutRequestId(),
        merchantRequestId: `mock-merchant-${Date.now()}`,
        message: `Daraja STK Push request failed (${data.errorMessage ?? res.statusText}) — falling back to simulation mode.`,
      };
    }

    return {
      simulated: false,
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      responseCode: data.ResponseCode,
      responseDescription: data.ResponseDescription,
      customerMessage: data.CustomerMessage,
    };
  } catch (err) {
    console.error("[mpesa] initiateStkPush failed:", err);
    return {
      simulated: true,
      checkoutRequestId: mockCheckoutRequestId(),
      merchantRequestId: `mock-merchant-${Date.now()}`,
      message: "Unexpected error calling Daraja — falling back to simulation mode.",
    };
  }
}

export type StkStatusResult =
  | {
      simulated: false;
      resultCode: string;
      resultDesc: string;
      merchantRequestId?: string;
      checkoutRequestId: string;
    }
  | {
      simulated: true;
      checkoutRequestId: string;
      message: string;
    };

/**
 * STK Push Query — POSTs to /mpesa/stkpushquery/v1/query to check the status of a
 * previously initiated STK Push, useful for client-side polling when the async
 * callback is slow to arrive. Falls back to a simulated "still pending" result when
 * credentials are absent or the checkoutRequestId looks like a mock id.
 */
export async function queryStkStatus(checkoutRequestId: string): Promise<StkStatusResult> {
  if (!isConfigured() || checkoutRequestId.startsWith("ws_CO_mock_")) {
    return {
      simulated: true,
      checkoutRequestId,
      message:
        "M-PESA credentials not configured (or this is a simulated checkout) — cannot query Daraja live status.",
    };
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        simulated: true,
        checkoutRequestId,
        message: "Unable to obtain a Daraja access token for status query.",
      };
    }

    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);

    const res = await fetch(`${getBaseUrl()}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
      cache: "no-store",
    });

    const data = await res.json();

    return {
      simulated: false,
      resultCode: String(data.ResultCode),
      resultDesc: data.ResultDesc,
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId,
    };
  } catch (err) {
    console.error("[mpesa] queryStkStatus failed:", err);
    return {
      simulated: true,
      checkoutRequestId,
      message: "Unexpected error querying Daraja for STK status.",
    };
  }
}
