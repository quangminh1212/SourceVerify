/**
 * Sentence Rhythm
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceRhythm(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentence Rhythm", nameKey: "signal.sentenceRhythm", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentenceRhythm.error", icon: "🎵" };
    }
    const sents = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lengths = sents.map(s => s.trim().split(/\s+/).length);
    let score: number;
    if (lengths.length < 3) {
        score = 50;
    } else {
        let diffs = 0; for (let i = 1; i < lengths.length; i++)diffs += Math.abs(lengths[i] - lengths[i - 1]);
        const avgDiff = diffs / (lengths.length - 1); const maxL = Math.max(...lengths);
        const r = maxL > 0 ? avgDiff / maxL : 0;
        if (r < 0.1) score = 66; else if (r < 0.25) score = 50; else if (r > 0.5) score = 30; else score = 44;
    }
    return {
        name: "Sentence Rhythm", nameKey: "signal.sentenceRhythm", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Monotonous sentence rhythm — suggests AI generation" : "Natural sentence rhythm — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentenceRhythm.ai" : "signal.sentenceRhythm.real", icon: "🎵",
        details: `Sentences: ${lengths.length}`,
    };
}
