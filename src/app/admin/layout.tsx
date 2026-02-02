"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-secondary">
      <nav className="bg-bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/admin"
                className="flex items-center px-2 text-xl font-semibold text-text-primary"
              >
                Admin
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === "/admin"
                      ? "border-accent-primary text-text-primary"
                      : "border-transparent text-text-muted hover:border-border-secondary hover:text-text-secondary"
                  }`}
                >
                  Posts
                </Link>
                <Link
                  href="/admin/branding"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === "/admin/branding"
                      ? "border-accent-primary text-text-primary"
                      : "border-transparent text-text-muted hover:border-border-secondary hover:text-text-secondary"
                  }`}
                >
                  Branding
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm text-text-muted hover:text-text-secondary"
              >
                View Site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-sm text-text-muted hover:text-text-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
