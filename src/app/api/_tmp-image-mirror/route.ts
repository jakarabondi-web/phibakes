import { NextRequest, NextResponse } from "next/server";

// Temporary endpoint: mirrors a single Unsplash photo as base64 JSON so the
// development environment (whose egress policy blocks images.unsplash.com)
// can vendor the stock photography into the repo. Removed after use.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const w = req.nextUrl.searchParams.get("w") ?? "1200";
  if (!/^photo-[0-9a-f-]+$/.test(id) || !/^\d{2,4}$/.test(w)) {
    return NextResponse.json({ error: "bad params" }, { status: 400 });
  }
  const upstream = `https://images.unsplash.com/${id}?fit=crop&w=${w}&q=80&fm=jpg`;
  const res = await fetch(upstream, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: `upstream ${res.status}` }, { status: 502 });
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return NextResponse.json({
    id,
    bytes: buf.length,
    contentType: res.headers.get("content-type"),
    base64: buf.toString("base64"),
  });
}
