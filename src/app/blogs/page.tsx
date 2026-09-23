import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Link from 'next/link';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import { getRobotsMetadata } from "@/lib/seo";
import { mergePageContent } from '@/lib/deepMerge';
import StatsBar from '@/components/StatsBar';
import BlogsClientList from '@/components/blog/BlogsClientList';
import CtaBanner from '@/components/CtaBanner';
import QAForm from '@/components/QAForm';
import { generateSchema } from '@/lib/schema-generator';

export const revalidate = 60; // Cache for 1 minute

const DEFAULT_CTA_BANNER = {
  label: "NEED PARTS OR REPAIR?",
  title: "Talk to Our Odessa Shop About Your Well.",
  description: "From sucker rods to downhole rod pump tracking, our West Texas team is ready to help — call or send us the details of your job.",
  button: "Get a Quote",
  buttonUrl: "/contact-us/",
};

const DEFAULT_STATS = [
  { value: "150+", label: "Years Combined Experience", icon: "Award" },
  { value: "Odessa, TX", label: "Permian Basin Shop", icon: "MapPin" },
  { value: "100% USA", label: "Built Pump Parts", icon: "ShieldCheck" },
  { value: "24/7", label: "On-Call Field Support", icon: "Headphones" },
];

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

  const metaTitle = seo.metaTitle || pageDoc?.title || "Our Field Journal & Technical Guides | Trinity Pump & Supply";
  const metaDescription = seo.metaDescription || blogData?.hero?.description || "Explore practical guidance, technical guides, and artificial lift maintenance tips from the Odessa team at Trinity Pump & Supply.";

  return {
    title: {
      absolute: metaTitle
    },
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.ogTitle || metaTitle,
      description: seo.ogDescription || metaDescription,
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
      title: seo.twitterTitle || seo.ogTitle || metaTitle,
      description: seo.twitterDescription || seo.ogDescription || metaDescription,
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage || `${BASE_URL}/logo.png`].filter(Boolean) as string[],
      site: "@trinitypumpsupply",
      creator: "@trinitypumpsupply",
    },
    robots: getRobotsMetadata(settings, seo)
  };
}

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

  const label = blogsPage.label || blogsPage.header?.badge || "FIELD INSIGHTS & TECHNICAL GUIDES";
  const titleLine1 = blogsPage.titleLine1 || blogsPage.header?.titlePrefix || "Our";
  const titleLine2 = blogsPage.titleLine2 || blogsPage.header?.titleHighlight || "Field Journal.";
  const description = blogsPage.description || blogsPage.header?.description || "Practical guidance on downhole rod pumps, sucker rods, artificial lift equipment, and teardown diagnostics from Trinity Pump & Supply in Odessa, Texas.";
  const ctaReadMore = blogsPage.ctaReadMore || "Read Article";
  const emptyStateTitle = blogsPage.emptyStateTitle || "No articles found";
  const emptyStateDescription = blogsPage.emptyStateDescription || "Check back soon for new field guides, pump maintenance tips, and equipment updates.";
  const heroImage = blogsPage.header?.image || "/images/trinity/about.jpg";
  const heroImageAlt = blogsPage.header?.imageAlt || "Trinity Pump & Supply Odessa facility";

  // Independent CTA banner content
  const ctaBannerData = blogsPage.ctaBanner && Object.keys(blogsPage.ctaBanner).length > 0 ? blogsPage.ctaBanner : DEFAULT_CTA_BANNER;
  const pageDataForForm = pageDoc ? JSON.parse(JSON.stringify(pageDoc)) : null;

  // Filter posts based on selected posts list if configured in CMS
  let posts = allPosts;
  if (Array.isArray(blogsPage.selectedPosts) && blogsPage.selectedPosts.length > 0) {
    const selected = blogsPage.selectedPosts
      .map((id: string) => allPosts.find((p: any) => String(p._id) === String(id)))
      .filter(Boolean);
    if (selected.length > 0) {
      posts = selected;
    }
  }

  const seo = {
    ...(globalBlogsPage?.seo || {}),
    ...(pageDoc?.seo || {})
  };

  const schema = generateSchema({
    title: seo.metaTitle || pageDoc?.title || "Our Field Journal & Technical Guides | Trinity Pump & Supply",
    description: seo.metaDescription || description,
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
         1. HERO SECTION — Matches About & Home templates
         ════════════════════════════════════════════════════════ */}
      <section className="relative bg-dark min-h-[58vh] flex items-center pt-[130px] pb-14 border-b border-border-dark overflow-hidden">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
        </div>

        {/* Ambient gold glow blob */}
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
              <span className="text-gold font-medium">Blogs</span>
            </nav>
          </div>

          <div className="max-w-[720px]">
            {/* Section label with gold dash */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
              <p className="section-label text-gold">{label}</p>
            </div>

            {/* Display Heading */}
            <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[70px] text-white leading-[1.08] mb-6 tracking-tight">
              {titleLine1}{' '}
              <span className="text-gold font-medium block sm:inline">{titleLine2}</span>
            </h1>

            {/* Subtitle description */}
            {description && (
              <div
                className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[580px] mb-2 font-light [&_p]:text-white/80 [&_p]:md:text-white/70 [&_p]:text-[15px] [&_p]:md:text-[17px] [&_p]:leading-[1.8] [&_p]:font-light"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         2. STATS BAR — Signature strip matching Home & About
         ════════════════════════════════════════════════════════ */}
      <StatsBar overrideItems={DEFAULT_STATS} />

      {/* ════════════════════════════════════════════════════════
         3. ARTICLES CATALOG — Interactive client list with
         category filter, search, featured post, and card grid
         ════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-off-white relative overflow-hidden border-b border-border-light/40">
        <div
          className="bg-radial-dots-gold absolute top-0 right-0 w-[480px] h-[480px] opacity-[0.14] pointer-events-none"
          style={{
            WebkitMaskImage: "radial-gradient(circle at top right, black, transparent 70%)",
            maskImage: "radial-gradient(circle at top right, black, transparent 70%)",
          }}
        />

        <div className="site-container relative z-10">
          <BlogsClientList
            initialPosts={JSON.parse(JSON.stringify(posts))}
            emptyStateTitle={emptyStateTitle}
            emptyStateDescription={emptyStateDescription}
            ctaReadMore={ctaReadMore}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         4. CTA BANNER — Matches Home & About layout
         ════════════════════════════════════════════════════════ */}
      <div className="-mt-10 md:-mt-16 relative">
        <CtaBanner overrideData={ctaBannerData} />
      </div>

      {/* ════════════════════════════════════════════════════════
         5. CONTACT FORM + FAQ — Sitewide standard component
         ════════════════════════════════════════════════════════ */}
      <QAForm pageData={pageDataForForm} />
    </main>
  );
}
