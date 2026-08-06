// Email delivery via Resend (https://resend.com).
//
// PRODUCTION SETUP:
//   RESEND_API_KEY — API key from the Resend dashboard.
//
// When RESEND_API_KEY is unset (e.g. this sandbox), sendEmail() no-ops gracefully:
// it logs the intended email to the console and resolves with `{ simulated: true }`
// instead of throwing, so callers never need to special-case "no credentials".

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export type SendEmailResult =
  | { simulated: false; id: string }
  | { simulated: true; reason: string };

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, subject, html, from = "PhiBakes <orders@phibakes.co.ke>" } = params;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[email:simulated] to=${to} subject="${subject}"`);
    return { simulated: true, reason: "RESEND_API_KEY not configured — email simulated, not sent." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[email] Resend request failed: ${res.status} ${text}`);
      return { simulated: true, reason: `Resend API error (${res.status}) — email not sent.` };
    }

    const data = (await res.json()) as { id: string };
    return { simulated: false, id: data.id };
  } catch (err) {
    console.error("[email] sendEmail failed:", err);
    return { simulated: true, reason: "Unexpected error calling Resend — email not sent." };
  }
}
