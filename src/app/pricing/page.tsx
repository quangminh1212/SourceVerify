"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const CHECK = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

            <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20">
                <div className="w-full max-w-6xl mx-auto">

                    {/* Title */}
                    <div className="text-center mb-12 sm:mb-16">
                        <h1 className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
                            {t("pricing.headline")}{" "}
                            <span className="gradient-text">{t("pricing.headlineHighlight")}</span>
                        </h1>
                        <p className="text-sm sm:text-[15px] lg:text-base leading-[1.8] text-[--color-text-secondary] max-w-xl mx-auto animate-fade-in-up animate-delay-1">
                            {t("pricing.subtitle")}
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="pricing-grid animate-fade-in-up animate-delay-2">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.nameKey}
                                className={`pricing-card ${plan.highlight ? "pricing-card-highlight" : ""}`}
                            >
                                {/* Badge */}
                                {plan.badgeKey && (
                                    <div className="pricing-badge">{t(plan.badgeKey)}</div>
                                )}

                                {/* Plan Header */}
                                <div className="pricing-card-header">
                                    <h3 className="pricing-plan-name">{t(plan.nameKey)}</h3>
                                    <div className="pricing-price-row">
                                        <span className="pricing-price">{t(plan.priceKey)}</span>
                                        {t(plan.periodKey) && (
                                            <span className="pricing-period">{t(plan.periodKey)}</span>
                                        )}
                                    </div>
                                    <p className="pricing-desc">{t(plan.descKey)}</p>
                                </div>

                                {/* Divider */}
                                <div className="pricing-divider" />

                                {/* Features */}
                                <ul className="pricing-features">
                                    {plan.features.map((f) => (
                                        <li key={f.key} className="pricing-feature-item">
                                            <span className="pricing-check">{CHECK}</span>
                                            <span>{t(f.key)}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <div className="pricing-cta-wrap">
                                    <Link
                                        href="/"
                                        className={plan.highlight ? "pricing-cta-primary" : "pricing-cta-outline"}
                                    >
                                        {t(plan.ctaKey)}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="text-center mt-20 sm:mt-24 animate-fade-in-up animate-delay-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-[--color-text-primary] mb-10">
                            {t("pricing.faq.title")}
                        </h2>
                        <div className="pricing-faq-grid">
                            {FAQS.map((faq) => (
                                <div key={faq.q} className="pricing-faq-item">
                                    <h3 className="pricing-faq-q">{t(faq.q)}</h3>
                                    <p className="pricing-faq-a">{t(faq.a)}</p>
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
