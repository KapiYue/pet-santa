const KIE_API_BASE = "https://api.kie.ai/api/v1/jobs";

export interface KieCreateTaskInput {
  prompt: string;
  imageInput?: string[];
  aspectRatio?: string;
  resolution?: string;
  outputFormat?: "png" | "jpg";
  callBackUrl?: string;
}

export interface KieCreateTaskResponse {
  code: number;
  msg: string;
  data?: {
    taskId: string;
  };
}

export interface KieTaskRecord {
  taskId: string;
  model: string;
  state: "waiting" | "success" | "fail";
  param: string;
  resultJson: string | null;
  failCode: string | null;
  failMsg: string | null;
  costTime: number | null;
  completeTime: number | null;
  createTime: number;
}

export interface KieRecordInfoResponse {
  code: number;
  msg: string;
  data?: KieTaskRecord;
}

function getApiKey(): string {
  const key = process.env.KIE_AI_API_KEY;
  if (!key) {
    throw new Error("KIE_AI_API_KEY is not configured");
  }
  return key;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
}

export async function createKieTask(
  input: KieCreateTaskInput,
): Promise<string> {
  const body = {
    model: "nano-banana-pro",
    callBackUrl: input.callBackUrl,
    input: {
      prompt: input.prompt,
      image_input: input.imageInput ?? [],
      aspect_ratio: input.aspectRatio ?? "1:1",
      resolution: input.resolution ?? "1K",
      output_format: input.outputFormat ?? "png",
    },
  };

  const res = await fetch(`${KIE_API_BASE}/createTask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as KieCreateTaskResponse;

  if (!res.ok || json.code !== 200 || !json.data?.taskId) {
    throw new Error(json.msg || `Kie.ai createTask failed (${res.status})`);
  }

  return json.data.taskId;
}

export async function getKieTaskRecord(
  kieTaskId: string,
): Promise<KieTaskRecord> {
  const url = new URL(`${KIE_API_BASE}/recordInfo`);
  url.searchParams.set("taskId", kieTaskId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
  });

  const json = (await res.json()) as KieRecordInfoResponse;

  if (!res.ok || json.code !== 200 || !json.data) {
    throw new Error(json.msg || `Kie.ai recordInfo failed (${res.status})`);
  }

  return json.data;
}

export function parseKieResultUrls(resultJson: string | null): string[] {
  if (!resultJson) return [];

  try {
    const parsed = JSON.parse(resultJson) as { resultUrls?: string[] };
    return parsed.resultUrls ?? [];
  } catch {
    return [];
  }
}

export function getCallbackUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }
  return `${base.replace(/\/$/, "")}/api/callback`;
}
