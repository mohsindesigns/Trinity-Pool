"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Calendar, Clock, ArrowRight, BookOpen, Star, Sparkles } from "lucide-react";
import BlogCard from "@/components/templates/BlogCard";
import { normalizeBlogImage } from "@/lib/blogImage";

interface BlogPostItem {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  excerpt?: string;
  content?: string;
  publishedAt?: string;
  createdAt?: string;
  date?: string;
  author?: any;
  category?: string;
  categories?: any[];
  tags?: any[];
  location?: string;
}

interface BlogsClientListProps {
  initialPosts: BlogPostItem[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  ctaReadMore?: string;
}

export default function BlogsClientList({
  initialPosts = [],
  emptyStateTitle = "No articles found",
  emptyStateDescription = "Try adjusting your search terms or category filter to find what you're looking for.",
  ctaReadMore = "Read Article",
}: BlogsClientListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique category names
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((post) => {
      if (post.category && typeof post.category === "string" && post.category.trim()) {
        set.add(post.category.trim());
      }
      if (Array.isArray(post.categories)) {
        post.categories.forEach((c: any) => {
          const name = typeof c === "string" ? c : c?.name;
          if (name && typeof name === "string" && name.trim()) {
            set.add(name.trim());
          }
        });
      }
    });
    return ["all", ...Array.from(set)];
  }, [initialPosts]);

  // Filter posts based on query and selected category
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialPosts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const excerpt = (post.excerpt || "").toLowerCase();
      const rawContent = (post.content || "").replace(/<[^>]*>/g, "").toLowerCase();

      // Category matching
      let postCats: string[] = [];
      if (post.category) postCats.push(post.category.toLowerCase());
      if (Array.isArray(post.categories)) {
        post.categories.forEach((c: any) => {
          const name = typeof c === "string" ? c : c?.name;
          if (name) postCats.push(name.toLowerCase());
        });
      }

      const matchesCategory =
        selectedCategory === "all" || postCats.some((c) => c.includes(selectedCategory.toLowerCase()));

      const matchesSearch =
        !query ||
        title.includes(query) ||
        excerpt.includes(query) ||
        rawContent.includes(query) ||
        postCats.some((c) => c.includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  const hasFilterActive = searchQuery.trim().length > 0 || selectedCategory !== "all";

  // When no filters are active and we have >= 3 posts, highlight the first as Featured
  const isDefaultView = !hasFilterActive && initialPosts.length >= 2;
  const featuredPost = isDefaultView ? filteredPosts[0] : null;
  const gridPosts = isDefaultView ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="space-y-12">
      {/* ── Search & Category Filter Bar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-white border border-border-light shadow-[0_2px_12px_rgba(7,27,28,0.04)]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar flex-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const label = cat === "all" ? "All Articles" : cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-gold text-dark shadow-md shadow-gold/25 scale-[1.02]"
                    : "bg-off-white/70 text-dark/70 hover:bg-gold/10 hover:text-dark border border-border-light/60"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search field guides..."
            className="w-full bg-off-white/70 border border-border-light/80 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-dark placeholder:text-dark/40 outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-dark/10 text-dark/40 hover:text-dark transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Active Filter / Results Counter ── */}
      <div className="flex items-center justify-between text-xs font-mono text-dark/50 px-1 -mt-6">
        <span>
          Showing <strong className="text-dark">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? "article" : "articles"}
        </span>
        {hasFilterActive && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-gold-dark hover:text-gold hover:underline font-semibold"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Featured Article Spotlight Card (when default view) ── */}
      {featuredPost && (
        <div className="relative group bg-white rounded-3xl border border-border-light overflow-hidden shadow-[0_4px_20px_rgba(7,27,28,0.06)] hover:shadow-[0_24px_48px_-16px_rgba(200,154,69,0.35)] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Image Box */}
            <div className="lg:col-span-7 relative h-[260px] sm:h-[340px] lg:h-[420px] w-full overflow-hidden bg-warm-cream">
              <Image
                src={featuredPost.featuredImage ? normalizeBlogImage(featuredPost.featuredImage) : "/images/trinity/blog-pump.jpg"}
                alt={featuredPost.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gold text-dark shadow-md">
                  <Sparkles className="w-3 h-3 fill-current" /> Featured Article
                </span>
                {featuredPost.category && (
                  <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-dark/80 text-white backdrop-blur-md">
                    {featuredPost.category}
                  </span>
                )}
              </div>
            </div>

            {/* Content Box */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs font-mono text-dark/50 mb-3">
                {featuredPost.publishedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  5 min read
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-dark leading-snug mb-4 group-hover:text-gold-dark transition-colors line-clamp-2">
                <Link href={`/blogs/${featuredPost.slug}/`}>{featuredPost.title}</Link>
              </h2>

              <p className="text-dark/65 text-sm sm:text-[15px] leading-relaxed line-clamp-3 mb-6 font-light">
                {(featuredPost.excerpt || featuredPost.content || "").replace(/<[^>]*>/g, "").substring(0, 180).trim()}...
              </p>

              <div>
                <Link
                  href={`/blogs/${featuredPost.slug}/`}
                  className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Read Featured Guide <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Articles Grid ── */}
      {gridPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gridPosts.map((post) => {
            const tag =
              post.category ||
              (post.categories && post.categories[0]?.name) ||
              "Field Insight";

            const rawExcerpt = post.excerpt || post.content || "";
            const cleanExcerpt = rawExcerpt.replace(/<[^>]*>/g, "").substring(0, 140).trim() + "...";

            let postDate = "";
            const rawDate = post.publishedAt || post.date || post.createdAt;
            if (rawDate) {
              const d = new Date(rawDate);
              if (!Number.isNaN(d.getTime())) {
                postDate = d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }
            }

            const words = (post.content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
            const readTime = `${Math.max(3, Math.ceil(words / 200))} min read`;

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
                readTime={readTime}
                ctaText={ctaReadMore}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-border-light max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-dark font-display">{emptyStateTitle}</h3>
          <p className="text-dark/60 text-sm mt-2 max-w-md mx-auto">{emptyStateDescription}</p>
          {hasFilterActive && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold text-dark text-xs font-mono font-bold uppercase tracking-wider shadow-sm hover:bg-gold-hover transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
