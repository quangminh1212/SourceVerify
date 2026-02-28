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
