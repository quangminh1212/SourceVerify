import en from "./locales/en.json";
import zh from "./locales/zh.json";
import vi from "./locales/vi.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";

export type Locale = "en" | "zh" | "vi" | "ja" | "ko";

export const LOCALE_LABELS: Record<Locale, string> = {
    en: "EN",
    zh: "中文",
    vi: "VI",
    ja: "日本語",
    ko: "한국어",
};

export const LOCALE_NAMES: Record<Locale, string> = {
    en: "English",
    zh: "中文",
    vi: "Tiếng Việt",
    ja: "日本語",
    ko: "한국어",
};

const translations: Record<Locale, Record<string, string>> = {
    en,
    zh,
    vi,
    ja,
    ko,
};

export default translations;
