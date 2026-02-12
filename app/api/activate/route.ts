import { NextResponse } from "next/server";
import { verifyCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sessionId = body?.sessionId || "";

  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
  }

  const result = await verifyCheckoutSession(sessionId);

  const paid =
    typeof result === "boolean"
      ? result
      : Boolean((result as any)?.paid || (result as any)?.isPaid);

  if (!paid) {
    return NextResponse.json({ ok: false, error: "Payment not verified" }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("bkm_paid", "1", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}