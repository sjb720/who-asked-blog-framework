import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PostForm from "@/components/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
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
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Post</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <PostForm
          initialData={{
            id: post.id,
            title: post.title,
            content: post.content,
            bannerUrl: post.bannerUrl,
            published: post.published,
            images: post.images.map((img) => ({
              id: img.id,
              url: img.url,
              caption: img.caption || undefined,
              sortOrder: img.sortOrder,
            })),
          }}
        />
      </div>
    </div>
  );
}
