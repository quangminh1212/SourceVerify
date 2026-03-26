/**
 * SourceVerify - Type Definitions
 * Shared type interfaces for analysis engine
 * Note: "method" = phương pháp phân tích, each method produces a result with score
 */

export interface AnalysisResult {
    verdict: "ai" | "real" | "uncertain";
    confidence: number;
    aiScore: number;
    methods: AnalysisMethod[];
    /** @deprecated Use 'methods' instead — kept for backward compat */
    signals: AnalysisMethod[];
    metadata: FileMetadata;
    processingTimeMs: number;
}

export interface AnalysisMethod {
    name: string;
    nameKey: string;
    category: string;
    score: number;
    weight: number;
    description: string;
    descriptionKey: string;
    icon: string;
    details?: string;
}

export interface FileMetadata {
    fileName: string;
    fileSize: number;
    fileType: string;
    width: number;
    height: number;
    isVideo: boolean;
    exifData?: Record<string, string>;
}

// Curated runtime core: only methods whose current implementation is close
// enough to the cited descriptor/statistic or metadata integrity check.
//
// Methods explicitly marked proxy/simplified in the academic audit are kept
// out of this default runtime set until they are re-implemented faithfully.
export const PAPER_FAITHFUL_IMAGE_METHOD_IDS = [
    "benford",
    "cfa",
    "dct",
    "glcm",
    "local_binary_pattern",
    "power_spectral_density",
    "frequency_band",
    "chi_square",
    "entropy",
    "jpeg_ghost",
    "double_jpeg",
    "autocorrelation",
    "pixel_cooccurrence",
    "tamura_texture",
    "lpq_analysis",
    "histogram",
    "histogram_gradient",
    "color_coherence",
    "mutual_information",
    "laplacian_edge",
    "median_filter",
    "resampling",
    "steganalysis",
    "perceptual_hash",
    "blocking_artifact",
    "srm_filter",
    "exif_integrity",
    "iptc_verification",
    "gps_consistency",
    "timestamp_forensics",
    "color_profile_meta",
    "resolution_consistency",
] as const;

export const PAPER_FAITHFUL_TEXT_METHOD_IDS = [
    "repetition_pattern",
    "sentence_length_variance",
    "readability_score",
    "punctuation_pattern",
    "type_token_ratio",
    "word_length_dist",
] as const;

// No dedicated video-only method currently passes the academic fidelity bar.
// Default video runtime falls back to the vetted frame-compatible image
// descriptors above until real paper-faithful temporal/audio methods exist.
export const PAPER_FAITHFUL_VIDEO_METHOD_IDS = [] as const;

export const PAPER_FAITHFUL_METHOD_IDS = [
    ...PAPER_FAITHFUL_IMAGE_METHOD_IDS,
    ...PAPER_FAITHFUL_TEXT_METHOD_IDS,
] as const;

export const PAPER_FAITHFUL_IMAGE_NAME_KEYS = [
    "signal.benfordsLaw",
    "signal.cfaPattern",
    "signal.dctBlock",
    "signal.glcmTexture",
    "signal.localBinaryPattern",
    "signal.psdSlope",
    "signal.freqBandRatio",
    "signal.chiSquareUniformity",
    "signal.entropyMap",
    "signal.jpegGhost",
    "signal.doubleJpeg",
    "signal.autocorrelation",
    "signal.pixelCooccurrence",
    "signal.tamuraTexture",
    "signal.lpq",
    "signal.histogram",
    "signal.histogramGradient",
    "signal.colorCoherence",
    "signal.mutualInfo",
    "signal.laplacianEdge",
    "signal.medianFilter",
    "signal.resampling",
    "signal.steganalysis",
    "signal.perceptualHash",
    "signal.blockingArtifact",
    "signal.srmFilter",
    "signal.exifIntegrity",
    "signal.iptcVerification",
    "signal.gpsConsistency",
    "signal.timestampForensics",
    "signal.colorProfileMeta",
    "signal.resolutionConsistency",
] as const;

export const PAPER_FAITHFUL_TEXT_NAME_KEYS = [
    "signal.repetitionPattern",
    "signal.sentenceLengthVariance",
    "signal.readabilityScore",
    "signal.punctuationPattern",
    "signal.typeTokenRatio",
    "signal.wordLengthDist",
] as const;

export const DEFAULT_VIDEO_METHOD_IDS = [
    ...PAPER_FAITHFUL_IMAGE_METHOD_IDS,
    ...PAPER_FAITHFUL_VIDEO_METHOD_IDS,
] as const;

export const DEFAULT_VIDEO_NAME_KEYS = [
    ...PAPER_FAITHFUL_IMAGE_NAME_KEYS,
] as const;

export const PAPER_FAITHFUL_METHOD_ID_SET = new Set<string>(PAPER_FAITHFUL_METHOD_IDS);
export const DEFAULT_VIDEO_METHOD_ID_SET = new Set<string>(DEFAULT_VIDEO_METHOD_IDS);
