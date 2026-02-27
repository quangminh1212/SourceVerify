"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const FEATURE_KEYS = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>, titleKey: "features.item1.title", descKey: "features.item1.desc", accent: "from-blue-500/10 to-cyan-500/10" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>, titleKey: "features.item2.title", descKey: "features.item2.desc", accent: "from-green-500/10 to-emerald-500/10" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, titleKey: "features.item3.title", descKey: "features.item3.desc", accent: "from-amber-500/10 to-yellow-500/10" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>, titleKey: "features.item4.title", descKey: "features.item4.desc", accent: "from-rose-500/10 to-pink-500/10" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" /></svg>, titleKey: "features.item5.title", descKey: "features.item5.desc", accent: "from-purple-500/10 to-violet-500/10" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>, titleKey: "features.item6.title", descKey: "features.item6.desc", accent: "from-indigo-500/10 to-blue-500/10" },
];

export default function FeaturesPage() {
    const { t } = useLanguage();

    return (
        <main className="relative min-h-screen flex flex-col">

            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl mx-auto text-center">
                    <div className="section-gap">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] text-center mb-4 animate-fade-in-up">
                            {t("features.headline")}{" "}
                            <span className="gradient-text">{t("features.headlineHighlight")}</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed text-center animate-fade-in-up">
                            {t("features.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {FEATURE_KEYS.map((feat, i) => (
                            <div
                                key={feat.titleKey}
                                className={`group relative rounded-2xl bg-transparent p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] animate-fade-in-up animate-delay-${Math.min(i, 5)} flex flex-col`}
                            >
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="relative flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-2xl lg:text-3xl">{feat.icon}</span>
                                        <h3 className="text-sm lg:text-base font-bold text-[--color-text-primary]">{t(feat.titleKey)}</h3>
                                    </div>
                                    <p className="text-[13px] lg:text-sm leading-relaxed text-[--color-text-secondary] flex-1">{t(feat.descKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-gap-top animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {t("features.cta")}
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
