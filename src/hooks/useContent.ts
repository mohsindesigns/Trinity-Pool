import { useContentContext } from "../context/ContentContext";
import { cleanMojibake } from "../lib/utils";

function sanitizeEncoding(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return cleanMojibake(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeEncoding(item));
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      res[key] = sanitizeEncoding(obj[key]);
    }
    return res;
  }
  return obj;
}

function proxyAllUrls(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.includes("https://res.cloudinary.com/dytytwyp6/image/upload/")) {
      return obj.replace(/https:\/\/res\.cloudinary\.com\/dytytwyp6\/image\/upload\//g, "/cdn-images/");
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => proxyAllUrls(item));
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      res[key] = proxyAllUrls(obj[key]);
    }
    return res;
  }
  return obj;
}

export const useContent = () => {
    const rawData = useContentContext();
    const completeData = sanitizeEncoding(proxyAllUrls(rawData));

    // Deep fallback helper to prevent undefined.property crashes
    const getSafe = (data: any, key: string, fallback: any = {}) => {
        return data?.[key] || fallback;
    };

    const contactPage = getSafe(completeData, 'contactPage', { info: {} });
    const info = contactPage?.info || {};

    const footer = getSafe(completeData, 'footer');
    const footerServices = getSafe(footer, 'services', { title: "Our Services", materials: { title: "Premium Materials", items: [] } });
    const footerContact = getSafe(footer, 'contact', { title: "Contact Us", email: "", phone: "", address: "", emergency: "", areas: "" });
    
    footerContact.email = footerContact.email || info.email || footer?.email || "";
    footerContact.phone = footerContact.phone || info.phone || footer?.phone || "";
    footerContact.address = footerContact.address || info.address || footer?.address || "";
    footerContact.hours = footerContact.hours || info.hours || footer?.hours || "";

    const footerCompany = getSafe(footer, 'company', { name: "", tagline: "", description: "", logo: "" });
    const footerBottom = getSafe(footer, 'bottom', { copyright: "", rights: "", tagline: "", links: [] });
    const footerMarquee = getSafe(footer, 'marquee', { texts: [], speed: 30, repeats: 8 });
    const footerCertifications = getSafe(footer, 'certifications', []);

    return {
        navbar: (() => {
            const nav = getSafe(completeData, 'navbar', { menu: [], logo: "", cta: { text: "Get Quote", href: "/contact-us" } });
            if (nav) {
                const linksList = (nav.companyLinks || nav.links || nav.menu || []).map((link: any) => {
                    if (link && (link.label === "Services" || link.href === "/services") && link.useMegaMenu === undefined) {
                        return { ...link, useMegaMenu: true };
                    }
                    if (link && (link.href === "/blog" || link.href === "/blog/" || link.label === "Blogs" && (!link.href || link.href === "/blog" || link.href === "/blog/"))) {
                        return { ...link, href: "/blogs/" };
                    }
                    return link;
                });
                nav.companyLinks = linksList;
                nav.links = linksList;
                nav.menu = linksList;
            }
            return nav;
        })(),
        hero: (() => {
            const h = getSafe(completeData, 'hero', { description: "" });
            
            const label = h.label || h.badge || "";
            
            const headlines = h.headlines || [];
            const title1 = h.title1 || headlines[0]?.text || "";
            const title2 = h.title2 || headlines[1]?.text || "";
            
            const buttons = h.buttons || [];
            const ctaBook = h.ctaBook || buttons[0]?.text || "";
            const ctaServices = h.ctaServices || buttons[1]?.text || "";
            
            const stats = h.stats || [];
            const socialProofText = h.socialProofText || (stats.length > 0 ? `${stats[0].value} ${stats[0].label}` : "");
                
            const image = h.image || h.images?.[0] || "";
            const imageAlt = h.imageAlt || h.bgImageAlt || "";
            
            return {
                ...h,
                label,
                title1,
                title2,
                ctaBook,
                ctaServices,
                socialProofText,
                image,
                imageAlt,
                
                // Back-compat for admin editor
                badge: label,
                headlines: [
                    { text: title1, highlight: false },
                    { text: title2, highlight: true }
                ],
                buttons: [
                    { text: ctaBook, href: h.bookingUrl || "/#contact", primary: true, icon: "ArrowRight" },
                    { text: ctaServices, href: "/#services", primary: false, icon: "ArrowRight" }
                ],
                stats: stats.length > 0 ? stats : [],
                images: [image],
                bgImageAlt: imageAlt
            };
        })(),
        about: getSafe(completeData, 'about'),
        stats: (() => {
            const s = getSafe(completeData, 'stats', {});
            const defaultItems = [
                { value: "100+", label: "Oil & Lubricant Products", icon: "Droplets" },
                { value: "50+",  label: "Pump Solutions",           icon: "Gauge"    },
                { value: "20+",  label: "Years of Experience",      icon: "Award"    },
                { value: "500+", label: "Happy Clients",            icon: "Users"    }
            ];
            const items = Array.isArray(s.items) && s.items.length > 0 ? s.items : defaultItems;
            return {
                ...s,
                items
            };
        })(),
        services: (() => {
            const s = getSafe(completeData, 'services', { services: [] });
            const allServices = Array.isArray(s.services) && s.services.length > 0 
                ? s.services 
                : (Array.isArray(s.items) ? s.items : []);

            const formatService = (item: any, i: number) => {
                const title = item.title || item.name || `Service ${i + 1}`;
                const name = item.name || item.title || `Service ${i + 1}`;
                const slug = item.slug || item.id || title.toLowerCase().replace(/\s+/g, '-');
                const description = item.description || item.heroDescription || "";
                const image = item.image || item.featuredImage || "";
                const rawBenefits = item.benefits || item.focusCards || [];
                const benefits = Array.isArray(rawBenefits) && rawBenefits.length > 0 
                    ? rawBenefits 
                    : [];
                return {
                    ...item,
                    id: item.id || String(i + 1).padStart(2, '0'),
                    title,
                    name,
                    slug,
                    description,
                    image,
                    benefits
                };
            };

            const sortAscending = (a: any, b: any) => {
                const numA = parseInt(a.number || a.id || '99', 10);
                const numB = parseInt(b.number || b.id || '99', 10);
                return numA - numB;
            };

            const formattedServices = allServices.map((svc: any, i: number) => formatService(svc, i)).sort(sortAscending);
            // Curated homepage selection (Home editor). When nothing is selected, show every published service.
            const rawItems = Array.isArray(s.items) && s.items.length > 0 ? s.items : formattedServices;
            const formattedItems = rawItems.map((svc: any, i: number) => formatService(svc, i)).sort(sortAscending);

            const label = s.label || s.badge || "Our Services";
            const titleLine1 = s.titleLine1 || s.headline?.prefix || "";
            const titleLine2 = s.titleLine2 || s.headline?.highlight || "";
            const titleLine3 = s.titleLine3 || s.headline?.suffix || "";
            const titleItalicWord = s.titleItalicWord || "";
            
            const ctaAll = s.ctaAll || "VIEW ALL SERVICES";
            const ctaLearnMore = s.ctaLearnMore || "LEARN MORE";

            const rawCategoryLabels = s.categoryLabels || {};
            const categoryLabels = {
                "artificial-lift": rawCategoryLabels["artificial-lift"] || "Artificial Lift",
                "projects-supplies": rawCategoryLabels["projects-supplies"] || "Projects & Supplies",
                "other": rawCategoryLabels["other"] || "More Services",
            };

            return {
                ...s,
                label,
                badge: label,
                titleLine1,
                titleLine2,
                titleLine3,
                titleItalicWord,
                ctaAll,
                ctaLearnMore,
                categoryLabels,
                services: formattedServices,
                items: formattedItems,
                headline: {
                    prefix: titleLine1,
                    highlight: titleLine2,
                    suffix: titleLine3
                }
            };
        })(),
        leadership: (() => {
            const l = getSafe(completeData, 'leadership', {});
            const ceo = l.ceo || {};
            const section = l.section || {};

            const label = l.label || section.badge || "ABOUT US";
            const title = l.title || section.headline || "Your Trusted Partner in Oil & Pump Supply";
            const tagline = l.tagline || (typeof ceo.quotes?.[0] === 'string' ? ceo.quotes[0].replace(/<[^>]*>/g, '').trim() : "");
            const image = l.image || ceo.image?.src || "/images/about-us.jpg";
            const imageAlt = l.imageAlt || ceo.image?.alt || "Oil & Pump Supply Facility";

            const desc1 = l.desc1 || (ceo.description ? ceo.description.split("</p>")[0] + "</p>" : "We are a leading supplier of high-quality oil products, industrial pumps and related equipment, serving diverse industries across the region. With a commitment to quality, reliability and customer satisfaction, we ensure your operations never stop.");
            const desc2 = l.desc2 || (ceo.description && ceo.description.includes("</p>") ? ceo.description.split("</p>").slice(1).join("</p>") : "");

            const photoBadge = l.photoBadge || ceo.badges?.top || "Quality Solutions for a Reliable Tomorrow";
            const photoBadgeTitle = l.photoBadgeTitle || "Quality Solutions";
            const photoBadgeSubtitle = l.photoBadgeSubtitle || "for a Reliable Tomorrow";
            const signatureName = l.signatureName || ceo.name || "";
            const signatureTitle = l.signatureTitle || ceo.title || "";
            const ctaMore = l.ctaMore || "Learn More About Us";
            const ctaLink = l.ctaLink || "/about";

            // Dedicated own stats for About Us / Leadership section
            const stats = Array.isArray(l.stats) && l.stats.length > 0 ? l.stats : [
                { value: "20+",  label: "Years Experience" },
                { value: "100+", label: "Trusted Brands" },
                { value: "500+", label: "Happy Clients" },
                { value: "24/7", label: "Support" }
            ];

            const keyHighlights = getSafe(l, 'keyHighlights', [
                "Certified industrial fluid handling & precision equipment",
                "Direct supplier access with fast, reliable turnaround",
                "Continuous technical support for maximum equipment uptime"
            ]);

            return {
                ...l,
                label,
                title,
                tagline,
                desc1,
                desc2,
                photoBadge,
                photoBadgeTitle,
                photoBadgeSubtitle,
                signatureName,
                signatureTitle,
                image,
                imageAlt,
                ctaMore,
                ctaLink,
                stats,
                keyHighlights,

                // Back-compat for admin editor
                section: {
                    badge: label,
                    headline: title,
                    description: `${desc1}${desc2}`
                },
                ceo: {
                    ...ceo,
                    name: signatureName,
                    title: signatureTitle,
                    quotes: [tagline],
                    description: `${desc1}${desc2}`,
                    badges: {
                        top: photoBadge,
                        bottom: ceo.badges?.bottom || ""
                    },
                    image: {
                        src: image,
                        alt: imageAlt
                    }
                }
            };
        })(),
        portfolio: (() => {
            const p = getSafe(completeData, 'portfolio', {});
            const selectedProjects = Array.isArray(p.projects) ? p.projects : [];

            // If no projects specifically selected for home, use from galleryPage
            if (selectedProjects.length === 0) {
                const galleryProjects = completeData?.galleryPage?.projects || [];
                if (Array.isArray(galleryProjects) && galleryProjects.length > 0) {
                    return {
                        ...p,
                        projects: galleryProjects.slice(0, 8) // Show up to 8 featured
                    };
                }
            }

            return {
                ...p,
                projects: selectedProjects
            };
        })(),
        testimonials: (() => {
            const t = getSafe(completeData, 'testimonials', { items: [], results: [] });
            
            const label = t.label || t.section?.badge || "";
            const title1 = t.title1 || t.section?.headlinePrefix || "";
            const title2 = t.title2 || t.section?.headlineHighlight || "";
            const quoteIcon = t.quoteIcon || "\"";
            const dash = t.dash || "—";
            
            // Map selected reviews to items
            const selectedReviews = t.testimonials || [];
            const mappedReviews = selectedReviews.map((r: any) => ({
                quote: r.text || r.quote || "",
                name: r.name || r.author || "",
                author: r.author || r.name || "",
                role: r.role || r.position || r.title || "",
                avatar: r.avatar || r.image || "",
                stars: r.rating || r.stars || 5
            }));
            const items = mappedReviews.length > 0 ? mappedReviews : (t.items || []);
            const results = t.results || [];

            return {
                ...t,
                label,
                badge: label,
                title1,
                title2,
                quoteIcon,
                dash,
                items,
                results,
                // Preserve every real field the admin editor saves (badge, headline,
                // description, image, ...) and only add the legacy aliases some old
                // code expects on top — never replace the raw section wholesale, or
                // fields like `description` silently vanish on the live page.
                section: {
                    ...(t.section || {}),
                    badge: label,
                    headlinePrefix: title1,
                    headlineHighlight: title2,
                    headlineSuffix: t.section?.headlineSuffix || "",
                    featured: t.section?.featured || "Google Review"
                }
            };
        })(),
        whyChooseUs: (() => {
            const w = getSafe(completeData, 'whyChooseUs', {});
            const sec = w.section || {};
            const badge = w.badge || sec.badge || "WHY CHOOSE US";
            const title = w.title || w.headline || sec.headline || "Why Businesses Trust Us";
            const description = w.description || sec.description || "We go beyond just supplying products — we fuel your operations and success with reliable, high-quality pump & oilfield solutions.";
            const image = w.image || "/images/why-choose-us.jpg";
            const imageAlt = w.imageAlt || "Why Businesses Trust Us";
            const features = (Array.isArray(w.features) && w.features.length > 0)
                ? w.features
                : [
                    { title: "Premium Quality Products", description: "Engineered to withstand harsh operating conditions.", icon: "ShieldCheck" },
                    { title: "Competitive Pricing", description: "Direct supplier rates that protect your bottom line.", icon: "Coins" },
                    { title: "Fast & Reliable Delivery", description: "Rapid turnaround times to minimize costly downtime.", icon: "Truck" },
                    { title: "Expert Technical Support", description: "Dedicated engineers ready to assist with sizing & specs.", icon: "Headphones" },
                    { title: "Wide Product Range", description: "Complete inventory of pumps, parts, and fluid systems.", icon: "Package" },
                    { title: "Customer Satisfaction", description: "Proven track record with regional industrial operators.", icon: "Award" }
                ];
            return {
                ...w,
                badge,
                title,
                headline: title,
                description,
                image,
                imageAlt,
                features,
                section: {
                    badge,
                    headline: title,
                    description
                }
            };
        })(),
        faq: (() => {
            const globalFaq = getSafe(completeData, 'faq', {
                section: { badge: "", headline: "", title: "", description: "" },
                categories: [],
                items: []
            });
            if (Array.isArray(completeData?.faqs) && completeData?.faqs.length > 0) {
                return {
                    ...globalFaq,
                    section: {
                        ...globalFaq.section,
                        badge: completeData.faqBadge || globalFaq.section?.badge || "",
                        headline: completeData.faqTitle || globalFaq.section?.headline || globalFaq.section?.title || "",
                        title: completeData.faqTitle || globalFaq.section?.title || "",
                        description: completeData.faqDescription || globalFaq.section?.description || ""
                    },
                    items: completeData.faqs.map((f: any) => ({
                        question: f.question,
                        answer: f.answer
                    }))
                };
            }
            return globalFaq;
        })(),
        process: (() => {
            const p = getSafe(completeData, 'process', {});
            const label = p.label || "OUR PROCESS";
            const title = p.title || "How We Work";
            const description = p.description || "From initial inquiry to long-term support, our process is designed to be simple, transparent and efficient — so you get the right solutions, exactly when you need them.";
            const phaseLabel = p.phaseLabel || "STEP";
            const items = (Array.isArray(p.items) && p.items.length > 0)
                ? p.items
                : [
                    {
                        title: "Request a Quote",
                        shortDescription: "Tell us what you need and get a quick, competitive quote.",
                        description: "Share your requirements with our team. We'll review your needs and provide a competitive, no-obligation quote — fast and hassle-free.",
                        ctaText: "GET A QUOTE",
                        ctaUrl: "/contact-us/",
                        image: "/images/trinity/process-1.jpg",
                        icon: "FileText"
                    },
                    {
                        title: "Consultation",
                        shortDescription: "We understand your requirements and provide the best solution.",
                        description: "Our expert engineering team assesses your technical specifications, fluid dynamics, and operational requirements to recommend optimal, cost-efficient pump systems.",
                        ctaText: "SCHEDULE CONSULTATION",
                        ctaUrl: "/contact-us/",
                        image: "/images/trinity/process-2.jpg",
                        icon: "MessageSquare"
                    },
                    {
                        title: "Supply & Delivery",
                        shortDescription: "We source, prepare and deliver on time.",
                        description: "Fast-track logistics, certified equipment packaging, and guaranteed on-time site dispatch ensure zero operational downtime for your plant or drilling facility.",
                        ctaText: "TRACK SHIPMENTS",
                        ctaUrl: "/contact-us/",
                        image: "/images/trinity/process-3.jpg",
                        icon: "Truck"
                    },
                    {
                        title: "After-Sales Support",
                        shortDescription: "Ongoing support for maximum uptime.",
                        description: "24/7 technical hotline, rapid OEM spare parts replacement, preventative field diagnostics, and certified technician maintenance for maximum equipment uptime.",
                        ctaText: "GET SUPPORT",
                        ctaUrl: "/contact-us/",
                        image: "/images/trinity/process-4.jpg",
                        icon: "Wrench"
                    }
                ];
            return {
                ...p,
                label,
                title,
                description,
                phaseLabel,
                items
            };
        })(),
        quote: getSafe(completeData, 'quote', {
            section: { badge: "", headline: "", description: "" },
            services: [],
            projectTypes: [],
            timelines: [],
            success: { title: "", message: "", response: "", buttonText: "" }
        }),
        contactFaq: (() => {
            const faqObj = getSafe(completeData, 'faq', { section: { badge: "", headline: "", description: "" }, items: [] });
            const quoteObj = getSafe(completeData, 'quote', { section: { badge: "", headline: "", description: "" }, services: [] });
            
            const faqLabel = faqObj.section?.badge || faqObj.badge || "FAQ";
            const faqTitle = faqObj.section?.headline || faqObj.title || faqObj.section?.title || "Frequently Asked Questions";
            const faqDescription = faqObj.section?.description || faqObj.description || "";
            const faqCtaText = faqObj.section?.ctaText || faqObj.ctaText || "";

            const rawFaqItems = Array.isArray(faqObj.items) && faqObj.items.length > 0
              ? faqObj.items
              : (Array.isArray(completeData?.faqs) ? completeData.faqs : []);

            const formattedFaqs = rawFaqItems.map((f: any) => ({
              q: f.q || f.question || "",
              a: f.a || f.answer || "",
              question: f.question || f.q || "",
              answer: f.answer || f.a || ""
            }));
            
            const formLabel = quoteObj.section?.badge || quoteObj.badge || "GET IN TOUCH";
            const formTitle = quoteObj.section?.headline || quoteObj.title || "Have Questions? Let's Connect.";
            
            const formDescription = quoteObj.section?.description || quoteObj.description || "";
            const formClinicPortal = quoteObj.formClinicPortal || "";
            const formClinicPortalSub = quoteObj.formClinicPortalSub || "";
            const formStyleSeatBtn = quoteObj.formStyleSeatBtn || "";
            const formClinicPortalUrl = quoteObj.formClinicPortalUrl || "";

            const formNameLabel = quoteObj.formNameLabel || "Full Name";
            const formNamePlaceholder = quoteObj.formNamePlaceholder || "Your name";
            const formEmailLabel = quoteObj.formEmailLabel || "Email Address";
            const formEmailPlaceholder = quoteObj.formEmailPlaceholder || "you@company.com";
            const formPhoneLabel = quoteObj.formPhoneLabel || "Phone Number";
            const formPhonePlaceholder = quoteObj.formPhonePlaceholder || "Your phone number";
            const formServiceLabel = quoteObj.formServiceLabel || "Service";
            const formServicePlaceholder = quoteObj.formServicePlaceholder || "Select a service";
            const formMessageLabel = quoteObj.formMessageLabel || "Message";
            const formMessagePlaceholder = quoteObj.formMessagePlaceholder || "Tell us what you need...";

            const formBtnSubmit = quoteObj.formBtnSubmit || "Send Message";
            const formBtnSuccess = quoteObj.formBtnSuccess || "Message Sent";
            const formSuccessToast = quoteObj.formSuccessToast || "Thank you! Your inquiry has been sent. We will reply within 24 hours.";
            
            const trustHipa = quoteObj.trustHipa || "";
            const trustResponse = quoteObj.trustResponse || "";
            
            // Map quote.services to options format { label, value }
            const formServicesOptions = Array.isArray(quoteObj.services) && quoteObj.services.length > 0 
              ? quoteObj.services.map((s: any) => typeof s === 'string' ? { label: s, value: s } : { label: s.label || s.name || "", value: s.value || s.id || "" })
              : [];
                
            return {
                label: formLabel,
                title: formTitle,
                description: "",
                faqLabel,
                faqTitle,
                faqDescription,
                faqCtaText,
                panelPhoneLabel: quoteObj.panelPhoneLabel || "Call us",
                panelEmailLabel: quoteObj.panelEmailLabel || "Email us",
                panelAddressLabel: quoteObj.panelAddressLabel || "Visit us",
                formLabel,
                formTitle,
                formDescription,
                formClinicPortal,
                formClinicPortalSub,
                formStyleSeatBtn,
                formClinicPortalUrl,
                formNameLabel,
                formNamePlaceholder,
                formEmailLabel,
                formEmailPlaceholder,
                formPhoneLabel,
                formPhonePlaceholder,
                formServiceLabel,
                formServicePlaceholder,
                formMessageLabel,
                formMessagePlaceholder,
                formBtnSubmit,
                formBtnSuccess,
                formSuccessToast,
                trustHipa,
                trustResponse,
                formServicesOptions,
                faqs: formattedFaqs
            };
        })(),
        ctaBanner: (() => {
            const cb = getSafe(completeData, 'ctaBanner', {});
            const { email, ...restCb } = cb;
            return {
                ...restCb,
                tagline: restCb.tagline || "",
                title: restCb.title || "",
                description: restCb.description || "",
                button: restCb.button || "",
                buttonUrl: restCb.buttonUrl || restCb.btnUrl || "/contact-us/"
            };
        })(),
        footer: {
            ...footer,
            services: footerServices,
            contact: footerContact,
            company: footerCompany,
            bottom: footerBottom,
            marquee: footerMarquee,
            certifications: footerCertifications,
            newsletter: getSafe(footer, 'newsletter', { placeholder: "Enter your email", buttonText: "Subscribe" })
        },
        team: getSafe(completeData, 'team', {
            section: { badge: "", headline: "", description: "" },
            members: []
        }),
        careers: getSafe(completeData, 'careers', {
            section: { badge: "", headline: "", description: "" },
            roles: [],
            success: { title: "", description: "" },
            labels: { name: "", email: "", role: "", summary: "" }
        }),
        // aboutPage is the About page's OWN independent content — it must never
        // fall back onto the homepage's root-level hero/stats/ctaBanner/etc, or
        // editing one page would silently leak into and overwrite the other.
        aboutPage: getSafe(completeData, 'aboutPage', {}),
        images: getSafe(completeData, 'images', {}),
        loader: getSafe(completeData, 'loader', { company: { name: "", tagline: "" }, phases: { simpleDark: 200, logoText: 400, ready: 100 } }),
        quickQuote: getSafe(completeData, 'quickQuote', {
            title: "",
            description: "",
            buttonText: ""
        }),
        hours: getSafe(completeData, 'hours'),
        contactPage: getSafe(completeData, 'contactPage', {
            header: { badge: "", headline: "", description: "" },
            formFields: [],
            info: {},
            social: {}
        }),
        galleryPage: getSafe(completeData, 'galleryPage', {
            header: { badge: "", title: "", description: "" }
        }),
        brandStore: getSafe(completeData, 'brandStore', {
            section: { badge: "", headline: "", description: "" },
            items: []
        }),
        serviceDetailPage: getSafe(completeData, 'serviceDetailPage'),
        settings: completeData?.settings || { siteTitle: "", siteTemplate: "%s", favicon: "/logo.png" },
        globalSite: getSafe(completeData, 'globalSite', {}),
        globalMetadata: getSafe(completeData, 'globalMetadata', {}),
        faqPage: getSafe(completeData, 'faqPage'),
        blogSection: getSafe(completeData, 'blogSection', {
            title: "Latest from the Blog",
            subtitle: "Insights & News",
            description: "",
            ctaAll: "View All Articles",
            ctaReadMore: "Read Article",
            selectedPosts: []
        }),
        allBlogs: Array.isArray(completeData?.allBlogs) ? completeData.allBlogs : [],
        industries: getSafe(completeData, 'industries', {
            badge: "INDUSTRIES WE SERVE",
            title: "Trusted Across Multiple Industries",
            description: "We support a wide range of industries with reliable equipment and pumping solutions, helping businesses achieve greater efficiency and productivity.",
            ctaLabel: "View All Industries",
            ctaLink: "/industries",
            cards: [
                { image: "", title: "Oil & Gas",                subtitle: "Exploration & Production",   cta: "Learn More", ctaLink: "#" },
                { image: "", title: "Petrochemical",            subtitle: "Refining & Chemicals",       cta: "Learn More", ctaLink: "#" },
                { image: "", title: "Water & Wastewater",       subtitle: "Treatment & Management",     cta: "Learn More", ctaLink: "#" },
                { image: "", title: "Mining & Resources",       subtitle: "Extraction & Processing",    cta: "Learn More", ctaLink: "#" },
                { image: "", title: "Industrial Fabrication", subtitle: "General Fabrication",      cta: "Learn More", ctaLink: "#" },
            ]
        }),
    };
};
