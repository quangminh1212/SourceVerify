/**
 * Quotation Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeQuotationUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Quotation Usage", nameKey: "signal.quotationUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.quotationUsage.error", icon: "💬" };
    }
    const doubleQ=(text.match(/"/g)||[]).length/2;const singleQ=(text.match(/'/g)||[]).length/2;const total=Math.floor(doubleQ+singleQ);const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?total/sents:0;
    let score: number;
    if(ratio<0.01)score=60;else if(ratio<0.08)score=46;else if(ratio>0.2)score=35;else score=44;
    return {
        name: "Quotation Usage", nameKey: "signal.quotationUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Quotation Usage pattern suggests AI generation" : "Natural quotation usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.quotationUsage.ai" : "signal.quotationUsage.real", icon: "💬",
        details: `Quotes: ${total}, Ratio: ${ratio.toFixed(3)}`,
    };
}
