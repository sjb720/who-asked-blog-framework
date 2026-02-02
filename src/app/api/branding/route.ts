import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json(settings || {
    siteName: "Blog",
    logoUrl: null,
    bannerUrl: null,
    bannerTitle: null,
    bannerSubtitle: null,
  });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      siteName: data.siteName,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      bannerTitle: data.bannerTitle,
      bannerSubtitle: data.bannerSubtitle,
    },
    create: {
      id: "default",
      siteName: data.siteName || "Blog",
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      bannerTitle: data.bannerTitle,
      bannerSubtitle: data.bannerSubtitle,
    },
  });

  return NextResponse.json(settings);
}
