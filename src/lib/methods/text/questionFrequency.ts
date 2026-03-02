/**
 * Question Frequency
 * Unique algorithm for question frequency detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeQuestionFrequency(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Question Frequency", nameKey: "signal.questionFrequency", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.questionFrequency.error", icon: "❓" };
    }

    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const questions=(text.match(/\?/g)||[]).length;
    const ratio=sents>0?questions/sents:0;
    let score;
    if(ratio<0.02)score=65;else if(ratio<0.08)score=55;else if(ratio>0.3)score=30;else score=42;
    const details=`Question ratio: ${ratio.toFixed(3)}, Questions: ${questions}, Sentences: ${sents}.`;
    return {
        name: "Question Frequency", nameKey: "signal.questionFrequency", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Question Frequency pattern suggests AI generation" : "Natural question frequency — consistent with human writing",
        descriptionKey: score > 55 ? "signal.questionFrequency.ai" : "signal.questionFrequency.real", icon: "❓",
        details,
    };
}
