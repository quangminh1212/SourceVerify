/**
 * Clause Depth Analysis
 * Measures nesting depth of clauses using subordination markers.
 *
 * Reference: Hunt (1965) - Grammatical Structures Written at Three Grade Levels, NCTE
 * Reference: Gibson (1998) - Linguistic Complexity: Locality of Syntactic Dependencies, Cognition
 */

import type { AnalysisMethod } from "../../types";

const SUBORDINATORS = new Set(["because", "although", "though", "while", "whereas", "unless", "until", "since", "if", "when", "where", "after", "before", "whether", "that", "which", "who", "whom", "whose", "whoever", "whatever", "wherever", "whenever", "however"]);

export function analyzeClauseDepthAnalysis(text: string): AnalysisMethod {
    if (text.length < 150) {
        return { name: "Clause Depth", nameKey: "signal.clauseDepthAnalysis", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.clauseDepthAnalysis.error", icon: "📐" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
    if (sentences.length < 5) {
        return { name: "Clause Depth", nameKey: "signal.clauseDepthAnalysis", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "signal.clauseDepthAnalysis.error", icon: "📐" };
    }

    const depths: number[] = [];
    for (const sent of sentences) {
        const words = sent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        let depth = 0;
        for (const w of words) {
            const clean = w.replace(/[^a-z]/g, "");
            if (SUBORDINATORS.has(clean)) depth++;
        }
        // Also count nested punctuation
        const parenDepth = (sent.match(/\(/g) || []).length;
        depths.push(depth + parenDepth);
    }

    const maxDepth = Math.max(...depths);
    const meanDepth = depths.reduce((a, b) => a + b, 0) / depths.length;
    const depthVar = depths.reduce((a, b) => a + (b - meanDepth) ** 2, 0) / depths.length;
    const depthCV = meanDepth > 0 ? Math.sqrt(depthVar) / meanDepth : 0;

    // AI: lower max depth, lower variance (flat structure)
    let score: number;
    if (maxDepth <= 1 && depthCV < 0.5 && meanDepth < 0.5) score = 74;
    else if (maxDepth <= 2 && depthCV < 0.7) score = 62;
    else if (meanDepth < 0.8) score = 50;
    else if (maxDepth >= 4 && depthCV > 1.0) score = 25;
    else if (maxDepth >= 3) score = 35;
    else score = 42;

    return {
        name: "Clause Depth", nameKey: "signal.clauseDepthAnalysis", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Shallow clause nesting — flat structure suggests AI generation" : "Natural clause depth variation — consistent with human writing",
        descriptionKey: score > 55 ? "signal.clauseDepthAnalysis.ai" : "signal.clauseDepthAnalysis.real", icon: "📐",
        details: `Max depth: ${maxDepth}, Mean: ${meanDepth.toFixed(2)}, CV: ${depthCV.toFixed(3)}, Sentences: ${sentences.length}.`,
    };
}
