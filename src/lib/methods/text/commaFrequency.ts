/**
 * Comma Frequency
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCommaFrequency(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Comma Frequency", nameKey: "signal.commaFreq", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.commaFreq.error", icon: "📝" };
    }
    const commas=(text.match(/,/g)||[]).length;const words=text.split(/\s+/).length;const ratio=words>0?commas/words:0;
    let score: number;
    if(ratio<0.02)score=62;else if(ratio<0.06)score=46;else if(ratio>0.12)score=35;else score=44;
    return {
        name: "Comma Frequency", nameKey: "signal.commaFreq", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Comma Frequency pattern suggests AI generation" : "Natural comma frequency — consistent with human writing",
        descriptionKey: score > 55 ? "signal.commaFreq.ai" : "signal.commaFreq.real", icon: "📝",
        details: `Commas: ${commas}, Ratio: ${ratio.toFixed(4)}`,
    };
}
