"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import translations, { type Locale, LOCALE_NAMES } from "./translations";

type LanguageContextType = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (key: string, vars?: Record<string, string>) => string;
};

const STORAGE_KEY = "sv-locale";

function detectLocale(): Locale {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in LOCALE_NAMES) return saved as Locale;
    const nav = navigator.language?.toLowerCase() ?? "";
    if (nav.startsWith("vi")) return "vi";
    if (nav.startsWith("zh")) return "zh";
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("ko")) return "ko";
    return "en";
}

const fallbackT = (key: string, vars?: Record<string, string>) => {
    let val = translations.en[key] ?? key;
    if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
            val = val.replace(`{${k}}`, v);
        });
    }
    return val;
};

const defaultValue: LanguageContextType = {
    locale: "en",
    setLocale: () => { },
    t: fallbackT,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setLocaleState(detectLocale());
        setMounted(true);
    }, []);

    const setLocale = useCallback((l: Locale) => {
        setLocaleState(l);
        localStorage.setItem(STORAGE_KEY, l);
        document.documentElement.lang = l === "zh" ? "zh-CN" : l;
    }, []);

    const t = useCallback(
        (key: string, vars?: Record<string, string>) => {
            let val = translations[locale]?.[key] ?? translations.en[key] ?? key;
            if (vars) {
                Object.entries(vars).forEach(([k, v]) => {
                    val = val.replace(`{${k}}`, v);
                });
            }
            return val;
        },
        [locale],
    );

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {!mounted ? <div className="i18n-loading">{children}</div> : children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
