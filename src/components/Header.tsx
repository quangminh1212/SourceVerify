"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";
import { LOCALE_LABELS, type Locale } from "@/i18n/translations";

const NAV_KEYS = [
    { key: "nav.product", href: "/product" },
    { key: "nav.features", href: "/features" },
    { key: "nav.howItWorks", href: "/how-it-works" },
    { key: "nav.methods", href: "/methods" },
    { key: "nav.about", href: "/about" },
];

const LOCALES: Locale[] = ["en", "zh", "vi", "ja", "ko", "es"];
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface GoogleUser {
    name: string;
    email: string;
    picture: string;
    apiKey?: string;
}

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState<GoogleUser | null>(null);
    const [isDark, setIsDark] = useState(false);
    const { locale, setLocale, t } = useLanguage();

    // Dark mode initialization
    useEffect(() => {
        const stored = localStorage.getItem("sv_theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const dark = stored ? stored === "dark" : prefersDark;
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("sv_theme", next ? "dark" : "light");
    };

    const handleCredential = useCallback(async (credential: string) => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential }),
            });
            const data = await res.json();
            if (data.success) {
                const userData: GoogleUser = {
                    name: data.data.name,
                    email: data.data.email,
                    picture: data.data.picture,
                    apiKey: data.data.apiKey,
                };
                setUser(userData);
                localStorage.setItem("sv_user", JSON.stringify(userData));
            }
        } catch (e) {
            console.error("Auth error:", e);
        }
    }, []);

    // Open Google OAuth popup (Implicit Flow)
    const openGoogleLogin = useCallback(() => {
        if (!GOOGLE_CLIENT_ID) {
            alert("Google Sign-In is not configured.");
            return;
        }
        const redirectUri = `${window.location.origin}/api/auth/callback/google`;
        const nonce = Math.random().toString(36).substring(2);
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: redirectUri,
            response_type: "id_token",
            scope: "openid email profile",
            nonce,
        });
        const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        const w = 480, h = 640;
        const left = (screen.width - w) / 2, top = (screen.height - h) / 2;
        window.open(url, "google_login", `width=${w},height=${h},left=${left},top=${top}`);
    }, []);

    useEffect(() => {
        // Restore user from localStorage
        const saved = localStorage.getItem("sv_user");
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
        }

        // Listen for OAuth callback message from popup
        const onMessage = (e: MessageEvent) => {
            if (e.origin !== window.location.origin) return;
            if (e.data?.type === "google-auth" && e.data.id_token) {
                handleCredential(e.data.id_token);
            }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [handleCredential]);

    const logout = () => {
        setUser(null);
        setUserMenuOpen(false);
        localStorage.removeItem("sv_user");
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".lang-switcher")) setLangOpen(false);
            if (!target.closest(".user-menu-wrapper")) setUserMenuOpen(false);
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    return (
        <header className="header-bar">
            <div className="header-inner">
                <Link href="/" className="header-logo">
                    <Image src="/logo.png" alt="SourceVerify" width={28} height={28} className="logo-img" priority />
                    <span className="header-brand">SourceVerify</span>
                </Link>

                <nav className="header-nav" aria-label="Main navigation">
                    {NAV_KEYS.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            className={`header-nav-link ${pathname === link.href ? "header-nav-link-active" : ""}`}
                        >
                            {t(link.key)}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        title={isDark ? "Light mode" : "Dark mode"}
                    >
                        {isDark ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    {/* Language Switcher */}
                    <div className="lang-switcher">
                        <button
                            className="lang-switcher-btn"
                            onClick={() => setLangOpen(!langOpen)}
                            aria-label="Change language"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                            </svg>
                            {LOCALE_LABELS[locale]}
                        </button>
                        {langOpen && (
                            <div className="lang-dropdown">
                                {LOCALES.map((l) => (
                                    <button
                                        key={l}
                                        className={`lang-option ${l === locale ? "active" : ""}`}
                                        onClick={() => { setLocale(l); setLangOpen(false); }}
                                    >
                                        {LOCALE_LABELS[l]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Google Sign-In / User Menu */}
                    {user ? (
                        <div className="user-menu-wrapper">
                            <button
                                className="user-avatar-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-label="User menu"
                            >
                                {user.picture ? (
                                    <img src={user.picture} alt="" className="user-avatar-img" referrerPolicy="no-referrer" />
                                ) : (
                                    <span className="user-avatar-fallback">{user.name?.[0] || "U"}</span>
                                )}
                            </button>
                            {userMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="user-dropdown-header">
                                        <div className="user-dropdown-name">{user.name}</div>
                                        <div className="user-dropdown-email">{user.email}</div>
                                    </div>
                                    <Link href="/api-docs" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                        {t("header.apiKey")}
                                    </Link>
                                    <button className="user-dropdown-item user-dropdown-logout" onClick={logout}>
                                        {t("header.signOut")}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="header-signin-fallback"
                            onClick={openGoogleLogin}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            {t("header.signIn")}
                        </button>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className="header-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {open ? (
                            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                        ) : (
                            <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="header-mobile-menu">
                    {NAV_KEYS.map((link) => (
                        <Link key={link.key} href={link.href} className={`header-mobile-link ${pathname === link.href ? "header-mobile-link-active" : ""}`} onClick={() => setOpen(false)}>
                            {t(link.key)}
                        </Link>
                    ))}
                    {/* Mobile user section */}
                    {user ? (
                        <div className="mobile-user-section">
                            <div className="mobile-user-info">
                                {user.picture && <img src={user.picture} alt="" className="mobile-user-avatar" referrerPolicy="no-referrer" />}
                                <span className="mobile-user-name">{user.name}</span>
                            </div>
                            <Link href="/api-docs" className="header-mobile-link" onClick={() => setOpen(false)}>{t("header.apiKey")}</Link>
                            <button className="header-mobile-link mobile-logout-btn" onClick={() => { logout(); setOpen(false); }}>{t("header.signOut")}</button>
                        </div>
                    ) : (
                        <div className="mobile-google-wrapper">
                            <button className="header-mobile-link mobile-signin-btn" onClick={() => { openGoogleLogin(); setOpen(false); }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                {t("header.signIn")}
                            </button>
                        </div>
                    )}
                    {/* Mobile theme toggle */}
                    <div className="mobile-settings-section">
                        <button
                            className="mobile-theme-toggle"
                            onClick={toggleTheme}
                        >
                            <span className="mobile-theme-icon">
                                {isDark ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                )}
                            </span>
                            <span>{isDark ? t("header.lightMode") : t("header.darkMode")}</span>
                        </button>
                    </div>
                    {/* Mobile language switcher */}
                    <div className="mobile-lang-section">
                        {LOCALES.map((l) => (
                            <button
                                key={l}
                                className={`lang-mobile-btn ${l === locale ? "active" : ""}`}
                                onClick={() => { setLocale(l); setOpen(false); }}
                            >
                                {LOCALE_LABELS[l]}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
