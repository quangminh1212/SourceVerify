/**
 * Curie Detection
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCurieDetect(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Curie Detection", nameKey: "signal.curieDetect", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.curieDetect.error", icon: "🔬" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const wordCounts=sents.map(s=>s.trim().split(/\s+/).length);const avg=wordCounts.reduce((a,b)=>a+b,0)/(wordCounts.length||1);const variance=wordCounts.reduce((a,b)=>a+(b-avg)**2,0)/(wordCounts.length||1);const cv=avg>0?Math.sqrt(variance)/avg:0;
    let score: number;
    if(cv<0.2)score=70;else if(cv<0.4)score=52;else if(cv>0.8)score=28;else score=44;
    return {
        name: "Curie Detection", nameKey: "signal.curieDetect", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Curie Detection — suggests AI generation" : "Natural curie detection — consistent with human writing",
        descriptionKey: score > 55 ? "signal.curieDetect.ai" : "signal.curieDetect.real", icon: "🔬",
        details: `Sentence CV: ${cv.toFixed(3)}`,
    };
}
