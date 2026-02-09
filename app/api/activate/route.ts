// app/api/activate/route.ts
import { NextResponse } from "next/server";
import { verifyCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = body?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // ✅ Your verifyCheckoutSession returns a boolean
    const paid = await verifyCheckoutSession(sessionId);

    if (!paid) {
      return NextResponse.json(
        { ok: false, error: "Payment not verified" },
        { status: 403 }
      );
    }

    // ✅ Set cookie that unlocks planner
    const res = NextResponse.json({ ok: true });

    res.cookies.set("bkm_paid", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Server error verifying payment" },
      { status: 500 }
    );
  }
}
