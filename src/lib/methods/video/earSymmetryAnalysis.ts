/**
 * Ear Symmetry Analysis
 * Algorithm: symmetry
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEarSymmetryAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Ear Symmetry Analysis", nameKey: "signal.earSymmetryAnalysis", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.earSymmetryAnalysis.error", icon: "👂" };
    }
let leftSum=0,rightSum=0,leftCnt=0,rightCnt=0;
for(let y=0;y<h;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(x<w/2){leftSum+=g;leftCnt++;}else{rightSum+=g;rightCnt++;}}}
const leftMean=leftCnt>0?leftSum/leftCnt:0;const rightMean=rightCnt>0?rightSum/rightCnt:0;
const symScore=Math.abs(leftMean-rightMean);
let lVar=0,rVar=0;
for(let y=0;y<h;y+=4){for(let x=0;x<w;x+=4){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(x<w/2){lVar+=(g-leftMean)**2;}else{rVar+=(g-rightMean)**2;}}}
lVar=Math.sqrt(lVar/(leftCnt/2));rVar=Math.sqrt(rVar/(rightCnt/2));
const varDiff=Math.abs(lVar-rVar);
let score;if(symScore<3&&varDiff<5)score=70;else if(symScore<8)score=58;else if(symScore>25)score=30;else score=44;
const details=`Symmetry diff: ${symScore.toFixed(2)}, Var diff: ${varDiff.toFixed(2)}.`;
    return {
        name: "Ear Symmetry Analysis", nameKey: "signal.earSymmetryAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Ear Symmetry Analysis — potential AI artifact" : "Natural ear symmetry analysis — authentic",
        descriptionKey: score > 55 ? "signal.earSymmetryAnalysis.ai" : "signal.earSymmetryAnalysis.real", icon: "👂",
        details,
    };
}
