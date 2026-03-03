/**
 * Abstractness
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAbstractnessIndex(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Abstractness", nameKey: "signal.abstractness", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.abstractness.error", icon: "💭" };
    }
    const abstracts=new Set(['concept','idea','theory','belief','freedom','justice','truth','beauty','knowledge','wisdom','love','peace','power','time','nature','reality','existence','consciousness','thought','mind','soul','spirit','emotion','reason','logic','meaning','purpose','value','principle','ethics']);const words=text.split(/\s+/).filter(w=>w.length>0);let count=0;for(const w of words)if(abstracts.has(w.toLowerCase()))count++;const ratio=words.length>0?count/words.length:0;
    let score: number;
    if(ratio>0.02)score=64;else if(ratio>0.008)score=50;else if(ratio<0.002)score=35;else score=44;
    return {
        name: "Abstractness", nameKey: "signal.abstractness", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Abstractness pattern suggests AI generation" : "Natural abstractness — consistent with human writing",
        descriptionKey: score > 55 ? "signal.abstractness.ai" : "signal.abstractness.real", icon: "💭",
        details: `Abstract words: ${count}, Ratio: ${ratio.toFixed(4)}`,
    };
}
