/**
 * Contraction Usage
 * Unique algorithm for contraction usage detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeContractionUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Contraction Usage", nameKey: "signal.contractionUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.contractionUsage.error", icon: "📝" };
    }

    const contractions=["n't","'re","'ve","'ll","'d","'m","'s","won't","can't","don't","isn't","aren't","wasn't","weren't","couldn't","wouldn't","shouldn't","hasn't","haven't","hadn't"];
    const lower=text.toLowerCase();
    let cCount=0;
    for(const c of contractions){let i=-1;while((i=lower.indexOf(c,i+1))!==-1)cCount++;}
    const ws=text.split(/\s+/).length;
    const ratio=ws>0?cCount/ws:0;
    let score;
    if(ratio<0.005)score=68;else if(ratio<0.015)score=58;else if(ratio>0.06)score=28;else score=42;
    const details=`Contraction ratio: ${ratio.toFixed(4)}, Found: ${cCount}.`;
    return {
        name: "Contraction Usage", nameKey: "signal.contractionUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Contraction Usage pattern suggests AI generation" : "Natural contraction usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.contractionUsage.ai" : "signal.contractionUsage.real", icon: "📝",
        details,
    };
}
