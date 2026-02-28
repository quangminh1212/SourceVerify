"use client";

import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="relative z-10 border-t border-[--color-border-subtle]">
            <div className="footer-inner">
                <div className="flex items-center justify-center">
                    <p className="text-[11px] sm:text-xs text-[--color-text-muted] text-center">
                        {t("footer.copyright", { year: new Date().getFullYear().toString() })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
