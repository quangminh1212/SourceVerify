/**
 * Filler Word Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFillerWordUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Filler Word Usage", nameKey: "signal.fillerWordUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.fillerWordUsage.error", icon: "💬" };
    }
    const fillers=['well','um','uh','like','you know','i mean','sort of','kind of','actually','basically','honestly','right','okay','so','anyway','whatever','stuff','things','yeah'];let count=0;const lower=text.toLowerCase();for(const f of fillers){const regex=new RegExp('\\b'+f.replace(/ /g,'\\s+')+'\\b','gi');const m=lower.match(regex);if(m)count+=m.length;}const words=text.split(/\s+/).length;const ratio=words>0?count/words:0;
    let score: number;
    if(ratio<0.005)score=66;else if(ratio<0.02)score=48;else if(ratio>0.05)score=30;else score=44;
    return {
        name: "Filler Word Usage", nameKey: "signal.fillerWordUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "No filler words — typical of polished AI writing" : "Natural filler word usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.fillerWordUsage.ai" : "signal.fillerWordUsage.real", icon: "💬",
        details: `Fillers: ${count}, Ratio: ${ratio.toFixed(4)}`,
    };
}
