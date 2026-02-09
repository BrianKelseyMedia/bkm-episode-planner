// lib/stripe.ts
import Stripe from "stripe";

export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/fZu9AS9lG2Pt6IQdQLdAk0f";


const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // This prevents Vercel build from succeeding without env vars,
  // and makes the error obvious instead of silent.
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
