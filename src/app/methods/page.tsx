"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

type Category = "all" | "pixel" | "frequency" | "statistical" | "metadata" | "sensor";

/* ── SVG Icon paths (Lucide-style, monochrome) ── */
const ICONS: Record<string, JSX.Element> = {
    metadata: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></>,
    spectral: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
    reconstruction: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></>,
    noise: <><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></>,
    edge: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></>,
    gradient: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    benford: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    chromatic: <><circle cx="12" cy="12" r="10" /><line x1="14.31" y1="8" x2="20.05" y2="17.94" /><line x1="9.69" y1="8" x2="21.17" y2="8" /><line x1="7.38" y1="12" x2="13.12" y2="2.06" /><line x1="9.69" y1="16" x2="3.95" y2="6.06" /><line x1="14.31" y1="16" x2="2.83" y2="16" /><line x1="16.62" y1="12" x2="10.88" y2="21.94" /></>,
    texture: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    cfa: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></>,
    dct: <><rect x="18" y="3" width="4" height="18" /><rect x="10" y="8" width="4" height="13" /><rect x="2" y="13" width="4" height="8" /></>,
    color: <><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></>,
    prnu: <><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></>,
};

/* ── Category hex colors for icons ── */
const CAT_HEX: Record<Category, string> = {
    all: "#888",
    pixel: "#4285F4",
    frequency: "#9C27B0",
    statistical: "#FBBC04",
    metadata: "#34A853",
    sensor: "#EA4335",
};

/* ── Method detail data (technical, language-neutral) ── */
const DETAILS: Record<string, {
    algorithm: string; mechanism: string; parameters: string;
    accuracy: string; source: string; useCase: string;
}> = {
    metadata: {
        algorithm: "EXIF / XMP / IPTC Parser",
        mechanism: "Parses embedded metadata fields including camera make/model, GPS coordinates, software tags, creation timestamps, and file structure. AI-generated images typically lack authentic camera metadata or contain telltale software signatures (e.g., 'Stable Diffusion', 'DALL-E', 'Midjourney').",
        parameters: "Fields analyzed: Make, Model, Software, GPS, DateTimeOriginal, ColorSpace, ExifVersion, XMP:CreatorTool",
        accuracy: "High — 85-95% when metadata is present and unstripped",
        source: "JEITA CP-3451 (Exif 2.32), Adobe XMP Specification, IPTC Photo Metadata Standard",
        useCase: "First-pass triage: quickly identifies images with AI software tags or missing camera metadata",
    },
    spectral: {
        algorithm: "Nyquist Frequency Spectral Analysis (2D FFT)",
        mechanism: "Applies 2D Fast Fourier Transform to convert the image from spatial domain to frequency domain. AI-generated images exhibit characteristic spectral peaks at Nyquist frequency boundaries due to the upsampling operations in generative models (transposed convolutions, pixel shuffle). Real camera images lack these periodic artifacts.",
        parameters: "FFT size: adaptive to image dimensions, Window: Hann, Analysis: radial power spectrum, peak detection at f/2",
        accuracy: "High — 80-90% for GAN-generated images with upsampling artifacts",
        source: "Durall et al. (2020) 'Watch your Up-Convolution: CNN Based Generative Deep Neural Networks are Failing to Reproduce Spectral Distributions', CVPR 2020",
        useCase: "Detecting GAN/diffusion model artifacts from upsampling layers in the frequency domain",
    },
    reconstruction: {
        algorithm: "Multi-Scale Reconstruction Error Analysis",
        mechanism: "Downscales and reconstructs the image at multiple resolution levels (2×, 4×, 8×), measuring reconstruction error at each scale. AI-generated images show uniform reconstruction error across scales, while real photos exhibit natural scale-dependent variation due to optical physics and sensor characteristics.",
        parameters: "Scales: [0.5, 0.25, 0.125], Interpolation: bicubic, Metric: MSE + SSIM per scale",
        accuracy: "Moderate-High — 75-85% across diverse image types",
        source: "Inspired by image forensics research on resampling detection (Popescu & Farid, 2005)",
        useCase: "Identifying images that have been generated at a fixed resolution without natural multi-scale optical properties",
    },
    noise: {
        algorithm: "High-Frequency Noise Residual Analysis (Wiener Filter)",
        mechanism: "Extracts the noise residual by applying a Wiener denoising filter and subtracting the denoised image from the original. Real photos contain spatially varying sensor noise (shot noise, read noise) that follows Poisson-Gaussian distribution. AI images produce unnaturally uniform or patterned noise residuals.",
        parameters: "Wiener filter: σ=3, Block size: 8×8, Analysis: noise variance map, spatial uniformity metric",
        accuracy: "High — 80-90% for distinguishing natural vs synthetic noise patterns",
        source: "Fridrich & Kodovský (2012), IEEE TIFS; Chen et al. (2008) sensor noise forensics",
        useCase: "Detecting the absence of authentic sensor noise patterns in AI-generated images",
    },
    edge: {
        algorithm: "Sobel Edge Coherence Analysis",
        mechanism: "Computes Sobel edge magnitude and direction maps, then analyzes the transition sharpness between edges and non-edges. AI images often produce unnaturally smooth or uniformly sharp edge transitions, while real photos show natural variation due to optical blur, depth-of-field, and sensor characteristics.",
        parameters: "Sobel kernel: 3×3, Edge threshold: adaptive Otsu, Metrics: edge density, coherence ratio, transition histogram",
        accuracy: "Moderate — 70-80% as a supporting signal",
        source: "Adapted from image forgery detection edge analysis (Cozzolino et al., 2015, IEEE TIFS)",
        useCase: "Supplementary detection of AI-typical edge uniformity patterns",
    },
    gradient: {
        algorithm: "Gradient Smoothness & Micro-Texture Analysis",
        mechanism: "Analyzes image gradient fields to detect unnaturally smooth regions that lack the micro-texture found in real photographs. Examines gradient magnitude distribution and spatial correlation. AI images often produce suspiciously clean gradient transitions, especially in background areas.",
        parameters: "Gradient operator: Scharr, Window: 16×16 sliding, Metrics: gradient entropy, smoothness ratio, kurtosis",
        accuracy: "Moderate — 70-80%, higher for diffusion model outputs",
        source: "Nataraj et al. (2019) 'Detecting GAN generated Fake Images using Co-occurrence Matrices'",
        useCase: "Identifying AI-generated smooth gradients that lack natural photographic micro-texture",
    },
    benford: {
        algorithm: "Benford's Law First-Digit Distribution Test",
        mechanism: "Analyzes the distribution of first significant digits in DCT coefficients of 8×8 image blocks. Natural images follow Benford's Law (logarithmic first-digit distribution), while AI-generated images deviate from this statistical property due to the synthetic generation process.",
        parameters: "Block size: 8×8, DCT coefficients: AC terms, Test: χ² goodness-of-fit against Benford distribution",
        accuracy: "Moderate — 65-75%, best as a complementary statistical test",
        source: "Fu et al. (2007) 'Generalized Benford's Law for JPEG Coefficients', IEEE TIFS",
        useCase: "Statistical validation of image naturalness through digit distribution analysis",
    },
    chromatic: {
        algorithm: "Chromatic Aberration Pattern Detection",
        mechanism: "Measures color channel misalignment (lateral chromatic aberration) across the image, particularly toward edges. Real camera lenses produce predictable radial chromatic aberration patterns. AI-generated images either lack this optical phenomenon entirely or produce physically implausible aberration patterns.",
        parameters: "Channel pairs: R-G, R-B, G-B, Measurement: phase correlation per block, Radial model: Brown–Conrady",
        accuracy: "Moderate-High — 75-85% when chromatic aberration is detectable",
        source: "Johnson & Farid (2006) 'Exposing Digital Forgeries through Chromatic Aberration', ACM Workshop on Multimedia and Security",
        useCase: "Detecting absence or inconsistency of lens-induced chromatic aberration",
    },
    texture: {
        algorithm: "Gray-Level Co-occurrence Matrix (GLCM) Texture Analysis",
        mechanism: "Computes GLCM texture features (contrast, correlation, energy, homogeneity) across multiple orientations and distances. Compares local texture consistency across the image. AI images tend to produce more uniform texture statistics, while real photos show natural spatial variation.",
        parameters: "Distances: [1, 2, 4], Angles: [0°, 45°, 90°, 135°], Features: contrast, correlation, energy, homogeneity",
        accuracy: "Moderate — 70-80% for detecting texture uniformity anomalies",
        source: "Haralick et al. (1973), adapted for forensic application by Qian et al. (2020)",
        useCase: "Identifying AI-typical uniform texture patterns that deviate from natural photographic variation",
    },
    cfa: {
        algorithm: "Color Filter Array (Bayer CFA) Demosaicing Trace Detection",
        mechanism: "Detects periodic correlation patterns introduced by the Bayer CFA demosaicing process in real digital cameras. Digital cameras capture light through a color filter array (typically RGGB Bayer pattern) and interpolate missing color values. This leaves detectable periodic traces that are absent in AI-generated images.",
        parameters: "Analysis: 2D autocorrelation of green channel, Expected pattern: 2×2 periodic, Threshold: adaptive",
        accuracy: "High — 80-92% for images from known camera sensors",
        source: "Popescu & Farid (2005) 'Exposing Digital Forgeries by Detecting CFA Interpolation', ACM Workshop on Multimedia and Security",
        useCase: "Verifying authentic camera origin through CFA demosaicing artifact detection",
    },
    dct: {
        algorithm: "DCT (Discrete Cosine Transform) Block Artifact Analysis",
        mechanism: "Analyzes 8×8 DCT block boundary artifacts and coefficient quantization patterns from JPEG compression. Real JPEG images show characteristic blocking and quantization patterns. AI-generated images may lack these or show inconsistent JPEG artifacts if they were generated as PNG and later converted.",
        parameters: "Block size: 8×8, Analysis: block boundary discontinuity, quantization table estimation, double-compression detection",
        accuracy: "Moderate — 65-80%, highly dependent on image format history",
        source: "Fan & de Queiroz (2003) 'Identifying Bitmap Compression History', IEEE ICIP; Bianchi et al. (2012)",
        useCase: "Detecting JPEG compression history inconsistencies in AI-generated images",
    },
    color: {
        algorithm: "Inter-Channel Color Correlation Analysis",
        mechanism: "Analyzes statistical correlations between R, G, B color channels at local and global levels. Real photographs exhibit natural inter-channel correlations determined by scene illumination and camera color science. AI-generated images often produce subtly different correlation patterns due to the independent color generation in neural networks.",
        parameters: "Block size: 32×32, Metrics: Pearson correlation R-G/R-B/G-B per block, global histogram correlation",
        accuracy: "Low-Moderate — 60-70%, best used as a complementary signal",
        source: "Adapted from color constancy forensics research (Gijsenij et al., 2011)",
        useCase: "Supplementary detection of AI-generated color distribution anomalies",
    },
    prnu: {
        algorithm: "Photo Response Non-Uniformity (PRNU) Sensor Noise Fingerprint",
        mechanism: "Extracts the unique sensor noise fingerprint (PRNU pattern) from the image and checks for consistency. Every digital camera sensor has a unique fixed-pattern noise caused by manufacturing variations in individual pixels. AI-generated images lack any authentic PRNU pattern, as they are not captured by a physical sensor.",
        parameters: "Denoising: BM3D / wavelet, Correlation: normalized cross-correlation, Threshold: Neyman-Pearson at α=0.05",
        accuracy: "Low in browser (no reference PRNU) — 55-65% for anomaly detection without reference",
        source: "Lukáš et al. (2006) 'Determining Digital Image Origin Using Sensor Imperfections', SPIE Image and Video Communications",
        useCase: "Detecting absence of physical sensor noise fingerprint in AI-generated images",
    },
};

const METHODS = [
    { id: "metadata", nameKey: "api.methods.metadata.name", descKey: "api.methods.metadata.desc", category: "metadata" as Category, weight: 0.12 },
    { id: "spectral", nameKey: "api.methods.spectral.name", descKey: "api.methods.spectral.desc", category: "frequency" as Category, weight: 0.10 },
    { id: "reconstruction", nameKey: "api.methods.reconstruction.name", descKey: "api.methods.reconstruction.desc", category: "pixel" as Category, weight: 0.08 },
    { id: "noise", nameKey: "api.methods.noise.name", descKey: "api.methods.noise.desc", category: "pixel" as Category, weight: 0.09 },
    { id: "edge", nameKey: "api.methods.edge.name", descKey: "api.methods.edge.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "gradient", nameKey: "api.methods.gradient.name", descKey: "api.methods.gradient.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "benford", nameKey: "api.methods.benford.name", descKey: "api.methods.benford.desc", category: "statistical" as Category, weight: 0.06 },
    { id: "chromatic", nameKey: "api.methods.chromatic.name", descKey: "api.methods.chromatic.desc", category: "sensor" as Category, weight: 0.08 },
    { id: "texture", nameKey: "api.methods.texture.name", descKey: "api.methods.texture.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "cfa", nameKey: "api.methods.cfa.name", descKey: "api.methods.cfa.desc", category: "sensor" as Category, weight: 0.10 },
    { id: "dct", nameKey: "api.methods.dct.name", descKey: "api.methods.dct.desc", category: "frequency" as Category, weight: 0.06 },
    { id: "color", nameKey: "api.methods.color.name", descKey: "api.methods.color.desc", category: "pixel" as Category, weight: 0.05 },
    { id: "prnu", nameKey: "api.methods.prnu.name", descKey: "api.methods.prnu.desc", category: "sensor" as Category, weight: 0.05 },
];

const CATEGORIES: { key: Category; labelKey: string }[] = [
    { key: "all", labelKey: "methods.catAll" },
    { key: "pixel", labelKey: "methods.catPixel" },
    { key: "frequency", labelKey: "methods.catFrequency" },
    { key: "statistical", labelKey: "methods.catStatistical" },
    { key: "metadata", labelKey: "methods.catMetadata" },
    { key: "sensor", labelKey: "methods.catSensor" },
];

const CAT_COLORS: Record<Category, string> = {
    all: "",
    pixel: "cat-pixel",
    frequency: "cat-frequency",
    statistical: "cat-statistical",
    metadata: "cat-metadata",
    sensor: "cat-sensor",
};

function MethodIcon({ id, category }: { id: string; category: Category }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={CAT_HEX[category]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="methods-card-svg-icon"
        >
            {ICONS[id]}
        </svg>
    );
}

export default function MethodsPage() {
    const { t } = useLanguage();
    const [activeCat, setActiveCat] = useState<Category>("all");
    const [showMethods, setShowMethods] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = activeCat === "all"
        ? METHODS
        : METHODS.filter(m => m.category === activeCat);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-5xl mx-auto text-center">

                    {!showMethods ? (
                        /* === Intro View === */
                        <div className="methods-intro-section text-center animate-fade-in-up">
                            <h1 className="methods-page-title text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary]">
                                {t("methods.headline")}{" "}
                                <span className="gradient-text">{t("methods.headlineHighlight")}</span>
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed mx-auto text-center">
                                {t("methods.subtitle1")}
                            </p>
                            <p className="methods-subtitle2 text-sm sm:text-base lg:text-lg text-[--color-text-secondary] leading-relaxed mx-auto text-center">
                                {t("methods.subtitle2")}
                            </p>

                            {/* View Now Button */}
                            <div className="methods-view-cta">
                                <button
                                    className="btn-primary inline-flex items-center gap-2"
                                    onClick={() => setShowMethods(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    {t("methods.viewNow")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* === Methods Grid View === */
                        <>
                            {/* Category Tabs */}
                            <div className="methods-cat-tabs animate-fade-in-up">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.key}
                                        className={`methods-cat-tab ${activeCat === cat.key ? "active" : ""}`}
                                        onClick={() => setActiveCat(cat.key)}
                                    >
                                        {t(cat.labelKey)}
                                        {cat.key !== "all" && (
                                            <span className="methods-cat-tab-count">
                                                {METHODS.filter(m => m.category === cat.key).length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Methods Grid */}
                            <div className="methods-grid animate-fade-in-up">
                                {filtered.map((m, i) => {
                                    const detail = DETAILS[m.id];
                                    const isExpanded = expandedId === m.id;
                                    return (
                                        <div
                                            key={m.id}
                                            className={`methods-card methods-card-clickable animate-fade-in-up animate-delay-${Math.min(i, 5)} ${isExpanded ? "expanded" : ""}`}
                                            onClick={() => setExpandedId(isExpanded ? null : m.id)}
                                        >
                                            <div className="methods-card-header">
                                                <MethodIcon id={m.id} category={m.category} />
                                                <div className="methods-card-meta">
                                                    <span className={`methods-card-badge ${CAT_COLORS[m.category]}`}>
                                                        {t(`methods.cat${m.category.charAt(0).toUpperCase() + m.category.slice(1)}` as string)}
                                                    </span>
                                                    <span className="methods-card-weight">
                                                        {t("methods.weightLabel")}: {Math.round(m.weight * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="methods-card-name">{t(m.nameKey)}</h3>
                                            <p className="methods-card-desc">{t(m.descKey)}</p>

                                            {/* Weight bar */}
                                            <div className="methods-card-bar-track">
                                                <div className={`methods-card-bar-fill methods-bar-w-${Math.round(m.weight * 100)}`} />
                                            </div>

                                            {/* Expand indicator */}
                                            <div className="methods-card-expand-hint">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isExpanded ? "rotated" : ""}>
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </div>

                                            {/* Detail Panel */}
                                            {isExpanded && detail && (
                                                <div className="methods-detail-panel" onClick={e => e.stopPropagation()}>
                                                    <div className="methods-detail-row">
                                                        <span className="methods-detail-label">Algorithm</span>
                                                        <span className="methods-detail-value methods-detail-algo">{detail.algorithm}</span>
                                                    </div>
                                                    <div className="methods-detail-row">
                                                        <span className="methods-detail-label">How it works</span>
                                                        <span className="methods-detail-value">{detail.mechanism}</span>
                                                    </div>
                                                    <div className="methods-detail-row">
                                                        <span className="methods-detail-label">Parameters</span>
                                                        <span className="methods-detail-value methods-detail-mono">{detail.parameters}</span>
                                                    </div>
                                                    <div className="methods-detail-row">
                                                        <span className="methods-detail-label">Accuracy</span>
                                                        <span className="methods-detail-value">{detail.accuracy}</span>
                                                    </div>
                                                    <div className="methods-detail-row">
                                                        <span className="methods-detail-label">Use case</span>
                                                        <span className="methods-detail-value">{detail.useCase}</span>
                                                    </div>
                                                    <div className="methods-detail-row">
                                                        <span className="methods-detail-label">Reference</span>
                                                        <span className="methods-detail-value methods-detail-ref">{detail.source}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                </div>
            </div>

            <Footer />
        </main>
    );
}
