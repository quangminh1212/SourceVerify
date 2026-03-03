/**
 * List Enumeration
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeListEnumerationPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "List Enumeration", nameKey: "signal.listEnumeration", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.listEnumeration.error", icon: "📋" };
    }
    const numbered=(text.match(/^\s*\d+[.)]/gm)||[]).length;const bulleted=(text.match(/^\s*[-*•]/gm)||[]).length;const ordinals=(text.match(/\b(first|second|third|finally|lastly|moreover|furthermore|additionally)\b/gi)||[]).length;const total=numbered+bulleted+ordinals;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?total/sents:0;
    let score: number;
    if(ratio>0.3)score=72;else if(ratio>0.15)score=58;else if(ratio<0.02)score=35;else score=44;
    return {
        name: "List Enumeration", nameKey: "signal.listEnumeration", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Heavy list/enumeration usage — typical of AI writing structure" : "Natural enumeration — consistent with human writing",
        descriptionKey: score > 55 ? "signal.listEnumeration.ai" : "signal.listEnumeration.real", icon: "📋",
        details: `Lists: ${total}, Ratio: ${ratio.toFixed(3)}`,
    };
}
