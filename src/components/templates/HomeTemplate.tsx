"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

const Leadership = dynamic(() => import("@/components/Leadership"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const HowWeWork = dynamic(() => import("@/components/HowWeWork"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"), { ssr: false });
const CtaBanner = dynamic(() => import("@/components/CtaBanner"), { ssr: false });
const IndustriesSection = dynamic(() => import("@/components/IndustriesSection"), { ssr: false });

import { useContent } from "@/hooks/useContent";
import StatsBar from "@/components/StatsBar";

export default function HomeTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  const { allBlogs, blogSection } = useContent();
  const isBlogSectionHidden = Boolean(pageData?.content?.blogSection?.hidden ?? blogSection?.hidden);

  return (
    <div className="relative">
      <Hero />
      <StatsBar />

      <Services />
      <section id="industries">
        <IndustriesSection />
      </section>
      <section id="about">
        <Leadership />
      </section>

      <section id="why-choose-us">
        <WhyChooseUs />
      </section>

      <HowWeWork />
      <Testimonials />

      {!isBlogSectionHidden && (
        <BlogSection
          title={pageData?.content?.blogSection?.title || blogSection?.title}
          subtitle={pageData?.content?.blogSection?.subtitle || blogSection?.subtitle}
          ctaAll={pageData?.content?.blogSection?.ctaAll || blogSection?.ctaAll}
          ctaReadMore={pageData?.content?.blogSection?.ctaReadMore || blogSection?.ctaReadMore}
          viewAllLink={pageData?.content?.blogSection?.viewAllLink || blogSection?.viewAllLink || "/blogs/"}
          posts={(() => {
            const selected = pageData?.content?.blogSection?.selectedPosts || blogSection?.selectedPosts || [];
            const filtered = Array.isArray(selected) && selected.length > 0
              ? allBlogs.filter((p: any) => selected.map(String).includes(String(p._id)))
              : [];
            // Home carousel shows the latest 12 posts; the full list lives at /blogs/
            return filtered.length > 0 ? filtered : allBlogs.slice(0, 12);
          })()}
        />
      )}

      <CtaBanner />
      <section id="contact">
        <QAForm pageData={pageData} />
      </section>
    </div>
  );
}

