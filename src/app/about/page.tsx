"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AboutPage() {
    const { t } = useLanguage();

    const stats = [
        { valueKey: "about.stat1.value", labelKey: "about.stat1.label" },
        { valueKey: "about.stat2.value", labelKey: "about.stat2.label" },
        { valueKey: "about.stat3.value", labelKey: "about.stat3.label" },
    ];

    return (
        <main className="relative min-h-screen flex flex-col">
            <div className="edge-glow" aria-hidden="true" />
            <div className="fixed inset-0 -z-10" aria-hidden="true">
                <div className="absolute inset-0 top-glow" />
                <div className="absolute top-0 left-0 right-0 h-[500px] top-glow opacity-60" />
            </div>

            <Header active="/about" />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="w-full max-w-3xl text-center">
                    <div className="mb-8 lg:mb-12">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
                            {t("about.headline")}{" "}
                            <span className="gradient-text">{t("about.headlineHighlight")}</span>
                            {t("about.headlineSuffix") ? ` ${t("about.headlineSuffix")}` : ""}
                        </h1>
                    </div>

                    <div className="mb-10 animate-fade-in-up">
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

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-12 animate-fade-in-up animate-delay-1">
                        {stats.map((stat) => (
                            <div
                                key={stat.labelKey}
                                className="rounded-2xl bg-white/30 py-5 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)]"
                            >
                                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold gradient-text mb-1 tracking-tight">{t(stat.valueKey)}</div>
                                <div className="text-[10px] sm:text-[11px] lg:text-xs font-medium uppercase tracking-[0.12em] text-[--color-text-muted]">{t(stat.labelKey)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animate-delay-2">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {t("about.cta")}
                        </Link>
                        <a
                            href="https://github.com/quangminh1212/SourceVerify"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-[--color-text-secondary] bg-white/30 transition-all duration-200 hover:text-[--color-text-primary] hover:bg-white/50"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            {t("about.github")}
                        </a>
                    </div>
                </div>
            </div>

            <footer className="relative z-10 footer-divider">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="SourceVerify" width={18} height={18} />
                            <span className="text-xs font-semibold text-[--color-text-primary]">SourceVerify</span>
                        </Link>
                        <p className="text-[11px] text-[--color-text-muted]">{t("footer.copyright", { year: new Date().getFullYear().toString() })}</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
