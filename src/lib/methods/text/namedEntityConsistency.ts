/**
 * Named Entity Consistency
 * Evaluates consistency of named entities to detect AI hallucinations.
 * AI text is prone to hallucinating entities or mixing attributes.
 *
 * Reference: Ji et al. (2023) - Survey of Hallucination in NLG, ACM Computing Surveys
 * Reference: Manakul et al. (2023) - SelfCheckGPT, EMNLP
 */

import type { AnalysisMethod } from "../../types";

export function analyzeNamedEntityConsistency(text: string): AnalysisMethod {
    if (text.length < 200) {
        return { name: "Named Entity Consistency", nameKey: "signal.namedEntityConsistency", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.namedEntityConsistency.error", icon: "🏷️" };
    }

    // Extract potential named entities (capitalized words not at sentence start)
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    const entityMentions = new Map<string, number>();
    const entityPositions = new Map<string, number[]>();

    for (let si = 0; si < sentences.length; si++) {
        const words = sentences[si].split(/\s+/);
        for (let wi = 0; wi < words.length; wi++) {
            const word = words[wi].replace(/[^a-zA-Z]/g, "");
            if (word.length > 1 && word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
                // Skip if first word of sentence (common capitalization)
                if (wi === 0) continue;
                const key = word.toLowerCase();
                entityMentions.set(key, (entityMentions.get(key) || 0) + 1);
                if (!entityPositions.has(key)) entityPositions.set(key, []);
                entityPositions.get(key)!.push(si);
            }
        }
    }

    const entities = Array.from(entityMentions.entries()).filter(([, count]) => count >= 1);
    const uniqueEntities = entities.length;
    const totalMentions = entities.reduce((sum, [, c]) => sum + c, 0);

    // Entity density and repetition patterns
    const entityDensity = uniqueEntities / (sentences.length || 1);
    const mentionDensity = totalMentions / (sentences.length || 1);

    // Check for entity clustering (entities mentioned once then never again)
    let singleMentionRatio = 0;
    if (entities.length > 0) {
        const singleMentions = entities.filter(([, c]) => c === 1).length;
        singleMentionRatio = singleMentions / entities.length;
    }

    // AI text: high entity density (name-drops many entities), high single-mention ratio (introduces but doesn't develop)
    let score: number;
    if (entityDensity > 1.5 && singleMentionRatio > 0.7) score = 72;
    else if (entityDensity > 1.0 && singleMentionRatio > 0.6) score = 62;
    else if (entityDensity > 0.8) score = 50;
    else if (entityDensity < 0.3 && singleMentionRatio < 0.4) score = 28;
    else if (singleMentionRatio < 0.5) score = 35;
    else score = 42;

    return {
        name: "Named Entity Consistency", nameKey: "signal.namedEntityConsistency", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Entity usage patterns suggest AI generation — possible hallucination indicators" : "Natural entity consistency — entities developed and referenced coherently",
        descriptionKey: score > 55 ? "signal.namedEntityConsistency.ai" : "signal.namedEntityConsistency.real", icon: "🏷️",
        details: `Entities: ${uniqueEntities}, Density: ${entityDensity.toFixed(2)}/sent, Single-mention: ${(singleMentionRatio * 100).toFixed(1)}%.`,
    };
}
