/**
 * Number Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNumberUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Number Usage", nameKey: "signal.numberUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.numberUsage.error", icon: "🔢" };
    }
    const numbers=(text.match(/\b\d+\.?\d*\b/g)||[]).length;const words=text.split(/\s+/).length;const ratio=words>0?numbers/words:0;
    let score: number;
    if(ratio<0.005)score=60;else if(ratio<0.03)score=46;else if(ratio>0.08)score=38;else score=44;
    return {
        name: "Number Usage", nameKey: "signal.numberUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Number Usage pattern suggests AI generation" : "Natural number usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.numberUsage.ai" : "signal.numberUsage.real", icon: "🔢",
        details: `Numbers: ${numbers}, Ratio: ${ratio.toFixed(4)}`,
    };
}
