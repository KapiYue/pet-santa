import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { generationTask } from "@/db/schema/generation";
import { getServerSession } from "@/lib/auth/get-session";
import { syncGenerationTaskById } from "@/lib/generation/process-task";

export async function GET(
  _request: Request,
  context: { params: Promise<{ taskId: string }> },
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await context.params;

  const [existing] = await db
    .select()
    .from(generationTask)
    .where(eq(generationTask.id, taskId))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const task =
      existing.status === "success" || existing.status === "fail"
        ? existing
        : await syncGenerationTaskById(taskId);

    return NextResponse.json({
      id: task.id,
      status: task.status,
      originalImageUrl: task.originalImageUrl,
      generatedImageUrl: task.generatedImageUrl,
      failMsg: task.failMsg,
      creditsDeducted: task.creditsDeducted,
      creditsCost: task.creditsCost,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
    });
  } catch (error) {
    console.error("[generate/poll] sync failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
