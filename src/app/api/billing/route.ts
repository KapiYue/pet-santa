import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { creditTransaction, payment } from "@/db/schema/billing";
import { getServerSession } from "@/lib/auth/get-session";

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [account] = await db
    .select({ credits: user.credits })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  const payments = await db
    .select()
    .from(payment)
    .where(eq(payment.userId, userId))
    .orderBy(desc(payment.createdAt));

  const transactions = await db
    .select()
    .from(creditTransaction)
    .where(eq(creditTransaction.userId, userId))
    .orderBy(desc(creditTransaction.createdAt))
    .limit(50);

  return NextResponse.json({
    credits: account?.credits ?? 0,
    payments,
    transactions,
  });
}
