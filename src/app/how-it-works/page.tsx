import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "How it works",
    description:
        "Learn how SourceVerify detects AI-generated content in 3 simple steps.",
};

const STEPS = [
    {
        num: "01",
        title: "Upload your file",
        desc: "Drag and drop or click to upload any image or video. We support JPEG, PNG, WebP, GIF, MP4, WebM and more — up to 100MB.",
        icon: "📁",
    },
    {
        num: "02",
        title: "Multi-signal analysis",
        desc: "Our engine runs 6+ detection algorithms in parallel — analyzing frequency patterns, noise signatures, edge artifacts and metadata — all locally in your browser.",
        icon: "🔬",
    },
    {
        num: "03",
        title: "Get your results",
        desc: "View a detailed breakdown with an overall confidence score, individual signal analysis, and clear verdict on whether the content appears AI-generated.",
        icon: "📊",
    },
];

export default function HowItWorksPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <div className="edge-glow" aria-hidden="true" />
            <div className="fixed inset-0 -z-10" aria-hidden="true">
                <div className="absolute inset-0 top-glow" />
                <div className="absolute top-0 left-0 right-0 h-[500px] top-glow opacity-60" />
            </div>

            <Header active="/how-it-works" />

            {/* Centered content */}
            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl text-center">
                    {/* Hero */}
                    <div className="max-w-3xl mx-auto mb-10 lg:mb-14">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
                            Three simple{" "}
                            <span className="gradient-text">steps</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed max-w-xl mx-auto animate-fade-in-up">
                            From upload to verdict in seconds — no setup, no account, no data collection.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 text-left">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.num}
                                className={`group relative rounded-2xl bg-transparent p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] animate-fade-in-up animate-delay-${i}`}
                            >
                                <div className="lg:mb-5 mb-0 flex lg:flex-col items-start gap-4 lg:gap-0">
                                    <span className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center text-xs lg:text-sm font-extrabold text-blue-600 tracking-wide flex-shrink-0 lg:mb-5">
                                        {step.num}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl lg:text-2xl">{step.icon}</span>
                                            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[--color-text-primary]">{step.title}</h3>
                                        </div>
                                        <p className="text-[13px] lg:text-sm leading-relaxed text-[--color-text-secondary]">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 lg:mt-14 animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            Start detecting
                        </Link>
                    </div>
                </div>
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
