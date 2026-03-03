"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const CHECK = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

interface PlanFeature { key: string }

interface Plan {
    nameKey: string;
    priceKey: string;
    periodKey: string;
    descKey: string;
    features: PlanFeature[];
    ctaKey: string;
    highlight?: boolean;
    badgeKey?: string;
}

const PLANS: Plan[] = [
    {
        nameKey: "pricing.free.name",
        priceKey: "pricing.free.price",
        periodKey: "pricing.free.period",
        descKey: "pricing.free.desc",
        features: [
            { key: "pricing.free.f1" },
            { key: "pricing.free.f2" },
            { key: "pricing.free.f3" },
            { key: "pricing.free.f4" },
        ],
        ctaKey: "pricing.free.cta",
    },
    {
        nameKey: "pricing.pro.name",
        priceKey: "pricing.pro.price",
        periodKey: "pricing.pro.period",
        descKey: "pricing.pro.desc",
        features: [
            { key: "pricing.pro.f1" },
            { key: "pricing.pro.f2" },
            { key: "pricing.pro.f3" },
            { key: "pricing.pro.f4" },
            { key: "pricing.pro.f5" },
        ],
        ctaKey: "pricing.pro.cta",
        highlight: true,
        badgeKey: "pricing.pro.badge",
    },
    {
        nameKey: "pricing.enterprise.name",
        priceKey: "pricing.enterprise.price",
        periodKey: "pricing.enterprise.period",
        descKey: "pricing.enterprise.desc",
        features: [
            { key: "pricing.enterprise.f1" },
            { key: "pricing.enterprise.f2" },
            { key: "pricing.enterprise.f3" },
            { key: "pricing.enterprise.f4" },
            { key: "pricing.enterprise.f5" },
        ],
        ctaKey: "pricing.enterprise.cta",
    },
];

const FAQS = [
    { q: "pricing.faq.q1", a: "pricing.faq.a1" },
    { q: "pricing.faq.q2", a: "pricing.faq.a2" },
    { q: "pricing.faq.q3", a: "pricing.faq.a3" },
];

export default function PricingPage() {
    const { t } = useLanguage();

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-20">
                <div className="w-full max-w-5xl mx-auto text-center">

                    {/* Title */}
                    <div className="section-gap">
                        <h1 className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
                            {t("pricing.headline")}{" "}
                            <span className="gradient-text">{t("pricing.headlineHighlight")}</span>
                        </h1>
                        <p className="text-sm sm:text-[15px] lg:text-base leading-[1.8] text-[--color-text-secondary] max-w-2xl mx-auto animate-fade-in-up animate-delay-1">
                            {t("pricing.subtitle")}
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="section-gap grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10 animate-fade-in-up animate-delay-2">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.nameKey}
                                className={`pricing-card ${plan.highlight ? "pricing-card-highlight" : ""}`}
                            >
                                {plan.badgeKey && (
                                    <span className="pricing-badge">{t(plan.badgeKey)}</span>
                                )}
                                <h3 className="text-lg font-bold text-[--color-text-primary] mb-2">
                                    {t(plan.nameKey)}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1 mb-2">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-[--color-text-primary]">
                                        {t(plan.priceKey)}
                                    </span>
                                    {t(plan.periodKey) && (
                                        <span className="text-sm text-[--color-text-muted]">
                                            {t(plan.periodKey)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs sm:text-sm text-[--color-text-secondary] mb-6">
                                    {t(plan.descKey)}
                                </p>
                                <ul className="space-y-3 mb-8 text-left">
                                    {plan.features.map((f) => (
                                        <li key={f.key} className="flex items-start gap-2 text-sm text-[--color-text-secondary]">
                                            <span className="text-[--color-accent-green] mt-0.5 shrink-0">{CHECK}</span>
                                            {t(f.key)}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/"
                                    className={plan.highlight ? "btn-primary w-full text-center block" : "btn-outline w-full text-center block"}
                                >
                                    {t(plan.ctaKey)}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="section-gap mt-16 animate-fade-in-up animate-delay-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-[--color-text-primary] mb-8">
                            {t("pricing.faq.title")}
                        </h2>
                        <div className="max-w-2xl mx-auto space-y-4 text-left">
                            {FAQS.map((faq) => (
                                <div key={faq.q} className="pricing-faq-item">
                                    <h3 className="text-sm sm:text-[15px] font-semibold text-[--color-text-primary] mb-2">
                                        {t(faq.q)}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[--color-text-secondary] leading-relaxed">
                                        {t(faq.a)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
