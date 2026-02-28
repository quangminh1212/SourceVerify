"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <main className="relative min-h-screen flex items-center justify-center px-6">
            <div className="text-center animate-fade-in-up">
                <div className="text-6xl mb-6 flex justify-center" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg></div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                    <span className="gradient-text">404</span>
                </h1>
                <h2 className="text-xl font-semibold text-[--color-text-secondary] mb-4">
                    {t("notFound.title")}
                </h2>
                <p className="text-sm text-[--color-text-muted] max-w-md mx-auto mb-8">
                    {t("notFound.description")}
                </p>
                <Link
                    href="/"
                    className="btn-primary inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-accent-cyan]"
                >
                    <span>← {t("notFound.backHome")}</span>
                </Link>
            </div>
        </main>
    );
}
