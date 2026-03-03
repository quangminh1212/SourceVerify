/**
 * Contraction Detect
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeContractionDetect(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Contraction Detect", nameKey: "signal.contractionDetect", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.contractionDetect.error", icon: "🔗" };
    }
    const contractions=(text.match(/\b\w+'(t|re|ve|ll|d|s|m)\b/gi)||[]).length;const words=text.split(/\s+/).length;const ratio=words>0?contractions/words:0;
    let score: number;
    if(ratio<0.005)score=64;else if(ratio<0.02)score=48;else if(ratio>0.06)score=32;else score=44;
    return {
        name: "Contraction Detect", nameKey: "signal.contractionDetect", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Contraction Detect pattern suggests AI generation" : "Natural contraction detect — consistent with human writing",
        descriptionKey: score > 55 ? "signal.contractionDetect.ai" : "signal.contractionDetect.real", icon: "🔗",
        details: `Contractions: ${contractions}, Ratio: ${ratio.toFixed(4)}`,
    };
}
