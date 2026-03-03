/**
 * Acronym Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAcronymUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Acronym Usage", nameKey: "signal.acronymUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.acronymUsage.error", icon: "📌" };
    }
    const acronyms=(text.match(/\b[A-Z]{2,6}\b/g)||[]).length;const words=text.split(/\s+/).length;const ratio=words>0?acronyms/words:0;
    let score: number;
    if(ratio<0.005)score=60;else if(ratio<0.02)score=46;else if(ratio>0.06)score=35;else score=44;
    return {
        name: "Acronym Usage", nameKey: "signal.acronymUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Acronym Usage pattern suggests AI generation" : "Natural acronym usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.acronymUsage.ai" : "signal.acronymUsage.real", icon: "📌",
        details: `Acronyms: ${acronyms}, Ratio: ${ratio.toFixed(4)}`,
    };
}
