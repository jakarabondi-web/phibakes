import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendSms, sendWhatsApp } from "@/lib/services/sms";
import { sendEmail } from "@/lib/services/email";

/**
 * Sends an abandoned-cart follow-up on the channel staff picked.
 *
 * The underlying SMS/WhatsApp/email services degrade gracefully when their
 * credentials are unset — they log and resolve `{ simulated: true }` rather
 * than throwing — so this route reports whether the message actually went out
 * and the dashboard tells staff plainly instead of implying a delivery.
 */
const followUpSchema = z.object({
  cartId: z.string().min(1),
  channel: z.enum(["sms", "whatsapp", "email"]),
  to: z.string().min(1),
  message: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = followUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const { cartId, channel, to, message } = parsed.data;

  try {
    if (channel === "email") {
      const result = await sendEmail({
        to,
        subject: "You left something in your PhiBakes cart 🎂",
        // Plain-text message entered by staff; preserve their line breaks.
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#32151d">${message
          .split("\n")
          .map((line) => `<p style="margin:0 0 12px">${line}</p>`)
          .join("")}</div>`,
      });
      return NextResponse.json({ cartId, channel, ...result }, { status: 200 });
    }

    const result =
      channel === "whatsapp" ? await sendWhatsApp(to, message) : await sendSms(to, message);
    return NextResponse.json({ cartId, channel, ...result }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to send follow-up" }, { status: 502 });
  }
}
