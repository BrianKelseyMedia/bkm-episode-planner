// lib/stripe.ts
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;

  // IMPORTANT:
  // Do NOT throw at module import time (breaks Vercel builds).
  // Only throw when a Stripe function is actually called.
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY env var on server.");
  }

  return new Stripe(key, {
    apiVersion: "2024-06-20",
  });
}

export async function verifyCheckoutSession(sessionId: string) {
  const stripe = getStripe();

  // Expand payment_intent so we can check status reliably
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  // A session is “paid” if payment_status === 'paid'
  // (This is the simplest + correct for most Checkout flows)
  const isPaid = session.payment_status === "paid";

  return { isPaid, session };
}
