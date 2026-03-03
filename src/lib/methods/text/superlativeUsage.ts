/**
 * Superlative Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSuperlativeUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Superlative Usage", nameKey: "signal.superlativeUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.superlativeUsage.error", icon: "🏆" };
    }
    const supers=(text.match(/\b(most|best|worst|largest|smallest|greatest|least|highest|lowest|fastest|newest|oldest|biggest|strongest|weakest)\b/gi)||[]).length;const words=text.split(/\s+/).length;const ratio=words>0?supers/words:0;
    let score: number;
    if(ratio>0.02)score=64;else if(ratio>0.008)score=50;else if(ratio<0.001)score=35;else score=44;
    return {
        name: "Superlative Usage", nameKey: "signal.superlativeUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Superlative Usage pattern suggests AI generation" : "Natural superlative usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.superlativeUsage.ai" : "signal.superlativeUsage.real", icon: "🏆",
        details: `Superlatives: ${supers}, Ratio: ${ratio.toFixed(4)}`,
    };
}
