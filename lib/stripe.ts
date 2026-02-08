// lib/stripe.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function verifyCheckoutSession(sessionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // We only accept fully paid sessions
  const isPaid = session.payment_status === "paid";

  return {
    isPaid,
    id: session.id,
    customer_email: session.customer_details?.email || session.customer_email || null,
  };
}
