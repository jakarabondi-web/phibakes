// Daraja STK Push callback receiver.
// Safaricom POSTs the result of an STK Push here (the URL configured as MPESA_CALLBACK_URL
// when the push was initiated). See src/lib/services/mpesa.ts for the outbound side.
// Docs: developer.safaricom.co.ke ("Daraja API" — Lipa Na M-PESA Online Callback).
//
// This handler MUST always respond with { ResultCode: 0, ResultDesc: "Success" } so Daraja
// considers the callback acknowledged and does not retry indefinitely — even if our own
// downstream processing (DB writes) fails, since a live DB may not be configured here.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CallbackMetadataItem = { Name: string; Value?: string | number };

type StkCallbackBody = {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: { Item: CallbackMetadataItem[] };
    };
  };
};

function metadataValue(items: CallbackMetadataItem[] | undefined, name: string) {
  return items?.find((i) => i.Name === name)?.Value;
}

const ACK = { ResultCode: 0, ResultDesc: "Success" };

export async function POST(request: Request) {
  let payload: StkCallbackBody | null = null;

  try {
    payload = (await request.json()) as StkCallbackBody;
  } catch (err) {
    console.error("[mpesa/callback] failed to parse callback JSON:", err);
    // Still acknowledge — Daraja will keep retrying malformed callbacks otherwise, and
    // there's nothing more we can do with an unparseable payload.
    return NextResponse.json(ACK);
  }

  try {
    const stkCallback = payload?.Body?.stkCallback;
    if (!stkCallback) {
      console.warn("[mpesa/callback] unexpected payload shape:", payload);
      return NextResponse.json(ACK);
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;
    const isSuccess = ResultCode === 0;

    const items = CallbackMetadata?.Item;
    const mpesaReceiptNumber = isSuccess ? (metadataValue(items, "MpesaReceiptNumber") as string | undefined) : undefined;
    const amount = isSuccess ? (metadataValue(items, "Amount") as number | undefined) : undefined;
    const phoneNumber = isSuccess ? (metadataValue(items, "PhoneNumber") as string | number | undefined) : undefined;

    try {
      const payment = await prisma.payment.findFirst({
        where: { mpesaCheckoutRequestId: CheckoutRequestID },
      });

      if (payment) {
        await prisma.paymentCallback.create({
          data: {
            paymentId: payment.id,
            rawPayload: payload as unknown as object,
            resultCode: ResultCode,
            resultDesc: ResultDesc,
          },
        });

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: isSuccess ? "SUCCESS" : "FAILED",
            mpesaReceiptNumber,
            failureReason: isSuccess ? undefined : ResultDesc,
          },
        });

        if (isSuccess) {
          const order = await prisma.order.findUnique({ where: { id: payment.orderId } });
          if (order && (order.status === "DEPOSIT_PENDING" || order.status === "REQUESTED" || order.status === "QUOTED")) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: "CONFIRMED",
                statusHistory: {
                  create: { status: "CONFIRMED", note: `M-PESA payment received (receipt ${mpesaReceiptNumber ?? "n/a"})` },
                },
              },
            });
          }
        }
      } else {
        console.warn(`[mpesa/callback] no Payment found for CheckoutRequestID=${CheckoutRequestID}`);
      }
    } catch (dbErr) {
      // No live database configured — log and still acknowledge Daraja so it stops retrying.
      console.warn("[mpesa/callback] DB update skipped (no live database?):", dbErr);
    }

    console.log(
      `[mpesa/callback] CheckoutRequestID=${CheckoutRequestID} ResultCode=${ResultCode} amount=${amount ?? "n/a"} phone=${phoneNumber ?? "n/a"}`
    );

    return NextResponse.json(ACK);
  } catch (err) {
    console.error("[mpesa/callback] unexpected error handling callback:", err);
    // Daraja still needs the ack shape even on our internal errors.
    return NextResponse.json(ACK);
  }
}
