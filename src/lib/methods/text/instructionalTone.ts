/**
 * Instructional Tone
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeInstructionalTone(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Instructional Tone", nameKey: "signal.instructionalTone", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.instructionalTone.error", icon: "📢" };
    }
    const imperative=(text.match(/^\s*(note|remember|consider|ensure|make sure|keep in mind|be aware|please|try|avoid|use|follow|check|verify|create|add|remove|update|install)/gmi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?imperative/sents:0;
    let score: number;
    if(ratio>0.2)score=68;else if(ratio>0.08)score=52;else if(ratio<0.02)score=32;else score=44;
    return {
        name: "Instructional Tone", nameKey: "signal.instructionalTone", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Instructional Tone pattern suggests AI generation" : "Natural instructional tone — consistent with human writing",
        descriptionKey: score > 55 ? "signal.instructionalTone.ai" : "signal.instructionalTone.real", icon: "📢",
        details: `Imperative: ${imperative}, Ratio: ${ratio.toFixed(3)}`,
    };
}
