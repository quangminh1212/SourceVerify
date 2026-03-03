/**
 * Ambiguity Tolerance
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAmbiguityTolerance(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Ambiguity Tolerance", nameKey: "signal.ambiguityTolerance", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.ambiguityTolerance.error", icon: "❓" };
    }
    const ambig=['perhaps','maybe','it depends','on the other hand','however','although','nevertheless','yet','still','but then','arguably','debatable','unclear','uncertain','complicated','complex','nuanced'];let count=0;const lower=text.toLowerCase();for(const a of ambig)if(lower.includes(a))count++;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?count/sents:0;
    let score: number;
    if(ratio>0.15)score=64;else if(ratio>0.05)score=48;else if(ratio<0.01)score=35;else score=44;
    return {
        name: "Ambiguity Tolerance", nameKey: "signal.ambiguityTolerance", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "High ambiguity hedging — typical of cautious AI writing" : "Natural ambiguity tolerance — consistent with human writing",
        descriptionKey: score > 55 ? "signal.ambiguityTolerance.ai" : "signal.ambiguityTolerance.real", icon: "❓",
        details: `Ambiguity markers: ${count}, Ratio: ${ratio.toFixed(3)}`,
    };
}
