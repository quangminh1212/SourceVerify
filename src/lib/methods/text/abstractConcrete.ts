/**
 * Abstract-Concrete Ratio
 * Unique algorithm for abstract-concrete ratio detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAbstractConcrete(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Abstract-Concrete Ratio", nameKey: "signal.abstractConcrete", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.abstractConcrete.error", icon: "🔬" };
    }

    const abstractW=['concept','idea','theory','freedom','justice','beauty','truth','knowledge','wisdom','belief','faith','hope','democracy','philosophy','morality','virtue','dignity','consciousness','reality','existence'];
    const concreteW=['table','chair','dog','car','house','tree','book','phone','water','food','door','window','road','building','hand','face','wall','floor','stone','glass'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>2);
    let abs=0,con=0;for(const w of ws){if(abstractW.includes(w))abs++;if(concreteW.includes(w))con++;}
    const total=abs+con;const ratio=total>0?abs/total:0.5;
    let score;
    if(ratio>0.8)score=68;else if(ratio>0.6)score=56;else if(ratio<0.2)score=32;else score=44;
    const details=`Abstract ratio: ${ratio.toFixed(3)}, Abstract: ${abs}, Concrete: ${con}.`;
    return {
        name: "Abstract-Concrete Ratio", nameKey: "signal.abstractConcrete", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Abstract-Concrete Ratio pattern suggests AI generation" : "Natural abstract-concrete ratio — consistent with human writing",
        descriptionKey: score > 55 ? "signal.abstractConcrete.ai" : "signal.abstractConcrete.real", icon: "🔬",
        details,
    };
}
