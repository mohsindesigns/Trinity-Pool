
import { BASE_URL } from "./constants";

interface SchemaOptions {
  title: string;
  description: string;
  slug: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Service" | "Article" | "BlogPosting";
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbTitle?: string;
  isService?: boolean;
  image?: string;
  servicesList?: Array<{ name: string; description?: string }>;
  datePublished?: string;
  dateModified?: string;
}

const BUSINESS_NAME = "Trinity Pump & Supply";
const BUSINESS_PHONE = "830-279-3996";
const BUSINESS_EMAIL = "trinitypumpsupply@gmail.com";
const BUSINESS_ADDRESS = {
  "@type": "PostalAddress",
  "streetAddress": "4608 Gist Ave",
  "addressLocality": "Odessa",
  "addressRegion": "TX",
  "postalCode": "79764",
  "addressCountry": "US"
};

export function getHomepageSchemas(servicesList?: Array<{ name: string }>, faqs?: Array<{ question?: string; answer?: string; q?: string; a?: string }>) {
  const defaultServices = [
    { name: "Downhole Rod Pumps" },
    { name: "HD Rod Rotator" },
    { name: "Artificial Lift Supplies" },
    { name: "Pipe, Valves & Fittings" },
    { name: "Poly" },
    { name: "General Oilfield Supply" }
  ];

  const serviceOffers = (servicesList && servicesList.length > 0 ? servicesList : defaultServices).map(s => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": s.name
    }
  }));

  const yoastGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/`,
        "url": `${BASE_URL}/`,
        "name": `Downhole Rod Pumps & Oilfield Supplies in Odessa, TX | ${BUSINESS_NAME}`,
        "isPartOf": {
          "@id": `${BASE_URL}/#website`
        },
        "about": {
          "@id": `${BASE_URL}/#organization`
        },
        "datePublished": "2025-02-07T15:28:30+00:00",
        "dateModified": "2026-07-24T16:08:21+00:00",
        "description": "Trinity Pump & Supply delivers high-quality USA-manufactured downhole rod pumps, artificial lift equipment and oilfield supplies across Texas and New Mexico.",
        "breadcrumb": {
          "@id": `${BASE_URL}/#breadcrumb`
        },
        "inLanguage": "en",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              `${BASE_URL}/`
            ]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": `${BASE_URL}/`,
        "name": BUSINESS_NAME,
        "description": "Downhole Rod Pumps & Oilfield Supplies serving the Permian Basin",
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${BASE_URL}/?s={search_term_string}`
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueRequired": true,
              "valueName": "search_term_string"
            }
          }
        ],
        "inLanguage": "en"
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": BUSINESS_NAME,
        "url": `${BASE_URL}/`,
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en",
          "@id": `${BASE_URL}/#/schema/logo/image/`,
          "url": "",
          "contentUrl": "",
          "caption": BUSINESS_NAME
        },
        "image": {
          "@id": `${BASE_URL}/#/schema/logo/image/`
        }
      }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Oilfield Equipment & Artificial Lift Supply",
    "provider": {
      "@type": "LocalBusiness",
      "name": BUSINESS_NAME,
      "url": `${BASE_URL}/`,
      "telephone": BUSINESS_PHONE,
      "address": BUSINESS_ADDRESS
    },
    "areaServed": {
      "@type": "Place",
      "name": "Permian Basin, Texas & New Mexico"
    },
    "description": "Trinity Pump & Supply manufactures, builds and repairs downhole rod pumps, and supplies artificial lift equipment, pipe, valves, fittings and general oilfield supplies across Texas and New Mexico.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Oilfield Equipment & Supplies",
      "itemListElement": serviceOffers
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": BUSINESS_NAME,
    "@id": `${BASE_URL}/`,
    "url": `${BASE_URL}/`,
    "telephone": BUSINESS_PHONE,
    "email": BUSINESS_EMAIL,
    "priceRange": "$$",
    "address": BUSINESS_ADDRESS,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "07:00",
        "closes": "18:00"
      }
    ],
    "description": "Trinity Pump & Supply, based in Odessa, Texas, specializes in USA-manufactured downhole rod pumps, HD rod rotators, artificial lift supplies and general oilfield supplies for operators across the Permian Basin."
  };

  let faqSchema: any = null;
  const validFaqs = (faqs || []).filter(f => (f.question || (f as any).q) && (f.answer || (f as any).a));
  if (validFaqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      "mainEntity": validFaqs.map(f => ({
        "@type": "Question",
        "name": (f.question || (f as any).q || "").replace(/<[^>]*>/g, "").trim(),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": (f.answer || (f as any).a || "").replace(/<[^>]*>/g, "").trim()
        }
      }))
    };
  }

  return {
    yoastGraph,
    serviceSchema,
    localBusinessSchema,
    faqSchema
  };
}

export function generateSchema(options: SchemaOptions) {
  const {
    title,
    description,
    slug = "",
    type = "WebPage",
    faqs,
    breadcrumbTitle,
    isService,
    image,
    servicesList,
    datePublished = "2025-02-07T15:28:30+00:00",
    dateModified = "2026-07-24T16:08:21+00:00"
  } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const isRoot = normalizedSlug === '/' || normalizedSlug === '';

  if (isRoot) {
    return getHomepageSchemas(servicesList, faqs);
  }

  const pageUrl = `${BASE_URL}${normalizedSlug.endsWith('/') ? normalizedSlug : `${normalizedSlug}/`}`;

  // 1. Organization Schema
  const organizationSchema = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": BUSINESS_NAME,
    "url": `${BASE_URL}/`,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/logo.png`,
      "width": 512,
      "height": 512
    }
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": BUSINESS_NAME,
    "image": `${BASE_URL}/logo.png`,
    "telephone": BUSINESS_PHONE,
    "email": BUSINESS_EMAIL,
    "url": `${BASE_URL}/`,
    "address": BUSINESS_ADDRESS,
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Texas" },
      { "@type": "AdministrativeArea", "name": "New Mexico" },
      { "@type": "AdministrativeArea", "name": "Permian Basin" },
      { "@type": "AdministrativeArea", "name": "Odessa" },
      { "@type": "AdministrativeArea", "name": "Midland" }
    ],
    "priceRange": "$$"
  };

  // 3. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": `${BASE_URL}/`,
    "name": BUSINESS_NAME,
    "publisher": { "@id": `${BASE_URL}/#organization` }
  };

  // 4. BreadcrumbList Schema
  const pathSegments = (isService ? [safeSlug.replace(/^services\//, '').replace(/^\/+|\/+$/g, '')] : safeSlug.split('/')).filter(Boolean);
  const breadcrumbList = pathSegments.length > 0 ? {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BASE_URL}/`
      },
      ...pathSegments.map((segment, index) => {
        const url = `${BASE_URL}/${pathSegments.slice(0, index + 1).join('/')}/`;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": index === pathSegments.length - 1 ? (breadcrumbTitle || title) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          "item": url
        };
      })
    ]
  } : null;

  // 5. WebPage / Service Schema
  const mainEntitySchema: any = {
    "@type": isService ? "Service" : type,
    "@id": `${pageUrl}#${(isService ? "service" : type).toLowerCase()}`,
    "url": pageUrl,
    "name": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "inLanguage": "en",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    ...(breadcrumbList ? { "breadcrumb": { "@id": `${pageUrl}#breadcrumb` } } : {}),
    ...(image ? {
      "image": {
        "@type": "ImageObject",
        "url": image
      },
      "primaryImageOfPage": {
        "@id": `${pageUrl}#primaryimage`
      }
    } : {})
  };

  if (isService) {
    mainEntitySchema["provider"] = { "@id": `${BASE_URL}/#organization` };
    mainEntitySchema["serviceType"] = title;
  }

  // Companion WebPage schema for Service pages so both Service & WebPage have dates & relations
  const companionWebPageSchema: any = isService ? {
    "@type": "WebPage",
    "@id": `${pageUrl}`,
    "url": pageUrl,
    "name": `${title} | ${BUSINESS_NAME}`,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "inLanguage": "en",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "about": { "@id": `${pageUrl}#service` },
    ...(breadcrumbList ? { "breadcrumb": { "@id": `${pageUrl}#breadcrumb` } } : {})
  } : null;

  const graph: any[] = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema
  ];

  if (breadcrumbList) {
    graph.push(breadcrumbList);
  }

  if (companionWebPageSchema) {
    graph.push(companionWebPageSchema);
  }

  graph.push(mainEntitySchema);

  if (image) {
    graph.push({
      "@type": "ImageObject",
      "@id": `${pageUrl}#primaryimage`,
      "url": image,
      "contentUrl": image
    });
  }

  if (faqs && Array.isArray(faqs) && faqs.length > 0) {
    const validFaqs = faqs.filter(f => (f.question || (f as any).q) && (f.answer || (f as any).a));
    if (validFaqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": validFaqs.map(f => ({
          "@type": "Question",
          "name": (f.question || (f as any).q || "").replace(/<[^>]*>/g, "").trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": (f.answer || (f as any).a || "").replace(/<[^>]*>/g, "").trim()
          }
        }))
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
