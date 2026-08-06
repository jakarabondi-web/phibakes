// SMS + WhatsApp delivery via Twilio (https://www.twilio.com).
//
// PRODUCTION SETUP:
//   TWILIO_ACCOUNT_SID    — Account SID from the Twilio console.
//   TWILIO_AUTH_TOKEN     — Auth Token from the Twilio console.
//   TWILIO_FROM_NUMBER    — Twilio phone number to send plain SMS from, e.g. +15551234567
//   TWILIO_WHATSAPP_FROM  — Twilio WhatsApp-enabled sender, e.g. whatsapp:+14155238886
//
// When Twilio credentials are unset, both sendSms() and sendWhatsApp() no-op gracefully:
// they log the intended message and resolve with `{ simulated: true }` instead of
// throwing, so callers never need to special-case "no credentials".

function isConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
}

export type SendSmsResult =
  | { simulated: false; sid: string }
  | { simulated: true; reason: string };

async function sendViaTwilio(to: string, from: string | undefined, body: string, channel: "sms" | "whatsapp"): Promise<SendSmsResult> {
  if (!isConfigured() || !from) {
    console.log(`[${channel}:simulated] to=${to} body="${body}"`);
    return {
      simulated: true,
      reason: `Twilio credentials (or ${channel === "whatsapp" ? "TWILIO_WHATSAPP_FROM" : "TWILIO_FROM_NUMBER"}) not configured — ${channel} simulated, not sent.`,
    };
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const toAddr = channel === "whatsapp" && !to.startsWith("whatsapp:") ? `whatsapp:${to}` : to;

    const form = new URLSearchParams({ To: toAddr, From: from, Body: body });

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[${channel}] Twilio request failed: ${res.status} ${text}`);
      return { simulated: true, reason: `Twilio API error (${res.status}) — ${channel} not sent.` };
    }

    const data = (await res.json()) as { sid: string };
    return { simulated: false, sid: data.sid };
  } catch (err) {
    console.error(`[${channel}] send failed:`, err);
    return { simulated: true, reason: `Unexpected error calling Twilio — ${channel} not sent.` };
  }
}

export async function sendSms(to: string, body: string): Promise<SendSmsResult> {
  return sendViaTwilio(to, process.env.TWILIO_FROM_NUMBER, body, "sms");
}

export async function sendWhatsApp(to: string, body: string): Promise<SendSmsResult> {
  return sendViaTwilio(to, process.env.TWILIO_WHATSAPP_FROM, body, "whatsapp");
}
