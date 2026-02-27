"use client";

import Link from "next/link";
import Image from "next/image";
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
        <footer className="relative z-10 footer-divider">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="SourceVerify" width={showLinks ? 22 : 18} height={showLinks ? 22 : 18} priority />
                        <span className={`${showLinks ? 'text-sm' : 'text-xs'} font-semibold text-[--color-text-primary]`}>SourceVerify</span>
                    </Link>
                    {showLinks && (
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[--color-text-muted]">
                            {FOOTER_LINKS.map(link => (
                                <Link key={link.key} href={link.href} className="hover:text-[--color-text-primary] transition-colors">
                                    {t(link.key)}
                                </Link>
                            ))}
                        </div>
                    )}
                    <p className="text-[11px] text-[--color-text-muted]">
                        {t("footer.copyright", { year: new Date().getFullYear().toString() })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
