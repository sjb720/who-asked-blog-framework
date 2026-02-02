import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFile } from "@/lib/s3";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;
  const bucket = process.env.S3_BUCKET!;
  const publicUrl = process.env.S3_PUBLIC_URL!;
  const url = `${publicUrl}/${bucket}/${filename}`;

  await deleteFile(url);

  return NextResponse.json({ success: true });
}
