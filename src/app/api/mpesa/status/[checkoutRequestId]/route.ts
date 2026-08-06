// Payment status polling endpoint — used by the client to poll while waiting for the
// async Daraja callback to land (STK Push confirmation on the customer's phone can take
// anywhere from a few seconds to ~60s, or never arrive if they cancel/ignore the prompt).
//
// Strategy: first check our own Payment record (updated by /api/mpesa/callback once
// Daraja posts back). If it's still PENDING, optionally cross-check live with Daraja's
// STK Push Query API (queryStkStatus) for a faster answer than waiting on the callback.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { queryStkStatus } from "@/lib/services/mpesa";

export async function GET(_request: Request, { params }: { params: Promise<{ checkoutRequestId: string }> }) {
  const { checkoutRequestId } = await params;

  let dbPayment: Awaited<ReturnType<typeof prisma.payment.findFirst>> | null = null;
  try {
    dbPayment = await prisma.payment.findFirst({ where: { mpesaCheckoutRequestId: checkoutRequestId } });
  } catch (err) {
    console.warn("[mpesa/status] DB lookup failed (no live database?):", err);
  }

  if (dbPayment && dbPayment.status !== "PENDING") {
    return NextResponse.json({ source: "db", checkoutRequestId, status: dbPayment.status, payment: dbPayment });
  }

  // Still pending in our records (or we have no DB) — ask Daraja directly.
  const liveStatus = await queryStkStatus(checkoutRequestId);

  if (liveStatus.simulated) {
    return NextResponse.json({
      source: "simulated",
      checkoutRequestId,
      status: dbPayment?.status ?? "PENDING",
      message: liveStatus.message,
    });
  }

  const status = liveStatus.resultCode === "0" ? "SUCCESS" : liveStatus.resultCode ? "FAILED" : "PENDING";

  return NextResponse.json({
    source: "daraja",
    checkoutRequestId,
    status,
    resultDesc: liveStatus.resultDesc,
  });
}
