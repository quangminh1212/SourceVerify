"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApiDocsSidebar from "@/components/ApiDocsSidebar";
import ApiDocsContent from "@/components/ApiDocsContent";

const API_DOCS_URL = "https://sourceverify.app";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface UserInfo {
    apiKey: string;
    email: string;
    name: string;
    picture: string;
    usageCount: number;
}

export default function ApiDocsPage() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [copied, setCopied] = useState(false);
    const [testResult, setTestResult] = useState<string>("");
    const [testing, setTesting] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
                localStorage.setItem("sv_user", JSON.stringify(data.data));
            }
        } catch (e) {
            console.error("Auth error:", e);
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("sv_user");
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
        }

        if (!GOOGLE_CLIENT_ID) return;
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).google) {
                const google = (window as unknown as Record<string, Record<string, { initialize: (c: unknown) => void; renderButton: (e: HTMLElement | null, c: unknown) => void }>>).google;
                if (google?.accounts?.id) {
                    google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleCallback,
                    });
                    const btnEl = document.getElementById("google-signin-btn");
                    if (btnEl) {
                        google.accounts.id.renderButton(btnEl, {
                            theme: "filled_black",
                            size: "large",
                            text: "signin_with",
                            shape: "rectangular",
                            width: 280,
                        });
                    }
                }
            }
        };
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, [handleGoogleCallback]);

    const copyKey = () => {
        if (user?.apiKey) {
            navigator.clipboard.writeText(user.apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("sv_user");
    };

    const testApi = async () => {
        if (!user?.apiKey) return;
        setTesting(true);
        setTestResult("Analyzing...");
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 100; canvas.height = 100;
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(0, 0, 100, 100);
            const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png"));
            const formData = new FormData();
            formData.append("image", blob, "test.png");

            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "X-API-Key": user.apiKey },
                body: formData,
            });
            const data = await res.json();
            setTestResult(JSON.stringify(data, null, 2));
        } catch (e) {
            setTestResult(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
        }
        setTesting(false);
    };

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Mobile section nav */}
                <div className="lg:hidden px-4 py-3 border-b border-[--color-border-subtle] bg-[--color-bg-primary]">
                    <button
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium"
                        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-subtle)' }}
                    >
                        <span>{(() => {
                            const sections = [
                                { id: "overview", label: "Overview" }, { id: "auth", label: "Authentication" }, { id: "rate-limits", label: "Rate Limits" },
                                { id: "endpoint", label: "Analyze Image" }, { id: "url-analysis", label: "Analyze by URL" }, { id: "batch-analysis", label: "Batch Analysis" }, { id: "analysis-history", label: "Analysis History" },
                                { id: "response", label: "Response Format" }, { id: "verdict-values", label: "Verdict Values" }, { id: "error-codes", label: "Error Codes" },
                                { id: "webhooks", label: "Webhooks" }, { id: "examples", label: "Quick Start" },
                            ];
                            return sections.find(s => s.id === activeSection)?.label || "Overview";
                        })()}</span>
                        <svg className="w-4 h-4" style={{ transform: mobileNavOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    {mobileNavOpen && (
                        <nav className="mt-2 rounded-lg overflow-hidden" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
                            {[
                                { title: "Getting Started", items: [{ id: "overview", label: "Overview" }, { id: "auth", label: "Authentication" }, { id: "rate-limits", label: "Rate Limits" }] },
                                { title: "Endpoints", items: [{ id: "endpoint", label: "Analyze Image", method: "POST" }, { id: "url-analysis", label: "Analyze by URL", method: "POST" }, { id: "batch-analysis", label: "Batch Analysis", method: "POST" }, { id: "analysis-history", label: "Analysis History", method: "GET" }] },
                                { title: "Response", items: [{ id: "response", label: "Response Format" }, { id: "verdict-values", label: "Verdict Values" }, { id: "error-codes", label: "Error Codes" }] },
                                { title: "Advanced", items: [{ id: "webhooks", label: "Webhooks" }] },
                                { title: "Code Examples", items: [{ id: "examples", label: "Quick Start" }] },
                            ].map((group) => (
                                <div key={group.title}>
                                    <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)' }}>{group.title}</p>
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => { setActiveSection(item.id); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors"
                                            style={{
                                                color: activeSection === item.id ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
                                                background: activeSection === item.id ? 'rgba(66, 133, 244, 0.08)' : 'transparent',
                                            }}
                                        >
                                            {"method" in item && item.method && (
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{
                                                    color: item.method === "GET" ? 'var(--color-accent-green)' : 'var(--color-accent-blue)',
                                                    background: item.method === "GET" ? 'rgba(52, 168, 83, 0.1)' : 'rgba(66, 133, 244, 0.1)',
                                                }}>{item.method}</span>
                                            )}
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </nav>
                    )}
                </div>
                <ApiDocsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                <ApiDocsContent
                    activeSection={activeSection}
                    user={user}
                    copied={copied}
                    testing={testing}
                    testResult={testResult}
                    onCopyKey={copyKey}
                    onTestApi={testApi}
                    onLogout={logout}
                    googleClientId={GOOGLE_CLIENT_ID}
                    apiDocsUrl={API_DOCS_URL}
                    onSectionChange={setActiveSection}
                />
            </div>

            <Footer />
        </main>
    );
}
