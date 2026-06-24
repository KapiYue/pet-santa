import { NextResponse } from "next/server";
import { applyKieCallbackPayload } from "@/lib/generation/process-task";
import type { KieTaskRecord } from "@/lib/kie/client";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const body = payload as { data?: KieTaskRecord } & KieTaskRecord;
  const record = body.data ?? body;

  if (!record?.taskId) {
    return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
  }

  try {
    const task = await applyKieCallbackPayload(record);

    if (!task) {
      console.warn("[callback] unknown Kie task:", record.taskId);
      return NextResponse.json({ ok: true, matched: false });
    }

    return NextResponse.json({
      ok: true,
      matched: true,
      taskId: task.id,
      status: task.status,
    });
  } catch (error) {
    console.error("[callback] processing failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
