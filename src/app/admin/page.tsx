"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PopConfirm from "@/components/PopConfirm";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  async function deletePost(id: string) {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-text-primary">Posts</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your blog posts here.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-accent-primary px-4 py-2 text-sm font-medium text-text-inverse shadow-sm hover:bg-accent-primary-hover"
          >
            New Post
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {posts.length === 0 ? (
                <div className="bg-bg-primary px-6 py-12 text-center">
                  <p className="text-text-muted">No posts yet.</p>
                  <Link
                    href="/admin/posts/new"
                    className="mt-4 inline-block text-accent-primary hover:text-accent-primary-light"
                  >
                    Create your first post
                  </Link>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-border-secondary">
                  <thead className="bg-bg-secondary">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-primary sm:pl-6">
                        Title
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">
                        Created
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary bg-bg-primary">
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-primary sm:pl-6">
                          {post.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              post.published
                                ? "bg-status-success-bg text-status-success-text"
                                : "bg-status-warning-bg text-status-warning-text"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="text-accent-primary hover:text-accent-primary-dark mr-4"
                          >
                            Edit
                          </Link>
                          <PopConfirm
                            title="Delete this post?"
                            description="This action cannot be undone."
                            onConfirm={() => deletePost(post.id)}
                          >
                            <button className="text-status-error hover:text-status-error-dark">
                              Delete
                            </button>
                          </PopConfirm>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
