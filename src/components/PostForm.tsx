"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSnackbar } from "notistack";
import ImageUpload from "./ImageUpload";
import GalleryUpload from "./GalleryUpload";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

interface GalleryImage {
  id?: string;
  url: string;
  caption?: string;
  sortOrder: number;
}

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    bannerUrl: string | null;
    published: boolean;
    images: GalleryImage[];
  };
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [images, setImages] = useState<GalleryImage[]>(initialData?.images || []);
  const [saving, setSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const handleImageUploadForEditor = useCallback(() => {
    setShowImageModal(true);
  }, []);

  const handleEditorImageInsert = useCallback((url: string) => {
    setShowImageModal(false);
    if (url) {
      setPendingImage(url);
    }
  }, []);

  const handleImageInserted = useCallback(() => {
    setPendingImage(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      title,
      content,
      bannerUrl: bannerUrl || null,
      published,
      images: images.map((img, index) => ({
        ...img,
        sortOrder: index,
      })),
    };

    const url = initialData
      ? `/api/posts/${initialData.id}`
      : "/api/posts";
    const method = initialData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // Deliberately leave `saving` set so the button stays disabled while
        // we navigate away, rather than flashing back to "Create".
        router.push("/admin");
        router.refresh();
        return;
      }

      // An error response is not guaranteed to be JSON — a proxy 502 or an
      // unhandled server error returns HTML, and res.json() would throw.
      const message = await res
        .json()
        .then((body) => body?.error)
        .catch(() => null);

      enqueueSnackbar(message || `Failed to save post (HTTP ${res.status})`, {
        variant: "error",
      });
      setSaving(false);
    } catch (err) {
      console.error("Failed to save post:", err);
      enqueueSnackbar("Network error — could not reach the server.", {
        variant: "error",
      });
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border-secondary rounded-md shadow-sm focus:outline-none focus:ring-border-focus focus:border-border-focus bg-bg-primary text-text-primary"
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Banner Image
          </label>
          <ImageUpload
            onUpload={setBannerUrl}
            currentImage={bannerUrl}
            label="PNG, JPG, GIF, WebP up to 10MB"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Content
          </label>
          <Editor
            content={content}
            onChange={setContent}
            onImageUpload={handleImageUploadForEditor}
            imageToInsert={pendingImage}
            onImageInserted={handleImageInserted}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Gallery Images
          </label>
          <GalleryUpload images={images} onChange={setImages} />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 text-accent-primary focus:ring-focus-ring border-border-secondary rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-text-primary">
            Published
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-4 py-2 border border-border-secondary rounded-md shadow-sm text-sm font-medium text-text-secondary bg-bg-primary hover:bg-hover-bg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-inverse bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-50"
          >
            {saving ? "Saving..." : initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>

      {showImageModal && (
        <div className="fixed inset-0 bg-bg-overlay flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Insert Image
            </h3>
            <ImageUpload
              onUpload={handleEditorImageInsert}
              label="Upload image to insert in content"
            />
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="mt-4 w-full px-4 py-2 border border-border-secondary rounded-md shadow-sm text-sm font-medium text-text-secondary bg-bg-primary hover:bg-hover-bg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
