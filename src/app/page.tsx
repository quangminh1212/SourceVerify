"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  analyzeMedia,
  formatFileSize,
  type AnalysisResult,
} from "@/lib/analyzer";
import { useLanguage } from "@/i18n/LanguageContext";
import { LOCALE_LABELS, type Locale } from "@/i18n/translations";

const ACCEPTED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/avif",
  "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo",
];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const NAV_KEYS = [
  { key: "nav.product", href: "/product" },
  { key: "nav.features", href: "/features" },
  { key: "nav.howItWorks", href: "/how-it-works" },
  { key: "nav.about", href: "/about" },
];

const LOCALES: Locale[] = ["en", "zh", "vi", "ja", "ko"];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => { return () => { if (preview) URL.revokeObjectURL(preview); }; }, [preview]);

  const handleFile = useCallback(async (selectedFile: File) => {
    setError(null);
    setResult(null);
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) { setError(t("home.errorUnsupported")); return; }
    if (selectedFile.size > MAX_FILE_SIZE) { setError(t("home.errorTooLarge")); return; }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsAnalyzing(true);
    setProgress(0);

    const iv = setInterval(() => {
      setProgress(p => { if (p >= 90) { clearInterval(iv); return p; } return p + Math.random() * 15; });
    }, 200);

    try {
      const r = await analyzeMedia(selectedFile);
      clearInterval(iv);
      setProgress(100);
      await new Promise(res => setTimeout(res, 500));
      setResult(r);
      setIsAnalyzing(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      clearInterval(iv);
      setIsAnalyzing(false);
      setError(t("home.errorFailed"));
    }
  }, [t]);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }, [handleFile]);
  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setResult(null); setError(null); setProgress(0); setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [preview]);

  // Ctrl+V paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (file || isAnalyzing) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/') || item.type.startsWith('video/')) {
          const pastedFile = item.getAsFile();
          if (pastedFile) { e.preventDefault(); handleFile(pastedFile); return; }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [file, isAnalyzing, handleFile]);


  return (
    <main className="relative min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[#4285f4] focus:text-white focus:rounded-full focus:text-sm">{t("home.skipToContent")}</a>

      {/* Edge glow removed for clean white background */}

      {/* ===== Header — Antigravity Style ===== */}
      <header className="header-bar">
        <div className="header-inner">
          {/* Logo */}
          <div className="header-logo">
            <Image src="/logo.png" alt="SourceVerify" width={28} height={28} className="logo-img" priority />
            <span className="header-brand">SourceVerify</span>
          </div>

          {/* Nav — desktop */}
          <nav className="header-nav" aria-label="Main navigation">
            {NAV_KEYS.map(link => (
              <Link key={link.key} href={link.href} className="header-nav-link">
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Language Switcher */}
            <div className="lang-switcher">
              <button
                className="lang-switcher-btn"
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Change language"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                {LOCALE_LABELS[locale]}
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  {LOCALES.map((l) => (
                    <button
                      key={l}
                      className={`lang-option ${l === locale ? "active" : ""}`}
                      onClick={() => { setLocale(l); setLangOpen(false); }}
                    >
                      {LOCALE_LABELS[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub */}
            <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer"
              className="header-github-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Mobile hamburger */}
          <button className="header-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="header-mobile-menu">
            {NAV_KEYS.map(link => (
              <Link key={link.key} href={link.href} className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                {t(link.key)}
              </Link>
            ))}
            <div className="header-mobile-lang">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`lang-mobile-btn ${l === locale ? "active" : ""}`}
                  onClick={() => { setLocale(l); setMobileMenuOpen(false); }}
                >
                  {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>
            <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="header-mobile-link">
              GitHub
            </a>
          </div>
        )}
      </header>

      {/* ===== Hero ===== */}
      <section id="main-content" className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 pt-12 pb-16">

        {!file && !result && (
          <div className="flex flex-col items-center gap-9 text-center max-w-3xl mx-auto animate-fade-in-up">

            {/* Tagline chip */}
            <div className="hero-chip">
              <span className="hero-chip-dot" />
              {t("home.chip")}
            </div>

            {/* Big headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-[--color-text-primary] whitespace-nowrap">
              {t("home.headline")} <span className="gradient-text">{t("home.headlineHighlight")}</span> {t("home.headlineSuffix")}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] max-w-xl leading-relaxed">
              {t("home.subtitle")}
            </p>

            {/* Upload area */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <label className="btn-primary flex items-center gap-2.5 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("home.uploadFile")}
                <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
              <div
                className={`btn-secondary cursor-pointer ${dragOver ? "!border-[#4285f4] !bg-blue-50" : ""}`}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
              >
                {t("home.orDropHere")}
              </div>
            </div>

            <p className="text-xs text-[--color-text-muted] hidden sm:block">
              {t("home.pasteHint")} <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono">{t("home.pasteKey")}</kbd> {t("home.pasteAction")}
            </p>
          </div>
        )}

        {/* File loaded — preview + progress */}
        {file && !result && (
          <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
            <div className="card p-4 sm:p-6">
              <div className="relative rounded-xl overflow-hidden bg-[--color-bg-tertiary]">
                {file.type.startsWith("video/") ? (
                  <video src={preview!} controls className="w-full max-h-[360px] object-contain" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview!} alt={`Preview: ${file.name}`} className="w-full max-h-[360px] object-contain" />
                )}
                {isAnalyzing && <div className="scan-overlay" aria-hidden="true" />}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-[--color-text-secondary] truncate max-w-[60%]">
                  {file.name} <span className="text-[--color-text-muted]">· {formatFileSize(file.size)}</span>
                </div>
                <button onClick={handleReset} className="text-sm text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors">
                  {t("home.cancel")}
                </button>
              </div>

              {isAnalyzing && (
                <div className="mt-4" role="status">
                  <div className="confidence-bar">
                    <div className="confidence-fill progress-fill-gradient" ref={el => { if (el) el.style.setProperty('--progress-width', `${Math.min(progress, 100)}%`); }} />
                  </div>
                  <p className="text-xs text-[--color-text-muted] mt-2 text-center">
                    {progress < 30 ? t("home.loading") : progress < 60 ? t("home.analyzingPixels") : progress < 85 ? t("home.frequencyScan") : t("home.finalizing")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div ref={resultRef} className="w-full max-w-3xl mx-auto animate-fade-in-up py-6">
            {/* Score Header */}
            <div className="result-header">
              <ScoreRing score={result.aiScore} label={t("home.score")} />
              <div className="result-header-info">
                <div className={`verdict-badge ${result.verdict}`}>
                  {result.verdict === "ai" ? t("home.aiGenerated") : result.verdict === "real" ? t("home.authentic") : t("home.uncertain")}
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[--color-text-muted] mt-2">
                  <span>{result.confidence}% {t("home.confidence")}</span>
                  <span className="opacity-40">·</span>
                  <span>{result.processingTimeMs}ms</span>
                </div>
              </div>
            </div>

            {/* Signals Grid */}
            <div className="signals-grid">
              {result.signals.map(signal => (
                <div key={signal.name} className="signal-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="signal-icon">{signal.icon}</span>
                    <span className="text-[13px] font-semibold text-[--color-text-primary] flex-1 truncate">{t(signal.nameKey) || signal.name}</span>
                    <span className={`signal-score ${signal.score >= 70 ? 'high' : signal.score >= 55 ? 'medium' : 'low'}`}>{signal.score}</span>
                  </div>
                  <div className="confidence-bar-slim">
                    <div className={`confidence-fill-slim ${signal.score > 55 ? "ai" : "real"}`} ref={el => { if (el) el.style.setProperty('--confidence-width', `${signal.score}%`); }} />
                  </div>
                  <p className="text-[11px] text-[--color-text-muted] mt-1.5 leading-relaxed">{t(signal.descriptionKey) || signal.description}</p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            {result.metadata.exifData && Object.keys(result.metadata.exifData).length > 0 && (
              <details className="metadata-panel">
                <summary className="metadata-summary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  {t("home.metadata")}
                </summary>
                <div className="metadata-grid">
                  {Object.entries(result.metadata.exifData).map(([k, v]) => (
                    <div key={k} className="metadata-row">
                      <span className="metadata-key">{k}</span>
                      <span className="metadata-value">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div className="text-center mt-8">
              <button onClick={handleReset} className="btn-primary">
                {t("home.analyzeAnother")}
              </button>
            </div>

            <p className="text-[11px] text-[--color-text-muted] text-center mt-5 max-w-md mx-auto leading-relaxed">
              {t("home.disclaimer")}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 max-w-md mx-auto card p-4 border-l-4 border-[--color-accent-red] animate-fade-in-up" role="alert">
            <p className="text-sm text-[--color-accent-red]">{error}</p>
          </div>
        )}
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 footer-divider">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="SourceVerify" width={22} height={22} priority />
              <span className="text-sm font-semibold text-[--color-text-primary]">SourceVerify</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[--color-text-muted]">
              <Link href="/product" className="hover:text-[--color-text-primary] transition-colors">{t("nav.product")}</Link>
              <Link href="/features" className="hover:text-[--color-text-primary] transition-colors">{t("nav.features")}</Link>
              <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer" className="hover:text-[--color-text-primary] transition-colors">GitHub</a>
            </div>
            <p className="text-[11px] text-[--color-text-muted]">
              {t("footer.copyright", { year: new Date().getFullYear().toString() })}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const size = 120, sw = 6, r = (size - sw) / 2, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);
  const color = score >= 70 ? "var(--color-accent-red)" : score <= 30 ? "var(--color-accent-green)" : "var(--color-accent-amber)";

  return (
    <div className="relative inline-flex items-center justify-center score-ring-overlay shrink-0">
      <svg width={size} height={size} className="score-ring" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} fill="none" className="score-ring-bg" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} fill="none" stroke={color}
          strokeDasharray={c} strokeDashoffset={on ? offset : c} strokeLinecap="round" className="score-ring-fill" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${score >= 70 ? 'score-color-high' : score <= 30 ? 'score-color-low' : 'score-color-medium'}`}>{score}</span>
        <span className="text-[9px] text-[--color-text-muted] uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}
