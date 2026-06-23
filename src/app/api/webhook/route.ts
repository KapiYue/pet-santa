import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/billing/stripe";
import { CREDITS_PER_PURCHASE } from "@/lib/billing/config";
import { recordPaymentAndGrantCredits } from "@/lib/billing/credits";

// Stripe needs the raw, unparsed body to verify the signature, so we must not
// let any framework body parsing run before us. Reading request.text() gives
// us the exact bytes Stripe signed.
export async function POST(request: Request): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[webhook] signature verification failed:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${(error as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const userId = checkoutSession.metadata?.userId;
    const credits = Number(
      checkoutSession.metadata?.credits ?? CREDITS_PER_PURCHASE,
    );

    if (!userId) {
      console.error("[webhook] checkout.session.completed missing userId metadata");
      // Acknowledge so Stripe stops retrying an event we can't act on.
      return NextResponse.json({ received: true });
    }

    try {
      const newBalance = await recordPaymentAndGrantCredits({
        userId,
        stripeSessionId: checkoutSession.id,
        stripePaymentIntentId:
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : (checkoutSession.payment_intent?.id ?? null),
        amount: checkoutSession.amount_total ?? 0,
        currency: checkoutSession.currency ?? "usd",
        credits,
      });

      if (newBalance === null) {
        console.log(`[webhook] duplicate session ${checkoutSession.id}, skipped.`);
      } else {
        console.log(
          `[webhook] granted ${credits} credits to user ${userId}, new balance ${newBalance}.`,
        );
      }
    } catch (error) {
      console.error("[webhook] failed to grant credits:", error);
      // Return 500 so Stripe retries delivery.
      return NextResponse.json(
        { error: "Failed to process payment." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
