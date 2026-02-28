"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { METHODS, CATEGORIES, CAT_COLORS, CAT_HEX, CAT_ICON_PATHS, type Category } from "./data";

function MethodIcon({ category }: { category: Category }) {
    const paths = (CAT_ICON_PATHS[category] || "").split(" M");
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={CAT_HEX[category]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="methods-card-svg-icon"
        >
            {paths.map((p, i) => (
                <path key={i} d={i === 0 ? p : `M${p}`} />
            ))}
        </svg>
    );
}

export default function MethodsPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [activeCat, setActiveCat] = useState<Category>("all");
    const [showMethods, setShowMethods] = useState(false);

    useEffect(() => {
        if (searchParams.get("view") === "grid") {
            setShowMethods(true);
        }
    }, [searchParams]);

    const filtered = activeCat === "all"
        ? METHODS
        : METHODS.filter(m => m.category === activeCat);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl mx-auto text-center">

                    {!showMethods ? (
                        /* === Intro View === */
                        <div className="methods-intro-section text-center animate-fade-in-up">
                            <h1 className="methods-page-title text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary]">
                                {t("methods.headline")}{" "}
                                <span className="gradient-text">{t("methods.headlineHighlight")}</span>
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed mx-auto text-center">
                                {t("methods.subtitle1")}
                            </p>
                            <p className="methods-subtitle2 text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed mx-auto text-center">
                                {t("methods.subtitle2")}
                            </p>

                            <div className="methods-view-cta">
                                <button
                                    className="btn-primary inline-flex items-center gap-2"
                                    onClick={() => setShowMethods(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    {t("methods.viewNow")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Back to intro */}
                            <nav className="method-detail-breadcrumb animate-fade-in-up">
                                <button className="method-detail-back-nav" onClick={() => setShowMethods(false)} aria-label="Back">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                <span className="method-detail-breadcrumb-current">
                                    {t("methods.headline")} {t("methods.headlineHighlight")}
                                </span>
                            </nav>

                            {/* Category Tabs */}
                            <div className="methods-cat-tabs animate-fade-in-up">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.key}
                                        className={`methods-cat-tab ${activeCat === cat.key ? "active" : ""}`}
                                        onClick={() => setActiveCat(cat.key)}
                                    >
                                        {t(cat.labelKey)}
                                        {cat.key !== "all" && (
                                            <span className="methods-cat-tab-count">
                                                {METHODS.filter(m => m.category === cat.key).length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Methods Grid — each card is a Link */}
                            <div className="methods-grid animate-fade-in-up">
                                {filtered.map((m, i) => (
                                    <Link
                                        key={m.id}
                                        href={`/methods/${m.id}`}
                                        className={`methods-card methods-card-clickable animate-fade-in-up animate-delay-${Math.min(i, 5)}`}
                                    >
                                        <div className="methods-card-header">
                                            <MethodIcon category={m.category} />
                                            <div className="methods-card-meta">
                                                <span className={`methods-card-badge ${CAT_COLORS[m.category]}`}>
                                                    {t(`methods.cat${m.category.charAt(0).toUpperCase() + m.category.slice(1)}` as string)}
                                                </span>
                                                <span className="methods-card-weight">
                                                    {t("methods.weightLabel")}: {Math.round(m.weight * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="methods-card-name">{t(m.nameKey)}</h3>
                                        <p className="methods-card-desc">{t(m.descKey)}</p>

                                        <div className="methods-card-bar-track">
                                            <div className={`methods-card-bar-fill methods-bar-w-${Math.round(m.weight * 100)}`} />
                                        </div>

                                        {/* Arrow hint */}
                                        <div className="methods-card-expand-hint">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>

            <Footer />
        </main>
    );
}
