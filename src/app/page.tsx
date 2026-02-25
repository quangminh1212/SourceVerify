"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import {
  analyzeMedia,
  formatFileSize,
  type AnalysisResult,
} from "@/lib/analyzer";

const ACCEPTED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/avif",
  "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo",
];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => { return () => { if (preview) URL.revokeObjectURL(preview); }; }, [preview]);

  const handleFile = useCallback(async (selectedFile: File) => {
    setError(null);
    setResult(null);
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) { setError("Unsupported format. Use JPEG, PNG, WebP, GIF, MP4, or WebM."); return; }
    if (selectedFile.size > MAX_FILE_SIZE) { setError("File too large. Max 100MB."); return; }

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
      setError("Analysis failed. Try a different file.");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }, [handleFile]);
  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setResult(null); setError(null); setProgress(0); setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [preview]);

  return (
    <main className="relative min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[#4285f4] focus:text-white focus:rounded-full focus:text-sm">Skip to content</a>

      {/* Edge glow */}
      <div className="edge-glow" aria-hidden="true" />
      <div className="fixed top-0 left-0 right-0 h-[400px] pointer-events-none top-glow opacity-50" aria-hidden="true" />

      {/* Header — ultra minimal */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="SourceVerify" width={28} height={28} className="logo-img" priority />
          <span className="text-base font-semibold tracking-tight text-[--color-text-primary]">SourceVerify</span>
        </div>
        <a href="https://github.com/quangminh1212/SourceVerify" target="_blank" rel="noopener noreferrer"
          className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors">
          GitHub
        </a>
      </header>

      {/* Hero — Antigravity style: logo + big headline + action area */}
      <section id="main-content" className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 -mt-10">

        {!file && !result && (
          <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
            {/* Brand mark */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <Image src="/logo.png" alt="SourceVerify" width={52} height={52} className="logo-img" priority />
              <span className="text-2xl font-semibold gradient-text tracking-wide">SourceVerify</span>
            </div>

            {/* Single big headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-[--color-text-primary] mb-14 whitespace-nowrap">
              Detect <span className="gradient-text">AI-generated</span> content
            </h1>

            {/* Upload area — just two buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <label className="btn-primary flex items-center gap-2.5 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload file
                <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
              <div
                className={`btn-secondary cursor-pointer ${dragOver ? "!border-[#4285f4] !bg-blue-50" : ""}`}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
              >
                or drop here
              </div>
            </div>

            <p className="text-xs text-[--color-text-muted] mt-6">
              Images &amp; videos · up to 100MB · processed locally
            </p>
          </div>
        )}

        {/* File loaded — minimal preview + progress */}
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
                  Cancel
                </button>
              </div>

              {isAnalyzing && (
                <div className="mt-4" role="status">
                  <div className="confidence-bar">
                    <div className="confidence-fill progress-fill-gradient" ref={el => { if (el) el.style.setProperty('--progress-width', `${Math.min(progress, 100)}%`); }} />
                  </div>
                  <p className="text-xs text-[--color-text-muted] mt-2 text-center">
                    {progress < 30 ? "Loading..." : progress < 60 ? "Analyzing pixels..." : progress < 85 ? "Frequency scan..." : "Finalizing..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results — clean and minimal */}
        {result && (
          <div ref={resultRef} className="w-full max-w-3xl mx-auto animate-fade-in-up py-8">
            {/* Verdict — centred, big */}
            <div className="text-center mb-10">
              <div className={`verdict-badge ${result.verdict} mb-6 mx-auto`}>
                {result.verdict === "ai" ? "🤖 AI Generated" : result.verdict === "real" ? "✅ Authentic" : "❓ Uncertain"}
              </div>
              <ScoreRing score={result.aiScore} />
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[--color-text-muted]">
                <span>{result.confidence}% confidence</span>
                <span>·</span>
                <span>{result.processingTimeMs}ms</span>
              </div>
            </div>

            {/* Signal grid — compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.signals.map(signal => (
                <div key={signal.name} className="analysis-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[--color-text-primary]">
                      <span className="mr-1.5">{signal.icon}</span>{signal.name}
                    </span>
                    <span className={`text-xs font-bold ${signal.score >= 70 ? 'signal-score-high' : signal.score >= 55 ? 'signal-score-medium' : 'signal-score-low'}`}>{signal.score}</span>
                  </div>
                  <div className="confidence-bar">
                    <div className={`confidence-fill confidence-fill-dynamic ${signal.score > 55 ? "ai" : "real"}`} ref={el => { if (el) el.style.setProperty('--confidence-width', `${signal.score}%`); }} />
                  </div>
                  <p className="text-[11px] text-[--color-text-muted] mt-1.5 leading-relaxed">{signal.description}</p>
                </div>
              ))}
            </div>

            {/* Metadata — if exists */}
            {result.metadata.exifData && Object.keys(result.metadata.exifData).length > 0 && (
              <details className="mt-4 analysis-card">
                <summary className="text-sm font-medium text-[--color-text-primary] cursor-pointer">
                  📋 Metadata
                </summary>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3">
                  {Object.entries(result.metadata.exifData).map(([k, v]) => (
                    <div key={k} className="flex gap-2 py-1 border-b border-[--color-border-subtle] text-[11px]">
                      <span className="text-[--color-text-muted] w-24 shrink-0">{k}</span>
                      <span className="text-[--color-text-primary] font-mono truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* New scan */}
            <div className="text-center mt-8">
              <button onClick={handleReset} className="btn-primary">
                Analyze another file
              </button>
            </div>

            <p className="text-[10px] text-[--color-text-muted] text-center mt-6 max-w-md mx-auto">
              Results are heuristic-based indicators, not definitive proof.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 max-w-md mx-auto card p-4 border-l-4 border-[--color-accent-red] animate-fade-in-up" role="alert">
            <p className="text-sm text-[--color-accent-red]">{error}</p>
          </div>
        )}
      </section>

      {/* Footer — one line */}
      <footer className="relative z-10 py-5 text-center">
        <p className="text-[11px] text-[--color-text-muted]">
          © {new Date().getFullYear()} SourceVerify · Privacy-first · All processing done locally
        </p>
      </footer>
    </main>
  );
}

function ScoreRing({ score }: { score: number }) {
  const size = 120, sw = 6, r = (size - sw) / 2, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);
  const color = score >= 70 ? "var(--color-accent-red)" : score <= 30 ? "var(--color-accent-green)" : "var(--color-accent-amber)";

  return (
    <div className="relative inline-flex items-center justify-center score-ring-overlay">
      <svg width={size} height={size} className="score-ring" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} fill="none" className="score-ring-bg" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} fill="none" stroke={color}
          strokeDasharray={c} strokeDashoffset={on ? offset : c} strokeLinecap="round" className="score-ring-fill" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${score >= 70 ? 'score-color-high' : score <= 30 ? 'score-color-low' : 'score-color-medium'}`}>{score}</span>
        <span className="text-[9px] text-[--color-text-muted] uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
}
