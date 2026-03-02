import en from "./locales/en.json";
import zh from "./locales/zh.json";
import vi from "./locales/vi.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import es from "./locales/es.json";
import { methodTranslations } from "../lib/methodsI18n";

export type Locale = "en" | "zh" | "vi" | "ja" | "ko" | "es";

export const LOCALE_LABELS: Record<Locale, string> = {
    en: "EN",
    zh: "中文",
    vi: "VI",
    ja: "日本語",
    ko: "한국어",
    es: "ES",
};

export const LOCALE_NAMES: Record<Locale, string> = {
    en: "English",
    zh: "中文",
    vi: "Tiếng Việt",
    ja: "日本語",
    ko: "한국어",
    es: "Español",
};

// Merge base translations with method-specific translations
const translations: Record<Locale, Record<string, string>> = {
    en: { ...en, ...methodTranslations.en },
    zh: { ...zh, ...methodTranslations.en, ...(methodTranslations.zh ?? {}) },
    vi: { ...vi, ...methodTranslations.en, ...(methodTranslations.vi ?? {}) },
    ja: { ...ja, ...methodTranslations.en, ...(methodTranslations.ja ?? {}) },
    ko: { ...ko, ...methodTranslations.en, ...(methodTranslations.ko ?? {}) },
    es: { ...es, ...methodTranslations.en, ...(methodTranslations.es ?? {}) },
};

export default translations;
