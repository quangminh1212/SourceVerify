export type Category = "all" | "pixel" | "frequency" | "statistical" | "metadata" | "sensor";

/* ── SVG Icon paths (Lucide-style, monochrome) ── */
export const ICON_PATHS: Record<string, string> = {
    metadata: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    spectral: "M22 12L18 12L15 21L9 3L6 12L2 12",
    reconstruction: "M11 11a8 8 0 110 0 M21 21l-4.35-4.35 M11 8v6 M8 11h6",
    noise: "M4 9h16 M4 15h16 M10 3l-2 18 M16 3l-2 18",
    edge: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
    gradient: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    benford: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    chromatic: "M12 12a10 10 0 110 0z M14.31 8l5.74 9.94 M9.69 8h11.48 M7.38 12l5.74-9.94 M9.69 16l-5.74-9.94 M14.31 16H2.83 M16.62 12l-5.74 9.94",
    texture: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
    cfa: "M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18",
    dct: "M18 3h4v18h-4z M10 8h4v13h-4z M2 13h4v8H2z",
    color: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    prnu: "M12 12a10 10 0 110 0z M22 12h-4 M6 12H2 M12 6V2 M12 22v-4",
};

/* ── Category hex colors for icons ── */
export const CAT_HEX: Record<Category, string> = {
    all: "#888",
    pixel: "#4285F4",
    frequency: "#9C27B0",
    statistical: "#FBBC04",
    metadata: "#34A853",
    sensor: "#EA4335",
};

/* ── Method detail data (technical, language-neutral) ── */
export const DETAILS: Record<string, {
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

export const METHODS = [
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

export const CATEGORIES: { key: Category; labelKey: string }[] = [
    { key: "all", labelKey: "methods.catAll" },
    { key: "pixel", labelKey: "methods.catPixel" },
    { key: "frequency", labelKey: "methods.catFrequency" },
    { key: "statistical", labelKey: "methods.catStatistical" },
    { key: "metadata", labelKey: "methods.catMetadata" },
    { key: "sensor", labelKey: "methods.catSensor" },
];

export const CAT_COLORS: Record<Category, string> = {
    all: "",
    pixel: "cat-pixel",
    frequency: "cat-frequency",
    statistical: "cat-statistical",
    metadata: "cat-metadata",
    sensor: "cat-sensor",
};
