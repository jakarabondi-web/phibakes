// STK Push (Lipa Na M-PESA Online) initiation endpoint.
//
// PRODUCTION SETUP — set these env vars for a real Daraja integration (see .env.example
// and src/lib/services/mpesa.ts for details): MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET,
// MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL, MPESA_ENV.
// Docs: developer.safaricom.co.ke ("Daraja API" — Lipa Na M-PESA Online / STK Push).
//
// Without those credentials configured this route still responds 200 with a clearly
// marked `{ simulated: true, ... }` payload rather than throwing, so the checkout flow
// keeps working end-to-end in this sandbox / local dev.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { initiateStkPush } from "@/lib/services/mpesa";

const stkPushSchema = z.object({
  phone: z.string().regex(/^2547\d{8}$/, "Phone must be in 2547XXXXXXXX format"),
  amount: z.number().positive(),
  orderId: z.string().min(1),
  orderCode: z.string().optional(),
  customerId: z.string().optional(),
  paymentType: z.enum(["DEPOSIT", "BALANCE", "FULL"]).optional().default("DEPOSIT"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = stkPushSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  const { phone, amount, orderId, orderCode, customerId, paymentType } = parsed.data;

  const result = await initiateStkPush({
    phone,
    amount,
    accountReference: orderCode ?? orderId,
    transactionDesc: `PhiBakes order ${orderCode ?? orderId}`,
    orderId,
  });

  const checkoutRequestId = result.checkoutRequestId;

  // Persist a PENDING Payment record when we can — best-effort, never blocks the response.
  try {
    if (customerId) {
      await prisma.payment.create({
        data: {
          orderId,
          customerId,
          type: paymentType,
          method: "MPESA",
          amount,
          status: "PENDING",
          phoneNumber: phone,
          mpesaCheckoutRequestId: checkoutRequestId,
        },
      });
    }
  } catch (err) {
    // No live database — this is expected in the sandbox. The STK push response below
    // is still returned to the client so the checkout UI can proceed / poll for status.
    console.warn("[mpesa/stkpush] could not persist Payment record:", err);
  }

  if (result.simulated) {
    return NextResponse.json(
      {
        simulated: true,
        checkoutRequestId,
        merchantRequestId: result.merchantRequestId,
        message: result.message,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      simulated: false,
      checkoutRequestId: result.checkoutRequestId,
      merchantRequestId: result.merchantRequestId,
      responseCode: result.responseCode,
      responseDescription: result.responseDescription,
      customerMessage: result.customerMessage,
    },
    { status: 200 }
  );
}
