import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About",
    description:
        "About SourceVerify — our mission to bring transparency and trust to digital media.",
};

export default function AboutPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <div className="edge-glow" aria-hidden="true" />
            <div className="fixed inset-0 -z-10" aria-hidden="true">
                <div className="absolute inset-0 top-glow" />
                <div className="absolute top-0 left-0 right-0 h-[500px] top-glow opacity-60" />
            </div>

            {/* Header */}
            <header className="header-bar">
                <div className="header-inner">
                    <Link href="/" className="header-logo">
                        <Image src="/logo.png" alt="SourceVerify" width={28} height={28} className="logo-img" priority />
                        <span className="header-brand">SourceVerify</span>
                    </Link>
                    <nav className="header-nav" aria-label="Main navigation">
                        <Link href="/product" className="header-nav-link">Product</Link>
                        <Link href="/features" className="header-nav-link">Features</Link>
                        <Link href="/how-it-works" className="header-nav-link">How it works</Link>
                        <Link href="/about" className="header-nav-link font-semibold text-[--color-text-primary]">About</Link>
                    </nav>
                    <div className="header-actions">
                        <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="header-github-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            GitHub
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative z-10 text-center pt-32 pb-8 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-[--color-text-secondary] bg-white/60 border border-[--color-border-subtle] backdrop-blur-xl mb-6 animate-fade-in-up">
                        <span className="w-1.5 h-1.5 rounded-full bg-[--color-accent-green]" />
                        About
                    </div>
                    <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-4 animate-fade-in-up">
                        Building{" "}
                        <span className="gradient-text">trust</span>{" "}
                        in digital media
                    </h1>
                </div>
            </section>

            {/* Content */}
            <section className="relative z-10 px-6 pb-16">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-10 animate-fade-in-up">
                        <p className="text-[15px] leading-[1.8] text-[--color-text-secondary] mb-5">
                            As AI-generated content becomes increasingly indistinguishable from real media, the need for reliable detection tools has never been greater.
                        </p>
                        <p className="text-[15px] leading-[1.8] text-[--color-text-secondary] mb-5">
                            SourceVerify is our answer — an{" "}
                            <strong className="text-[--color-text-primary] font-semibold">open-source</strong>,{" "}
                            <strong className="text-[--color-text-primary] font-semibold">privacy-first</strong>{" "}
                            detection engine that empowers anyone to verify content authenticity.
                        </p>
                        <p className="text-[15px] leading-[1.8] text-[--color-text-secondary]">
                            Every analysis runs entirely in your browser — no uploads, no tracking, no compromise.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-12 animate-fade-in-up animate-delay-1">
                        {[
                            { value: "100%", label: "Open source" },
                            { value: "0", label: "Data collected" },
                            { value: "6+", label: "Detection signals" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-[--color-border-subtle] bg-white/50 backdrop-blur-2xl py-6 px-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(66,133,244,0.08)] hover:border-blue-400/30"
                            >
                                <div className="text-2xl font-extrabold gradient-text mb-1 tracking-tight">{stat.value}</div>
                                <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[--color-text-muted]">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center justify-center gap-3 animate-fade-in-up animate-delay-2">
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            Try SourceVerify
                        </Link>
                        <a
                            href="https://github.com/quangminh1212/SourceVerify"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-[--color-text-secondary] border border-[--color-border-subtle] bg-white/50 backdrop-blur-xl transition-all duration-200 hover:text-[--color-text-primary] hover:border-[--color-text-primary]"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            View on GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 footer-divider mt-auto">
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
