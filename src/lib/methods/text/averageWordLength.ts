/**
 * Avg Word Length
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAverageWordLength(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Avg Word Length", nameKey: "signal.avgWordLength", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.avgWordLength.error", icon: "📏" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const totalLen=words.reduce((a,w)=>a+w.length,0);const avg=words.length>0?totalLen/words.length:0;
    let score: number;
    if(avg>6)score=64;else if(avg>5)score=50;else if(avg<4)score=35;else score=44;
    return {
        name: "Avg Word Length", nameKey: "signal.avgWordLength", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Avg Word Length pattern suggests AI generation" : "Natural avg word length — consistent with human writing",
        descriptionKey: score > 55 ? "signal.avgWordLength.ai" : "signal.avgWordLength.real", icon: "📏",
        details: `Avg word length: ${avg.toFixed(2)}`,
    };
}
