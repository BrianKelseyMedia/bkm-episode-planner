// app/api/activate/route.ts
import { NextResponse } from "next/server";
import { verifyCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = body?.session_id;

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
    }

    const { isPaid } = await verifyCheckoutSession(sessionId);

    if (!isPaid) {
      return NextResponse.json({ ok: false, error: "Payment not verified" }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true });

    // Cookie for paid access
    res.cookies.set("bkm_paid", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
