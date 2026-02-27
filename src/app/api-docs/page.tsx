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

    const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
        try {
            const res = await fetch("/api/v1/auth", {
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

            const res = await fetch("/api/v1/analyze", {
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

            <div className="flex-1 flex">
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
                />
            </div>

            <Footer />
        </main>
    );
}
