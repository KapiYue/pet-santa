import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/get-session";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE_IN_BYTES = 4 * 1024 * 1024; // 4MB (stay under Vercel's 4.5MB body limit)

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 },
      );
    }

    if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, WEBP or GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_IN_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 4MB." },
        { status: 400 },
      );
    }

    // Server-side upload: the outbound request to Vercel Blob goes through the
    // Node fetch (undici) global dispatcher, so it uses the proxy configured in
    // instrumentation.ts. BLOB_READ_WRITE_TOKEN is read from the environment.
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("[blob] upload failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
