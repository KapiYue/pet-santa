import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/get-session";
import { stripe } from "@/lib/billing/stripe";
import { CREDITS_PER_PURCHASE } from "@/lib/billing/config";

export async function POST(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price is not configured." },
      { status: 500 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/billing?success=true`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      customer_email: session.user.email,
      // Carried through to the webhook so we know who to credit.
      metadata: {
        userId: session.user.id,
        credits: String(CREDITS_PER_PURCHASE),
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("[checkout] failed to create session:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
