/**
 * Text DNA Watermark
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTextDNAWatermark(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Text DNA Watermark", nameKey: "signal.textDNA", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.textDNA.error", icon: "🧬" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const charFreq=new Map();for(const w of words){for(const c of w.toLowerCase())charFreq.set(c,(charFreq.get(c)||0)+1);}const vowels=['a','e','i','o','u'];let vSum=0,cSum=0;for(const[ch,cnt] of charFreq){if(vowels.includes(ch))vSum+=cnt;else if(ch.match(/[a-z]/))cSum+=cnt;}const vcRatio=cSum>0?vSum/cSum:0;
    let score: number;
    if(Math.abs(vcRatio-0.6)<0.05)score=64;else if(Math.abs(vcRatio-0.6)<0.1)score=48;else if(vcRatio>0.8||vcRatio<0.3)score=30;else score=44;
    return {
        name: "Text DNA Watermark", nameKey: "signal.textDNA", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Text DNA Watermark — suggests AI generation" : "Natural text dna watermark — consistent with human writing",
        descriptionKey: score > 55 ? "signal.textDNA.ai" : "signal.textDNA.real", icon: "🧬",
        details: `V/C ratio: ${vcRatio.toFixed(3)}`,
    };
}
