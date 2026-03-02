/**
 * Conclusion Pattern
 * Unique algorithm for conclusion pattern detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeConclusionPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Conclusion Pattern", nameKey: "signal.conclusionPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.conclusionPattern.error", icon: "🏁" };
    }

    const conclusionMarkers=['in conclusion','to conclude','in summary','to summarize','overall','in short','to sum up','finally','ultimately','all in all','on the whole','in the end','as a result','taking everything into account'];
    const lower=text.toLowerCase();
    let found=0;for(const m of conclusionMarkers)if(lower.includes(m))found++;
    const lastPara=text.split(/\n\s*\n/).filter(p=>p.trim().length>0).pop()||'';
    const lastSents=lastPara.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    let score;
    if(found>=2)score=68;else if(found===1)score=56;else score=40;
    const details=`Conclusion markers: ${found}, Last para sentences: ${lastSents}.`;
    return {
        name: "Conclusion Pattern", nameKey: "signal.conclusionPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Conclusion Pattern pattern suggests AI generation" : "Natural conclusion pattern — consistent with human writing",
        descriptionKey: score > 55 ? "signal.conclusionPattern.ai" : "signal.conclusionPattern.real", icon: "🏁",
        details,
    };
}
