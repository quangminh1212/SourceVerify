"use client";
import MethodDetail from "../../_components/MethodDetail";
import { getMethodTranslation } from "../../methodsI18n";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Page() {
    const { locale } = useLanguage();
    const tr = getMethodTranslation("facs_energy_vgen", locale);
    return <MethodDetail methodId="facs_energy_vgen" translations={{ [locale]: tr } as any} />;
}
