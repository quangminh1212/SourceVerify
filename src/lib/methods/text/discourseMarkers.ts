/**
 * Discourse Marker Analysis
 * Analyzes usage patterns of discourse markers (connectives, transitions).
 * AI text typically uses a narrower set of discourse markers with formulaic placement.
 *
 * Reference: Kumarage et al. (2023) - Stylometric Detection of AI-Generated Text
 * Reference: Halliday & Hasan (1976) - Cohesion in English
 */

import type { AnalysisMethod } from "../../types";

const DISCOURSE_MARKERS = new Set([
    "however", "therefore", "furthermore", "moreover", "nevertheless", "nonetheless",
    "consequently", "accordingly", "meanwhile", "subsequently", "additionally",
    "alternatively", "conversely", "similarly", "likewise", "otherwise",
    "in addition", "in contrast", "on the other hand", "as a result",
    "for example", "for instance", "in particular", "in fact", "indeed",
    "specifically", "namely", "that is", "in other words",
    "first", "second", "third", "finally", "lastly", "initially",
    "overall", "in conclusion", "to summarize", "in summary",
    "it is important", "it is worth noting", "it should be noted",
]);

const SINGLE_WORD_MARKERS = new Set([
    "however", "therefore", "furthermore", "moreover", "nevertheless", "nonetheless",
    "consequently", "accordingly", "meanwhile", "subsequently", "additionally",
    "alternatively", "conversely", "similarly", "likewise", "otherwise",
    "indeed", "specifically", "namely", "initially", "overall", "finally", "lastly",
    "first", "second", "third",
]);

export function analyzeDiscourseMarkers(text: string): AnalysisMethod {
    if (text.length < 150) {
        return { name: "Discourse Markers", nameKey: "signal.discourseMarkers", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.discourseMarkers.error", icon: "🔗" };
    }

    const normalized = text.toLowerCase();
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 5) {
        return { name: "Discourse Markers", nameKey: "signal.discourseMarkers", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "signal.discourseMarkers.error", icon: "🔗" };
    }

    // Count marker occurrences
    let totalMarkers = 0;
    const markerSet = new Set<string>();
    let sentenceInitialCount = 0;

    for (const sent of sentences) {
        const lower = sent.toLowerCase().trim();
        const words = lower.split(/\s+/);
        const firstWord = words[0] || "";

        // Check single-word markers
        for (const marker of SINGLE_WORD_MARKERS) {
            if (lower.includes(marker)) {
                totalMarkers++;
                markerSet.add(marker);
                if (firstWord === marker || lower.startsWith(marker + ",") || lower.startsWith(marker + " ")) {
                    sentenceInitialCount++;
                }
            }
        }
    }

    const markerDensity = totalMarkers / sentences.length; // markers per sentence
    const markerVariety = markerSet.size;
    const sentInitialRatio = totalMarkers > 0 ? sentenceInitialCount / totalMarkers : 0;

    // AI patterns: high marker density, low variety (formulaic), high sentence-initial ratio
    let score: number;
    if (markerDensity > 0.6 && markerVariety < 5 && sentInitialRatio > 0.7) score = 74;
    else if (markerDensity > 0.4 && markerVariety < 6) score = 64;
    else if (markerDensity > 0.3) score = 52;
    else if (markerDensity < 0.1 && markerVariety > 3) score = 30;
    else if (markerDensity < 0.15) score = 38;
    else score = 42;

    return {
        name: "Discourse Markers", nameKey: "signal.discourseMarkers", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Formulaic discourse marker usage — suggests AI-generated text" : "Natural discourse marker patterns — consistent with human writing",
        descriptionKey: score > 55 ? "signal.discourseMarkers.ai" : "signal.discourseMarkers.real", icon: "🔗",
        details: `Density: ${markerDensity.toFixed(3)}/sent, Variety: ${markerVariety} unique, Sent-initial: ${(sentInitialRatio * 100).toFixed(1)}%, Sentences: ${sentences.length}.`,
    };
}
