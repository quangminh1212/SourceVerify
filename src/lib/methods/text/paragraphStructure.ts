/**
 * Paragraph Structure
 * Unique algorithm for paragraph structure detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeParagraphStructure(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Paragraph Structure", nameKey: "signal.paragraphStructure", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.paragraphStructure.error", icon: "📄" };
    }

    const paras=text.split(/\n\s*\n/).filter(p=>p.trim().length>0);
    if(paras.length<2)return{name:"Paragraph Structure",nameKey:"signal.paragraphStructure",category:"statistical",score:50,weight:0.2,description:"Too few paragraphs",descriptionKey:"signal.paragraphStructure.error",icon:"📄"};
    const lens=paras.map(p=>p.split(/\s+/).length);
    const mean=lens.reduce((a,b)=>a+b,0)/lens.length;
    const cv=mean>0?Math.sqrt(lens.reduce((a,b)=>a+(b-mean)**2,0)/lens.length)/mean:0;
    let score;
    if(cv<0.15)score=72;else if(cv<0.3)score=58;else if(cv>0.8)score=28;else score=44;
    const details=`Para CV: ${cv.toFixed(3)}, Mean len: ${mean.toFixed(1)}, Paras: ${paras.length}.`;
    return {
        name: "Paragraph Structure", nameKey: "signal.paragraphStructure", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Paragraph Structure pattern suggests AI generation" : "Natural paragraph structure — consistent with human writing",
        descriptionKey: score > 55 ? "signal.paragraphStructure.ai" : "signal.paragraphStructure.real", icon: "📄",
        details,
    };
}
