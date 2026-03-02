/**
 * Referential Density
 * Unique algorithm for referential density detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeReferentialDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Referential Density", nameKey: "signal.referentialDensity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.referentialDensity.error", icon: "🔗" };
    }

    const refs=['this','that','these','those','it','its','they','them','their','he','she','him','her','his','such','said','the former','the latter'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(refs.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio<0.03)score=64;else if(ratio<0.06)score=54;else if(ratio>0.12)score=32;else score=44;
    const details=`Referential ratio: ${ratio.toFixed(4)}, Count: ${count}.`;
    return {
        name: "Referential Density", nameKey: "signal.referentialDensity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Referential Density pattern suggests AI generation" : "Natural referential density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.referentialDensity.ai" : "signal.referentialDensity.real", icon: "🔗",
        details,
    };
}
