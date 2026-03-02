/**
 * Topic Consistency Analysis
 * AI text maintains unnaturally consistent topic focus throughout.
 * We measure topic drift between document segments using vocabulary overlap
 * (Jaccard similarity) and term frequency correlation.
 *
 * Reference: Bakhtin et al. (2019) - Real or Fake? Learning to Discriminate Machine from Human Generated Text
 * Reference: Blei et al. (2003) - Latent Dirichlet Allocation, JMLR
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTopicConsistency(text: string): AnalysisMethod {
    if (text.length < 200) {
        return { name: "Topic Consistency", nameKey: "signal.topicConsistency", category: "statistical", score: 50, weight: 0.25, description: "Text too short", descriptionKey: "signal.topicConsistency.error", icon: "📋" };
    }

    // Split into equal segments
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 2);
    if (words.length < 40) {
        return { name: "Topic Consistency", nameKey: "signal.topicConsistency", category: "statistical", score: 50, weight: 0.25, description: "Too few content words", descriptionKey: "signal.topicConsistency.error", icon: "📋" };
    }

    // Remove common stopwords for topic-level analysis
    const stopwords = new Set(["the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "her", "was", "one", "our", "out", "his", "has", "had", "how", "its", "may", "new", "too", "use", "who", "did", "get", "let", "say", "she", "him", "his", "old", "see", "way", "also", "been", "each", "from", "have", "into", "just", "like", "make", "many", "some", "than", "that", "them", "then", "this", "very", "what", "when", "will", "with", "would", "your", "about", "could", "other", "their", "there", "these", "those", "which"]);
    const contentWords = words.filter(w => !stopwords.has(w));

    const segmentCount = 4;
    const segSize = Math.floor(contentWords.length / segmentCount);
    if (segSize < 5) {
        return { name: "Topic Consistency", nameKey: "signal.topicConsistency", category: "statistical", score: 50, weight: 0.25, description: "Segments too small", descriptionKey: "signal.topicConsistency.error", icon: "📋" };
    }

    // Build vocabulary sets per segment
    const segments: Set<string>[] = [];
    const segFreqs: Map<string, number>[] = [];
    for (let i = 0; i < segmentCount; i++) {
        const segWords = contentWords.slice(i * segSize, (i + 1) * segSize);
        segments.push(new Set(segWords));
        const freq = new Map<string, number>();
        for (const w of segWords) freq.set(w, (freq.get(w) || 0) + 1);
        segFreqs.push(freq);
    }

    // Pairwise Jaccard similarity
    let totalJaccard = 0;
    let pairs = 0;
    for (let i = 0; i < segmentCount; i++) {
        for (let j = i + 1; j < segmentCount; j++) {
            let intersection = 0;
            for (const word of segments[i]) {
                if (segments[j].has(word)) intersection++;
            }
            const union = segments[i].size + segments[j].size - intersection;
            totalJaccard += union > 0 ? intersection / union : 0;
            pairs++;
        }
    }
    const avgJaccard = pairs > 0 ? totalJaccard / pairs : 0;

    // AI text: high Jaccard (reuses same vocabulary)
    // Human text: more topic drift between segments
    let score: number;
    if (avgJaccard > 0.5) score = 75;
    else if (avgJaccard > 0.35) score = 62;
    else if (avgJaccard > 0.25) score = 48;
    else if (avgJaccard < 0.1) score = 22;
    else if (avgJaccard < 0.15) score = 32;
    else score = 42;

    return {
        name: "Topic Consistency", nameKey: "signal.topicConsistency", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Extremely consistent topic vocabulary — characteristic of AI-generated text" : "Natural topic variation — consistent with human-authored content",
        descriptionKey: score > 55 ? "signal.topicConsistency.ai" : "signal.topicConsistency.real", icon: "📋",
        details: `Avg Jaccard: ${avgJaccard.toFixed(4)}, Segments: ${segmentCount}, Content words: ${contentWords.length}.`,
    };
}
