"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { METHODS, CATEGORIES, CAT_COLORS, CAT_HEX, CAT_ICON_PATHS, type Category } from "./data";
import { getMethodTranslation } from "./methodsI18n";

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
    const { t, locale } = useLanguage();
    const [activeCat, setActiveCat] = useState<Category>("all");
    const router = useRouter();
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("sv_user");
        setIsLoggedIn(!!saved);
        const method = localStorage.getItem("sv_method");
        setSelectedId(method);
        // Check URL for select mode
        const params = new URLSearchParams(window.location.search);
        setIsSelectMode(params.get("select") === "1");
    }, []);

    const handleSelectMethod = (id: string) => {
        localStorage.setItem("sv_method", id);
        router.push("/");
    };

    const showSelectUI = isSelectMode && !isLoggedIn;

    const filtered = activeCat === "all"
        ? METHODS
        : METHODS.filter(m => m.category === activeCat);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-20">
                <div className="w-full max-w-5xl mx-auto text-center">


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
                                    <span className={`methods-cat-tab-count count-${cat.key}`}>
                                        {METHODS.filter(m => m.category === cat.key).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Methods Grid */}
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
                                    </div>
                                </div>
                                <h3 className="methods-card-name">{getMethodTranslation(m.id, locale).name}</h3>
                                <p className="methods-card-desc">{getMethodTranslation(m.id, locale).description}</p>
                                {showSelectUI && (
                                    <button
                                        className={`methods-select-btn ${selectedId === m.id ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelectMethod(m.id); }}
                                    >
                                        {selectedId === m.id ? t("methods.currentMethod") : t("methods.useThis")}
                                    </button>
                                )}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
