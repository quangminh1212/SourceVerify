/**
 * Logical Connector
 * Unique algorithm for logical connector detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLogicalConnector(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Logical Connector", nameKey: "signal.logicalConnector", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.logicalConnector.error", icon: "🧩" };
    }

    const logical=['if','then','therefore','because','since','thus','hence','so','consequently','accordingly','as a result','for this reason','due to','owing to','in order to','provided that','assuming that','given that'];
    const lower=text.toLowerCase();
    let count=0;for(const l of logical){let i=-1;while((i=lower.indexOf(l,i+1))!==-1)count++;}
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const ratio=sents>0?count/sents:0;
    let score;
    if(ratio>0.5)score=66;else if(ratio>0.25)score=54;else if(ratio<0.05)score=35;else score=45;
    const details=`Logical connector/sent: ${ratio.toFixed(3)}, Found: ${count}.`;
    return {
        name: "Logical Connector", nameKey: "signal.logicalConnector", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Logical Connector pattern suggests AI generation" : "Natural logical connector — consistent with human writing",
        descriptionKey: score > 55 ? "signal.logicalConnector.ai" : "signal.logicalConnector.real", icon: "🧩",
        details,
    };
}
