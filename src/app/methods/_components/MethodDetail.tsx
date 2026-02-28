"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { METHODS, CAT_HEX, CAT_COLORS, CAT_ICON_PATHS, type Category } from "../data";

export type Reference = {
    title: string;
    url?: string;
};

export type MethodTranslations = {
    name: string;
    description: string;
    algorithm: string;
    mechanism: string;
    parameters: string;
    accuracy: string;
    source: string;
    useCase: string;
    references?: Reference[];
    limitations?: string;
    strengths?: string;
};

type MethodI18n = Record<string, MethodTranslations>;

function MethodIcon({ category, size = 28 }: { category: Category; size?: number }) {
    const d = CAT_ICON_PATHS[category] || "";
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

/** Renders text with \n as line breaks and **text** as bold */
function FormattedText({ text }: { text: string }) {
    const paragraphs = text.split(/\n\n+/);
    return (
        <>
            {paragraphs.map((para, pi) => {
                const lines = para.split(/\n/);
                return (
                    <span key={pi} className="method-detail-paragraph">
                        {lines.map((line, li) => {
                            // Parse **bold** markers
                            const parts = line.split(/(\*\*[^*]+\*\*)/g);
                            return (
                                <span key={li}>
                                    {li > 0 && <br />}
                                    {parts.map((part, i) => {
                                        if (part.startsWith("**") && part.endsWith("**")) {
                                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                                        }
                                        // Parse bullet points
                                        if (part.startsWith("• ")) {
                                            return <span key={i} className="method-detail-bullet">{part}</span>;
                                        }
                                        return <span key={i}>{part}</span>;
                                    })}
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </>
    );
}

const SECTION_LABELS = [
    { key: "algorithm" as const, label: "Algorithm / Model", style: "algo" },
    { key: "mechanism" as const, label: "How it works", style: "" },
    { key: "parameters" as const, label: "Technical Parameters", style: "mono" },
    { key: "accuracy" as const, label: "Accuracy & Reliability", style: "" },
    { key: "strengths" as const, label: "Strengths", style: "" },
    { key: "limitations" as const, label: "Limitations", style: "" },
    { key: "useCase" as const, label: "Use Case", style: "" },
    { key: "source" as const, label: "Academic Reference", style: "ref" },
];

export default function MethodDetail({ methodId, translations }: { methodId: string; translations: MethodI18n }) {
    const { t, locale } = useLanguage();

    const method = METHODS.find(m => m.id === methodId);
    if (!method) return null;

    const tr = translations[locale] || translations.en;
    const catLabel = t(`methods.cat${method.category.charAt(0).toUpperCase() + method.category.slice(1)}` as string);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-3xl mx-auto">

                    {/* Breadcrumb + back nav */}
                    <nav className="method-detail-breadcrumb animate-fade-in-up">
                        <Link href="/methods" className="method-detail-back-nav">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                        </Link>
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
                            <MethodIcon category={method.category} size={36} />
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
                        {SECTION_LABELS.map(s => {
                            const value = tr[s.key as keyof MethodTranslations];
                            if (!value || typeof value !== "string") return null;
                            return (
                                <div key={s.key} className="method-detail-section">
                                    <h3 className="method-detail-section-label">{s.label}</h3>
                                    <div className={`method-detail-section-value ${s.style === "algo" ? "method-detail-algo" : ""} ${s.style === "mono" ? "method-detail-mono" : ""} ${s.style === "ref" ? "method-detail-ref" : ""}`}>
                                        <FormattedText text={value} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* References with links */}
                    {tr.references && tr.references.length > 0 && (
                        <div className="method-detail-section method-detail-references animate-fade-in-up">
                            <h3 className="method-detail-section-label">References & Citations</h3>
                            <ol className="method-detail-ref-list">
                                {tr.references.map((ref, i) => (
                                    <li key={i} className="method-detail-ref-item">
                                        {ref.url ? (
                                            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="method-detail-ref-link">
                                                {ref.title}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="method-detail-ref-icon">
                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <span>{ref.title}</span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

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
