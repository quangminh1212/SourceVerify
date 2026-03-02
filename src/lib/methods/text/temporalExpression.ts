/**
 * Temporal Expression Analysis
 * Analyzes temporal expressions and verb tense consistency.
 * AI text sometimes produces temporal inconsistencies.
 *
 * Reference: Verhagen et al. (2007) - SemEval-2007 TempEval, SemEval
 * Reference: Ning et al. (2019) - Improved Neural Baseline for Temporal Relation Extraction, NAACL
 */

import type { AnalysisMethod } from "../../types";

const PAST_MARKERS = new Set(["yesterday", "ago", "previously", "formerly", "earlier", "historically", "traditionally"]);
const PRESENT_MARKERS = new Set(["now", "currently", "today", "presently", "nowadays"]);
const FUTURE_MARKERS = new Set(["tomorrow", "soon", "eventually", "later", "upcoming", "forthcoming"]);
const PAST_VERBS_ENDINGS = ["ed", "ught", "ent", "ept", "ade"];
const PRESENT_INDICATORS = ["is", "are", "has", "have", "does", "do"];

export function analyzeTemporalExpression(text: string): AnalysisMethod {
    if (text.length < 150) {
        return { name: "Temporal Expression", nameKey: "signal.temporalExpression", category: "statistical", score: 50, weight: 0.15, description: "Text too short", descriptionKey: "signal.temporalExpression.error", icon: "⏰" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 5) {
        return { name: "Temporal Expression", nameKey: "signal.temporalExpression", category: "statistical", score: 50, weight: 0.15, description: "Too few sentences", descriptionKey: "signal.temporalExpression.error", icon: "⏰" };
    }

    // Track tense per sentence
    const tenses: string[] = []; // "past", "present", "future", "mixed"
    let temporalMarkerCount = 0;

    for (const sent of sentences) {
        const words = sent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        let pastSignals = 0, presentSignals = 0, futureSignals = 0;

        for (const w of words) {
            const clean = w.replace(/[^a-z]/g, "");
            if (PAST_MARKERS.has(clean)) { pastSignals++; temporalMarkerCount++; }
            if (PRESENT_MARKERS.has(clean)) { presentSignals++; temporalMarkerCount++; }
            if (FUTURE_MARKERS.has(clean)) { futureSignals++; temporalMarkerCount++; }
            if (PAST_VERBS_ENDINGS.some(e => clean.endsWith(e) && clean.length > e.length + 2)) pastSignals++;
            if (PRESENT_INDICATORS.includes(clean)) presentSignals++;
            if (clean === "will" || clean === "shall") futureSignals++;
        }

        const maxSignal = Math.max(pastSignals, presentSignals, futureSignals);
        if (maxSignal === 0) tenses.push("neutral");
        else if (pastSignals === maxSignal && presentSignals < maxSignal * 0.5) tenses.push("past");
        else if (presentSignals === maxSignal && pastSignals < maxSignal * 0.5) tenses.push("present");
        else if (futureSignals === maxSignal) tenses.push("future");
        else tenses.push("mixed");
    }

    // Measure tense consistency
    const tenseCounts = new Map<string, number>();
    for (const t of tenses) tenseCounts.set(t, (tenseCounts.get(t) || 0) + 1);
    const dominantTense = Array.from(tenseCounts.entries()).sort((a, b) => b[1] - a[1])[0];
    const dominantRatio = dominantTense ? dominantTense[1] / tenses.length : 0;

    // Count tense shifts
    let shifts = 0;
    for (let i = 1; i < tenses.length; i++) {
        if (tenses[i] !== tenses[i - 1] && tenses[i] !== "neutral" && tenses[i - 1] !== "neutral") shifts++;
    }
    const shiftRatio = shifts / (tenses.length - 1 || 1);

    // AI: very high tense consistency (boring uniformity) OR inconsistent shifts without discourse signals
    let score: number;
    if (dominantRatio > 0.85 && shiftRatio < 0.05) score = 68;
    else if (dominantRatio > 0.75 && shiftRatio < 0.1) score = 58;
    else if (shiftRatio > 0.4) score = 60; // too many unexplained shifts
    else if (dominantRatio < 0.5 && shiftRatio > 0.15 && shiftRatio < 0.35) score = 30;
    else if (shiftRatio > 0.1 && shiftRatio < 0.3) score = 38;
    else score = 45;

    return {
        name: "Temporal Expression", nameKey: "signal.temporalExpression", category: "statistical", score, weight: 0.15,
        description: score > 55 ? "Temporal patterns suggest AI — either too uniform or inconsistent" : "Natural temporal flow — consistent with human narrative patterns",
        descriptionKey: score > 55 ? "signal.temporalExpression.ai" : "signal.temporalExpression.real", icon: "⏰",
        details: `Dominant: ${dominantTense?.[0] || "N/A"} (${(dominantRatio * 100).toFixed(1)}%), Shifts: ${(shiftRatio * 100).toFixed(1)}%, Markers: ${temporalMarkerCount}.`,
    };
}
