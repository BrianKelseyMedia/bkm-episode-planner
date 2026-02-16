import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const res = NextResponse.redirect(new URL("/planner", url.origin));

  res.cookies.set("bkm_paid", "0", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
