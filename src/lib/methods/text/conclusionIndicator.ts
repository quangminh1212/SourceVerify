/**
 * Conclusion Indicator
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeConclusionIndicator(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Conclusion Indicator", nameKey: "signal.conclusionIndicator", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.conclusionIndicator.error", icon: "🏁" };
    }
    const indicators=(text.match(/\b(in conclusion|to conclude|to summarize|in summary|overall|all in all|to sum up|in short|the bottom line|ultimately|finally|in essence|in brief|taking everything into account)\b/gi)||[]).length;const paras=text.split(/\n\n+/).length;const ratio=paras>0?indicators/paras:0;
    let score: number;
    if(ratio>0.3)score=68;else if(ratio>0.1)score=52;else if(indicators===0)score=38;else score=44;
    return {
        name: "Conclusion Indicator", nameKey: "signal.conclusionIndicator", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Conclusion Indicator pattern suggests AI generation" : "Natural conclusion indicator — consistent with human writing",
        descriptionKey: score > 55 ? "signal.conclusionIndicator.ai" : "signal.conclusionIndicator.real", icon: "🏁",
        details: `Conclusions: ${indicators}, Ratio: ${ratio.toFixed(3)}`,
    };
}
