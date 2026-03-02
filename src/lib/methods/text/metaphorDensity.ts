/**
 * Metaphor Density
 * Unique algorithm for metaphor density detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMetaphorDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Metaphor Density", nameKey: "signal.metaphorDensity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.metaphorDensity.error", icon: "🎭" };
    }

    const markers=['like a','as if','as though','resembles','mirror','echoes','shadow of','heart of','ocean of','mountain of','river of','sea of','flood of','storm of','fire of','light of','wave of','bridge between','wall of','door to','window into','key to','path to','garden of','forest of'];
    const lower=text.toLowerCase();
    let count=0;for(const m of markers){let i=-1;while((i=lower.indexOf(m,i+1))!==-1)count++;}
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const density=sents>0?count/sents:0;
    let score;
    if(density<0.05)score=65;else if(density<0.15)score=55;else if(density>0.5)score=30;else score=42;
    const details=`Figurative density: ${density.toFixed(3)}, Markers: ${count}, Sentences: ${sents}.`;
    return {
        name: "Metaphor Density", nameKey: "signal.metaphorDensity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Metaphor Density pattern suggests AI generation" : "Natural metaphor density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.metaphorDensity.ai" : "signal.metaphorDensity.real", icon: "🎭",
        details,
    };
}
