import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "How it works",
    description: "Learn how SourceVerify detects AI-generated content in 3 simple steps — upload, analyze, results.",
};

const STEPS = [
    { num: "1", title: "Upload your file", desc: "Drag and drop or click to upload any image or video. We support JPEG, PNG, WebP, GIF, MP4, WebM and more — up to 100MB.", icon: "📁" },
    { num: "2", title: "Multi-signal analysis", desc: "Our engine runs 6+ detection algorithms in parallel — analyzing frequency patterns, noise signatures, edge artifacts and metadata — all locally in your browser.", icon: "🔬" },
    { num: "3", title: "Get your results", desc: "View a detailed breakdown with an overall confidence score, individual signal analysis, and clear verdict on whether the content appears AI-generated.", icon: "📊" },
];

export default function HowItWorksPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <div className="edge-glow" aria-hidden="true" />
            <div className="fixed inset-0 top-glow -z-10" aria-hidden="true" />

            {/* Header */}
            <header className="header-bar">
                <div className="header-inner">
                    <Link href="/" className="header-logo">
                        <Image src="/logo.png" alt="SourceVerify" width={28} height={28} priority />
                        <span className="header-brand">SourceVerify</span>
                    </Link>
                    <nav className="header-nav">
                        <Link href="/product" className="header-nav-link">Product</Link>
                        <Link href="/features" className="header-nav-link">Features</Link>
                        <Link href="/how-it-works" className="header-nav-link" style={{ color: 'var(--color-text-primary)' }}>How it works</Link>
                        <Link href="/about" className="header-nav-link">About</Link>
                    </nav>
                    <div className="header-actions">
                        <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="header-github-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            GitHub
                        </a>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="relative z-10 flex-1 px-6 py-20">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-14 animate-fade-in-up">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[--color-text-muted] mb-6">Process</p>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[--color-text-primary] mb-4">
                            Three simple <span className="gradient-text">steps</span>
                        </h1>
                        <p className="text-base text-[--color-text-secondary] max-w-md mx-auto">
                            From upload to verdict in seconds — no setup, no account, no data collection.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {STEPS.map((step, i) => (
                            <div key={step.num} className={`flex gap-5 animate-fade-in-up animate-delay-${i}`}>
                                <div className="flex flex-col items-center">
                                    <div className="step-num step-num-lg">{step.num}</div>
                                    {i < STEPS.length - 1 && <div className="w-px flex-1 bg-[--color-border-subtle] mt-2" />}
                                </div>
                                <div className="card p-5 flex-1">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl">{step.icon}</span>
                                        <div>
                                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-1">{step.title}</h3>
                                            <p className="text-xs text-[--color-text-secondary] leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-14 animate-fade-in-up">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            Start detecting
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                    </div>
                </div>
            </section>

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
