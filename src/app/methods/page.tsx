"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

type Category = "all" | "pixel" | "frequency" | "statistical" | "metadata" | "sensor";

const METHODS = [
    { id: "metadata", icon: "📋", nameKey: "api.methods.metadata.name", descKey: "api.methods.metadata.desc", category: "metadata" as Category, weight: 0.12 },
    { id: "spectral", icon: "📊", nameKey: "api.methods.spectral.name", descKey: "api.methods.spectral.desc", category: "frequency" as Category, weight: 0.10 },
    { id: "reconstruction", icon: "🔬", nameKey: "api.methods.reconstruction.name", descKey: "api.methods.reconstruction.desc", category: "pixel" as Category, weight: 0.08 },
    { id: "noise", icon: "◫", nameKey: "api.methods.noise.name", descKey: "api.methods.noise.desc", category: "pixel" as Category, weight: 0.09 },
    { id: "edge", icon: "⬡", nameKey: "api.methods.edge.name", descKey: "api.methods.edge.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "gradient", icon: "▤", nameKey: "api.methods.gradient.name", descKey: "api.methods.gradient.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "benford", icon: "📈", nameKey: "api.methods.benford.name", descKey: "api.methods.benford.desc", category: "statistical" as Category, weight: 0.06 },
    { id: "chromatic", icon: "🌈", nameKey: "api.methods.chromatic.name", descKey: "api.methods.chromatic.desc", category: "sensor" as Category, weight: 0.08 },
    { id: "texture", icon: "🧩", nameKey: "api.methods.texture.name", descKey: "api.methods.texture.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "cfa", icon: "⊞", nameKey: "api.methods.cfa.name", descKey: "api.methods.cfa.desc", category: "sensor" as Category, weight: 0.10 },
    { id: "dct", icon: "▦", nameKey: "api.methods.dct.name", descKey: "api.methods.dct.desc", category: "frequency" as Category, weight: 0.06 },
    { id: "color", icon: "◈", nameKey: "api.methods.color.name", descKey: "api.methods.color.desc", category: "pixel" as Category, weight: 0.05 },
    { id: "prnu", icon: "⊕", nameKey: "api.methods.prnu.name", descKey: "api.methods.prnu.desc", category: "sensor" as Category, weight: 0.05 },
];

const CATEGORIES: { key: Category; labelKey: string }[] = [
    { key: "all", labelKey: "methods.catAll" },
    { key: "pixel", labelKey: "methods.catPixel" },
    { key: "frequency", labelKey: "methods.catFrequency" },
    { key: "statistical", labelKey: "methods.catStatistical" },
    { key: "metadata", labelKey: "methods.catMetadata" },
    { key: "sensor", labelKey: "methods.catSensor" },
];

const CAT_COLORS: Record<Category, string> = {
    all: "",
    pixel: "cat-pixel",
    frequency: "cat-frequency",
    statistical: "cat-statistical",
    metadata: "cat-metadata",
    sensor: "cat-sensor",
};

export default function MethodsPage() {
    const { t } = useLanguage();
    const [activeCat, setActiveCat] = useState<Category>("all");

    const filtered = activeCat === "all"
        ? METHODS
        : METHODS.filter(m => m.category === activeCat);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl mx-auto text-center">
                    {/* Header */}
                    <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
                        <h1 className="methods-page-title text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary]">
                            {t("methods.headline")}{" "}
                            <span className="gradient-text">{t("methods.headlineHighlight")}</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed mx-auto text-center">
                            {t("methods.subtitle1")}
                        </p>
                        <p className="methods-page-subtitle2 text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed mx-auto text-center">
                            {t("methods.subtitle2")}
                        </p>
                    </div>

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

                    {/* Methods Grid */}
                    <div className="methods-grid animate-fade-in-up">
                        {filtered.map((m, i) => (
                            <div
                                key={m.id}
                                className={`methods-card animate-fade-in-up animate-delay-${Math.min(i, 5)}`}
                            >
                                <div className="methods-card-header">
                                    <span className="methods-card-icon">{m.icon}</span>
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

                                {/* Weight bar */}
                                <div className="methods-card-bar-track">
                                    <div
                                        className={`methods-card-bar-fill methods-bar-w-${Math.round(m.weight * 100)}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12 sm:mt-16 animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {t("methods.cta")}
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
