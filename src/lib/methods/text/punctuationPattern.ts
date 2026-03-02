/**
 * Punctuation Pattern Analysis
 * AI text has distinctive punctuation usage patterns — more regular
 * comma/period spacing and less diverse punctuation marks.
 *
 * We analyze: punctuation frequency distribution, inter-punctuation spacing
 * variance, and diversity of punctuation types used.
 *
 * Reference: Fagni et al. (2021) - TweepFake: About detecting deepfake tweets, PLOS ONE
 * Reference: Neal et al. (2017) - Surveying Stylometry Techniques and Applications, ACM CSUR
 */
import type { AnalysisMethod } from "../../types";

export function analyzePunctuationPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Punctuation Pattern", nameKey: "signal.punctuationPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.punctuationPattern.error", icon: "❗" };
    }

    // Find all punctuation positions and types
    const punctRegex = /[.,;:!?'"()\[\]{}\-—–…\/\\@#$%&*]/g;
    const punctPositions: number[] = [];
    const punctTypes = new Map<string, number>();
    let match;
    while ((match = punctRegex.exec(text)) !== null) {
        punctPositions.push(match.index);
        const ch = match[0];
        punctTypes.set(ch, (punctTypes.get(ch) || 0) + 1);
    }

    if (punctPositions.length < 5) {
        return { name: "Punctuation Pattern", nameKey: "signal.punctuationPattern", category: "statistical", score: 50, weight: 0.2, description: "Too few punctuation marks", descriptionKey: "signal.punctuationPattern.error", icon: "❗" };
    }

    // 1. Inter-punctuation spacing CV
    const spacings: number[] = [];
    for (let i = 1; i < punctPositions.length; i++) {
        spacings.push(punctPositions[i] - punctPositions[i - 1]);
    }
    const spaceMean = spacings.reduce((a, b) => a + b, 0) / spacings.length;
    const spaceVar = spacings.reduce((a, b) => a + (b - spaceMean) ** 2, 0) / spacings.length;
    const spaceCV = spaceMean > 0 ? Math.sqrt(spaceVar) / spaceMean : 0;

    // 2. Punctuation type diversity (entropy-based)
    const totalPunct = Array.from(punctTypes.values()).reduce((a, b) => a + b, 0);
    let punctEntropy = 0;
    for (const count of punctTypes.values()) {
        const p = count / totalPunct;
        if (p > 0) punctEntropy -= p * Math.log2(p);
    }
    const maxPunctEntropy = Math.log2(Math.max(punctTypes.size, 1));
    const normalizedPunctEntropy = maxPunctEntropy > 0 ? punctEntropy / maxPunctEntropy : 0;

    // 3. Punctuation rate (punctuation per word)
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const punctRate = wordCount > 0 ? punctPositions.length / wordCount : 0;

    // AI text: low spacing CV (regular), low punctuation diversity, moderate punctRate
    // Human text: higher spacing CV, more diverse punctuation, variable rate
    let score: number;
    if (spaceCV < 0.4 && normalizedPunctEntropy < 0.5) score = 72;
    else if (spaceCV < 0.6 && normalizedPunctEntropy < 0.6) score = 58;
    else if (spaceCV < 0.7) score = 48;
    else if (spaceCV > 1.2 && normalizedPunctEntropy > 0.8) score = 22;
    else if (spaceCV > 1.0) score = 32;
    else score = 42;

    return {
        name: "Punctuation Pattern", nameKey: "signal.punctuationPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Regular punctuation spacing — AI text shows predictable punctuation patterns" : "Natural punctuation variation — consistent with human writing style",
        descriptionKey: score > 55 ? "signal.punctuationPattern.ai" : "signal.punctuationPattern.real", icon: "❗",
        details: `Space CV: ${spaceCV.toFixed(3)}, Punct diversity: ${normalizedPunctEntropy.toFixed(3)}, Punct rate: ${punctRate.toFixed(3)}, Types: ${punctTypes.size}.`,
    };
}
