"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { METHODS, CAT_HEX, CAT_COLORS, ICON_PATHS, type Category } from "../data";

export type MethodTranslations = {
    name: string;
    description: string;
    algorithm: string;
    mechanism: string;
    parameters: string;
    accuracy: string;
    source: string;
    useCase: string;
};

type MethodI18n = Record<string, MethodTranslations>;

function MethodIcon({ id, category, size = 28 }: { id: string; category: Category; size?: number }) {
    const d = ICON_PATHS[id] || "";
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={CAT_HEX[category]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={d} />
        </svg>
    );
}

const SECTION_LABELS = [
    { key: "algorithm" as const, label: "Algorithm / Model", style: "algo" },
    { key: "mechanism" as const, label: "How it works", style: "" },
    { key: "parameters" as const, label: "Technical Parameters", style: "mono" },
    { key: "accuracy" as const, label: "Accuracy & Reliability", style: "" },
    { key: "useCase" as const, label: "Use Case", style: "" },
    { key: "source" as const, label: "Academic Reference", style: "ref" },
];

export default function MethodDetail({ methodId, translations }: { methodId: string; translations: MethodI18n }) {
    const { t, language } = useLanguage();

    const method = METHODS.find(m => m.id === methodId);
    if (!method) return null;

    const tr = translations[language] || translations.en;
    const catLabel = t(`methods.cat${method.category.charAt(0).toUpperCase() + method.category.slice(1)}` as string);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-3xl mx-auto">

                    {/* Breadcrumb */}
                    <nav className="method-detail-breadcrumb animate-fade-in-up">
                        <Link href="/methods" className="method-detail-breadcrumb-link">
                            {t("methods.headline")} {t("methods.headlineHighlight")}
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="method-detail-breadcrumb-current">{tr.name}</span>
                    </nav>

                    {/* Header */}
                    <div className="method-detail-header animate-fade-in-up">
                        <div className="method-detail-icon-wrap">
                            <MethodIcon id={method.id} category={method.category} size={36} />
                        </div>
                        <div className="method-detail-header-text">
                            <h1 className="method-detail-title">{tr.name}</h1>
                            <div className="method-detail-meta">
                                <span className={`methods-card-badge ${CAT_COLORS[method.category]}`}>{catLabel}</span>
                                <span className="method-detail-weight">{t("methods.weightLabel")}: {Math.round(method.weight * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="method-detail-desc animate-fade-in-up">{tr.description}</p>

                    {/* Weight bar */}
                    <div className="method-detail-bar-section animate-fade-in-up">
                        <div className="method-detail-bar-label">{t("methods.weightLabel")}</div>
                        <div className="methods-card-bar-track method-detail-bar">
                            <div className={`methods-card-bar-fill methods-bar-w-${Math.round(method.weight * 100)}`} />
                        </div>
                        <div className="method-detail-bar-value">{Math.round(method.weight * 100)}%</div>
                    </div>

                    {/* Detail sections */}
                    <div className="method-detail-sections animate-fade-in-up">
                        {SECTION_LABELS.map(s => (
                            <div key={s.key} className="method-detail-section">
                                <h3 className="method-detail-section-label">{s.label}</h3>
                                <p className={`method-detail-section-value ${s.style === "algo" ? "method-detail-algo" : ""} ${s.style === "mono" ? "method-detail-mono" : ""} ${s.style === "ref" ? "method-detail-ref" : ""}`}>
                                    {tr[s.key]}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Back link */}
                    <div className="method-detail-back animate-fade-in-up">
                        <Link href="/methods" className="method-detail-back-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                            {t("methods.backToIntro")}
                        </Link>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
