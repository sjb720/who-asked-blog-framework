import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Gallery from "@/components/Gallery";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getExcerpt(content: string, maxLength = 160): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      content: true,
      bannerUrl: true,
      createdAt: true,
    },
  });

  if (!post) {
    return { title: "Post Not Found" };
  }

  const description = getExcerpt(post.content);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      ...(post.bannerUrl && {
        images: [{ url: post.bannerUrl }],
      }),
    },
    twitter: {
      card: post.bannerUrl ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(post.bannerUrl && {
        images: [post.bannerUrl],
      }),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-text-muted hover:text-text-secondary mb-8"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to posts
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-4">{post.title}</h1>
        <time className="text-text-muted">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      {post.bannerUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.bannerUrl}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.images.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Gallery</h2>
          <Gallery images={post.images} />
        </div>
      )}
    </article>
  );
}
