/**
 * Qualifier Density
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeQualifierDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Qualifier Density", nameKey: "signal.qualifierDensity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.qualifierDensity.error", icon: "📋" };
    }
    const quals=(text.match(/\b(very|quite|rather|somewhat|fairly|extremely|incredibly|remarkably|particularly|especially|significantly|substantially|considerably|noticeably)\b/gi)||[]).length;const words=text.split(/\s+/).length;const ratio=words>0?quals/words:0;
    let score: number;
    if(ratio>0.03)score=66;else if(ratio>0.01)score=50;else if(ratio<0.003)score=35;else score=44;
    return {
        name: "Qualifier Density", nameKey: "signal.qualifierDensity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Qualifier Density pattern suggests AI generation" : "Natural qualifier density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.qualifierDensity.ai" : "signal.qualifierDensity.real", icon: "📋",
        details: `Qualifiers: ${quals}, Ratio: ${ratio.toFixed(4)}`,
    };
}
