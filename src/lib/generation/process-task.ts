import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { generationTask } from "@/db/schema/generation";
import {
  consumeCredits,
  InsufficientCreditsError,
} from "@/lib/billing/credits";
import {
  getKieTaskRecord,
  parseKieResultUrls,
  type KieTaskRecord,
} from "@/lib/kie/client";

async function persistResultImage(
  sourceUrl: string,
  taskId: string,
): Promise<string> {
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`Failed to download generated image (${res.status})`);
  }

  const contentType = res.headers.get("content-type") || "image/png";
  const ext = contentType.includes("jpeg") || contentType.includes("jpg")
    ? "jpg"
    : "png";
  const buffer = Buffer.from(await res.arrayBuffer());

  const blob = await put(`generations/${taskId}.${ext}`, buffer, {
    access: "public",
    contentType,
  });

  return blob.url;
}

async function applyKieRecord(
  taskId: string,
  record: KieTaskRecord,
): Promise<(typeof generationTask.$inferSelect)> {
  const [existing] = await db
    .select()
    .from(generationTask)
    .where(eq(generationTask.id, taskId))
    .limit(1);

  if (!existing) {
    throw new Error(`Generation task ${taskId} not found`);
  }

  if (existing.status === "success" || existing.status === "fail") {
    return existing;
  }

  if (record.state === "waiting") {
    const [updated] = await db
      .update(generationTask)
      .set({
        status: "waiting",
        updatedAt: new Date(),
      })
      .where(eq(generationTask.id, taskId))
      .returning();

    return updated;
  }

  if (record.state === "fail") {
    const [updated] = await db
      .update(generationTask)
      .set({
        status: "fail",
        failCode: record.failCode,
        failMsg: record.failMsg,
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(generationTask.id, taskId))
      .returning();

    return updated;
  }

  const resultUrls = parseKieResultUrls(record.resultJson);
  const remoteUrl = resultUrls[0];

  if (!remoteUrl) {
    const [updated] = await db
      .update(generationTask)
      .set({
        status: "fail",
        failMsg: "No result image returned from Kie.ai",
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(generationTask.id, taskId))
      .returning();

    return updated;
  }

  const storedUrl = await persistResultImage(remoteUrl, taskId);

  let creditTransactionId = existing.creditTransactionId;
  let creditsDeducted = existing.creditsDeducted;

  if (!creditsDeducted) {
    try {
      const remaining = await consumeCredits(existing.userId, existing.creditsCost, {
        description: "Portrait generation",
        generationTaskId: taskId,
      });
      creditsDeducted = true;
      void remaining;

      const { creditTransaction } = await import("@/db/schema/billing");
      const { desc, and } = await import("drizzle-orm");
      const [usageTx] = await db
        .select({ id: creditTransaction.id })
        .from(creditTransaction)
        .where(
          and(
            eq(creditTransaction.generationTaskId, taskId),
            eq(creditTransaction.type, "usage"),
          ),
        )
        .orderBy(desc(creditTransaction.createdAt))
        .limit(1);

      creditTransactionId = usageTx?.id ?? creditTransactionId;
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        const [updated] = await db
          .update(generationTask)
          .set({
            status: "fail",
            failMsg: "Insufficient credits to complete generation",
            generatedImageUrl: storedUrl,
            updatedAt: new Date(),
            completedAt: new Date(),
          })
          .where(eq(generationTask.id, taskId))
          .returning();

        return updated;
      }
      throw error;
    }
  } else {
    creditTransactionId = existing.creditTransactionId;
  }

  const [updated] = await db
    .update(generationTask)
    .set({
      status: "success",
      generatedImageUrl: storedUrl,
      creditsDeducted,
      creditTransactionId,
      updatedAt: new Date(),
      completedAt: new Date(),
    })
    .where(eq(generationTask.id, taskId))
    .returning();

  return updated;
}

export async function syncGenerationTaskById(
  taskId: string,
): Promise<(typeof generationTask.$inferSelect)> {
  const [existing] = await db
    .select()
    .from(generationTask)
    .where(eq(generationTask.id, taskId))
    .limit(1);

  if (!existing) {
    throw new Error(`Generation task ${taskId} not found`);
  }

  if (existing.status === "success" || existing.status === "fail") {
    return existing;
  }

  if (!existing.kieTaskId) {
    return existing;
  }

  const record = await getKieTaskRecord(existing.kieTaskId);
  return applyKieRecord(taskId, record);
}

export async function syncGenerationTaskByKieId(
  kieTaskId: string,
  record?: KieTaskRecord,
): Promise<(typeof generationTask.$inferSelect) | null> {
  const [existing] = await db
    .select()
    .from(generationTask)
    .where(eq(generationTask.kieTaskId, kieTaskId))
    .limit(1);

  if (!existing) {
    return null;
  }

  const kieRecord = record ?? (await getKieTaskRecord(kieTaskId));
  return applyKieRecord(existing.id, kieRecord);
}

export async function applyKieCallbackPayload(
  payload: KieTaskRecord,
): Promise<(typeof generationTask.$inferSelect) | null> {
  return syncGenerationTaskByKieId(payload.taskId, payload);
}
