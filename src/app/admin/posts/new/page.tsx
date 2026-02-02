import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">New Post</h1>
      </div>
      <div className="bg-bg-primary shadow rounded-lg p-6">
        <PostForm />
      </div>
    </div>
  );
}
