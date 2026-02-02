import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.join("/");

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const bytes = await response.Body.transformToByteArray();

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(response.ContentLength || bytes.length),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (errorMessage.includes("NoSuchKey") || errorMessage.includes("NotFound")) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
