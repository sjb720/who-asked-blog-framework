"use client";

import { useState, useRef, useCallback } from "react";
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
  const editorRef = useRef<any>(null);

  const handleImageUploadForEditor = useCallback(() => {
    setShowImageModal(true);
  }, []);

  const handleEditorImageInsert = useCallback(async (url: string) => {
    setShowImageModal(false);
    if (url && editorRef.current) {
      editorRef.current.chain().focus().setImage({ src: url }).run();
    }
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

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const error = await res.json();
      enqueueSnackbar(error.error || "Failed to save post", { variant: "error" });
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner Image
          </label>
          <ImageUpload
            onUpload={setBannerUrl}
            currentImage={bannerUrl}
            label="PNG, JPG, GIF, WebP up to 10MB"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <Editor
            content={content}
            onChange={setContent}
            onImageUpload={handleImageUploadForEditor}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Published
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Insert Image
            </h3>
            <ImageUpload
              onUpload={handleEditorImageInsert}
              label="Upload image to insert in content"
            />
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
