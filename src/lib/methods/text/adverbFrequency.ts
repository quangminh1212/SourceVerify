/**
 * Adverb Frequency
 * Unique algorithm for adverb frequency detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAdverbFrequency(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Adverb Frequency", nameKey: "signal.adverbFrequency", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.adverbFrequency.error", icon: "📝" };
    }

    const ws=text.toLowerCase().split(/\s+/).filter(w=>w.length>0);
    const advEndings=['ly','ally','fully','ously','ively','edly'];
    let advCount=0;
    for(const w of ws){for(const e of advEndings){if(w.endsWith(e)&&w.length>e.length+2){advCount++;break;}}}
    const ratio=ws.length>0?advCount/ws.length:0;
    let score;
    if(ratio>0.08)score=70;else if(ratio>0.05)score=60;else if(ratio<0.01)score=30;else score=45;
    const details=`Adverb ratio: ${ratio.toFixed(4)}, Adverbs: ${advCount}/${ws.length}.`;
    return {
        name: "Adverb Frequency", nameKey: "signal.adverbFrequency", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Adverb Frequency pattern suggests AI generation" : "Natural adverb frequency — consistent with human writing",
        descriptionKey: score > 55 ? "signal.adverbFrequency.ai" : "signal.adverbFrequency.real", icon: "📝",
        details,
    };
}
