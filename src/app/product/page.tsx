import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "Product",
    description:
        "SourceVerify — AI-powered media authenticity detection. Open-source, privacy-first, browser-based.",
};

export default function ProductPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <div className="edge-glow" aria-hidden="true" />
            <div className="fixed inset-0 -z-10" aria-hidden="true">
                <div className="absolute inset-0 top-glow" />
                <div className="absolute top-0 left-0 right-0 h-[500px] top-glow opacity-60" />
            </div>

            <Header active="/product" />

            {/* Content wrapper — centers vertically */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Hero */}
                <section className="text-center mb-10 lg:mb-14">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
                            Verify media{" "}
                            <span className="gradient-text">authenticity</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed max-w-xl mx-auto animate-fade-in-up">
                            An open-source detection engine that analyzes images and videos for signs of AI generation — entirely in your browser.
                        </p>
                    </div>
                </section>

                {/* Product Cards — wider on large screens */}
                <section className="w-full max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                        {[
                            { icon: "🔬", title: "Multi-signal engine", desc: "6+ detection algorithms running in parallel — frequency analysis, noise patterns, edge detection, metadata inspection and more.", gradient: "from-blue-500/10 to-cyan-500/10" },
                            { icon: "🔒", title: "Privacy by design", desc: "Every computation happens on your device. No uploads, no servers, no tracking. Your files never leave your browser.", gradient: "from-green-500/10 to-emerald-500/10" },
                            { icon: "⚡", title: "Real-time results", desc: "Analysis completes in milliseconds. No queues, no waiting, no accounts — just instant, detailed feedback.", gradient: "from-amber-500/10 to-yellow-500/10" },
                        ].map((item, i) => (
                            <div
                                key={item.title}
                                className={`group relative rounded-2xl bg-transparent p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] animate-fade-in-up animate-delay-${i}`}
                            >
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="relative">
                                    <div className="text-3xl lg:text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-base lg:text-lg font-bold text-[--color-text-primary] mb-2">{item.title}</h3>
                                    <p className="text-[13px] lg:text-sm leading-relaxed text-[--color-text-secondary]">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10 lg:mt-14 animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            Try SourceVerify
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="relative z-10 footer-divider">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="SourceVerify" width={18} height={18} />
                            <span className="text-xs font-semibold text-[--color-text-primary]">SourceVerify</span>
                        </Link>
                        <p className="text-[11px] text-[--color-text-muted]">© {new Date().getFullYear()} SourceVerify · Privacy-first</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
