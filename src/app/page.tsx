"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  analyzeMedia,
  formatFileSize,
  type AnalysisResult,
  METHOD_MAP,
} from "@/lib/analyzer";
import { useLanguage } from "@/i18n/LanguageContext";
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { METHODS } from "@/app/methods/data";
import { loadSettings, type AnalysisSettings } from "@/components/Header";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScoreRing from "@/components/ScoreRing";
import RadarChart from "@/components/RadarChart";
import { getMethodTranslation } from "@/app/methods/methodsI18n";

/** Map display method ID (data.ts) → analyzer method ID (METHOD_MAP keys) */
const DISPLAY_TO_ANALYZER: Record<string, string[]> = {
  metadata: ["metadata"], spectral: ["spectral"], reconstruction: ["reconstruction"],
  noise: ["noise"], edge: ["edge"], gradient: ["gradient"], benford: ["benford"],
  chromatic: ["chromatic"], texture: ["texture"], cfa: ["cfa"], dct: ["dct"],
  color: ["color"], prnu: ["prnu"], ela: ["ela"],
  copymove: ["lbp", "hog"], splicing: ["glcm", "localVariance"],
  histogram: ["saturation"], wavelet: ["wavelet"], jpeg_ghost: ["jpegGhost"],
  chi_square: ["chiSquare"], entropy: ["entropy"],
  gan_fingerprint: ["ganFingerprint"], diffusion: ["diffusion"],
  noiseprint: ["morphGradient", "weber"], upscaling: ["upsampling"],
  frequency_band: ["freqBand"], face_landmark: ["phase", "gabor"],
  lighting: ["lighting"], shadow: ["shadow"], perspective: ["perspective"],
  reflection: ["psd", "radial"], double_jpeg: ["quantization", "banding"],
  patchforensics: ["markov", "hos"], clip_detection: ["zipf"],
  binary_pattern: ["lbp"], fourier_ring: ["radial"],
  resnet_classifier: ["hog"], vit_detection: ["gabor"],
  gram_matrix: ["glcm"], srm_filter: ["weber"],
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'basic' | 'advanced'>('basic');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(METHODS[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useLanguage();
  const [analysisSettings, setAnalysisSettings] = useState<AnalysisSettings | null>(null);

  // Check auth state from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const saved = localStorage.getItem("sv_user");
      setIsLoggedIn(!!saved);
    };
    checkAuth();
    // Listen for storage changes (login/logout from Header)
    window.addEventListener("storage", checkAuth);
    // Also poll periodically in case Header updates in same tab
    const iv = setInterval(checkAuth, 1000);
    // Read selected method from localStorage
    const savedMethod = localStorage.getItem("sv_method");
    if (savedMethod && METHODS.some(m => m.id === savedMethod)) {
      setSelectedMethod(savedMethod);
    }
    // Load analysis settings
    setAnalysisSettings(loadSettings());
    // Listen for settings changes from header modal
    const onSettingsChange = () => setAnalysisSettings(loadSettings());
    window.addEventListener('sv_settings_changed', onSettingsChange);
    return () => { window.removeEventListener("storage", checkAuth); clearInterval(iv); window.removeEventListener('sv_settings_changed', onSettingsChange); };
  }, []);

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
      // If not logged in, only run the single selected method
      // If logged in, use settings-configured methods (or all if no settings)
      let enabledMethods: string[] | undefined;
      if (!isLoggedIn) {
        enabledMethods = DISPLAY_TO_ANALYZER[selectedMethod] || [selectedMethod];
      } else if (analysisSettings && analysisSettings.enabledMethods.length < METHODS.length) {
        // User has customized which methods are enabled
        enabledMethods = analysisSettings.enabledMethods.flatMap(id => DISPLAY_TO_ANALYZER[id] || [id]);
      }
      const r = await analyzeMedia(selectedFile, enabledMethods);
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
  }, [t, isLoggedIn, selectedMethod, analysisSettings]);

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

      {/* ===== Header (shared component) ===== */}
      <Header />

      {/* ===== Hero ===== */}
      <section id="main-content" className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pt-12 pb-16">

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

            {/* Guest mode: show selected method chip */}
            {!isLoggedIn && (
              <div className="method-chip-row">
                <Link href="/methods?select=1" className="method-chip-link">
                  <span className="method-chip-dot" />
                  <span className="method-chip-name">{getMethodTranslation(selectedMethod, locale).name}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
                <span className="method-chip-sep">·</span>
                <Link href="#" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLButtonElement>('.header-signin-fallback,.header-google-signin button')?.click(); }} className="method-chip-unlock">
                  {t("home.signInForFull")}
                </Link>
              </div>
            )}

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
          <div ref={resultRef} className="w-full max-w-4xl mx-auto animate-fade-in-up py-4">
            {/* Tab Toggle */}
            <div className="result-tabs">
              <button className={`result-tab ${viewMode === 'basic' ? 'active' : ''}`} onClick={() => setViewMode('basic')}>
                {t('home.basicView') || 'Cơ bản'}
              </button>
              <button className={`result-tab ${viewMode === 'advanced' ? 'active' : ''}`} onClick={() => setViewMode('advanced')}>
                {t('home.advancedView') || 'Nâng cao'}
              </button>
            </div>

            {viewMode === 'basic' ? (
              /* === BASIC VIEW === */
              <div className="result-row">
                <div className="result-score-panel">
                  <ScoreRing score={result.aiScore} label={t('home.score')} />
                  <div className={`verdict-badge ${result.verdict}`}>
                    {result.verdict === 'ai' ? t('home.aiGenerated') : result.verdict === 'real' ? t('home.authentic') : t('home.uncertain')}
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-[--color-text-muted] mt-1">
                    <span>{result.confidence}% {t('home.confidence')}</span>
                    <span className="opacity-40">·</span>
                    <span>{result.processingTimeMs}ms</span>
                  </div>
                </div>
                <div className="basic-detail-panel">
                  {/* AI Probability */}
                  <div className="ai-probability">
                    <span className="ai-probability-value">
                      {result.aiScore}% <span className="ai-probability-label">{t('home.aiProbLabel') || 'khả năng do AI tạo'}</span>
                    </span>
                    <div className="ai-probability-bar">
                      <div className="ai-probability-track" />
                      <div className="ai-probability-dot" ref={el => { if (el) el.style.left = `${result.aiScore}%`; }} />
                    </div>
                    <div className="ai-probability-range">
                      <span>0% — {t('home.authentic') || 'Ảnh thật'}</span>
                      <span>100% — AI</span>
                    </div>
                    <p className="ai-probability-explain">
                      {result.aiScore >= 70
                        ? t('home.explainHigh') || 'Điểm cao cho thấy nhiều đặc điểm phổ biến của ảnh AI.'
                        : result.aiScore <= 30
                          ? t('home.explainLow') || 'Điểm thấp cho thấy ảnh có đặc điểm tự nhiên.'
                          : t('home.explainMid') || 'Điểm trung bình — chưa đủ để kết luận rõ ràng.'}
                    </p>
                  </div>
                  {/* Top signals */}
                  <div className="basic-signals">
                    {[...result.methods].sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50)).slice(0, 4).map(s => {
                      const level = s.score >= 70 ? 'high' : s.score <= 40 ? 'low' : 'mid';
                      return (
                        <div key={s.name} className="basic-signal-bar" data-level={level}>
                          <div className="basic-signal-header">
                            <span className="basic-signal-name">{t(s.nameKey) || s.name}</span>
                            <span className="basic-signal-score">{s.score}/100</span>
                          </div>
                          <div className="basic-bar-bg">
                            <div className="basic-bar-fill" ref={el => { if (el) { el.style.width = `${s.score}%`; el.style.background = level === 'high' ? 'var(--color-accent-red)' : level === 'low' ? 'var(--color-accent-green)' : 'var(--color-accent-amber)'; } }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* === ADVANCED VIEW === */
              <div className="result-row">
                <div className="result-score-panel">
                  <ScoreRing score={result.aiScore} label={t('home.score')} />
                  <div className={`verdict-badge ${result.verdict}`}>
                    {result.verdict === 'ai' ? t('home.aiGenerated') : result.verdict === 'real' ? t('home.authentic') : t('home.uncertain')}
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-[--color-text-muted] mt-1">
                    <span>{result.confidence}% {t('home.confidence')}</span>
                    <span className="opacity-40">·</span>
                    <span>{result.processingTimeMs}ms</span>
                  </div>
                </div>
                <RadarChart signals={result.methods} t={t} />
              </div>
            )}

            {/* Result Footer */}
            <div className="result-footer">
              {viewMode === 'advanced' && result.metadata.exifData && Object.keys(result.metadata.exifData).length > 0 && (
                <details className="metadata-panel">
                  <summary className="metadata-summary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    {t('home.metadata')}
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
              <button onClick={handleReset} className="btn-primary">
                {t('home.analyzeAnother')}
              </button>
              <p className="result-disclaimer">{t('home.disclaimer')}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 max-w-md mx-auto card p-4 border-l-4 border-[--color-accent-red] animate-fade-in-up" role="alert">
            <p className="text-sm text-[--color-accent-red]">{error}</p>
          </div>
        )}
      </section>

      {/* ===== Footer ===== */}
      <Footer showLinks />
    </main>
  );
}
