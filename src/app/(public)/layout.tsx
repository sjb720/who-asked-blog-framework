import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const siteName = settings?.siteName || "Blog";

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="border-b border-border-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                {settings?.logoUrl && (
                  <img
                    src={settings.logoUrl}
                    alt={siteName}
                    className="h-8 w-8 object-contain"
                  />
                )}
                <span className="text-xl font-semibold text-text-primary">
                  {siteName}
                </span>
              </Link>
            </div>
            {session && (
              <div className="flex items-center">
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-accent-secondary text-text-inverse text-sm font-medium rounded-md hover:bg-accent-secondary-hover transition-colors"
                >
                  Admin Console
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="border-t border-border-primary mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-text-muted text-sm">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
