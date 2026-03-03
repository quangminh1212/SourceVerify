/**
 * Topic Depth
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTopicDepthAnalysis(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Topic Depth", nameKey: "signal.topicDepth", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.topicDepth.error", icon: "🔎" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const words=text.split(/\s+/).filter(w=>w.length>3).map(w=>w.toLowerCase());const unique=new Set(words);const contentWords=words.filter(w=>!new Set(['that','this','with','from','have','been','were','will','would','could','should','about','their','which','there','other','than']).has(w));const repeatMap=new Map();for(const w of contentWords)repeatMap.set(w,(repeatMap.get(w)||0)+1);let deepWords=0;for(const[,c]of repeatMap)if(c>=3)deepWords++;const ratio=sents.length>0?deepWords/sents.length:0;
    let score: number;
    if(ratio>0.3)score=62;else if(ratio>0.1)score=48;else if(ratio<0.03)score=35;else score=44;
    return {
        name: "Topic Depth", nameKey: "signal.topicDepth", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Surface-level topic coverage — suggests AI generation" : "Deep topic exploration — consistent with human writing",
        descriptionKey: score > 55 ? "signal.topicDepth.ai" : "signal.topicDepth.real", icon: "🔎",
        details: `Deep topic words: ${deepWords}, Ratio: ${ratio.toFixed(3)}`,
    };
}
