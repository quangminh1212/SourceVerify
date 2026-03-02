/**
 * Preposition Pattern
 * Unique algorithm for preposition pattern detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzePrepositionPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Preposition Pattern", nameKey: "signal.prepositionPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.prepositionPattern.error", icon: "📌" };
    }

    const preps=['in','on','at','to','for','with','by','from','of','about','into','through','during','before','after','above','below','between','under','over','against','among','within','without','along','across','behind','beyond','upon','toward','throughout','beneath','beside','unlike'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(preps.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.15)score=65;else if(ratio>0.1)score=55;else if(ratio<0.04)score=35;else score=45;
    const details=`Preposition ratio: ${ratio.toFixed(4)}, Count: ${count}/${ws.length}.`;
    return {
        name: "Preposition Pattern", nameKey: "signal.prepositionPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Preposition Pattern pattern suggests AI generation" : "Natural preposition pattern — consistent with human writing",
        descriptionKey: score > 55 ? "signal.prepositionPattern.ai" : "signal.prepositionPattern.real", icon: "📌",
        details,
    };
}
