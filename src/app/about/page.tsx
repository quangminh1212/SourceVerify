"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AboutPage() {
    const { t } = useLanguage();

    const stats = [
        { valueKey: "about.stat1.value", labelKey: "about.stat1.label", colorClass: "text-[#4285f4]" },
        { valueKey: "about.stat2.value", labelKey: "about.stat2.label", colorClass: "text-[#0f9d58]" },
        { valueKey: "about.stat3.value", labelKey: "about.stat3.label", colorClass: "text-[#f4b400]" },
    ];

    return (
        <main className="relative min-h-screen flex flex-col">

            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl mx-auto text-center">
                    <div className="section-gap">
                        <h1 className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up whitespace-nowrap">
                            {t("about.headline")}{" "}
                            <span className="gradient-text">{t("about.headlineHighlight")}</span>
                            {t("about.headlineSuffix") ? ` ${t("about.headlineSuffix")}` : ""}
                        </h1>
                    </div>

                    <div className="section-gap animate-fade-in-up">
                        <p className="text-sm sm:text-[15px] lg:text-base leading-[1.8] text-[--color-text-secondary] mb-5">
                            {t("about.p1")}
                        </p>
                        <p className="text-sm sm:text-[15px] lg:text-base leading-[1.8] text-[--color-text-secondary] mb-5">
                            {t("about.p2prefix")}{" "}
                            <strong className="text-[--color-text-primary] font-semibold">{t("about.opensource")}</strong>,{" "}
                            <strong className="text-[--color-text-primary] font-semibold">{t("about.privacyfirst")}</strong>{" "}
                            {t("about.p2suffix")}
                        </p>
                        <p className="text-sm sm:text-[15px] lg:text-base leading-[1.8] text-[--color-text-secondary]">
                            {t("about.p3")}
                        </p>
                    </div>

                    <div className="section-gap grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up animate-delay-1">
                        {stats.map((stat) => (
                            <div
                                key={stat.labelKey}
                                className="py-5 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 text-center transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1 tracking-tight ${stat.colorClass}`}>{t(stat.valueKey)}</div>
                                <div className="text-xs sm:text-sm lg:text-sm font-medium uppercase tracking-[0.12em] text-[--color-text-muted]">{t(stat.labelKey)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="section-gap-top flex items-center justify-center animate-fade-in-up animate-delay-2">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {t("about.cta")}
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
