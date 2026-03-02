/**
 * Passive Voice Frequency
 * Analyzes passive voice usage patterns. AI text overuses passive voice uniformly.
 *
 * Reference: Herbold et al. (2023) - Human vs ChatGPT Essays, Scientific Reports
 * Reference: Biber (1988) - Variation Across Speech and Writing
 */

import type { AnalysisMethod } from "../../types";

const PASSIVE_AUXILIARIES = new Set(["is", "are", "was", "were", "be", "been", "being", "get", "gets", "got", "gotten", "getting"]);

export function analyzePassiveVoiceFrequency(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Passive Voice Frequency", nameKey: "signal.passiveVoiceFrequency", category: "statistical", score: 50, weight: 0.15, description: "Text too short", descriptionKey: "signal.passiveVoiceFrequency.error", icon: "🔄" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 5) {
        return { name: "Passive Voice Frequency", nameKey: "signal.passiveVoiceFrequency", category: "statistical", score: 50, weight: 0.15, description: "Too few sentences", descriptionKey: "signal.passiveVoiceFrequency.error", icon: "🔄" };
    }

    // Detect passive voice: auxiliary + past participle (word ending in -ed, -en, -t)
    let passiveCount = 0;
    const passivePerPara: number[] = [];
    let paraSentCount = 0;
    let paraPassiveCount = 0;

    for (let si = 0; si < sentences.length; si++) {
        const words = sentences[si].toLowerCase().split(/\s+/).filter(w => w.length > 0);
        let isPassive = false;
        for (let i = 0; i < words.length - 1; i++) {
            const clean = words[i].replace(/[^a-z]/g, "");
            const next = words[i + 1].replace(/[^a-z]/g, "");
            if (PASSIVE_AUXILIARIES.has(clean) && (next.endsWith("ed") || next.endsWith("en") || next.endsWith("own") || next.endsWith("ught") || next.endsWith("ade"))) {
                isPassive = true;
                break;
            }
        }
        if (isPassive) { passiveCount++; paraPassiveCount++; }
        paraSentCount++;
        // Group every 3-5 sentences as paragraph proxy
        if (paraSentCount >= 4 || si === sentences.length - 1) {
            passivePerPara.push(paraPassiveCount / paraSentCount);
            paraSentCount = 0;
            paraPassiveCount = 0;
        }
    }

    const passiveRatio = passiveCount / sentences.length;
    const paraVarMean = passivePerPara.length > 0 ? passivePerPara.reduce((a, b) => a + b, 0) / passivePerPara.length : 0;
    const paraVar = passivePerPara.length > 1 ? passivePerPara.reduce((a, b) => a + (b - paraVarMean) ** 2, 0) / passivePerPara.length : 0;

    // AI: high passive ratio, low paragraph variance
    let score: number;
    if (passiveRatio > 0.4 && paraVar < 0.02) score = 72;
    else if (passiveRatio > 0.3 && paraVar < 0.04) score = 62;
    else if (passiveRatio > 0.25) score = 50;
    else if (passiveRatio < 0.1 && paraVar > 0.05) score = 28;
    else if (passiveRatio < 0.15) score = 35;
    else score = 42;

    return {
        name: "Passive Voice Frequency", nameKey: "signal.passiveVoiceFrequency", category: "statistical", score, weight: 0.15,
        description: score > 55 ? "Excessive passive voice — uniform usage pattern suggests AI" : "Natural voice balance — consistent with human writing",
        descriptionKey: score > 55 ? "signal.passiveVoiceFrequency.ai" : "signal.passiveVoiceFrequency.real", icon: "🔄",
        details: `Passive ratio: ${(passiveRatio * 100).toFixed(1)}%, Para variance: ${paraVar.toFixed(4)}, Sentences: ${sentences.length}.`,
    };
}
