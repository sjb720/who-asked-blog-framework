import Link from "next/link";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, settings] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        bannerUrl: true,
        createdAt: true,
      },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
  ]);

  return (
    <>
      {settings?.bannerUrl && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={settings.bannerUrl}
            alt="Site banner"
            className="w-full h-full object-cover"
          />
          {(settings.bannerTitle || settings.bannerSubtitle) && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
              {settings.bannerTitle && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {settings.bannerTitle}
                </h1>
              )}
              {settings.bannerSubtitle && (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  {settings.bannerSubtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-text-primary mb-8">Latest Posts</h2>

      {posts.length === 0 ? (
        <p className="text-text-muted text-center py-12">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group block"
            >
              <article className="bg-bg-primary rounded-lg overflow-hidden shadow-sm border border-border-primary hover:shadow-md transition-shadow">
                {post.bannerUrl ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.bannerUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-bg-tertiary flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-text-disabled"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <time className="text-sm text-text-muted mt-2 block">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
