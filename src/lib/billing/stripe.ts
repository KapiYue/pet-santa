import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Surfaced at runtime on the server only; helps catch a missing env var early.
  console.warn("[stripe] STRIPE_SECRET_KEY is not set.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  // Pin behaviour to the SDK's bundled API version.
  typescript: true,
});
