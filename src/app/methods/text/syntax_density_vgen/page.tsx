"use client";
import MethodDetail from "../../_components/MethodDetail";
import { getMethodTranslation } from "../../methodsI18n";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Page() {
    const { locale } = useLanguage();
    const tr = getMethodTranslation("syntax_density_vgen", locale);
    return <MethodDetail methodId="syntax_density_vgen" translations={{ [locale]: tr } as any} />;
}
