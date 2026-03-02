/**
 * First Person Usage
 * Unique algorithm for first person usage detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFirstPersonUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "First Person Usage", nameKey: "signal.firstPersonUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.firstPersonUsage.error", icon: "👤" };
    }

    const fp=['i','me','my','mine','myself','we','us','our','ours','ourselves'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(fp.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio<0.005)score=65;else if(ratio<0.02)score=55;else if(ratio>0.08)score=30;else score=42;
    const details=`First person ratio: ${ratio.toFixed(4)}, Count: ${count}/${ws.length}.`;
    return {
        name: "First Person Usage", nameKey: "signal.firstPersonUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "First Person Usage pattern suggests AI generation" : "Natural first person usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.firstPersonUsage.ai" : "signal.firstPersonUsage.real", icon: "👤",
        details,
    };
}
