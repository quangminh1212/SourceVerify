/**
 * Typo Error Pattern
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTypoErrorPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Typo Error Pattern", nameKey: "signal.typoErrorPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.typoErrorPattern.error", icon: "✏️" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const common=new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);let typoLike=0;for(const w of words){const lower=w.toLowerCase().replace(/[^a-z]/g,'');if(lower.length>3&&!common.has(lower)){const doubled=/([a-z])\1{2,}/.test(lower);const endPattern=/[^aeiou]{4,}$/.test(lower);if(doubled||endPattern)typoLike++;}}const typoR=words.length>0?typoLike/words.length:0;
    let score: number;
    if(typoR<0.001)score=66;else if(typoR<0.01)score=50;else if(typoR>0.03)score=30;else score=42;
    return {
        name: "Typo Error Pattern", nameKey: "signal.typoErrorPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "No natural typos/errors — typical of AI generation" : "Natural error patterns — consistent with human writing",
        descriptionKey: score > 55 ? "signal.typoErrorPattern.ai" : "signal.typoErrorPattern.real", icon: "✏️",
        details: `Typo-like: ${typoLike}, Ratio: ${typoR.toFixed(4)}`,
    };
}
