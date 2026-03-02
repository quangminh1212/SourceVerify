/**
 * Conjunction Density
 * Unique algorithm for conjunction density detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeConjunctionDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Conjunction Density", nameKey: "signal.conjunctionDensity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.conjunctionDensity.error", icon: "🔗" };
    }

    const conj=['and','but','or','nor','yet','so','for','because','although','while','whereas','since','unless','until','after','before','when','if','though','whether'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(conj.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.08)score=35;else if(ratio>0.05)score=45;else if(ratio<0.02)score=65;else score=50;
    const details=`Conjunction ratio: ${ratio.toFixed(4)}, Count: ${count}/${ws.length}.`;
    return {
        name: "Conjunction Density", nameKey: "signal.conjunctionDensity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Conjunction Density pattern suggests AI generation" : "Natural conjunction density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.conjunctionDensity.ai" : "signal.conjunctionDensity.real", icon: "🔗",
        details,
    };
}
