"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import ImageUpload from "@/components/ImageUpload";

interface BrandingSettings {
  siteName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  bannerTitle: string | null;
  bannerSubtitle: string | null;
}

export default function BrandingPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<BrandingSettings>({
    siteName: "Blog",
    logoUrl: null,
    bannerUrl: null,
    bannerTitle: null,
    bannerSubtitle: null,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const res = await fetch("/api/branding");
    const data = await res.json();
    setSettings(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        enqueueSnackbar("Branding saved successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to save branding", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Failed to save branding", { variant: "error" });
    } finally {
      setSaving(false);
    }
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Branding</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Customize your blog's appearance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-bg-primary shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium text-text-primary">Site Identity</h2>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full max-w-md px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-bg-primary text-text-primary"
              style={{ borderColor: "var(--border-secondary)" }}
              placeholder="My Blog"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Logo
            </label>
            <p className="text-xs text-text-muted mb-2">
              Displayed in the header. Recommended: Square image, at least 64x64px.
            </p>
            <div className="max-w-md">
              <ImageUpload
                onUpload={(url) => setSettings({ ...settings, logoUrl: url || null })}
                currentImage={settings.logoUrl}
                label="PNG, JPG, SVG up to 2MB"
              />
            </div>
          </div>
        </div>

        <div className="bg-bg-primary shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium text-text-primary">Landing Page Banner</h2>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Banner Image
            </label>
            <p className="text-xs text-text-muted mb-2">
              Displayed at the top of your home page. Recommended: Wide image, at least 1200px wide.
            </p>
            <ImageUpload
              onUpload={(url) => setSettings({ ...settings, bannerUrl: url || null })}
              currentImage={settings.bannerUrl}
              label="PNG, JPG, WebP up to 10MB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Banner Title
            </label>
            <input
              type="text"
              value={settings.bannerTitle || ""}
              onChange={(e) => setSettings({ ...settings, bannerTitle: e.target.value || null })}
              className="w-full max-w-md px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-bg-primary text-text-primary"
              style={{ borderColor: "var(--border-secondary)" }}
              placeholder="Welcome to My Blog"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Banner Subtitle
            </label>
            <input
              type="text"
              value={settings.bannerSubtitle || ""}
              onChange={(e) => setSettings({ ...settings, bannerSubtitle: e.target.value || null })}
              className="w-full max-w-md px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-bg-primary text-text-primary"
              style={{ borderColor: "var(--border-secondary)" }}
              placeholder="Thoughts on technology, life, and everything in between"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-inverse disabled:opacity-50"
            style={{ backgroundColor: "var(--accent-primary)" }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "var(--accent-primary-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-primary)";
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
