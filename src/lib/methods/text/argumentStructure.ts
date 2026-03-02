/**
 * Argument Structure
 * Unique algorithm for argument structure detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeArgumentStructure(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Argument Structure", nameKey: "signal.argumentStructure", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.argumentStructure.error", icon: "🏗" };
    }

    const claimW=['therefore','thus','hence','consequently','argue','claim','suggest','propose','conclude','evidence','proves','demonstrates','implies','indicates'];
    const lower=text.toLowerCase();const ws=lower.split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(claimW.includes(w))count++;
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const ratio=sents>0?count/sents:0;
    let score;
    if(ratio>0.2)score=68;else if(ratio>0.1)score=56;else if(ratio<0.02)score=35;else score=45;
    const details=`Argument marker ratio: ${ratio.toFixed(3)}, Found: ${count}.`;
    return {
        name: "Argument Structure", nameKey: "signal.argumentStructure", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Argument Structure pattern suggests AI generation" : "Natural argument structure — consistent with human writing",
        descriptionKey: score > 55 ? "signal.argumentStructure.ai" : "signal.argumentStructure.real", icon: "🏗",
        details,
    };
}
