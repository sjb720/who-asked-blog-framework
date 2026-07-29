import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
  bannerUrl: z.string().nullable().optional(),
  published: z.boolean().default(false),
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

  const { title, content, bannerUrl, published, images } = parsed.data;

  // A title made only of symbols/emoji slugifies to "", which would produce a
  // post that is unreachable at /posts/<slug>.
  const baseSlug = slugify(title) || "post";
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        bannerUrl,
        published,
        ...(images?.length && {
          images: {
            create: images.map((img) => ({
              url: img.url,
              caption: img.caption || null,
              sortOrder: img.sortOrder,
            })),
          },
        }),
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    // Without this the route throws an HTML error page, which the client then
    // fails to parse as JSON — surfacing as an unhandled promise rejection.
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
