/**
 * Rhetorical Device
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRhetoricalDevice(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Rhetorical Device", nameKey: "signal.rhetoricalDevice", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.rhetoricalDevice.error", icon: "🎤" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);let rhetorical=0;for(const s of sents){const t=s.trim();if(t.endsWith('?')&&!t.startsWith('What')&&!t.startsWith('How')&&!t.startsWith('Why'))rhetorical++;}const anaphora=new Map();for(const s of sents){const first=s.trim().split(/\s+/)[0]?.toLowerCase();if(first)anaphora.set(first,(anaphora.get(first)||0)+1);}let anaphoraCount=0;for(const v of anaphora.values())if(v>=3)anaphoraCount++;const ratio=sents.length>0?(rhetorical+anaphoraCount)/sents.length:0;
    let score: number;
    if(ratio<0.01)score=62;else if(ratio<0.05)score=48;else if(ratio>0.15)score=35;else score=44;
    return {
        name: "Rhetorical Device", nameKey: "signal.rhetoricalDevice", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Minimal rhetorical devices — suggests AI generation" : "Natural rhetorical usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.rhetoricalDevice.ai" : "signal.rhetoricalDevice.real", icon: "🎤",
        details: `Rhetorical: ${rhetorical}, Anaphora groups: ${anaphoraCount}`,
    };
}
