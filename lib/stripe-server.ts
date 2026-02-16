// lib/stripe-server.ts
import "server-only";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY env var");
}

export const stripe = new Stripe(secretKey, {
  // safest: let Stripe pick account default version
  apiVersion: undefined as any,
});

export async function verifyCheckoutSession(sessionId: string) {
  if (!sessionId) return false;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // We only unlock if Stripe confirms this session is fully paid
  return session.payment_status === "paid";
}
