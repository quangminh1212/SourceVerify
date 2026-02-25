"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { useLanguage } from "@/i18n/LanguageContext";

const STEP_KEYS = [
    { num: "01", titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> },
    { num: "02", titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg> },
    { num: "03", titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
];

export default function HowItWorksPage() {
    const { t } = useLanguage();

    return (
        <main className="relative min-h-screen flex flex-col">

            <Header active="/how-it-works" />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl mx-auto text-center">
                    <div className="mb-12 lg:mb-14">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] text-center mb-4 animate-fade-in-up">
                            {t("howItWorks.headline")}{" "}
                            <span className="gradient-text">{t("howItWorks.headlineHighlight")}</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed text-center animate-fade-in-up">
                            {t("howItWorks.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 text-center">
                        {STEP_KEYS.map((step, i) => (
                            <div
                                key={step.num}
                                className={`group relative rounded-2xl bg-transparent p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] animate-fade-in-up animate-delay-${i}`}
                            >
                                <div className="lg:mb-5 mb-0 flex lg:flex-col items-start gap-4 lg:gap-0">
                                    <span className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center text-xs lg:text-sm font-extrabold text-blue-600 tracking-wide flex-shrink-0 lg:mb-5">
                                        {step.num}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl lg:text-2xl">{step.icon}</span>
                                            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[--color-text-primary]">{t(step.titleKey)}</h3>
                                        </div>
                                        <p className="text-[13px] lg:text-sm leading-relaxed text-[--color-text-secondary]">{t(step.descKey)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 lg:mt-14 animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {t("howItWorks.cta")}
                        </Link>
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
