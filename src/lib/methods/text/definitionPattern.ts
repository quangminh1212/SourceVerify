/**
 * Definition Pattern
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDefinitionPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Definition Pattern", nameKey: "signal.definitionPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.definitionPattern.error", icon: "📖" };
    }
    const defs=(text.match(/\b(is defined as|refers to|means|is known as|is called|is described as|is characterized by|consists of|is the process of|is a type of)\b/gi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?defs/sents:0;
    let score: number;
    if(ratio>0.1)score=70;else if(ratio>0.03)score=55;else if(ratio<0.005)score=32;else score=44;
    return {
        name: "Definition Pattern", nameKey: "signal.definitionPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Definition Pattern pattern suggests AI generation" : "Natural definition pattern — consistent with human writing",
        descriptionKey: score > 55 ? "signal.definitionPattern.ai" : "signal.definitionPattern.real", icon: "📖",
        details: `Definitions: ${defs}, Ratio: ${ratio.toFixed(3)}`,
    };
}
