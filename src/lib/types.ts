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
// enough to a classical descriptor/statistic or metadata integrity check.
export const PAPER_FAITHFUL_METHOD_IDS = [
    // Image
    "benford",
    "cfa",
    "dct",
    "glcm",
    "local_binary_pattern",
    "gabor_response",
    "power_spectral_density",
    "phase_congruency",
    "radial_spectrum",
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
    "radon_transform",
    "zernike_moments",
    "blocking_artifact",
    "srm_filter",
    "exif_integrity",
    "iptc_verification",
    "gps_consistency",
    "timestamp_forensics",
    "file_structure",
    "color_profile_meta",
    "resolution_consistency",
    "software_fingerprint",
    // Text
    "ngram_frequency",
    "repetition_pattern",
    "sentence_length_variance",
    "readability_score",
    "punctuation_pattern",
    "type_token_ratio",
    "function_word_distribution",
    "passive_voice_frequency",
    "word_length_dist",
] as const;

export const PAPER_FAITHFUL_METHOD_ID_SET = new Set<string>(PAPER_FAITHFUL_METHOD_IDS);
