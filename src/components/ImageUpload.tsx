"use client";

import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  currentImage?: string | null;
}

export default function ImageUpload({
  onUpload,
  label = "Upload Image",
  currentImage,
}: ImageUploadProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          enqueueSnackbar(error.error || "Upload failed", { variant: "error" });
          return;
        }

        const { url } = await res.json();
        setPreview(url);
        onUpload(url);
      } catch (error) {
        enqueueSnackbar("Upload failed", { variant: "error" });
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onUpload("");
  }, [onUpload]);

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-status-error text-text-inverse rounded-full p-1 hover:bg-status-error-hover"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-border-secondary border-dashed rounded-lg cursor-pointer bg-bg-secondary hover:bg-bg-tertiary">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-text-muted"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-text-muted">
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <span>
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </span>
              )}
            </p>
            <p className="text-xs text-text-muted">{label}</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
