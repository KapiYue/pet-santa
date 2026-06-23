import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/get-session";
import { CREDITS_PER_GENERATION } from "@/lib/billing/config";
import { consumeCredits, InsufficientCreditsError } from "@/lib/billing/credits";

// Charges the user for one portrait generation. The actual rendering happens
// client-side; this endpoint is the source of truth for spending credits.
export async function POST(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const remaining = await consumeCredits(
      session.user.id,
      CREDITS_PER_GENERATION,
    );
    return NextResponse.json({ ok: true, credits: remaining });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { error: "Insufficient credits", code: "INSUFFICIENT_CREDITS" },
        { status: 402 },
      );
    }
    console.error("[generate] failed to consume credits:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
