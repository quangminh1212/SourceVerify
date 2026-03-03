/**
 * Colloquial Expression
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeColloquialExpression(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Colloquial Expression", nameKey: "signal.colloquialExpression", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.colloquialExpression.error", icon: "🗨️" };
    }
    const colloquials = ['gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'dunno', 'aint', 'cuz', 'cos', 'yall', 'bout', 'prolly', 'lemme', 'gimme', 'cmon', 'nah', 'yep', 'nope', 'yup', 'haha', 'lmao', 'omg', 'btw']; let count = 0; const lower = text.toLowerCase(); for (const c of colloquials) { if (lower.includes(c)) count++; } const words = text.split(/\s+/).length; const ratio = words > 0 ? count / words : 0;
    let score: number;
    if (ratio < 0.001) score = 64; else if (ratio < 0.01) score = 48; else if (ratio > 0.03) score = 32; else score = 44;
    return {
        name: "Colloquial Expression", nameKey: "signal.colloquialExpression", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "No colloquial expressions — suggests formal AI writing" : "Natural colloquial language — consistent with human writing",
        descriptionKey: score > 55 ? "signal.colloquialExpression.ai" : "signal.colloquialExpression.real", icon: "🗨️",
        details: `Colloquials: ${count}, Ratio: ${ratio.toFixed(4)}`,
    };
}
