/**
 * Modal Verb Frequency
 * Unique algorithm for modal verb frequency detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeModalVerbFrequency(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Modal Verb Frequency", nameKey: "signal.modalVerbFrequency", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.modalVerbFrequency.error", icon: "📝" };
    }

    const modals=['can','could','may','might','must','shall','should','will','would','ought','need','dare'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(modals.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio<0.005)score=64;else if(ratio<0.015)score=54;else if(ratio>0.05)score=32;else score=44;
    const details=`Modal ratio: ${ratio.toFixed(4)}, Count: ${count}/${ws.length}.`;
    return {
        name: "Modal Verb Frequency", nameKey: "signal.modalVerbFrequency", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Modal Verb Frequency pattern suggests AI generation" : "Natural modal verb frequency — consistent with human writing",
        descriptionKey: score > 55 ? "signal.modalVerbFrequency.ai" : "signal.modalVerbFrequency.real", icon: "📝",
        details,
    };
}
