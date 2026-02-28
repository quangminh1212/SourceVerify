"use client";

interface ApiDocsSidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const SECTIONS = [
    {
        title: "Getting Started",
        items: [
            { id: "overview", label: "Overview" },
            { id: "auth", label: "Authentication" },
            { id: "rate-limits", label: "Rate Limits" },
        ],
    },
    {
        title: "Endpoints",
        items: [
            { id: "endpoint", label: "Analyze Image", method: "POST" },
            { id: "url-analysis", label: "Analyze by URL", method: "POST" },
            { id: "batch-analysis", label: "Batch Analysis", method: "POST" },
            { id: "analysis-history", label: "Analysis History", method: "GET" },
        ],
    },
    {
        title: "Response",
        items: [
            { id: "response", label: "Response Format" },
            { id: "verdict-values", label: "Verdict Values" },
            { id: "error-codes", label: "Error Codes" },
        ],
    },
    {
        title: "Advanced",
        items: [
            { id: "webhooks", label: "Webhooks" },
        ],
    },
    {
        title: "Code Examples",
        items: [
            { id: "examples", label: "Quick Start" },
        ],
    },
];

export default function ApiDocsSidebar({ activeSection, onSectionChange }: ApiDocsSidebarProps) {
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
