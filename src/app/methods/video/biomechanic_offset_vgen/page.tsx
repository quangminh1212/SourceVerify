"use client";
import MethodDetail from "../../_components/MethodDetail";
import { getMethodTranslation } from "../../methodsI18n";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Page() {
    const { locale } = useLanguage();
    const tr = getMethodTranslation("biomechanic_offset_vgen", locale);
    return <MethodDetail methodId="biomechanic_offset_vgen" translations={{ [locale]: tr } as any} />;
}
