/**
 * Text Burstiness v2
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTextBurstiness2(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Text Burstiness v2", nameKey: "signal.textBurstiness2", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.textBurstiness2.error", icon: "💥" };
    }
    const sents = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCounts = sents.map(s => s.trim().split(/\s+/).length);
    let score: number;
    if (wordCounts.length < 3) {
        score = 50;
    } else {
        const sorted = [...wordCounts].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const median = sorted[Math.floor(sorted.length / 2)];
        const burstiness = median > 0 ? iqr / median : 0;
        if (burstiness < 0.3) score = 68; else if (burstiness < 0.6) score = 50; else if (burstiness > 1.2) score = 28; else score = 44;
    }
    return {
        name: "Text Burstiness v2", nameKey: "signal.textBurstiness2", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Text Burstiness v2 — suggests AI generation" : "Natural text burstiness v2 — consistent with human writing",
        descriptionKey: score > 55 ? "signal.textBurstiness2.ai" : "signal.textBurstiness2.real", icon: "💥",
        details: `Burstiness: ${wordCounts.length} sents`,
    };
}
