import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { generationTask } from "@/db/schema/generation";
import { getServerSession } from "@/lib/auth/get-session";
import { CREDITS_PER_GENERATION } from "@/lib/billing/config";
import { hasEnoughCredits } from "@/lib/billing/credits";
import { createKieTask, getCallbackUrl } from "@/lib/kie/client";
import { buildPortraitPrompt } from "@/lib/kie/prompts";

const createTaskSchema = z.object({
  originalImageUrl: z.url(),
  outfitId: z.string().min(1),
  backgroundId: z.string().min(1),
  aspectRatio: z
    .enum([
      "1:1",
      "2:3",
      "3:2",
      "3:4",
      "4:3",
      "4:5",
      "5:4",
      "9:16",
      "16:9",
      "21:9",
      "auto",
    ])
    .optional(),
  resolution: z.enum(["1K", "2K", "4K"]).optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const userId = session.user.id;
  const enoughCredits = await hasEnoughCredits(
    userId,
    CREDITS_PER_GENERATION,
  );

  if (!enoughCredits) {
    return NextResponse.json(
      { error: "Insufficient credits", code: "INSUFFICIENT_CREDITS" },
      { status: 402 },
    );
  }

  const { originalImageUrl, outfitId, backgroundId, aspectRatio, resolution } =
    parsed.data;
  const prompt = buildPortraitPrompt(outfitId, backgroundId);
  const taskId = randomUUID();

  await db.insert(generationTask).values({
    id: taskId,
    userId,
    status: "pending",
    prompt,
    outfitId,
    backgroundId,
    originalImageUrl,
    creditsCost: CREDITS_PER_GENERATION,
  });

  try {
    const kieTaskId = await createKieTask({
      prompt,
      imageInput: [originalImageUrl],
      aspectRatio,
      resolution,
      callBackUrl: getCallbackUrl(),
    });

    await db
      .update(generationTask)
      .set({
        kieTaskId,
        status: "waiting",
        updatedAt: new Date(),
      })
      .where(eq(generationTask.id, taskId));

    const [account] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return NextResponse.json({
      ok: true,
      taskId,
      kieTaskId,
      credits: account?.credits ?? 0,
      creditsCost: CREDITS_PER_GENERATION,
    });
  } catch (error) {
    await db
      .update(generationTask)
      .set({
        status: "fail",
        failMsg: (error as Error).message,
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(generationTask.id, taskId));

    console.error("[generate] failed to create Kie.ai task:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
