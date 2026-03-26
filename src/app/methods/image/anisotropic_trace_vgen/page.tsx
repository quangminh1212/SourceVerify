"use client";
import MethodDetail from "../../_components/MethodDetail";
import { getMethodTranslation } from "../../methodsI18n";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Page() {
    const { locale } = useLanguage();
    const tr = getMethodTranslation("anisotropic_trace_vgen", locale);
    return <MethodDetail methodId="anisotropic_trace_vgen" translations={{ [locale]: tr } as any} />;
}
