/**
 * Transition Smooth
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTransitionSmooth(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Transition Smooth", nameKey: "signal.transitionSmooth", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.transitionSmooth.error", icon: "🔄" };
    }
    const trans=(text.match(/\b(however|therefore|furthermore|moreover|consequently|nevertheless|meanwhile|subsequently|accordingly|additionally|alternatively|conversely|similarly|likewise|in contrast|on the contrary|as a result|in addition|for instance|for example|in conclusion|to summarize)\b/gi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?trans/sents:0;
    let score: number;
    if(ratio>0.15)score=68;else if(ratio>0.06)score=52;else if(ratio<0.01)score=32;else score=44;
    return {
        name: "Transition Smooth", nameKey: "signal.transitionSmooth", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Transition Smooth pattern suggests AI generation" : "Natural transition smooth — consistent with human writing",
        descriptionKey: score > 55 ? "signal.transitionSmooth.ai" : "signal.transitionSmooth.real", icon: "🔄",
        details: `Transitions: ${trans}, Ratio: ${ratio.toFixed(3)}`,
    };
}
