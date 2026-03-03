"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import {
    METHODS, CATEGORIES, MEDIA_TYPES,
    CAT_COLORS, CAT_HEX, CAT_ICON_PATHS,
    MEDIA_HEX, MEDIA_ICON_PATHS, MEDIA_COLORS,
    type Category, type MediaType,
} from "./data";
import { getMethodTranslation } from "./methodsI18n";

type SortMode = "default" | "name" | "year" | "category";

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

function MediaIcon({ mediaType }: { mediaType: MediaType }) {
    if (mediaType === "all") return null;
    const paths = (MEDIA_ICON_PATHS[mediaType] || "").split(" M");
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={MEDIA_HEX[mediaType]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {paths.map((p, i) => (
                <path key={i} d={i === 0 ? p : `M${p}`} />
            ))}
        </svg>
    );
}

/* Chevron down icon for dropdowns */
function ChevronDown() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

export default function MethodsPage() {
    const { t, locale } = useLanguage();
    const [activeCat, setActiveCat] = useState<Category>("all");
    const [activeMedia, setActiveMedia] = useState<MediaType>("all");
    const [sortMode, setSortMode] = useState<SortMode>("default");
    const router = useRouter();
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Dropdown open states
    const [mediaOpen, setMediaOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const mediaRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("sv_user");
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
        setIsLoggedIn(!!saved);
        const method = localStorage.getItem("sv_method");
        setSelectedId(method);
        const params = new URLSearchParams(window.location.search);
        setIsSelectMode(params.get("select") === "1");
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) setMediaOpen(false);
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSelectMethod = (id: string) => {
        localStorage.setItem("sv_method", id);
        router.push("/");
    };

    const handleMediaChange = (key: MediaType) => {
        setActiveMedia(key);
        setActiveCat("all"); // reset category when switching media type
        setMediaOpen(false);
    };

    const showSelectUI = isSelectMode && !isLoggedIn;

    // Get categories available in the selected media type
    const availableCategories = activeMedia === "all"
        ? CATEGORIES
        : CATEGORIES.filter(cat =>
            cat.key === "all" || METHODS.some(m => m.mediaType === activeMedia && m.category === cat.key)
        );

    const filtered = METHODS.filter(m => {
        const catMatch = activeCat === "all" || m.category === activeCat;
        const mediaMatch = activeMedia === "all" || m.mediaType === activeMedia;
        return catMatch && mediaMatch;
    });

    // Sort the filtered results
    const sorted = useMemo(() => {
        const arr = [...filtered];
        switch (sortMode) {
            case "name":
                return arr.sort((a, b) => {
                    const nameA = getMethodTranslation(a.id, locale).name.toLowerCase();
                    const nameB = getMethodTranslation(b.id, locale).name.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
            case "year":
                return arr.sort((a, b) => (a.year || 9999) - (b.year || 9999));
            case "category":
                return arr.sort((a, b) => {
                    const catOrder: Record<string, number> = { pixel: 0, frequency: 1, statistical: 2, metadata: 3, sensor: 4 };
                    return (catOrder[a.category] ?? 99) - (catOrder[b.category] ?? 99);
                });
            default:
                return arr;
        }
    }, [filtered, sortMode, locale]);

    // Count methods for category tabs based on current media type filter
    const getCatCount = (catKey: Category) => {
        if (activeMedia === "all") return METHODS.filter(m => m.category === catKey).length;
        return METHODS.filter(m => m.mediaType === activeMedia && m.category === catKey).length;
    };

    // Current media label
    const activeMediaLabel = MEDIA_TYPES.find(mt => mt.key === activeMedia);
    const mediaCount = activeMedia === "all" ? METHODS.length : METHODS.filter(m => m.mediaType === activeMedia).length;

    // Sort mode labels
    const SORT_OPTIONS: { key: SortMode; labelKey: string }[] = [
        { key: "default", labelKey: "methods.catAll" },
        { key: "name", labelKey: "methods.sortByName" },
        { key: "year", labelKey: "methods.sortByYear" },
        { key: "category", labelKey: "methods.sortByCategory" },
    ];
    const activeSortLabel = SORT_OPTIONS.find(s => s.key === sortMode);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-20">
                <div className="w-full max-w-5xl mx-auto text-center">

                    {/* Dropdowns row */}
                    <div className="methods-dropdowns-row animate-fade-in-up">
                        {/* Media Type Dropdown */}
                        <div className="methods-dropdown-group">
                            <span className="methods-filter-label">{t("methods.filterByContent")}</span>
                            <div className="methods-dropdown" ref={mediaRef}>
                                <button
                                    className="methods-dropdown-trigger"
                                    onClick={() => { setMediaOpen(!mediaOpen); setSortOpen(false); }}
                                >
                                    {activeMedia !== "all" && <MediaIcon mediaType={activeMedia} />}
                                    <span>{t(activeMediaLabel?.labelKey || "methods.mediaAll")}</span>
                                    {activeMedia !== "all" && (
                                        <span className="methods-dropdown-count">{mediaCount}</span>
                                    )}
                                    <ChevronDown />
                                </button>
                                {mediaOpen && (
                                    <div className="methods-dropdown-menu">
                                        {MEDIA_TYPES.map(mt => (
                                            <button
                                                key={mt.key}
                                                className={`methods-dropdown-item ${activeMedia === mt.key ? "active" : ""}`}
                                                onClick={() => handleMediaChange(mt.key)}
                                            >
                                                {mt.key !== "all" && <MediaIcon mediaType={mt.key} />}
                                                <span>{t(mt.labelKey)}</span>
                                                {mt.key !== "all" && (
                                                    <span className="methods-dropdown-item-count">
                                                        {METHODS.filter(m => m.mediaType === mt.key).length}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="methods-dropdown-group">
                            <span className="methods-filter-label">{t("methods.sortBy")}</span>
                            <div className="methods-dropdown" ref={sortRef}>
                                <button
                                    className="methods-dropdown-trigger"
                                    onClick={() => { setSortOpen(!sortOpen); setMediaOpen(false); }}
                                >
                                    <span>{t(activeSortLabel?.labelKey || "methods.catAll")}</span>
                                    <ChevronDown />
                                </button>
                                {sortOpen && (
                                    <div className="methods-dropdown-menu">
                                        {SORT_OPTIONS.map(opt => (
                                            <button
                                                key={opt.key}
                                                className={`methods-dropdown-item ${sortMode === opt.key ? "active" : ""}`}
                                                onClick={() => { setSortMode(opt.key); setSortOpen(false); }}
                                            >
                                                <span>{t(opt.labelKey)}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Category Tabs — By Technique (only when a specific media type is selected) */}
                    {activeMedia !== "all" && (
                        <div className="methods-filter-section animate-fade-in-up">
                            <span className="methods-filter-label">{t("methods.filterByTechnique")}</span>
                            <div className="methods-cat-tabs">
                                {availableCategories.map(cat => (
                                    <button
                                        key={cat.key}
                                        className={`methods-cat-tab ${activeCat === cat.key ? "active" : ""}`}
                                        onClick={() => setActiveCat(cat.key)}
                                    >
                                        {t(cat.labelKey)}
                                        {cat.key !== "all" && (
                                            <span className={`methods-cat-tab-count count-${cat.key}`}>
                                                {getCatCount(cat.key)}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Result count */}
                    <div className="methods-result-count animate-fade-in-up">
                        {sorted.length} / {METHODS.length}
                    </div>

                    {/* Methods Grid */}
                    <div className="methods-grid animate-fade-in-up">
                        {sorted.map((m, i) => (
                            <Link
                                key={m.id}
                                href={`/methods/${m.mediaType}/${m.id}`}
                                className={`methods-card methods-card-clickable animate-fade-in-up animate-delay-${Math.min(i, 5)}`}
                            >
                                <div className="methods-card-header">
                                    <MethodIcon category={m.category} />
                                    <div className="methods-card-meta">
                                        <span className={`methods-card-badge ${MEDIA_COLORS[m.mediaType]}`}>
                                            <MediaIcon mediaType={m.mediaType} />
                                            {t(`methods.media${m.mediaType.charAt(0).toUpperCase() + m.mediaType.slice(1)}` as string)}
                                        </span>
                                        <span className={`methods-card-badge ${CAT_COLORS[m.category]}`}>
                                            {t(`methods.cat${m.category.charAt(0).toUpperCase() + m.category.slice(1)}` as string)}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="methods-card-name">{getMethodTranslation(m.id, locale).name}</h3>
                                <p className="methods-card-desc">{getMethodTranslation(m.id, locale).description}</p>
                                {m.year && (
                                    <span className="methods-card-year">{m.year}</span>
                                )}
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
