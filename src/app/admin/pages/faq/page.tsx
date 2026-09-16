"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CircleHelp, ChevronRight, ArrowLeft } from "lucide-react";

/**
 * This route used to be a standalone editor that wrote to a global
 * `SiteContent.faqPage` object nothing on the live site ever read.
 * The FAQ page's actual header/CTA copy is a per-Page `content.faq*` field,
 * edited from the generic page editor's "Page FAQs" tab
 * (`/admin/pages/<id>`, auto-selected for the Page document whose
 * `slug === 'faq'`). Rather than 404 the existing admin-nav link, this page
 * looks up that document and forwards the admin to the editor that
 * actually works.
 */
export default function FAQPageEditorRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "notfound" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/pages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load pages");
        return res.json();
      })
      .then((pages) => {
        if (cancelled) return;
        const list = Array.isArray(pages) ? pages : [];
        // Prefer a non-trashed match, but fall back to any page with this slug.
        const match =
          list.find((p: any) => p.slug === "faq" && !p.isTrashed) ||
          list.find((p: any) => p.slug === "faq");

        if (match?._id) {
          router.replace(`/admin/pages/${match._id}`);
        } else {
          setStatus("notfound");
        }
      })
      .catch((err) => {
        console.error("Failed to look up the FAQ page:", err);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Finding your FAQ page...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <Link href="/admin/pages" className="hover:text-primary transition-colors">Pages</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-bold">FAQ Page</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <CircleHelp className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {status === "notfound" ? "No FAQ page found yet" : "Couldn't load the FAQ page"}
          </h1>
        </div>
        <p className="text-slate-600 text-sm font-medium">
          {status === "notfound"
            ? 'There’s no Page document with the slug "faq" yet, so there’s nothing to edit here. Create one from the Pages list — click "Add New Page" and set its Template to "FAQ Template" — and this link will take you straight to its editor from then on.'
            : "Something went wrong while looking up the FAQ page. Please try again, or open it directly from the Pages list."}
        </p>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Pages
        </Link>
      </div>
    </div>
  );
}
