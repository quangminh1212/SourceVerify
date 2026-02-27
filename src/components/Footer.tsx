"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

const FOOTER_LINKS = [
    { key: "nav.product", href: "/product" },
    { key: "nav.features", href: "/features" },
];

interface FooterProps {
    /** Show navigation links (default: false for sub-pages, true for homepage) */
    showLinks?: boolean;
}

export default function Footer({ showLinks = false }: FooterProps) {
    const { t } = useLanguage();

    return (
        <footer className="relative z-10 border-t border-[--color-border-subtle]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
                <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
                    {showLinks && (
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[--color-text-muted]">
                            {FOOTER_LINKS.map(link => (
                                <Link key={link.key} href={link.href} className="hover:text-[--color-text-primary] transition-colors">
                                    {t(link.key)}
                                </Link>
                            ))}
                        </div>
                    )}
                    <p className="text-[11px] sm:text-xs text-[--color-text-muted] text-center">
                        {t("footer.copyright", { year: new Date().getFullYear().toString() })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
