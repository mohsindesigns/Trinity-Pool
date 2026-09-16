"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ImageField from "@/components/admin/ImageField";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
    ssr: false,
    loading: () => <div className="h-40 bg-white animate-pulse border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs">Loading Rich Text Editor...</div>
});

export default function ContactEditor() {
    const [data, setData] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((json) => setData(json))
            .catch((err) => console.error("Failed to load content:", err));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save");
            setMessage("Saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setMessage("Error saving changes");
        } finally {
            setSaving(false);
        }
    };

    const updateHeader = (field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            contactPage: { ...(prev.contactPage || {}), header: { ...(prev.contactPage?.header || {}), [field]: value } },
        }));
    };

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="p-3 bg-white border border-gray-100 hover:border-primary/30 rounded-2xl transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Page Editor</h1>
                        <p className="text-slate-500 text-sm font-medium">Everything shown at /contact-us/.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-sm disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl border ${message.includes("Error") ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" /> Hero Section
                    </h2>

                    <div className="space-y-5">
                        <ImageField
                            label="Hero Background Image"
                            value={data.contactPage?.header?.image || ""}
                            onChange={(url: string) => updateHeader("image", url)}
                            altValue={data.contactPage?.header?.imageAlt || ""}
                            onAltChange={(alt: string) => updateHeader("imageAlt", alt)}
                            description="Full-bleed dark hero photo behind the headline."
                        />

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Section Badge</label>
                            <input
                                type="text"
                                value={data.contactPage?.header?.badge || ""}
                                onChange={(e) => updateHeader("badge", e.target.value)}
                                placeholder="e.g. GET IN TOUCH"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Headline</label>
                            <input
                                type="text"
                                value={data.contactPage?.header?.headline || ""}
                                onChange={(e) => updateHeader("headline", e.target.value)}
                                placeholder="e.g. Let's Talk Oilfield Supply."
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Description</label>
                            <RichTextEditor
                                content={data.contactPage?.header?.description || ""}
                                onChange={(v) => updateHeader("description", v)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Primary Button Text</label>
                                <input
                                    type="text"
                                    value={data.contactPage?.header?.ctaText || ""}
                                    onChange={(e) => updateHeader("ctaText", e.target.value)}
                                    placeholder="Defaults to “Call ” + your real phone number"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Primary Button Link</label>
                                <input
                                    type="text"
                                    value={data.contactPage?.header?.ctaUrl || ""}
                                    onChange={(e) => updateHeader("ctaUrl", e.target.value)}
                                    placeholder="Defaults to tel: your real phone number"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Secondary Button Text</label>
                                <input
                                    type="text"
                                    value={data.contactPage?.header?.ctaSecondaryText || ""}
                                    onChange={(e) => updateHeader("ctaSecondaryText", e.target.value)}
                                    placeholder="e.g. Send a Message"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Secondary Button Link</label>
                                <input
                                    type="text"
                                    value={data.contactPage?.header?.ctaSecondaryUrl || ""}
                                    onChange={(e) => updateHeader("ctaSecondaryUrl", e.target.value)}
                                    placeholder="e.g. #contact-support"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">!</div>
                    <p className="text-slate-600 text-sm font-medium">
                        The contact form, your phone/email/address, and the FAQ shown below the hero are all shared sitewide (the same real business info everywhere) — manage those from{" "}
                        <Link href="/admin/pages/home" className="text-primary font-bold hover:underline">Home page editor → 11. Contact & FAQs</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
