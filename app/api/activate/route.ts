// app/api/activate/route.ts
import { NextResponse } from "next/server";
import { verifyCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = body?.sessionId as string | undefined;

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // ✅ verifyCheckoutSession returns { paid, customerEmail }
    const { paid } = await verifyCheckoutSession(sessionId);

    if (!paid) {
      return NextResponse.json(
        { ok: false, error: "Payment not verified" },
        { status: 403 }
      );
    }

    // ✅ Tell the client to set the paid cookie (we set cookie in success-client)
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
