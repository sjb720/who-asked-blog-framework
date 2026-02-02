import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="border-b border-border-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-text-primary">
                Blog
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
            &copy; {new Date().getFullYear()} Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
