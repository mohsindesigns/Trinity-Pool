"use client";

import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import ServicesIndexGrid from '@/components/sections/ServicesIndexGrid';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import ContactFaqSection from '@/components/sections/ContactFaqSection';
import CtaBanner from '@/components/sections/CtaBanner';

export default function ServicesTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  return (
    <main>
      <ServicesHeroSection />
      <ServicesIndexGrid />
      <WhyChooseUsSection />
      <CtaBanner />
      <ContactFaqSection />
    </main>
  );
}
