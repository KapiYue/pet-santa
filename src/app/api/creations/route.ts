import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { generationTask } from "@/db/schema/generation";
import { getServerSession } from "@/lib/auth/get-session";
import { syncGenerationTaskById } from "@/lib/generation/process-task";

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const tasks = await db
    .select({
      id: generationTask.id,
      status: generationTask.status,
      outfitId: generationTask.outfitId,
      backgroundId: generationTask.backgroundId,
      originalImageUrl: generationTask.originalImageUrl,
      generatedImageUrl: generationTask.generatedImageUrl,
      failMsg: generationTask.failMsg,
      creditsDeducted: generationTask.creditsDeducted,
      creditsCost: generationTask.creditsCost,
      createdAt: generationTask.createdAt,
      completedAt: generationTask.completedAt,
    })
    .from(generationTask)
    .where(eq(generationTask.userId, userId))
    .orderBy(desc(generationTask.createdAt))
    .limit(50);

  const synced = await Promise.all(
    tasks.map(async (task) => {
      if (task.status === "waiting" || task.status === "pending") {
        try {
          const updated = await syncGenerationTaskById(task.id);
          return {
            id: updated.id,
            status: updated.status,
            outfitId: updated.outfitId,
            backgroundId: updated.backgroundId,
            originalImageUrl: updated.originalImageUrl,
            generatedImageUrl: updated.generatedImageUrl,
            failMsg: updated.failMsg,
            creditsDeducted: updated.creditsDeducted,
            creditsCost: updated.creditsCost,
            createdAt: updated.createdAt,
            completedAt: updated.completedAt,
          };
        } catch (error) {
          console.error("[creations] sync failed for", task.id, error);
          return task;
        }
      }
      return task;
    }),
  );

  return NextResponse.json({ tasks: synced });
}
