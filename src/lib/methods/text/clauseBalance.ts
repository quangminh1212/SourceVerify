/**
 * Clause Balance
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeClauseBalance(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Clause Balance", nameKey: "signal.clauseBalance", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.clauseBalance.error", icon: "⚖️" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);let balanced=0;for(const s of sents){const parts=s.split(/,|;|:/).filter(p2=>p2.trim().length>0);if(parts.length>=2){const lens=parts.map(p2=>p2.trim().split(/\s+/).length);const avg=lens.reduce((a,b)=>a+b,0)/lens.length;const cv=Math.sqrt(lens.reduce((a,b)=>a+(b-avg)**2,0)/lens.length)/(avg||1);if(cv<0.3)balanced++;}}const r=sents.length>0?balanced/sents.length:0;
    let score: number;
    if(r>0.4)score=66;else if(r>0.2)score=50;else if(r<0.05)score=30;else score=44;
    return {
        name: "Clause Balance", nameKey: "signal.clauseBalance", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Clause Balance — suggests AI generation" : "Natural clause balance — consistent with human writing",
        descriptionKey: score > 55 ? "signal.clauseBalance.ai" : "signal.clauseBalance.real", icon: "⚖️",
        details: `Balanced clauses: ${balanced}, Ratio: ${r.toFixed(3)}`,
    };
}
