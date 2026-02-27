"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";
import { LOCALE_LABELS, type Locale } from "@/i18n/translations";

const NAV_KEYS = [
    { key: "nav.product", href: "/product" },
    { key: "nav.features", href: "/features" },
    { key: "nav.howItWorks", href: "/how-it-works" },
    { key: "nav.apiDocs", href: "/api-docs" },
    { key: "nav.about", href: "/about" },
];

const LOCALES: Locale[] = ["en", "zh", "vi", "ja", "ko"];

export default function Header({ active }: { active?: string }) {
    const [open, setOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const { locale, setLocale, t } = useLanguage();

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
                            className={`header-nav-link ${active === link.href ? "font-semibold text-[--color-text-primary]" : ""}`}
                        >
                            {t(link.key)}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
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

                    <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="header-github-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        GitHub
                    </a>
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
                        <Link key={link.key} href={link.href} className="header-mobile-link" onClick={() => setOpen(false)}>
                            {t(link.key)}
                        </Link>
                    ))}
                    {/* Mobile language switcher */}
                    <div className="header-mobile-lang">
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
                    <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="header-mobile-link">
                        GitHub
                    </a>
                </div>
            )}
        </header>
    );
}
