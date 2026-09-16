import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';

export const revalidate = 60; // Cache for 1 minute

import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import { getRobotsMetadata } from "@/lib/seo";
import { normalizeBlogImage } from '@/lib/blogImage';
import { mergePageContent } from '@/lib/deepMerge';
import BlogCard from '@/components/templates/BlogCard';
import CtaBanner from '@/components/CtaBanner';
import QAForm from '@/components/QAForm';

const DEFAULT_CTA_BANNER = {
  label: "NEED PARTS OR SERVICE?",
  title: "Talk to Our Team About Your Well.",
  description: "From sucker rods to rod pump tracking, our Odessa shop is ready to help — call or send us the details of your job.",
  button: "Get a Quote",
  buttonUrl: "/contact-us/",
};

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const [content, pageDoc] = await Promise.all([
    SiteContent.findOne({ key: 'complete_data' }).lean() as any,
    Page.findOne({ $or: [{ slug: 'blogs' }, { slug: 'blog' }] }).lean() as any
  ]);

  const settings = content?.data?.settings;
  const blogData = content?.data?.blogsPage || content?.data?.blogPage || {};
  const seo = {
    ...(blogData?.seo || {}),
    ...(pageDoc?.seo || {})
  };
  const pageUrl = `${BASE_URL}/blogs/`;

  const publishedTime = (pageDoc?.publishedAt || pageDoc?.createdAt ? new Date(pageDoc.publishedAt || pageDoc.createdAt) : new Date("2025-02-07T15:28:30Z")).toISOString();
  const modifiedTime = (pageDoc?.updatedAt || pageDoc?.publishedAt || pageDoc?.createdAt ? new Date(pageDoc.updatedAt || pageDoc.publishedAt || pageDoc.createdAt) : new Date("2026-07-24T16:08:21Z")).toISOString();

  let canonicalUrl = seo.canonicalUrl || pageUrl;
  if (canonicalUrl.endsWith('/blog/') || canonicalUrl.endsWith('/blog')) {
    canonicalUrl = pageUrl;
  }

  return {
    title: {
      absolute: seo.metaTitle || pageDoc?.title || "Our Blogs | Trinity Pump & Supply"
    },
    description: seo.metaDescription || blogData?.hero?.description || "Explore our latest articles, insights, and clinical recovery tips.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || pageDoc?.title || "Our Blogs | Trinity Pump & Supply",
      description: seo.ogDescription || seo.metaDescription || blogData?.hero?.description || "Explore our latest articles, insights, and clinical recovery tips.",
      url: pageUrl,
      type: 'website',
      images: seo.featuredImage ? [{ url: seo.featuredImage }] : [`${BASE_URL}/logo.png`],
    },
    other: {
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || "Our Blogs | Trinity Pump & Supply",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || "Explore our latest articles, insights, and clinical recovery tips.",
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage || `${BASE_URL}/logo.png`].filter(Boolean) as string[],
      site: "@trinitypumpsupply",
      creator: "@trinitypumpsupply",
    },
    robots: getRobotsMetadata(settings, seo)
  };
}

import { generateSchema } from '@/lib/schema-generator';

export default async function BlogsIndexPage() {
  await connectToDatabase();

  const [allPosts, pageDoc, content] = await Promise.all([
    Post.find({ status: 'published', isTrashed: { $ne: true } })
      .populate('categories author')
      .sort({ publishedAt: -1, date: -1 })
      .lean(),
    Page.findOne({ $or: [{ slug: 'blogs' }, { slug: 'blog' }] }).lean() as any,
    SiteContent.findOne({ key: 'complete_data' }).lean() as any
  ]);

  const globalBlogsPage = content?.data?.blogsPage || content?.data?.blogPage || {};
  const blogsPage = mergePageContent(globalBlogsPage, pageDoc?.content || {});

  const label = blogsPage.label || blogsPage.header?.badge || "Recovery Insights";
  const titleLine1 = blogsPage.titleLine1 || blogsPage.header?.titlePrefix || "Our";
  const titleLine2 = blogsPage.titleLine2 || blogsPage.header?.titleHighlight || "Journal.";
  const description = blogsPage.description || blogsPage.header?.description || "Explore our latest articles, insights, and clinical tips on deep tissue therapy, mobility, and athletic recovery.";
  const ctaReadMore = blogsPage.ctaReadMore || "Read More";
  const emptyStateTitle = blogsPage.emptyStateTitle || "No posts yet";
  const emptyStateDescription = blogsPage.emptyStateDescription || "Check back later for new updates.";
  const heroImage = blogsPage.header?.image || "/images/trinity/about.jpg";
  const heroImageAlt = blogsPage.header?.imageAlt || "Trinity Pump & Supply";

  // CTA banner gets its own independent content here (never the shared homepage
  // useContent() data), so editing this page can never change what shows on
  // the homepage or vice versa.
  const ctaBannerData = blogsPage.ctaBanner && Object.keys(blogsPage.ctaBanner).length > 0 ? blogsPage.ctaBanner : DEFAULT_CTA_BANNER;
  const pageDataForForm = pageDoc ? JSON.parse(JSON.stringify(pageDoc)) : null;

  // Filter posts based on selected posts list, keeping custom selection order
  let posts = allPosts;
  if (Array.isArray(blogsPage.selectedPosts) && blogsPage.selectedPosts.length > 0) {
    posts = blogsPage.selectedPosts
      .map((id: string) => allPosts.find((p: any) => String(p._id) === String(id)))
      .filter(Boolean);
  }

  const seo = {
    ...(globalBlogsPage?.seo || {}),
    ...(pageDoc?.seo || {})
  };

  const schema = generateSchema({
    title: seo.metaTitle || pageDoc?.title || "Our Blogs | Trinity Pump & Supply",
    description: seo.metaDescription || description || "Explore our latest articles, insights, and clinical recovery tips.",
    slug: "blogs",
    type: "CollectionPage",
    breadcrumbTitle: "Blogs",
    datePublished: (pageDoc?.publishedAt || pageDoc?.createdAt ? new Date(pageDoc.publishedAt || pageDoc.createdAt) : new Date("2025-02-07T15:28:30Z")).toISOString(),
    dateModified: (pageDoc?.updatedAt || pageDoc?.publishedAt || pageDoc?.createdAt ? new Date(pageDoc.updatedAt || pageDoc.publishedAt || pageDoc.createdAt) : new Date("2026-07-24T16:08:21Z")).toISOString()
  });

  return (
    <main className="w-full bg-off-white text-body overflow-hidden">
      <script
        id="blogs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ════════════════════════════════════════════════════════
         HERO
         ════════════════════════════════════════════════════════ */}
      <section className="relative bg-dark min-h-[55vh] flex items-center pt-[130px] pb-14 border-b border-border-dark overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
        </div>

        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="site-container relative z-10 w-full text-left">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/60 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg"
            >
              <Link href="/" className="hover:text-gold transition-colors text-white/80">
                Home
              </Link>
              <span className="text-gold/50">/</span>
              <span className="text-gold font-medium">Blog</span>
            </nav>
          </div>

          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
              <p className="section-label text-gold">{label}</p>
            </div>

            <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[68px] text-white leading-[1.08] mb-6 tracking-tight">
              {titleLine1} <span className="text-gold italic font-light">{titleLine2}</span>
            </h1>

            {description && (
              <div
                className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-2 font-light [&_p]:text-white/80 [&_p]:md:text-white/70 [&_p]:text-[15px] [&_p]:md:text-[17px] [&_p]:leading-[1.8] [&_p]:font-light"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         ARTICLES GRID
         ════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-white relative overflow-hidden border-b border-border-light/40">
        <div
          className="bg-radial-dots-gold absolute top-0 right-0 w-[480px] h-[480px] opacity-[0.14] pointer-events-none"
          style={{
            WebkitMaskImage: "radial-gradient(circle at top right, black, transparent 70%)",
            maskImage: "radial-gradient(circle at top right, black, transparent 70%)",
          }}
        />

        <div className="site-container relative z-10">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const tag =
                  post.category ||
                  (post.categories && post.categories[0]?.name) ||
                  "";

                const rawExcerpt = post.excerpt || post.content || "";
                const cleanExcerpt = rawExcerpt.replace(/<[^>]*>/g, '').substring(0, 140).trim() + "...";

                let postDate = "";
                const rawDate = post.publishedAt || post.date || (post as any).createdAt;
                if (rawDate) {
                  const d = new Date(rawDate);
                  if (!Number.isNaN(d.getTime())) {
                    postDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  }
                }

                return (
                  <BlogCard
                    key={String(post._id)}
                    href={`/blogs/${post.slug}/`}
                    image={post.featuredImage ? normalizeBlogImage(post.featuredImage) : "/images/trinity/process-4.jpg"}
                    imageAlt={post.title}
                    category={tag}
                    title={post.title}
                    excerpt={cleanExcerpt}
                    date={postDate}
                    ctaText={ctaReadMore}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-off-white rounded-2xl border border-border-light">
              <BookOpen className="w-10 h-10 text-dark/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark">{emptyStateTitle}</h3>
              <p className="text-dark/40 text-sm mt-2">{emptyStateDescription}</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         CTA — reuses the homepage's component for visual consistency,
         with this page's own independent content.
         ════════════════════════════════════════════════════════ */}
      <div className="-mt-10 md:-mt-16 relative">
        <CtaBanner overrideData={ctaBannerData} />
      </div>

      {/* ════════════════════════════════════════════════════════
         CONTACT FORM + FAQ — shared sitewide, same as every other page.
         ════════════════════════════════════════════════════════ */}
      <QAForm pageData={pageDataForForm} />
    </main>
  );
}
