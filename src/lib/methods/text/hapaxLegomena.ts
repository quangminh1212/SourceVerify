/**
 * Hapax Legomena
 * Unique algorithm for hapax legomena detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHapaxLegomena(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Hapax Legomena", nameKey: "signal.hapaxLegomena", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.hapaxLegomena.error", icon: "🆕" };
    }

    const ws=text.toLowerCase().replace(/[^\w\s]/g,'').split(/\s+/).filter(w=>w.length>0);
    if(ws.length<20)return{name:"Hapax Legomena",nameKey:"signal.hapaxLegomena",category:"statistical",score:50,weight:0.2,description:"Too few words",descriptionKey:"signal.hapaxLegomena.error",icon:"🆕"};
    const freq=new Map();for(const w of ws)freq.set(w,(freq.get(w)||0)+1);
    let hapax=0,dis=0;for(const c of freq.values()){if(c===1)hapax++;if(c===2)dis++;}
    const hapaxRatio=freq.size>0?hapax/freq.size:0;
    const sichelS=freq.size>0?dis/freq.size:0;
    let score;
    if(hapaxRatio<0.35&&sichelS>0.3)score=70;else if(hapaxRatio<0.45)score=58;else if(hapaxRatio>0.7)score=28;else score=44;
    const details=`Hapax ratio: ${hapaxRatio.toFixed(3)}, Sichel's S: ${sichelS.toFixed(3)}, Unique: ${freq.size}.`;
    return {
        name: "Hapax Legomena", nameKey: "signal.hapaxLegomena", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Hapax Legomena pattern suggests AI generation" : "Natural hapax legomena — consistent with human writing",
        descriptionKey: score > 55 ? "signal.hapaxLegomena.ai" : "signal.hapaxLegomena.real", icon: "🆕",
        details,
    };
}
