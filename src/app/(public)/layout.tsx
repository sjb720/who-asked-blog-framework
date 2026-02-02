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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Blog
              </Link>
            </div>
            {session && (
              <div className="flex items-center">
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Admin Console
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
