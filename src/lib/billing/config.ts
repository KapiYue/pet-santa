// Central billing constants so the price, granted credits and per-generation
// cost stay consistent across the checkout, webhook and generation flows.

// Credits granted for a single $10 purchase.
export const CREDITS_PER_PURCHASE = 200;

// Credits consumed each time a portrait is generated.
export const CREDITS_PER_GENERATION = 20;

// Display price (in USD) shown in the UI. The actual charge is driven by the
// Stripe Price referenced by PRICE_ID.
export const PACK_PRICE_USD = 10;
