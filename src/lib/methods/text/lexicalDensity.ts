/**
 * Lexical Density
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLexicalDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Lexical Density", nameKey: "signal.lexicalDensity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.lexicalDensity.error", icon: "📊" };
    }
    const funcWords=new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','shall','would','should','can','could','may','might','must','in','on','at','to','for','with','by','from','of','and','but','or','nor','not','no','so','if','then','than','that','this','these','those','it','its','my','your','his','her','our','their']);const words=text.split(/\s+/).filter(w=>w.length>0);let content=0;for(const w of words)if(!funcWords.has(w.toLowerCase()))content++;const density=words.length>0?content/words.length:0;
    let score: number;
    if(density>0.6)score=64;else if(density>0.5)score=48;else if(density<0.35)score=32;else score=44;
    return {
        name: "Lexical Density", nameKey: "signal.lexicalDensity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Lexical Density — suggests AI generation" : "Natural lexical density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.lexicalDensity.ai" : "signal.lexicalDensity.real", icon: "📊",
        details: `Lexical density: ${density.toFixed(3)}`,
    };
}
