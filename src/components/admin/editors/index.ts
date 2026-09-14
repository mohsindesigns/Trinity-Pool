import dynamic from 'next/dynamic';

export const TemplateEditors: Record<string, any> = {
  home: dynamic(() => import('./HomeEditor')),
  about: dynamic(() => import('./AboutEditor')),
  services: dynamic(() => import('./ServicesEditor')),
  team: dynamic(() => import('./TeamEditor')),
  careers: dynamic(() => import('./CareersEditor')),
  gallery: dynamic(() => import('./GalleryEditor')),
  faq: dynamic(() => import('./FAQEditor')),
  contact: dynamic(() => import('./ContactEditor')),
  reviews: dynamic(() => import('./ReviewsEditor')),
  // NOTE: 'service-detail' is intentionally NOT registered here. Its real
  // editor is the dedicated /admin/services page, which saves content to
  // data.services.services[] (the single source of truth
  // ServiceDetailTemplate.tsx reads). ServiceDetailEditor.tsx is leftover,
  // unused, and writes to a different place (Page.content) that would
  // silently be overridden by the catalogue on next load if it were used
  // -- keeping it registered here would surface a second, wrong, dead-end
  // editor for the same pages. See the explicit notice in the generic
  // /admin/pages/[id] editor for anyone who lands on one of these pages
  // that way instead of through /admin/services.
  settings: dynamic(() => import('./SettingsEditor')),
  'service-area': dynamic(() => import('./ServiceAreaEditor')),
  blog: dynamic(() => import('./BlogEditor')),
  blogs: dynamic(() => import('./BlogEditor')),
  'artificial-lift-landing': dynamic(() => import('./ArtificialLiftEditor')),
};
