/**
 * Paragraph Structure
 * Paragraph organization analysis
 */
import type { AnalysisMethod } from "../../types";

export function analyzeParagraphStructure(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Paragraph Structure", nameKey: "signal.paragraphStructure", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.paragraphStructure.error", icon: "📄" };
    }
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 3) {
        return { name: "Paragraph Structure", nameKey: "signal.paragraphStructure", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "signal.paragraphStructure.error", icon: "📄" };
    }
    const values = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    let score: number;
    if (cv < 0.2) score = 72;
    else if (cv < 0.35) score = 60;
    else if (cv > 0.8) score = 28;
    else if (cv > 0.6) score = 38;
    else score = 48;

    return {
        name: "Paragraph Structure", nameKey: "signal.paragraphStructure", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Paragraph organization analysis — pattern suggests AI generation" : "Natural paragraph organization analysis — consistent with human writing",
        descriptionKey: score > 55 ? "signal.paragraphStructure.ai" : "signal.paragraphStructure.real", icon: "📄",
        details: `CV: ${cv.toFixed(3)}, Mean: ${mean.toFixed(2)}, Sentences: ${sentences.length}, Words: ${words.length}.`,
    };
}
