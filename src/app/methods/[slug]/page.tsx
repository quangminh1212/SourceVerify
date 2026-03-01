"use client";
import MethodDetail from "../_components/MethodDetail";
import { METHOD_PAGE_DATA, ALL_METHOD_SLUGS, type MethodPageI18n } from "../allMethodsData";
import { notFound } from "next/navigation";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    if (!ALL_METHOD_SLUGS.includes(slug)) {
        notFound();
    }

    const translations = METHOD_PAGE_DATA[slug] as MethodPageI18n;
    return <MethodDetail methodId={slug} translations={translations} />;
}
