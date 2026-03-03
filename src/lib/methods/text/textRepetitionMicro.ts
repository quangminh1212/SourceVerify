/**
 * Micro Repetition
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTextRepetitionMicro(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Micro Repetition", nameKey: "signal.microRepetition", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.microRepetition.error", icon: "🔁" };
    }
    const words=text.toLowerCase().split(/\s+/);let repeat2=0,repeat3=0;for(let i=1;i<words.length;i++){if(words[i]===words[i-1])repeat2++;}for(let i=2;i<words.length;i++){if(words[i]===words[i-2]&&words[i]!==words[i-1])repeat3++;}const total=words.length>0?(repeat2+repeat3)/words.length:0;
    let score: number;
    if(total<0.005)score=64;else if(total<0.02)score=48;else if(total>0.05)score=32;else score=44;
    return {
        name: "Micro Repetition", nameKey: "signal.microRepetition", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Micro Repetition — suggests AI generation" : "Natural micro repetition — consistent with human writing",
        descriptionKey: score > 55 ? "signal.microRepetition.ai" : "signal.microRepetition.real", icon: "🔁",
        details: `Repeat2: ${repeat2}, Repeat3: ${repeat3}`,
    };
}
