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
                        <h1 className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
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

                    <div className="section-gap grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up animate-delay-1">
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

                    {/* Owner Section */}
                    <div className="section-gap animate-fade-in-up animate-delay-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-text-muted] mb-5">{t("about.owner.title")}</p>
                        <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-5 px-6 py-5 rounded-2xl border border-[--color-border] bg-[--color-bg-secondary] transition-all duration-300 hover:border-[--color-border-hover] hover:shadow-lg">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4285f4] to-[#0f9d58] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                                Q
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="font-bold text-base text-[--color-text-primary]">{t("about.owner.name")}</div>
                                <div className="text-xs font-medium text-[#4285f4] mt-0.5">{t("about.owner.role")}</div>
                                <p className="text-xs leading-relaxed text-[--color-text-secondary] mt-2 max-w-sm">{t("about.owner.desc")}</p>
                                <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                                    <a href="https://github.com/quangminh1212" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                        {t("about.owner.github")}
                                    </a>
                                    <span className="text-[--color-text-muted] opacity-30">·</span>
                                    <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                        {t("about.owner.project")}
                                    </a>
                                </div>
                            </div>
                        </div>
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
