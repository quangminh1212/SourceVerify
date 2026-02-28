"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ProductPage() {
    const { t } = useLanguage();

    const cards = [
        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>, titleKey: "product.card1.title", descKey: "product.card1.desc", gradient: "from-blue-500/10 to-cyan-500/10" },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>, titleKey: "product.card2.title", descKey: "product.card2.desc", gradient: "from-green-500/10 to-emerald-500/10" },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, titleKey: "product.card3.title", descKey: "product.card3.desc", gradient: "from-amber-500/10 to-yellow-500/10" },
    ];

    return (
        <main className="relative min-h-screen flex flex-col">

            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-4xl mx-auto text-center">
                    <div className="section-gap">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] text-center mb-4 animate-fade-in-up">
                            {t("product.headline")}{" "}
                            <span className="gradient-text">{t("product.headlineHighlight")}</span>
                        </h1>
                        <p className="text-xs sm:text-sm lg:text-[15px] text-[--color-text-secondary] leading-relaxed text-center animate-fade-in-up">
                            {t("product.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 text-center">
                        {cards.map((item, i) => (
                            <div
                                key={item.titleKey}
                                className={`group relative rounded-2xl bg-transparent p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] animate-fade-in-up animate-delay-${i} flex flex-col`}
                            >
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="relative flex flex-col flex-1">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <span className="text-3xl lg:text-4xl">{item.icon}</span>
                                        <h3 className="text-base lg:text-lg font-bold text-[--color-text-primary]">{t(item.titleKey)}</h3>
                                    </div>
                                    <p className="text-[13px] lg:text-sm leading-relaxed text-[--color-text-secondary] flex-1 text-center">{t(item.descKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-gap-top animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {t("product.cta")}
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
