/**
 * Negation Pattern
 * Unique algorithm for negation pattern detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNegationPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Negation Pattern", nameKey: "signal.negationPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.negationPattern.error", icon: "🚫" };
    }

    const negs=["not","no","never","neither","nor","nobody","nothing","nowhere","none","don't","doesn't","didn't","won't","wouldn't","couldn't","shouldn't","can't","isn't","aren't","wasn't","weren't","hasn't","haven't","hadn't"];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(negs.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.06)score=35;else if(ratio>0.04)score=45;else if(ratio<0.01)score=62;else score=50;
    const details=`Negation ratio: ${ratio.toFixed(4)}, Count: ${count}/${ws.length}.`;
    return {
        name: "Negation Pattern", nameKey: "signal.negationPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Negation Pattern pattern suggests AI generation" : "Natural negation pattern — consistent with human writing",
        descriptionKey: score > 55 ? "signal.negationPattern.ai" : "signal.negationPattern.real", icon: "🚫",
        details,
    };
}
