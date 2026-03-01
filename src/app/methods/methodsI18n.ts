/**
 * Aggregated method translations — reads from centralized allMethodsData.ts
 * Replaces 80+ individual JSON imports with a single data source
 */
import type { Locale } from "@/i18n/translations";
import { METHOD_PAGE_DATA } from "./allMethodsData";

type MethodLocaleEntry = { name: string; description: string };

/**
 * Get the translated name & description for a method, falling back to English.
 */
export function getMethodTranslation(methodId: string, locale: Locale): MethodLocaleEntry {
    const methodData = METHOD_PAGE_DATA[methodId];
    if (!methodData) return { name: methodId, description: "" };

    const localeData = methodData[locale] ?? methodData["en"];
    if (!localeData) return { name: methodId, description: "" };

    return { name: localeData.name, description: localeData.description };
}
