import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { creditTransaction, payment } from "@/db/schema/billing";

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits");
    this.name = "InsufficientCreditsError";
  }
}

interface RecordPaymentInput {
  userId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  amount: number;
  currency: string;
  credits: number;
}

interface ConsumeCreditsOptions {
  description?: string;
  generationTaskId?: string;
}

/**
 * Records a completed Stripe payment and tops up the user's credits.
 * Idempotent on `stripeSessionId`, so retried webhooks won't double-credit.
 * Returns the new balance, or `null` when the payment was already processed.
 */
export async function recordPaymentAndGrantCredits(
  input: RecordPaymentInput,
): Promise<number | null> {
  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: payment.id })
      .from(payment)
      .where(eq(payment.stripeSessionId, input.stripeSessionId))
      .limit(1);

    if (existing.length > 0) {
      return null;
    }

    const paymentId = randomUUID();
    await tx.insert(payment).values({
      id: paymentId,
      userId: input.userId,
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId ?? null,
      amount: input.amount,
      currency: input.currency,
      credits: input.credits,
      status: "completed",
    });

    const [updated] = await tx
      .update(user)
      .set({ credits: sql`${user.credits} + ${input.credits}` })
      .where(eq(user.id, input.userId))
      .returning({ credits: user.credits });

    await tx.insert(creditTransaction).values({
      id: randomUUID(),
      userId: input.userId,
      type: "recharge",
      amount: input.credits,
      balanceAfter: updated.credits,
      description: "Stripe purchase",
      paymentId,
    });

    return updated.credits;
  });
}

/**
 * Atomically consumes credits. Throws `InsufficientCreditsError` when the
 * balance is too low. Returns the remaining balance.
 */
export async function consumeCredits(
  userId: string,
  cost: number,
  options: ConsumeCreditsOptions = {},
): Promise<number> {
  const { description = "Portrait generation", generationTaskId } = options;

  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(user)
      .set({ credits: sql`${user.credits} - ${cost}` })
      .where(sql`${user.id} = ${userId} AND ${user.credits} >= ${cost}`)
      .returning({ credits: user.credits });

    if (!updated) {
      throw new InsufficientCreditsError();
    }

    const transactionId = randomUUID();
    await tx.insert(creditTransaction).values({
      id: transactionId,
      userId,
      type: "usage",
      amount: -cost,
      balanceAfter: updated.credits,
      description,
      generationTaskId,
    });

    return updated.credits;
  });
}

/**
 * Returns whether the user has enough credits for a generation.
 */
export async function hasEnoughCredits(
  userId: string,
  cost: number,
): Promise<boolean> {
  const [account] = await db
    .select({ credits: user.credits })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return (account?.credits ?? 0) >= cost;
}
