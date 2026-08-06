// Generic internal notification dispatch endpoint. Called by other routes (e.g. after a
// successful M-PESA payment, order status change, or low-stock trigger) to fan a single
// logical event out to the right channel via the service helpers in src/lib/services/.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/services/email";
import { sendSms, sendWhatsApp } from "@/lib/services/sms";

const NOTIFICATION_EVENTS = [
  "DEPOSIT_RECEIVED",
  "QUOTE_READY",
  "ORDER_CONFIRMED",
  "BALANCE_DUE",
  "CAKE_READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "LOW_STOCK",
] as const;

const sendNotificationSchema = z.object({
  userId: z.string().optional(),
  customerId: z.string().optional(),
  orderId: z.string().optional(),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "IN_APP", "PUSH"]),
  event: z.enum(NOTIFICATION_EVENTS),
  title: z.string().min(1),
  body: z.string().min(1),
  to: z.string().optional(), // email address or phone number (2547XXXXXXXX / whatsapp:+254...)
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = sendNotificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;

  let dispatchResult: Record<string, unknown> = { channel: data.channel };

  try {
    switch (data.channel) {
      case "EMAIL": {
        if (!data.to) {
          dispatchResult = { channel: "EMAIL", simulated: true, reason: "No recipient email ('to') provided." };
          break;
        }
        const result = await sendEmail({ to: data.to, subject: data.title, html: `<p>${data.body}</p>` });
        dispatchResult = { channel: "EMAIL", ...result };
        break;
      }
      case "SMS": {
        if (!data.to) {
          dispatchResult = { channel: "SMS", simulated: true, reason: "No recipient phone ('to') provided." };
          break;
        }
        const result = await sendSms(data.to, `${data.title}: ${data.body}`);
        dispatchResult = { channel: "SMS", ...result };
        break;
      }
      case "WHATSAPP": {
        if (!data.to) {
          dispatchResult = { channel: "WHATSAPP", simulated: true, reason: "No recipient phone ('to') provided." };
          break;
        }
        const result = await sendWhatsApp(data.to, `${data.title}: ${data.body}`);
        dispatchResult = { channel: "WHATSAPP", ...result };
        break;
      }
      case "IN_APP":
      case "PUSH":
        // In-app and push notifications are surfaced purely via the persisted
        // Notification record below (read by the client's notification feed / a push
        // service worker) — no outbound third-party call needed here.
        dispatchResult = { channel: data.channel, simulated: false, persisted: true };
        break;
    }
  } catch (err) {
    console.error("[notifications] dispatch failed:", err);
    dispatchResult = { channel: data.channel, simulated: true, reason: "Unexpected dispatch error." };
  }

  let notification: unknown = null;
  try {
    if (data.userId) {
      notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          orderId: data.orderId,
          channel: data.channel,
          event: data.event,
          title: data.title,
          body: data.body,
        },
      });
    }
  } catch (err) {
    console.warn("[notifications] could not persist Notification record (no live database?):", err);
  }

  return NextResponse.json(
    {
      notification,
      dispatch: dispatchResult,
    },
    { status: 201 }
  );
}
