import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About",
    description: "About SourceVerify — our mission to bring transparency and trust to digital media through open-source AI detection.",
};

export default function AboutPage() {
    return (
        <main className="subpage-main">
            <div className="edge-glow" aria-hidden="true" />
            <div className="fixed inset-0 top-glow -z-10" aria-hidden="true" />
            <div className="fixed top-0 left-0 right-0 h-[400px] pointer-events-none top-glow opacity-50" aria-hidden="true" />

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
                        <Link href="/about" className="header-nav-link header-nav-active">About</Link>
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
            <section className="subpage-hero">
                <div className="subpage-badge animate-fade-in-up">
                    <span className="subpage-badge-dot" />
                    About
                </div>
                <h1 className="subpage-title animate-fade-in-up">
                    Building <span className="gradient-text">trust</span> in digital media
                </h1>
                <p className="subpage-desc animate-fade-in-up">
                    As AI-generated content becomes indistinguishable from reality, SourceVerify empowers anyone to verify media authenticity — openly, privately, and instantly.
                </p>
            </section>

            {/* Content */}
            <section className="subpage-content">
                <div className="about-body animate-fade-in-up">
                    <p className="about-text">
                        We believe verification should be <strong>accessible</strong>, <strong>transparent</strong>, and <strong>private</strong>. That&apos;s why every analysis runs entirely in your browser — no uploads, no tracking, no compromise.
                    </p>
                    <p className="about-text">
                        SourceVerify is fully open-source. We invite researchers, journalists, and developers to use, audit, and build upon our detection engine.
                    </p>
                </div>

                {/* Stats */}
                <div className="about-stats animate-fade-in-up animate-delay-1">
                    {[
                        { value: "100%", label: "Open source" },
                        { value: "0", label: "Data collected" },
                        { value: "6+", label: "Detection signals" },
                    ].map((stat) => (
                        <div key={stat.label} className="about-stat">
                            <span className="about-stat-value gradient-text">{stat.value}</span>
                            <span className="about-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="subpage-cta animate-fade-in-up animate-delay-2">
                    <Link href="/" className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        Try SourceVerify
                    </Link>
                    <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                        View on GitHub
                    </a>
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
