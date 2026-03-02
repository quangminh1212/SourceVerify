/**
 * Pronoun Usage Pattern
 * Analyzes pronoun distribution to detect AI's distinctive avoidance patterns.
 *
 * Reference: Pennebaker (2011) - The Secret Life of Pronouns
 * Reference: Crothers et al. (2023) - Machine-Generated Text: Threat Models, IEEE Access
 */

import type { AnalysisMethod } from "../../types";

const FIRST_PERSON = new Set(["i", "me", "my", "mine", "myself", "we", "us", "our", "ours", "ourselves"]);
const SECOND_PERSON = new Set(["you", "your", "yours", "yourself", "yourselves"]);
const THIRD_PERSON = new Set(["he", "him", "his", "himself", "she", "her", "hers", "herself", "they", "them", "their", "theirs", "themselves"]);
const IMPERSONAL = new Set(["it", "its", "itself", "one", "ones"]);

export function analyzePronounUsagePattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Pronoun Usage", nameKey: "signal.pronounUsagePattern", category: "statistical", score: 50, weight: 0.15, description: "Text too short", descriptionKey: "signal.pronounUsagePattern.error", icon: "👤" };
    }

    const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 30) {
        return { name: "Pronoun Usage", nameKey: "signal.pronounUsagePattern", category: "statistical", score: 50, weight: 0.15, description: "Too few words", descriptionKey: "signal.pronounUsagePattern.error", icon: "👤" };
    }

    let first = 0, second = 0, third = 0, impersonal = 0;
    for (const w of words) {
        if (FIRST_PERSON.has(w)) first++;
        else if (SECOND_PERSON.has(w)) second++;
        else if (THIRD_PERSON.has(w)) third++;
        else if (IMPERSONAL.has(w)) impersonal++;
    }

    const N = words.length;
    const totalPronouns = first + second + third + impersonal;
    const pronounDensity = totalPronouns / N;
    const firstRatio = totalPronouns > 0 ? first / totalPronouns : 0;
    const impersonalRatio = totalPronouns > 0 ? impersonal / totalPronouns : 0;
    const selfRefIndex = first / (N || 1);

    // AI: low first-person usage, high impersonal ratio, low overall density
    let score: number;
    if (pronounDensity < 0.04 && selfRefIndex < 0.01 && impersonalRatio > 0.4) score = 72;
    else if (pronounDensity < 0.06 && selfRefIndex < 0.015) score = 62;
    else if (selfRefIndex < 0.02) score = 50;
    else if (selfRefIndex > 0.04 && pronounDensity > 0.08) score = 25;
    else if (selfRefIndex > 0.03) score = 35;
    else score = 42;

    return {
        name: "Pronoun Usage", nameKey: "signal.pronounUsagePattern", category: "statistical", score, weight: 0.15,
        description: score > 55 ? "Low personal pronoun usage — impersonal style suggests AI" : "Natural pronoun patterns — consistent with human authorship",
        descriptionKey: score > 55 ? "signal.pronounUsagePattern.ai" : "signal.pronounUsagePattern.real", icon: "👤",
        details: `Density: ${(pronounDensity * 100).toFixed(1)}%, 1st-person: ${(firstRatio * 100).toFixed(1)}%, Impersonal: ${(impersonalRatio * 100).toFixed(1)}%.`,
    };
}
