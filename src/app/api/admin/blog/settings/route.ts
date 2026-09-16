import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Page from "@/models/Page";
import { hasPermission, getSessionUser } from "@/lib/rbac";
import { recordActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_BLOG_SECTION = {
  hidden: false,
  subtitle: "LATEST NEWS",
  title: "Insights & Industry Updates",
  ctaAll: "View All Articles",
  ctaReadMore: "Read More",
  viewAllLink: "/blogs/",
  selectedPosts: [],
};

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const hasBlogPerm = await hasPermission(req, "blog", "read");
    const hasPagesPerm = await hasPermission(req, "pages", "read");

    if (!session || (!hasBlogPerm && !hasPagesPerm)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const [siteDoc, homePageDoc] = await Promise.all([
      SiteContent.findOne({ key: "complete_data" }).lean() as any,
      Page.findOne({
        $or: [{ slug: "home" }, { slug: "/" }, { template: "home" }],
        status: "published",
        isTrashed: { $ne: true },
      }).lean() as any,
    ]);

    const globalBlogSection = siteDoc?.data?.blogSection || {};
    const pageBlogSection = homePageDoc?.content?.blogSection || {};

    // Page content takes precedence if defined, otherwise global data, otherwise default
    const blogSection = {
      ...DEFAULT_BLOG_SECTION,
      ...globalBlogSection,
      ...pageBlogSection,
      hidden: Boolean(pageBlogSection.hidden ?? globalBlogSection.hidden ?? false),
    };

    return NextResponse.json({ success: true, blogSection });
  } catch (error: any) {
    console.error("Failed to fetch blog section settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const hasBlogPerm = await hasPermission(req, "blog", "update");
    const hasPagesPerm = await hasPermission(req, "pages", "update");

    if (!session || (!hasBlogPerm && !hasPagesPerm)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    await connectToDatabase();

    const siteDoc = await SiteContent.findOne({ key: "complete_data" });
    const currentGlobal = siteDoc?.data || {};
    const currentBlogSection = currentGlobal.blogSection || DEFAULT_BLOG_SECTION;

    const updatedBlogSection = {
      ...currentBlogSection,
      ...body,
      hidden: body.hidden !== undefined ? Boolean(body.hidden) : Boolean(currentBlogSection.hidden),
    };

    // 1. Update SiteContent
    await SiteContent.updateOne(
      { key: "complete_data" },
      {
        $set: {
          "data.blogSection": updatedBlogSection,
          lastUpdated: new Date(),
        },
      },
      { upsert: true }
    );

    // 2. Update Home Page Document
    try {
      await Page.updateMany(
        { $or: [{ slug: "home" }, { slug: "/" }, { template: "home" }] },
        {
          $set: {
            "content.blogSection": updatedBlogSection,
            updatedAt: new Date(),
          },
        }
      );
    } catch (pageErr) {
      console.error("Failed to sync blogSection to home page:", pageErr);
    }

    // 3. Log activity
    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: "UPDATE_SETTINGS",
      entity: "BlogSection",
      details: {
        message: `Updated homepage blog section settings (hidden: ${updatedBlogSection.hidden})`,
        hidden: updatedBlogSection.hidden,
      },
      ip: req.headers.get("x-forwarded-for") || (req as any).ip || "unknown",
    });

    // 4. Revalidate cache
    try {
      revalidatePath("/");
      revalidatePath("/blogs");
      revalidatePath("/blog");
    } catch (revalErr) {
      console.error("Failed to revalidate cache:", revalErr);
    }

    return NextResponse.json({
      success: true,
      blogSection: updatedBlogSection,
      message: `Homepage blog section is now ${updatedBlogSection.hidden ? "hidden" : "visible"}.`,
    });
  } catch (error: any) {
    console.error("Failed to update blog section settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
