"use client";
import MethodDetail from "../../_components/MethodDetail";
import { getMethodTranslation } from "../../methodsI18n";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Page() {
    const { locale } = useLanguage();
    const tr = getMethodTranslation("markov_variance_vgen", locale);
    return <MethodDetail methodId="markov_variance_vgen" translations={{ [locale]: tr } as any} />;
}
