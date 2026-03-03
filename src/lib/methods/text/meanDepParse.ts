/**
 * Mean Dependency Depth
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMeanDepParse(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Mean Dependency Depth", nameKey: "signal.meanDepParse", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.meanDepParse.error", icon: "📐" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const depths=sents.map(s=>{const ws=s.trim().split(/\s+/);let d=0,nest=0;for(const w2 of ws){if(w2.match(/^(if|when|while|because|although|that|which|who|whom|whose|where)$/i))nest++;if(w2===','||w2.endsWith(','))nest=Math.max(0,nest-1);d+=nest;}return ws.length>0?d/ws.length:0;});const avg=depths.length>0?depths.reduce((a,b)=>a+b,0)/depths.length:0;
    let score: number;
    if(avg<0.3)score=64;else if(avg<0.6)score=48;else if(avg>1.2)score=30;else score=44;
    return {
        name: "Mean Dependency Depth", nameKey: "signal.meanDepParse", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Mean Dependency Depth — suggests AI generation" : "Natural mean dependency depth — consistent with human writing",
        descriptionKey: score > 55 ? "signal.meanDepParse.ai" : "signal.meanDepParse.real", icon: "📐",
        details: `Avg depth: ${avg.toFixed(3)}`,
    };
}
