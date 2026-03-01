"use client";
import MethodDetail from "../_components/MethodDetail";
import en from "./i18n/en.json";
import vi from "./i18n/vi.json";
import zh from "./i18n/zh.json";
import ja from "./i18n/ja.json";
import ko from "./i18n/ko.json";
import es from "./i18n/es.json";

const i18n = { en, vi, zh, ja, ko, es };

export default function Page() {
    return <MethodDetail methodId="mutual_information" translations={i18n} />;
}
