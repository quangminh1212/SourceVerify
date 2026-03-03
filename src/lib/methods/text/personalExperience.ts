/**
 * Personal Experience
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzePersonalExperience(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Personal Experience", nameKey: "signal.personalExperience", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.personalExperience.error", icon: "📝" };
    }
    const markers = ['i remember', 'i think', 'i feel', 'i believe', 'in my experience', 'personally', 'from my perspective', 'i have seen', 'i have been', 'i noticed', 'i realized', 'i learned', 'my friend', 'my family', 'when i was', 'i used to', 'i always', 'i once', 'i never', 'i sometimes']; let count = 0; const lower = text.toLowerCase(); for (const m of markers) if (lower.includes(m)) count++; const sents = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length; const ratio = sents > 0 ? count / sents : 0;
    let score: number;
    if (ratio < 0.02) score = 66; else if (ratio < 0.08) score = 50; else if (ratio > 0.2) score = 32; else score = 44;
    return {
        name: "Personal Experience", nameKey: "signal.personalExperience", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Lack of personal experience markers — suggests AI generation" : "Personal experience references — consistent with human writing",
        descriptionKey: score > 55 ? "signal.personalExperience.ai" : "signal.personalExperience.real", icon: "📝",
        details: `Personal markers: ${count}, Ratio: ${ratio.toFixed(4)}`,
    };
}
