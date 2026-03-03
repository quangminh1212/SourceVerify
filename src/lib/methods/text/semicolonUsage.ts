/**
 * Semicolon Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSemicolonUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Semicolon Usage", nameKey: "signal.semicolonUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.semicolonUsage.error", icon: "✒️" };
    }
    const semi=(text.match(/;/g)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?semi/sents:0;
    let score: number;
    if(ratio<0.005)score=60;else if(ratio<0.05)score=46;else if(ratio>0.15)score=38;else score=44;
    return {
        name: "Semicolon Usage", nameKey: "signal.semicolonUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Semicolon Usage pattern suggests AI generation" : "Natural semicolon usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.semicolonUsage.ai" : "signal.semicolonUsage.real", icon: "✒️",
        details: `Semicolons: ${semi}, Ratio: ${ratio.toFixed(4)}`,
    };
}
