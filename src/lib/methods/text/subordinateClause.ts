/**
 * Subordinate Clause
 * Unique algorithm for subordinate clause detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSubordinateClause(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Subordinate Clause", nameKey: "signal.subordinateClause", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.subordinateClause.error", icon: "📐" };
    }

    const markers=['which','that','who','whom','whose','where','when','while','although','because','since','unless','until','after','before','if','though','whereas','whenever','wherever'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    let count=0;for(const w of ws)if(markers.includes(w))count++;
    const perSent=sents>0?count/sents:0;
    let score;
    if(perSent>2.5)score=35;else if(perSent>1.5)score=45;else if(perSent<0.3)score=65;else score=50;
    const details=`Subordinate/sent: ${perSent.toFixed(3)}, Markers: ${count}.`;
    return {
        name: "Subordinate Clause", nameKey: "signal.subordinateClause", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Subordinate Clause pattern suggests AI generation" : "Natural subordinate clause — consistent with human writing",
        descriptionKey: score > 55 ? "signal.subordinateClause.ai" : "signal.subordinateClause.real", icon: "📐",
        details,
    };
}
