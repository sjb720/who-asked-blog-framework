import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  bannerUrl: z.string().nullable().optional(),
  published: z.boolean().optional(),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string(),
        caption: z.string().optional(),
        sortOrder: z.number(),
      })
    )
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updatePostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const { title, content, bannerUrl, published, images } = parsed.data;

  let slug = existingPost.slug;
  if (title && title !== existingPost.title) {
    slug = slugify(title);
    let counter = 1;

    while (true) {
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (!existing || existing.id === id) break;
      slug = `${slugify(title)}-${counter}`;
      counter++;
    }
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(title && { title, slug }),
      ...(content !== undefined && { content }),
      ...(bannerUrl !== undefined && { bannerUrl }),
      ...(published !== undefined && { published }),
    },
  });

  if (images) {
    await prisma.image.deleteMany({
      where: { postId: id },
    });

    if (images.length > 0) {
      await prisma.image.createMany({
        data: images.map((img) => ({
          postId: id,
          url: img.url,
          caption: img.caption || null,
          sortOrder: img.sortOrder,
        })),
      });
    }
  }

  const updatedPost = await prisma.post.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json(updatedPost);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.post.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
