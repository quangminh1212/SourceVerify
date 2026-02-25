import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "Features",
    description:
        "Explore all detection features of SourceVerify — multi-signal analysis, privacy-first, instant results.",
};

const FEATURES = [
    {
        icon: "🔬",
        title: "Multi-signal Analysis",
        desc: "6+ detection algorithms analyze frequency, noise, edge patterns and more simultaneously for comprehensive coverage.",
        accent: "from-blue-500/10 to-cyan-500/10",
    },
    {
        icon: "🔒",
        title: "100% Private",
        desc: "All processing runs locally in your browser. Zero data is ever uploaded to any server.",
        accent: "from-green-500/10 to-emerald-500/10",
    },
    {
        icon: "⚡",
        title: "Instant Results",
        desc: "Get detailed analysis results in milliseconds — no waiting for server-side processing.",
        accent: "from-amber-500/10 to-yellow-500/10",
    },
    {
        icon: "🎯",
        title: "High Accuracy",
        desc: "Advanced heuristic-based detection with confidence scoring across multiple dimensions.",
        accent: "from-rose-500/10 to-pink-500/10",
    },
    {
        icon: "🎬",
        title: "Images & Video",
        desc: "Full support for JPEG, PNG, WebP, GIF, AVIF, MP4, WebM — any visual media format.",
        accent: "from-purple-500/10 to-violet-500/10",
    },
    {
        icon: "📊",
        title: "Detailed Reports",
        desc: "Visual breakdown of every detection signal with score analysis and metadata extraction.",
        accent: "from-indigo-500/10 to-blue-500/10",
    },
];

export default function FeaturesPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <div className="edge-glow" aria-hidden="true" />
            <div className="fixed inset-0 -z-10" aria-hidden="true">
                <div className="absolute inset-0 top-glow" />
                <div className="absolute top-0 left-0 right-0 h-[500px] top-glow opacity-60" />
            </div>

            <Header active="/features" />

            {/* Content wrapper — centers vertically in remaining space */}
            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl text-center">
                    {/* Hero */}
                    <div className="max-w-3xl mx-auto mb-10 lg:mb-14">
                        <h1 className="text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
                            Everything you need to{" "}
                            <span className="gradient-text">detect</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed max-w-xl mx-auto animate-fade-in-up">
                            A comprehensive toolkit for verifying media authenticity — built for transparency and trust.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                        {FEATURES.map((feat, i) => (
                            <div
                                key={feat.title}
                                className={`group relative rounded-2xl bg-transparent p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] animate-fade-in-up animate-delay-${Math.min(i, 5)}`}
                            >
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="relative">
                                    <div className="text-2xl lg:text-3xl mb-4">{feat.icon}</div>
                                    <h3 className="text-sm lg:text-base font-bold text-[--color-text-primary] mb-2">{feat.title}</h3>
                                    <p className="text-[13px] lg:text-sm leading-relaxed text-[--color-text-secondary]">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 lg:mt-14 animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            Try it now
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
