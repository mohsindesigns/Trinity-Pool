import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  Calendar,
  Clock,
  BookOpen,
  Star,
  MapPin,
  ArrowLeft
} from "lucide-react";

import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Page from "@/models/Page";
import SiteContent from "@/models/Content";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButton from "@/components/blog/ShareButton";
import PageInlineFaqs from "@/components/PageInlineFaqs";
import BlogCard from "@/components/templates/BlogCard";
import CtaBanner from "@/components/CtaBanner";
import QAForm from "@/components/QAForm";
import { BASE_URL } from "@/lib/constants";
import { makeLinksDoFollow, cleanMojibake } from "@/lib/utils";
import { getRobotsMetadata } from "@/lib/seo";
import { normalizeBlogImage } from "@/lib/blogImage";
import { mergePageContent } from "@/lib/deepMerge";

const DEFAULT_CTA_BANNER = {
  label: "NEED PARTS OR SERVICE?",
  title: "Talk to Our Team About Your Well.",
  description: "From sucker rods to rod pump tracking, our Odessa shop is ready to help — call or send us the details of your job.",
  button: "Get a Quote",
  buttonUrl: "/contact-us/",
};

export const revalidate = 60; // Cache for 1 minute

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();

  const [post, contentDoc] = await Promise.all([
    Post.findOne({
      $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
      status: "published",
      isTrashed: { $ne: true }
    }).populate("categories"),
    SiteContent.findOne({ key: "complete_data" }).lean() as any
  ]);

  if (!post) return { title: "Article Not Found | Trinity Pump & Supply" };

  const settings = contentDoc?.data?.settings;
  const pageTitle = post.seo?.metaTitle || `${post.title} | Trinity Pump & Supply`;
  const pageDesc =
    post.seo?.metaDescription ||
    post.excerpt ||
    `${post.title} - Technical guidance, downhole rod pump maintenance, and artificial lift equipment insights from Trinity Pump & Supply in Odessa, Texas.`;
  const pageImage = normalizeBlogImage(post.seo?.ogImage || post.featuredImage) || `${BASE_URL}/logo.png`;
  let canonicalUrl = post.seo?.canonicalUrl || `${BASE_URL}/blogs/${post.slug}/`;
  if (canonicalUrl.includes('/blog/')) {
    canonicalUrl = canonicalUrl.replace('/blog/', '/blogs/');
  }

  return {
    title: {
      absolute: pageTitle
    },
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl
    },
    robots: getRobotsMetadata(settings, post.seo),
    openGraph: {
      title: post.seo?.ogTitle || pageTitle,
      description: post.seo?.ogDescription || pageDesc,
      url: `${BASE_URL}/blogs/${post.slug}/`,
      type: "article",
      publishedTime: (post.publishedAt || post.createdAt
        ? new Date(post.publishedAt || post.createdAt)
        : new Date("2025-02-07T15:28:30Z")
      ).toISOString(),
      modifiedTime: (post.updatedAt || post.publishedAt || post.createdAt
        ? new Date(post.updatedAt || post.publishedAt || post.createdAt)
        : new Date("2026-07-24T16:08:21Z")
      ).toISOString(),
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.ogTitle || pageTitle,
      description: post.seo?.ogDescription || pageDesc,
      images: [pageImage],
      site: "@trinitypumpsupply",
      creator: "@trinitypumpsupply"
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectToDatabase();

  // 1. Fetch Post from MongoDB
  const post = await Post.findOne({
    $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    status: "published",
    isTrashed: { $ne: true }
  })
    .populate("categories tags author")
    .lean();

  if (!post) notFound();

  // 2. Fetch Blog Page Settings for CMS-managed Defaults
  const [blogPageDoc, contentDoc] = await Promise.all([
    Page.findOne({
      $or: [{ slug: { $in: ["blogs", "/blogs", "blog", "/blog"] } }, { template: { $in: ["blogs", "blog"] } }]
    }).lean() as any,
    SiteContent.findOne({ key: "complete_data" }).lean() as any
  ]);

  const globalContent = contentDoc?.data || {};
  const globalBlogPageData = globalContent.blogsPage || globalContent.blogPage || {};
  const pageBlogPageData = blogPageDoc?.content?.blogPage || blogPageDoc?.content || {};
  const blogPageData = mergePageContent(globalBlogPageData, pageBlogPageData);

  // Resolve Related Section Header
  const relatedSection = {
    eyebrow: blogPageData.relatedSection?.eyebrow || "CONTINUE READING",
    title: blogPageData.relatedSection?.title || "Related Field Guides & Technical Articles"
  };

  // CTA banner
  const ctaBannerData = blogPageData.ctaBanner && Object.keys(blogPageData.ctaBanner).length > 0 ? blogPageData.ctaBanner : DEFAULT_CTA_BANNER;
  const pageDataForForm = blogPageDoc ? JSON.parse(JSON.stringify(blogPageDoc)) : null;

  // 3. Fetch 3 Related Articles (excluding current post)
  const postCategoryIds = Array.isArray(post.categories) ? post.categories.map((c: any) => c._id || c) : [];

  let relatedPostsRaw = await Post.find({
    _id: { $ne: post._id },
    status: "published",
    isTrashed: { $ne: true },
    ...(postCategoryIds.length > 0 ? { categories: { $in: postCategoryIds } } : {})
  })
    .populate("categories")
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean();

  if (relatedPostsRaw.length < 3) {
    const existingIds = [post._id, ...relatedPostsRaw.map((r: any) => r._id)];
    const fallbackPosts = await Post.find({
      _id: { $nin: existingIds },
      status: "published",
      isTrashed: { $ne: true }
    })
      .populate("categories")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3 - relatedPostsRaw.length)
      .lean();
    relatedPostsRaw = [...relatedPostsRaw, ...fallbackPosts];
  }

  const relatedPosts = relatedPostsRaw.map((r: any) => {
    let catBadge = "Field Insight";
    if (Array.isArray(r.categories) && r.categories.length > 0) {
      catBadge = r.categories[0]?.name || "Field Insight";
    }

    let rDate = "Recent";
    if (r.publishedAt || r.createdAt) {
      try {
        rDate = new Date(r.publishedAt || r.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      } catch {
        rDate = "Recent";
      }
    }

    let rReadTime = "5 min read";
    if (r.content) {
      const words = String(r.content).replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      rReadTime = `${Math.max(3, Math.ceil(words / 200))} min read`;
    }

    return {
      id: String(r._id),
      slug: r.slug || String(r._id),
      title: r.title,
      badge: catBadge,
      image: normalizeBlogImage(r.featuredImage) || "/images/trinity/blog-pump.jpg",
      date: rDate,
      readTime: rReadTime
    };
  });

  // 4. Resolve Post Metadata & Author Information
  let categoryBadge = "Field Insight";
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    categoryBadge = post.categories[0].name || categoryBadge;
  } else if (post.category) {
    categoryBadge = post.category;
  }

  let formattedDate = "Recent";
  if (post.publishedAt || post.createdAt) {
    try {
      formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      formattedDate = "Recent";
    }
  }

  const rawHtmlContent = (post.content || "")
    .replace(/<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked|Common Questions)[^<]*<\/h[1-6]>[\s\S]*?(?=<h[1-6]|$)/gi, "")
    .trim();

  const wordCount = rawHtmlContent.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTimeDisplay = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;
  const featuredImage = normalizeBlogImage(post.featuredImage) || "/images/trinity/blog-pump.jpg";

  const rawAuthor = post.author as any;
  let cleanName = "Trinity Technical Specialists";
  if (rawAuthor) {
    if (typeof rawAuthor === "string" && rawAuthor.trim()) {
      cleanName = rawAuthor.trim();
    } else if (rawAuthor.name && typeof rawAuthor.name === "string" && rawAuthor.name.trim()) {
      cleanName = rawAuthor.name.trim();
    } else if (rawAuthor.username && typeof rawAuthor.username === "string" && rawAuthor.username.toLowerCase() !== "admin") {
      cleanName = rawAuthor.username;
    }
  }

  let cleanRole = "Downhole Rod Pump & Artificial Lift Specialists — Odessa, TX";
  if (rawAuthor?.role) {
    if (typeof rawAuthor.role === "object" && rawAuthor.role?.name) {
      cleanRole = String(rawAuthor.role.name);
    } else if (typeof rawAuthor.role === "string" && !rawAuthor.role.match(/^[0-9a-fA-F]{24}$/)) {
      cleanRole = rawAuthor.role;
    }
  }

  let cleanAvatar = "/images/trinity/avatar-1.jpg";
  if (rawAuthor) {
    const candidate = rawAuthor.image || rawAuthor.avatar;
    if (candidate && typeof candidate === "string" && (candidate.startsWith("http") || candidate.startsWith("/")) && !candidate.includes("theraphist")) {
      cleanAvatar = candidate;
    }
  }

  const authorInfo = {
    name: String(cleanName),
    role: String(cleanRole),
    avatar: String(cleanAvatar),
    bio: "The technical specialists at Trinity Pump & Supply bring over a century of hands-on expertise building, repairing, and troubleshooting downhole sucker rod pumps, TACs, and artificial lift equipment across the Permian Basin."
  };

  const url = `${BASE_URL}/blogs/${post.slug}/`;
  const publishDate = (post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt)
    : new Date("2025-02-07T15:28:30Z")
  ).toISOString();
  const modifiedDate = (post.updatedAt || post.publishedAt || post.createdAt
    ? new Date(post.updatedAt || post.publishedAt || post.createdAt)
    : new Date("2026-07-24T16:08:21Z")
  ).toISOString();

  // 5. Schema.org Article Graph JSON-LD
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        "url": url,
        "name": `${post.title} | Trinity Pump & Supply`,
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "primaryImageOfPage": { "@id": `${url}#primaryimage` },
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "description": post.seo?.metaDescription || post.excerpt,
        "breadcrumb": { "@id": `${url}#breadcrumb` },
        "inLanguage": "en-US"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${BASE_URL}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blogs",
            "item": `${BASE_URL}/blogs/`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": url
          }
        ]
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        "isPartOf": { "@id": url },
        "author": {
          "@type": "Person",
          "@id": `${BASE_URL}/#/schema/person/${post.author?._id || "trinity-technical-team"}`,
          "name": authorInfo.name,
          "jobTitle": authorInfo.role
        },
        "headline": post.title,
        "description": post.excerpt || post.title,
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "mainEntityOfPage": { "@id": url },
        "wordCount": wordCount,
        "publisher": {
          "@type": "Organization",
          "name": "Trinity Pump & Supply",
          "url": BASE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/logo.png`
          }
        },
        "image": {
          "@type": "ImageObject",
          "@id": `${url}#primaryimage`,
          "url": featuredImage
        },
        "keywords": post.tags?.map((t: any) => t.name).join(", "),
        "inLanguage": "en-US"
      }
    ]
  };

  // 6. Automated Table of Contents Logic
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let processedContent = rawHtmlContent;

  const headingRegex = /<(h[123])\b[^>]*>(.*?)<\/h[123]>/gi;
  let match;
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  while ((match = headingRegex.exec(rawHtmlContent)) !== null) {
    const tag = match[1].toLowerCase();
    const cleanText = match[2].replace(/<[^>]*>/g, "").trim();
    if (!cleanText || cleanText.length < 2) continue;
    if (/FAQ|Frequently Asked|Common Questions/i.test(cleanText)) continue;

    const id = slugify(cleanText) || `section-${tableOfContents.length + 1}`;
    const level = parseInt(tag[1]);

    tableOfContents.push({ id, text: cleanText, level });

    const originalTag = match[0];
    const newTag = `<${tag} id="${id}" class="scroll-mt-32 font-display ${
      level <= 2
        ? "text-2xl sm:text-3xl mt-12 mb-4 font-bold text-dark border-b border-border-light pb-3"
        : "text-xl sm:text-2xl mt-8 mb-3 font-semibold text-dark"
    } leading-snug">${match[2]}</${tag}>`;
    processedContent = processedContent.replace(originalTag, newTag);
  }

  // Convert any markdown links [Text](url) to HTML anchors
  processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match: string, label: string, url: string) => {
    const target = url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}" class="text-gold-dark font-semibold underline decoration-gold/40 hover:text-gold transition-colors"${target}>${label}</a>`;
  });

  processedContent = cleanMojibake(makeLinksDoFollow(processedContent));

  return (
    <article className="w-full bg-off-white text-body selection:bg-gold selection:text-dark transition-colors duration-300 pb-24 relative overflow-x-clip">
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <ReadingProgress />

      {/* ════════════════════════════════════════════════════════
         1. HERO — Featured image as full-bleed background
         ════════════════════════════════════════════════════════ */}
      <section className="relative bg-dark min-h-[52vh] flex items-end pt-[140px] pb-14 border-b border-border-dark overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src={featuredImage}
            alt={post.title}
            className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/20 to-dark" />
        </div>

        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="site-container relative z-10 w-full text-left">
          {/* Breadcrumb pill */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/60 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg"
            >
              <Link href="/" className="hover:text-gold transition-colors text-white/80">
                Home
              </Link>
              <span className="text-gold/50">/</span>
              <Link href="/blogs/" className="hover:text-gold transition-colors text-white/80">
                Blogs
              </Link>
              <span className="text-gold/50">/</span>
              <span className="text-gold font-medium">{categoryBadge}</span>
            </nav>
          </div>

          <div className="max-w-[800px]">
            <h1 className="font-display font-medium text-[30px] min-[400px]:text-[38px] md:text-[50px] lg:text-[56px] text-white leading-[1.12] mb-6 tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gold text-dark shadow-md shadow-gold/20">
                <Star className="w-3 h-3 fill-current" />
                {categoryBadge}
              </span>

              <span className="inline-flex items-center gap-1.5 text-white/70 font-mono font-medium">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                {formattedDate}
              </span>

              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-gold">
                <Clock className="w-3.5 h-3.5" />
                {readTimeDisplay}
              </span>

              <span className="inline-flex items-center gap-1.5 text-white/70 font-mono font-medium">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                {post.location || "Odessa, TX"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         2. MAIN CONTENT WITH STICKY SIDEBAR
         ════════════════════════════════════════════════════════ */}
      <div className="site-container mt-12 sm:mt-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left: Article Content */}
          <div className="lg:w-[65%] min-w-0 w-full">
            {/* Back to all articles link */}
            <div className="mb-8">
              <Link
                href="/blogs/"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-dark/60 hover:text-gold-dark transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
              </Link>
            </div>

            {/* Main Content Body */}
            <div
              className="prose max-w-none
              prose-headings:font-display prose-headings:font-semibold prose-headings:text-dark
              prose-p:text-dark/75 prose-p:leading-[1.8] prose-p:text-base sm:prose-p:text-lg prose-p:font-light
              prose-a:text-gold-dark prose-a:font-semibold prose-a:underline prose-a:decoration-gold/40 hover:prose-a:text-gold transition-colors
              [&_a]:!text-gold-dark [&_a]:underline [&_a]:decoration-gold/40 hover:[&_a]:!text-gold
              [&_a_*]:!text-inherit [&_a_b]:!text-inherit [&_a_strong]:!text-inherit [&_a_span]:!text-inherit
              [&_b_a]:!text-gold-dark [&_strong_a]:!text-gold-dark
              prose-img:rounded-2xl md:prose-img:rounded-3xl prose-img:my-8 prose-img:shadow-lg prose-img:border prose-img:border-border-light
              prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-gold/5 prose-blockquote:p-6 md:prose-blockquote:p-8 prose-blockquote:rounded-2xl prose-blockquote:text-dark/80 prose-blockquote:not-italic
              prose-ul:text-dark/75 prose-ul:my-4 prose-li:my-1.5 prose-li:text-[15px]
              prose-table:w-full prose-table:border-collapse prose-table:my-6
              prose-th:bg-dark/[0.04] prose-th:text-dark prose-th:p-3 prose-th:border prose-th:border-border-light prose-th:text-left prose-th:text-[13px]
              prose-td:p-3 prose-td:border prose-td:border-border-light prose-td:text-dark/70 prose-td:text-[13px]
              prose-strong:text-dark prose-strong:font-bold"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Tags (if any) */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-border-light flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-dark/40 mr-2">Tags:</span>
                {post.tags.map((t: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-white border border-border-light text-dark/70"
                  >
                    #{typeof t === 'string' ? t : t.name}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* Right: Sticky Sidebar */}
          <aside className="lg:w-[35%] shrink-0 lg:sticky lg:top-28 w-full">
            <div className="space-y-6 md:space-y-8">

              {/* Table of Contents Box */}
              <div className="bg-white border border-border-light rounded-[28px] p-6 sm:p-8 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center shrink-0 shadow-sm">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-dark">
                      Navigation
                    </h3>
                    <p className="text-[9px] text-gold-dark uppercase tracking-widest mt-0.5">
                      Quick Select
                    </p>
                  </div>
                </div>

                {tableOfContents.length > 0 ? (
                  <nav className="space-y-1.5 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {tableOfContents.map((item, idx) => (
                      <a
                        key={idx}
                        href={`#${item.id}`}
                        className={`flex items-center gap-3.5 py-2 px-3 rounded-xl transition-all duration-300 group ${
                          item.level <= 2
                            ? "text-dark font-bold hover:bg-gold/10 hover:text-gold-dark bg-dark/[0.03]"
                            : "pl-7 text-dark/50 hover:text-gold-dark hover:bg-dark/[0.02]"
                        }`}
                      >
                        <div
                          className={`shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
                            item.level <= 2
                              ? "bg-gold scale-100 shadow-[0_0_8px_rgba(200,154,69,0.5)]"
                              : "bg-dark/20 scale-75 group-hover:bg-gold group-hover:scale-100"
                          }`}
                        />
                        <span className="text-xs sm:text-sm font-semibold line-clamp-1 flex-1">
                          {item.text}
                        </span>
                      </a>
                    ))}
                  </nav>
                ) : (
                  <div className="py-2 space-y-2">
                    <p className="text-xs text-dark/40 italic">
                      Technical guide outlined above.
                    </p>
                  </div>
                )}

                {/* Article Impact / Quick Stats */}
                <div className="mt-6 pt-6 border-t border-border-light">
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-dark/40 mb-3">
                    Article Impact
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-off-white p-3.5 rounded-2xl border border-border-light text-left">
                      <p className="text-[9px] font-mono font-bold text-dark/40 uppercase tracking-wider">Words</p>
                      <p className="text-lg font-mono font-bold text-gold-dark mt-0.5">{wordCount}</p>
                    </div>
                    <div className="bg-off-white p-3.5 rounded-2xl border border-border-light text-left">
                      <p className="text-[9px] font-mono font-bold text-dark/40 uppercase tracking-wider">Read Time</p>
                      <p className="text-lg font-mono font-bold text-gold-dark mt-0.5">{readTimeDisplay}</p>
                    </div>
                  </div>
                </div>

                {/* Engage / Share */}
                <div className="mt-6 pt-6 border-t border-border-light">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-dark/40 mb-3">
                    Share Article
                  </p>
                  <ShareButton title={post.title} url={post.slug} />
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
         3. INLINE FAQS (IF ATTACHED TO POST)
         ════════════════════════════════════════════════════════ */}
      {((post.faq && post.faq.length > 0) || (post.faqSchemaMarkup && post.faqSchemaMarkup.trim())) && (
        <div className="site-container mt-16 pt-8 border-t border-border-light">
          <PageInlineFaqs
            faqs={post.faq}
            faqSchemaMarkup={post.faqSchemaMarkup}
            badge={post.faqBadge || "TECHNICAL FAQ"}
            title={post.faqTitle || "Frequently Asked Questions"}
            subtitle={post.faqDescription || "Key specifications, equipment diagnostics, and maintenance queries answered."}
          />
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
         4. RELATED ARTICLES
         ════════════════════════════════════════════════════════ */}
      {relatedPosts.length > 0 && (
        <section className="site-container my-20 pt-12 border-t border-border-light">
          <div className="text-left mb-8 flex items-center gap-3">
            <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
            <div>
              <p className="section-label text-gold-dark mb-1">{relatedSection.eyebrow}</p>
              <h2 className="display-heading text-2xl sm:text-3xl font-bold text-dark">
                {relatedSection.title}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <BlogCard
                key={rPost.id}
                href={`/blogs/${rPost.slug}/`}
                image={rPost.image}
                imageAlt={rPost.title}
                category={rPost.badge}
                title={rPost.title}
                date={rPost.date}
                readTime={rPost.readTime}
                ctaText="Read Article"
              />
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
         5. CTA BANNER
         ════════════════════════════════════════════════════════ */}
      <div className="-mt-4 md:-mt-6 relative">
        <CtaBanner overrideData={ctaBannerData} />
      </div>

      {/* ════════════════════════════════════════════════════════
         6. CONTACT FORM + FAQ
         ════════════════════════════════════════════════════════ */}
      <QAForm pageData={pageDataForForm} />
    </article>
  );
}
