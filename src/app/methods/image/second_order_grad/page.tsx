"use client";
import MethodDetail from "../../_components/MethodDetail";
import en from "./i18n/en.json";
import vi from "./i18n/vi.json";

const i18n = { en, vi };

export default function Page() {
    return <MethodDetail methodId="second_order_grad" translations={i18n} />;
}
