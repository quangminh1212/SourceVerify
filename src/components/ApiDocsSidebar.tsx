"use client";

import { useLanguage } from "@/i18n/LanguageContext";

interface ApiDocsSidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export default function ApiDocsSidebar({ activeSection, onSectionChange }: ApiDocsSidebarProps) {
    const { t } = useLanguage();

    const SECTIONS = [
        {
            title: t("api.sidebar.gettingStarted"),
            items: [
                { id: "overview", label: t("api.sidebar.overview") },
                { id: "auth", label: t("api.sidebar.authentication") },
                { id: "rate-limits", label: t("api.sidebar.rateLimits") },
            ],
        },
        {
            title: t("api.sidebar.endpoints"),
            items: [
                { id: "endpoint", label: t("api.sidebar.analyzeImage"), method: "POST" },
                { id: "url-analysis", label: t("api.sidebar.analyzeByUrl"), method: "POST" },
                { id: "batch-analysis", label: t("api.sidebar.batchAnalysis"), method: "POST" },
                { id: "analysis-history", label: t("api.sidebar.analysisHistory"), method: "GET" },
            ],
        },
        {
            title: t("api.sidebar.response"),
            items: [
                { id: "response", label: t("api.sidebar.responseFormat") },
                { id: "verdict-values", label: t("api.sidebar.verdictValues") },
                { id: "error-codes", label: t("api.sidebar.errorCodes") },
            ],
        },
        {
            title: t("api.sidebar.advanced"),
            items: [
                { id: "webhooks", label: t("api.sidebar.webhooks") },
            ],
        },
        {
            title: t("api.sidebar.analysisMethods"),
            items: [
                { id: "analysis-methods", label: t("api.methods.title") },
            ],
        },
        {
            title: t("api.sidebar.codeExamples"),
            items: [
                { id: "examples", label: t("api.sidebar.quickStart") },
            ],
        },
    ];

    return (
        <aside className="api-docs-sidebar">
            <nav className="sticky top-16 py-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
                {SECTIONS.map((group) => (
                    <div key={group.title} className="mb-1">
                        <p className="api-sidebar-title">{group.title}</p>
                        <div className="api-sidebar-group">
                            {group.items.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={`api-sidebar-link ${activeSection === item.id ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onSectionChange(item.id);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                >
                                    {"method" in item && item.method && (
                                        <span className={`api-sidebar-badge ${item.method === "GET" ? "get" : "post"}`}>
                                            {item.method}
                                        </span>
                                    )}
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
