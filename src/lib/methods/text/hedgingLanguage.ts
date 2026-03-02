/**
 * Hedging Language Detection
 * Detects hedging/epistemic markers indicating AI text's cautious language.
 * AI (especially RLHF-tuned) systematically overuses hedging.
 *
 * Reference: Liang et al. (2024) - Mapping the Increasing Use of LLMs in Scientific Papers
 * Reference: Kobak et al. (2024) - Delving into ChatGPT Usage Through Excess Vocabulary
 */

import type { AnalysisMethod } from "../../types";

const HEDGE_WORDS = new Set([
    "might", "could", "may", "perhaps", "possibly", "potentially", "arguably",
    "generally", "typically", "usually", "often", "sometimes", "occasionally",
    "likely", "unlikely", "probably", "presumably", "apparently", "seemingly",
    "relatively", "somewhat", "fairly", "rather", "quite",
    "suggest", "suggests", "indicate", "indicates", "imply", "implies",
    "tend", "tends", "appear", "appears", "seem", "seems",
]);

const HEDGE_PHRASES = [
    "it is important to note", "it should be noted", "it is worth noting",
    "it is important to", "it is crucial to", "it is essential to",
    "it is worth mentioning", "it can be argued", "one could argue",
    "to some extent", "in some cases", "in many cases",
    "on the other hand", "at the same time",
];

const ASSERTIVE_WORDS = new Set([
    "certainly", "definitely", "clearly", "obviously", "undoubtedly",
    "absolutely", "always", "never", "must", "prove", "proves",
    "demonstrate", "demonstrates", "establish", "confirms", "guarantee",
]);

export function analyzeHedgingLanguage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Hedging Language", nameKey: "signal.hedgingLanguage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.hedgingLanguage.error", icon: "🛡️" };
    }

    const lower = text.toLowerCase();
    const words = lower.replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 30) {
        return { name: "Hedging Language", nameKey: "signal.hedgingLanguage", category: "statistical", score: 50, weight: 0.2, description: "Too few words", descriptionKey: "signal.hedgingLanguage.error", icon: "🛡️" };
    }

    let hedgeCount = 0;
    let assertiveCount = 0;
    for (const w of words) {
        if (HEDGE_WORDS.has(w)) hedgeCount++;
        if (ASSERTIVE_WORDS.has(w)) assertiveCount++;
    }

    // Check phrase-level hedging
    for (const phrase of HEDGE_PHRASES) {
        const regex = new RegExp(phrase.replace(/\s+/g, "\\s+"), "gi");
        const matches = lower.match(regex);
        if (matches) hedgeCount += matches.length * 2; // phrases weighted more
    }

    const hedgePer100 = (hedgeCount / words.length) * 100;
    const assertPer100 = (assertiveCount / words.length) * 100;
    const hedgeRatio = (hedgeCount + 1) / (assertiveCount + 1);

    // AI: high hedge density, high hedge-to-assertive ratio
    let score: number;
    if (hedgePer100 > 4.0 && hedgeRatio > 5) score = 76;
    else if (hedgePer100 > 3.0 && hedgeRatio > 3) score = 66;
    else if (hedgePer100 > 2.0) score = 52;
    else if (hedgePer100 < 1.0 && hedgeRatio < 1.5) score = 25;
    else if (hedgePer100 < 1.5) score = 35;
    else score = 42;

    return {
        name: "Hedging Language", nameKey: "signal.hedgingLanguage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Excessive hedging detected — systematic caution suggests AI generation" : "Natural assertiveness balance — consistent with human writing",
        descriptionKey: score > 55 ? "signal.hedgingLanguage.ai" : "signal.hedgingLanguage.real", icon: "🛡️",
        details: `Hedge: ${hedgePer100.toFixed(2)}/100w, Assert: ${assertPer100.toFixed(2)}/100w, Ratio: ${hedgeRatio.toFixed(2)}.`,
    };
}
