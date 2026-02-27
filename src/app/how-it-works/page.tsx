"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const STEP_KEYS = [
    { titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> },
    { titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg> },
    { titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
];

export default function HowItWorksPage() {
    const { t } = useLanguage();

    return (
        <main className="relative min-h-screen flex flex-col">

            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl mx-auto text-center">
                    <div className="section-gap">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] text-center mb-4 animate-fade-in-up">
                            {t("howItWorks.headline")}{" "}
                            <span className="gradient-text">{t("howItWorks.headlineHighlight")}</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed text-center animate-fade-in-up">
                            {t("howItWorks.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-0 text-center">
                        {STEP_KEYS.map((step, i) => (
                            <div key={step.titleKey} className="relative flex flex-col items-center">
                                {/* Arrow connector between steps (desktop only) */}
                                {i < STEP_KEYS.length - 1 && (
                                    <svg className="hidden lg:block absolute -right-3 top-10 z-10 text-[--color-text-muted] opacity-40" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                )}
                                <div className={`group rounded-2xl bg-transparent p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] animate-fade-in-up animate-delay-${i} flex flex-col items-center`}>
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-5 text-[--color-accent-blue]">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[--color-text-primary] mb-2">{t(step.titleKey)}</h3>
                                    <p className="text-[13px] lg:text-sm leading-relaxed text-[--color-text-secondary]">{t(step.descKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-gap-top animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {t("howItWorks.cta")}
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
