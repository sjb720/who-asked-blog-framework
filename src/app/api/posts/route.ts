import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
  bannerUrl: z.string().optional(),
  published: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get("published") === "true";

  const posts = await prisma.post.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, content, bannerUrl, published } = parsed.data;

  let slug = slugify(title);
  let counter = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${slugify(title)}-${counter}`;
    counter++;
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      bannerUrl,
      published,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
