/**
 * Transition Quality
 * Unique algorithm for transition quality detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTransitionQuality(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Transition Quality", nameKey: "signal.transitionQuality", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.transitionQuality.error", icon: "🔗" };
    }

    const transitions=['however','moreover','furthermore','additionally','nevertheless','consequently','therefore','thus','meanwhile','subsequently','likewise','similarly','conversely','nonetheless','alternatively','accordingly','hence','otherwise','instead','besides'];
    const ws=text.toLowerCase().split(/\s+/);
    let count=0;for(const w of ws)if(transitions.includes(w))count++;
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const ratio=sents>0?count/sents:0;
    let score;
    if(ratio>0.15)score=70;else if(ratio>0.08)score=58;else if(ratio<0.01)score=30;else score=44;
    const details=`Transition ratio: ${ratio.toFixed(3)}, Found: ${count}.`;
    return {
        name: "Transition Quality", nameKey: "signal.transitionQuality", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Transition Quality pattern suggests AI generation" : "Natural transition quality — consistent with human writing",
        descriptionKey: score > 55 ? "signal.transitionQuality.ai" : "signal.transitionQuality.real", icon: "🔗",
        details,
    };
}
