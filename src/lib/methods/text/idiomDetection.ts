/**
 * Idiom Detection
 * Unique algorithm for idiom detection detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeIdiomDetection(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Idiom Detection", nameKey: "signal.idiomDetection", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.idiomDetection.error", icon: "💬" };
    }

    const idioms=['break the ice','hit the nail','piece of cake','once in a blue moon','bite the bullet','burn the midnight','cost an arm','call it a day','get out of hand','go the extra mile','in the same boat','let the cat out','miss the boat','under the weather','break a leg','back to square','beat around the bush','better late than','on the same page','speak of the devil'];
    const lower=text.toLowerCase();
    let count=0;for(const id of idioms)if(lower.includes(id))count++;
    const ws=text.split(/\s+/).length;
    const density=ws>0?count/(ws/100):0;
    let score;
    if(density<0.05)score=62;else if(density<0.2)score=50;else if(density>1)score=30;else score=40;
    const details=`Idiom density: ${density.toFixed(3)}/100w, Found: ${count}.`;
    return {
        name: "Idiom Detection", nameKey: "signal.idiomDetection", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Idiom Detection pattern suggests AI generation" : "Natural idiom detection — consistent with human writing",
        descriptionKey: score > 55 ? "signal.idiomDetection.ai" : "signal.idiomDetection.real", icon: "💬",
        details,
    };
}
