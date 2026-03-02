/**
 * Comparative Structure
 * Unique algorithm for comparative structure detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeComparativeStructure(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Comparative Structure", nameKey: "signal.comparativeStructure", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.comparativeStructure.error", icon: "⚖" };
    }

    const compW=['more','less','better','worse','greater','smaller','larger','higher','lower','faster','slower','than','compared','whereas','unlike','similarly','likewise','contrast'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(compW.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.04)score=62;else if(ratio>0.02)score=52;else if(ratio<0.005)score=35;else score=44;
    const details=`Comparative ratio: ${ratio.toFixed(4)}, Found: ${count}.`;
    return {
        name: "Comparative Structure", nameKey: "signal.comparativeStructure", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Comparative Structure pattern suggests AI generation" : "Natural comparative structure — consistent with human writing",
        descriptionKey: score > 55 ? "signal.comparativeStructure.ai" : "signal.comparativeStructure.real", icon: "⚖",
        details,
    };
}
