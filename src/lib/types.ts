/**
 * SourceVerify - Type Definitions
 * Shared type interfaces for analysis engine
 */

export interface AnalysisResult {
    verdict: "ai" | "real" | "uncertain";
    confidence: number;
    aiScore: number;
    signals: AnalysisSignal[];
    metadata: FileMetadata;
    processingTimeMs: number;
}

export interface AnalysisSignal {
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
