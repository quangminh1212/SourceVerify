"use client";
import MethodDetail from "../../_components/MethodDetail";
import { getMethodTranslation } from "../../methodsI18n";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Page() {
    const { locale } = useLanguage();
    const tr = getMethodTranslation("gait_residue_vgen", locale);
    return <MethodDetail methodId="gait_residue_vgen" translations={{ [locale]: tr } as any} />;
}
