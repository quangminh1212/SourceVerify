"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  analyzeMedia,
  formatFileSize,
  type AnalysisResult,
} from "@/lib/analyzer";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

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

  // Clean up object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = useCallback(async (selectedFile: File) => {
    setError(null);
    setResult(null);

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Unsupported file type. Please use JPEG, PNG, WebP, GIF, MP4, or WebM.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 100MB.");
      return;
    }

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);

    // Start analysis
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const analysisResult = await analyzeMedia(selectedFile);
      clearInterval(progressInterval);
      setProgress(100);

      // Small delay for UX
      await new Promise((r) => setTimeout(r, 500));
      setResult(analysisResult);
      setIsAnalyzing(false);

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setError("Analysis failed. Please try a different file.");
      console.error(err);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [preview]);

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Skip Navigation */}
      <a
        href="#upload-section"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[#2AABEE] focus:text-white focus:rounded-xl focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Hero Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none hero-glow"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 max-w-6xl mx-auto w-full" role="banner">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center logo-gradient"
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SourceVerify</h1>
            <p className="text-xs text-[--color-text-muted]">AI Content Detector</p>
          </div>
        </div>
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          <a
            href="https://github.com/quangminh1212/SourceVerify"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[--color-text-secondary] hover:text-[#2AABEE] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2AABEE] rounded-md"
            aria-label="View SourceVerify on GitHub (opens in new tab)"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8 max-w-4xl mx-auto" aria-labelledby="hero-heading">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full glass-light text-[10px] sm:text-xs font-semibold text-[#2AABEE] mb-4 sm:mb-6 tracking-wide">
            <span className="status-dot" aria-hidden="true"></span>
            Multi-Signal Analysis Engine
          </div>
          <h2 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4">
            Detect <span className="gradient-text">AI-Generated</span> Content
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[--color-text-secondary] max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Upload any image or video to analyze whether it was created by AI. Our engine examines
            metadata, pixel patterns, frequency domains, and structural artifacts.
          </p>
        </div>
      </section>

      {/* Upload Zone */}
      <section id="upload-section" className="relative z-10 px-4 sm:px-6 max-w-3xl mx-auto" aria-labelledby="upload-heading">
        <h3 id="upload-heading" className="sr-only">Upload media for analysis</h3>
        <div className="animate-fade-in-up animate-delay-200">
          {!file ? (
            <label
              className={`upload-zone p-6 sm:p-8 md:p-12 text-center block ${dragOver ? "drag-over" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                aria-label="Upload image or video file for AI detection analysis"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <div className="animate-float mb-4 sm:mb-6 flex justify-center" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="opacity-40 sm:w-14 sm:h-14">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2">Drop your file here</h3>
              <p className="text-xs sm:text-sm text-[--color-text-secondary] mb-3 sm:mb-4">
                or click to browse · Images &amp; Videos up to 100MB
              </p>
              <div className="flex flex-wrap justify-center gap-2" aria-label="Supported file formats">
                {["JPEG", "PNG", "WebP", "GIF", "MP4", "WebM"].map((fmt) => (
                  <span key={fmt} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#2AABEE]/[0.06] text-[--color-text-secondary] border border-[#2AABEE]/[0.1]">
                    {fmt}
                  </span>
                ))}
              </div>
            </label>
          ) : (
            <div className="relative">
              {/* Preview */}
              <div className="glass p-4 mb-4">
                <div className="relative video-preview bg-black/30 rounded-xl overflow-hidden preview-max-height">
                  {file.type.startsWith("video/") ? (
                    <video
                      src={preview!}
                      controls
                      className="w-full max-h-[400px] object-contain"
                      aria-label={`Video preview: ${file.name}`}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview!}
                      alt={`Preview of ${file.name}`}
                      className="w-full max-h-[400px] object-contain"
                    />
                  )}
                  {isAnalyzing && <div className="scan-overlay" aria-hidden="true" />}
                </div>

                {/* File info bar */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[--color-text-primary] truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-[--color-text-muted]">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="btn-secondary text-xs px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2AABEE]"
                    aria-label="Remove current file and upload a new one"
                  >
                    Upload New
                  </button>
                </div>
              </div>

              {/* Progress */}
              {isAnalyzing && (
                <div className="glass p-6 animate-fade-in-up" role="status" aria-live="polite">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 border-2 border-[#2AABEE] border-t-transparent rounded-full animate-rotate" aria-hidden="true" />
                    <span className="text-sm font-medium">Analyzing content...</span>
                  </div>
                  <div className="confidence-bar" role="progressbar" aria-label={`Analysis progress: ${Math.round(Math.min(progress, 100))}%`}>
                    <div
                      className="confidence-fill progress-fill-gradient"
                      ref={(el) => { if (el) el.style.setProperty('--progress-width', `${Math.min(progress, 100)}%`); }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-[--color-text-muted]">
                      {progress < 30 ? "Loading media..." : progress < 60 ? "Analyzing pixels..." : progress < 85 ? "Frequency analysis..." : "Finalizing..."}
                    </span>
                    <span className="text-xs text-[--color-text-muted]">{Math.round(Math.min(progress, 100))}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 glass p-4 border-l-4 border-[--color-accent-red] animate-fade-in-up" role="alert">
              <p className="text-sm text-[--color-accent-red]">{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && (
        <section ref={resultRef} className="relative z-10 px-4 sm:px-6 max-w-5xl mx-auto mt-6 sm:mt-8 pb-12 sm:pb-20" aria-labelledby="results-heading">
          <h3 id="results-heading" className="sr-only">Analysis Results</h3>

          {/* Verdict Card */}
          <div className="animate-fade-in-up mb-6">
            <div className="glass p-8 text-center glow-blue animate-blue-pulse">
              <VerdictBadge verdict={result.verdict} />
              <div className="mt-6">
                <ScoreRing score={result.aiScore} size={160} />
              </div>
              <p className="text-sm text-[--color-text-secondary] mt-4 max-w-md mx-auto">
                {result.verdict === "ai"
                  ? "This content shows strong indicators of being AI-generated."
                  : result.verdict === "real"
                    ? "This content appears to be authentic and captured by a real device."
                    : "The analysis is inconclusive. The content shows mixed signals."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-[10px] sm:text-xs text-[--color-text-muted]">
                <span>Confidence: {result.confidence}%</span>
                <span className="hidden sm:inline" aria-hidden="true">•</span>
                <span>AI Score: {result.aiScore}/100</span>
                <span className="hidden sm:inline" aria-hidden="true">•</span>
                <span>Processed in {result.processingTimeMs}ms</span>
              </div>
            </div>
          </div>

          {/* Signal Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4" role="list" aria-label="Analysis signal details">
            {result.signals.map((signal) => (
              <div
                key={signal.name}
                className="analysis-card animate-fade-in-up"
                role="listitem"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden="true">{signal.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold">{signal.name}</h4>
                      <span className="text-[10px] font-mono text-[--color-text-muted] uppercase tracking-wider">
                        {signal.category}
                      </span>
                    </div>
                  </div>
                  <SignalScore score={signal.score} />
                </div>
                <p className="text-xs text-[--color-text-secondary] leading-relaxed mb-3">
                  {signal.description}
                </p>
                <div
                  className="confidence-bar"
                  aria-label={`${signal.name} score: ${signal.score} out of 100`}
                >
                  <div
                    className={`confidence-fill confidence-fill-dynamic ${signal.score > 55 ? "ai" : "real"}`}
                    ref={(el) => { if (el) el.style.setProperty('--confidence-width', `${signal.score}%`); }}
                  />
                </div>
                {signal.details && (
                  <p className="text-[10px] text-[--color-text-muted] mt-2 font-mono leading-relaxed">
                    {signal.details}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Metadata Table */}
          {result.metadata.exifData && Object.keys(result.metadata.exifData).length > 0 && (
            <div className="analysis-card mt-4 animate-fade-in-up">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span aria-hidden="true">📋</span> File Metadata
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {Object.entries(result.metadata.exifData).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 py-1 border-b border-white/[0.03]">
                    <span className="text-[11px] text-[--color-text-muted] w-28 shrink-0">{key}</span>
                    <span className="text-[11px] text-[--color-text-primary] font-mono truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 text-center animate-fade-in-up">
            <p className="text-xs text-[--color-text-muted] max-w-lg mx-auto">
              ⚠️ This analysis uses heuristic methods and may not be 100% accurate.
              Results should be treated as indicators, not definitive proof.
              For critical verification, consult multiple tools and expert analysis.
            </p>
          </div>
        </section>
      )}

      {/* How It Works */}
      {!result && !isAnalyzing && (
        <section className="relative z-10 px-4 sm:px-6 max-w-5xl mx-auto mt-10 sm:mt-16 pb-12 sm:pb-20" aria-labelledby="how-it-works-heading">
          <h3 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-10 animate-fade-in-up">
            How It <span className="gradient-text">Works</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6" role="list">
            {[
              {
                icon: "📊",
                title: "Pixel Analysis",
                desc: "Examines noise patterns, color distribution, and texture consistency to identify unnatural uniformity typical of AI generation.",
              },
              {
                icon: "📡",
                title: "Frequency Domain",
                desc: "Analyzes frequency spectrum to detect missing high-frequency noise that real camera sensors naturally capture.",
              },
              {
                icon: "🔍",
                title: "Metadata Forensics",
                desc: "Inspects file metadata, EXIF data, and compression artifacts for signatures of AI generation tools.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="analysis-card how-it-works-card td-feature-card text-center p-4 sm:p-6 animate-fade-in-up"
                role="listitem"
              >
                <div className="text-3xl mb-4" aria-hidden="true">{item.icon}</div>
                <h4 className="text-base font-semibold mb-2">{item.title}</h4>
                <p className="text-xs text-[--color-text-secondary] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 footer-divider mt-auto" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <p className="text-[10px] sm:text-xs text-[--color-text-muted] text-center sm:text-left">
            © {new Date().getFullYear()} SourceVerify. All media processed locally in your browser.
          </p>
          <p className="text-[10px] sm:text-xs text-[--color-text-muted]">
            Privacy-first · No data uploaded
          </p>
        </div>
      </footer>
    </main>
  );
}

// ============================
// SUB-COMPONENTS
// ============================

function VerdictBadge({ verdict }: { verdict: "ai" | "real" | "uncertain" }) {
  const config = {
    ai: { label: "AI Generated", icon: "🤖" },
    real: { label: "Authentic", icon: "✅" },
    uncertain: { label: "Uncertain", icon: "❓" },
  };

  return (
    <div className={`verdict-badge ${verdict}`} role="status" aria-label={`Verdict: ${config[verdict].label}`}>
      <span aria-hidden="true">{config[verdict].icon}</span>
      <span>{config[verdict].label}</span>
    </div>
  );
}

function ScoreRing({ score, size }: { score: number; size: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const color =
    score >= 70
      ? "var(--color-accent-red)"
      : score <= 30
        ? "var(--color-accent-green)"
        : "var(--color-accent-amber)";

  return (
    <div className="inline-flex flex-col items-center" role="img" aria-label={`AI Score: ${score} out of 100`}>
      <svg width={size} height={size} className="score-ring" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="score-ring-bg"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          strokeLinecap="round"
          className="score-ring-fill"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center score-ring-overlay" ref={(el) => { if (el) el.style.setProperty('--ring-size', `${size}px`); }}>
        <span className="text-3xl font-bold score-color-text" ref={(el) => { if (el) el.style.setProperty('--score-color', color); }}>
          {score}
        </span>
        <span className="text-[10px] text-[--color-text-muted] uppercase tracking-wider mt-0.5">
          AI Score
        </span>
      </div>
    </div>
  );
}

function SignalScore({ score }: { score: number }) {
  const color =
    score >= 70
      ? "var(--color-accent-red)"
      : score >= 55
        ? "var(--color-accent-amber)"
        : score >= 35
          ? "var(--color-accent-green)"
          : "var(--color-accent-cyan)";

  return (
    <div
      className="text-sm font-bold px-2.5 py-1 rounded-lg signal-score-badge"
      ref={(el) => { if (el) el.style.setProperty('--signal-color', color); }}
      aria-label={`Signal score: ${score}`}
    >
      {score}
    </div>
  );
}
