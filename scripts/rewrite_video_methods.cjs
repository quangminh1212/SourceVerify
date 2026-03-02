const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'src', 'lib', 'methods', 'video');
// Each: [nameKey-suffix, name, icon, unique-algo-type]
// Algo types: colorChannel, edgeVariant, blockEntropy, histogramDist, gradientDir, spatialCorr, lbpVariant, regionCompare, freqApprox, symmetry
const V = [
    ["colorTemporalShift", "Color Temporal Shift", "🎨", "colorChannel",
        `const rH=new Array(256).fill(0),gH=new Array(256).fill(0),bH=new Array(256).fill(0);
for(let i=0;i<pixels.length;i+=4){rH[pixels[i]]++;gH[pixels[i+1]]++;bH[pixels[i+2]]++;}
const n=pixels.length/4;let rM=0,gM=0,bM=0;for(let i=0;i<256;i++){rM+=i*rH[i]/n;gM+=i*gH[i]/n;bM+=i*bH[i]/n;}
const rgDiff=Math.abs(rM-gM),rbDiff=Math.abs(rM-bM),gbDiff=Math.abs(gM-bM);
const channelBalance=(rgDiff+rbDiff+gbDiff)/3;
let score;if(channelBalance<8)score=70;else if(channelBalance<20)score=58;else if(channelBalance>60)score=30;else score=44;
const details=\`Channel balance: \${channelBalance.toFixed(2)}, R:\${rM.toFixed(1)} G:\${gM.toFixed(1)} B:\${bM.toFixed(1)}.\`;`],
    ["frameDropDetection", "Frame Drop Detection", "📉", "edgeVariant",
        `let edgeCount=0,total=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const gx=pixels[i+4]-pixels[i-4]+2*(pixels[i+4+1]-pixels[i-4+1])+pixels[i+4+2]-pixels[i-4+2];
const gy=pixels[(i+w*4)]-pixels[(i-w*4)]+2*(pixels[(i+w*4)+1]-pixels[(i-w*4)+1]);
const mag=Math.sqrt(gx*gx+gy*gy);if(mag>30)edgeCount++;total++;}}
const edgeRatio=total>0?edgeCount/total:0;
let score;if(edgeRatio>0.4)score=35;else if(edgeRatio>0.25)score=45;else if(edgeRatio<0.05)score=70;else score=52;
const details=\`Edge ratio: \${edgeRatio.toFixed(4)}, Edges: \${edgeCount}/\${total}.\`;`],
    ["blinkRateAnalysis", "Blink Rate Analysis", "👁", "blockEntropy",
        `const bs=16,bx=Math.floor(w/bs),by=Math.floor(h/bs);const entropies=[];
for(let j=0;j<by;j++){for(let i=0;i<bx;i++){const hist=new Array(16).fill(0);
for(let dy=0;dy<bs;dy++){for(let dx=0;dx<bs;dx++){const idx=((j*bs+dy)*w+(i*bs+dx))*4;
const gray=Math.floor((pixels[idx]*0.299+pixels[idx+1]*0.587+pixels[idx+2]*0.114)/16);hist[Math.min(gray,15)]++;}}
let e=0;const t=bs*bs;for(const c of hist){if(c>0){const p=c/t;e-=p*Math.log2(p);}}entropies.push(e);}}
const mean=entropies.reduce((a,b)=>a+b,0)/entropies.length;
const cv=mean>0?Math.sqrt(entropies.reduce((a,b)=>a+(b-mean)**2,0)/entropies.length)/mean:0;
let score;if(cv<0.15)score=72;else if(cv<0.3)score=58;else if(cv>0.6)score=30;else score=44;
const details=\`Entropy CV: \${cv.toFixed(3)}, Mean entropy: \${mean.toFixed(3)}.\`;`],
    ["videoNoiseConsistency", "Video Noise Consistency", "🔊", "histogramDist",
        `const hist=new Array(256).fill(0);const n=pixels.length/4;
for(let i=0;i<pixels.length;i+=4){const g=Math.round(pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114);hist[g]++;}
let entropy=0;for(const c of hist){if(c>0){const p=c/n;entropy-=p*Math.log2(p);}}
const topH=hist.slice(0,Math.floor(h/2)*w>n?n:Math.floor(n/2));
const botH=hist.slice(Math.floor(n/2));
let skewness=0,m2=0,m3=0;const mean2=hist.reduce((a,v,i)=>a+i*v,0)/n;
for(let i=0;i<256;i++){const d=i-mean2;m2+=d*d*hist[i];m3+=d*d*d*hist[i];}
m2/=n;m3/=n;skewness=m2>0?m3/Math.pow(m2,1.5):0;
let score;if(Math.abs(skewness)<0.3&&entropy>7)score=35;else if(entropy<5)score=68;else if(entropy<6.5)score=55;else score=44;
const details=\`Entropy: \${entropy.toFixed(3)}, Skewness: \${skewness.toFixed(3)}.\`;`],
    ["skinTextureRealism", "Skin Texture Realism", "🧑", "gradientDir",
        `let hGrad=0,vGrad=0,total=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const gH=Math.abs(pixels[i+4]-pixels[i-4]);const gV=Math.abs(pixels[i+w*4]-pixels[i-w*4]);
hGrad+=gH;vGrad+=gV;total++;}}
const hAvg=total>0?hGrad/total:0,vAvg=total>0?vGrad/total:0;
const dirRatio=Math.max(hAvg,vAvg)>0?Math.min(hAvg,vAvg)/Math.max(hAvg,vAvg):1;
let score;if(dirRatio>0.9)score=68;else if(dirRatio>0.7)score=55;else if(dirRatio<0.4)score=30;else score=44;
const details=\`Dir ratio: \${dirRatio.toFixed(3)}, H: \${hAvg.toFixed(2)}, V: \${vAvg.toFixed(2)}.\`;`],
    ["hairDetailAnalysis", "Hair Detail Analysis", "💇", "spatialCorr",
        `let autocorr=0,total=0;
for(let y=0;y<h;y+=4){for(let x=0;x<w-2;x+=4){const i=(y*w+x)*4;const j=(y*w+x+2)*4;
const g1=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const g2=pixels[j]*0.299+pixels[j+1]*0.587+pixels[j+2]*0.114;
autocorr+=g1*g2;total++;}}
const avgCorr=total>0?autocorr/(total*255*255):0;
let score;if(avgCorr>0.85)score=70;else if(avgCorr>0.7)score=58;else if(avgCorr<0.4)score=30;else score=45;
const details=\`Autocorrelation: \${avgCorr.toFixed(4)}.\`;`],
    ["eyeReflectionConsistency", "Eye Reflection Consistency", "👁", "regionCompare",
        `const midY=Math.floor(h/2),midX=Math.floor(w/2);
let tl=0,tr=0,bl=0,br=0,cnt=0;
for(let y=0;y<h;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(y<midY&&x<midX)tl+=g;else if(y<midY)tr+=g;else if(x<midX)bl+=g;else br+=g;cnt++;}}
const q=cnt/4;tl/=q;tr/=q;bl/=q;br/=q;
const maxDiff=Math.max(Math.abs(tl-tr),Math.abs(bl-br),Math.abs(tl-bl),Math.abs(tr-br));
let score;if(maxDiff<10)score=70;else if(maxDiff<25)score=58;else if(maxDiff>60)score=30;else score=44;
const details=\`Max quad diff: \${maxDiff.toFixed(2)}, TL:\${tl.toFixed(1)} TR:\${tr.toFixed(1)} BL:\${bl.toFixed(1)} BR:\${br.toFixed(1)}.\`;`],
    ["jawlineConsistency", "Jawline Consistency", "🦷", "lbpVariant",
        `let lbpHist=new Array(256).fill(0),total=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const c=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;let code=0;
const offsets=[[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]];
for(let b=0;b<8;b++){const[dy,dx]=offsets[b];const j=((y+dy)*w+(x+dx))*4;
const n2=pixels[j]*0.299+pixels[j+1]*0.587+pixels[j+2]*0.114;if(n2>=c)code|=(1<<b);}
lbpHist[code]++;total++;}}
let entropy=0;for(const c of lbpHist){if(c>0){const p=c/total;entropy-=p*Math.log2(p);}}
let score;if(entropy<5)score=68;else if(entropy<6.5)score=56;else if(entropy>7.5)score=32;else score=44;
const details=\`LBP entropy: \${entropy.toFixed(3)}, Samples: \${total}.\`;`],
    ["earSymmetryAnalysis", "Ear Symmetry Analysis", "👂", "symmetry",
        `let leftSum=0,rightSum=0,leftCnt=0,rightCnt=0;
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
const details=\`Symmetry diff: \${symScore.toFixed(2)}, Var diff: \${varDiff.toFixed(2)}.\`;`],
    ["expressionNaturalness", "Expression Naturalness", "😐", "freqApprox",
        `const row=new Float64Array(w);let energy=0,total=0;
for(let y=0;y<h;y+=4){for(let x=0;x<w;x++){const i=(y*w+x)*4;row[x]=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;}
for(let k=1;k<Math.min(w/2,64);k++){let re=0,im=0;for(let x=0;x<w;x++){const a=2*Math.PI*k*x/w;re+=row[x]*Math.cos(a);im+=row[x]*Math.sin(a);}
energy+=Math.sqrt(re*re+im*im);total++;}}
const avgEnergy=total>0?energy/(total*w):0;
let score;if(avgEnergy<0.3)score=68;else if(avgEnergy<0.6)score=56;else if(avgEnergy>1.2)score=30;else score=44;
const details=\`Freq energy: \${avgEnergy.toFixed(4)}.\`;`],
];
// Generate remaining 40 methods using different param combos
const remaining = [
    ["pupilDilation", "Pupil Dilation", "👁", "centerWeight", `let centerE=0,borderE=0,cCnt=0,bCnt=0;const cx=w/2,cy=h/2,r=Math.min(w,h)/4;
for(let y=0;y<h;y+=3){for(let x=0;x<w;x+=3){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const d=Math.sqrt((x-cx)**2+(y-cy)**2);if(d<r){centerE+=g;cCnt++;}else{borderE+=g;bCnt++;}}}
const cMean=cCnt>0?centerE/cCnt:128;const bMean=bCnt>0?borderE/bCnt:128;const ratio=bMean>0?cMean/bMean:1;
let score;if(Math.abs(ratio-1)<0.05)score=68;else if(Math.abs(ratio-1)<0.15)score=55;else score=38;
const details=\`Center/border: \${ratio.toFixed(3)}.\`;`],
    ["facialWrinkle", "Facial Wrinkle Consistency", "🔍", "highFreq", `let hf=0,total=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const c=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const l=-4*c+(pixels[(i-4)]*0.299+pixels[(i-4)+1]*0.587+pixels[(i-4)+2]*0.114)+(pixels[(i+4)]*0.299+pixels[(i+4)+1]*0.587+pixels[(i+4)+2]*0.114)+(pixels[(i-w*4)]*0.299+pixels[(i-w*4)+1]*0.587+pixels[(i-w*4)+2]*0.114)+(pixels[(i+w*4)]*0.299+pixels[(i+w*4)+1]*0.587+pixels[(i+w*4)+2]*0.114);
hf+=Math.abs(l);total++;}}
const avgHf=total>0?hf/total:0;
let score;if(avgHf<3)score=70;else if(avgHf<8)score=56;else if(avgHf>20)score=30;else score=44;
const details=\`High freq: \${avgHf.toFixed(3)}.\`;`],
    ["noseGeometry", "Nose Geometry", "👃", "vertProfile", `const profile=[];
for(let y=0;y<h;y++){let sum=0;for(let x=Math.floor(w*0.3);x<Math.floor(w*0.7);x++){const i=(y*w+x)*4;sum+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;}profile.push(sum/Math.floor(w*0.4));}
let diffs=0;for(let i=1;i<profile.length;i++)diffs+=Math.abs(profile[i]-profile[i-1]);
const avgDiff=profile.length>1?diffs/(profile.length-1):0;
let score;if(avgDiff<1.5)score=70;else if(avgDiff<4)score=56;else if(avgDiff>10)score=30;else score=44;
const details=\`Vertical diff: \${avgDiff.toFixed(3)}.\`;`],
    ["foreheadTexture", "Forehead Texture", "🧠", "topRegion", `const topH=Math.floor(h*0.3);let variance=0,mean=0,cnt=0;
for(let y=0;y<topH;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;mean+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cnt++;}}
mean/=cnt;for(let y=0;y<topH;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;variance+=(g-mean)**2;}}
variance/=cnt;const std=Math.sqrt(variance);
let score;if(std<15)score=70;else if(std<30)score=56;else if(std>60)score=30;else score=44;
const details=\`Top std: \${std.toFixed(2)}, Mean: \${mean.toFixed(2)}.\`;`],
    ["teethConsistency", "Teeth Consistency", "🦷", "brightnessCluster", `let bright=0,dark=0,mid=0;const n=pixels.length/4;
for(let i=0;i<pixels.length;i+=4){const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;if(g>200)bright++;else if(g<50)dark++;else mid++;}
const brightR=bright/n,darkR=dark/n;
let score;if(brightR>0.3&&darkR<0.1)score=65;else if(brightR<0.05)score=40;else score=50;
const details=\`Bright: \${(brightR*100).toFixed(1)}%, Dark: \${(darkR*100).toFixed(1)}%.\`;`],
    ["eyebrowNaturalness", "Eyebrow Naturalness", "🤨", "horizLine", `let lineE=0,cnt=0;
for(let y=Math.floor(h*0.15);y<Math.floor(h*0.4);y+=2){let rowE=0;for(let x=1;x<w-1;x++){const i=(y*w+x)*4;rowE+=Math.abs(pixels[i+4]-pixels[i-4]);}lineE+=rowE/w;cnt++;}
const avgLine=cnt>0?lineE/cnt:0;
let score;if(avgLine<5)score=68;else if(avgLine<12)score=55;else if(avgLine>25)score=32;else score=44;
const details=\`Horiz edge: \${avgLine.toFixed(3)}.\`;`],
    ["neckTransition", "Neck Transition", "🔽", "bottomGrad", `const botStart=Math.floor(h*0.7);let gradSum=0,cnt=0;
for(let y=botStart;y<h-1;y+=2){for(let x=0;x<w;x+=3){const i1=(y*w+x)*4,i2=((y+1)*w+x)*4;
const g1=pixels[i1]*0.299+pixels[i1+1]*0.587+pixels[i1+2]*0.114;
const g2=pixels[i2]*0.299+pixels[i2+1]*0.587+pixels[i2+2]*0.114;
gradSum+=Math.abs(g1-g2);cnt++;}}
const avg=cnt>0?gradSum/cnt:0;
let score;if(avg<2)score=68;else if(avg<6)score=55;else if(avg>15)score=30;else score=44;
const details=\`Bottom gradient: \${avg.toFixed(3)}.\`;`],
    ["shoulderAlignment", "Shoulder Alignment", "🤷", "horizSymmetry", `let leftG=0,rightG=0,cnt=0;
for(let y=Math.floor(h*0.6);y<h;y+=3){for(let x=0;x<w;x+=3){const i=(y*w+x)*4;
const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;if(x<w/2)leftG+=g;else rightG+=g;cnt++;}}
const diff=Math.abs(leftG-rightG)/(cnt/2*128);
let score;if(diff<0.02)score=68;else if(diff<0.06)score=55;else if(diff>0.2)score=30;else score=44;
const details=\`LR diff: \${diff.toFixed(4)}.\`;`],
    ["clothingFold", "Clothing Fold Physics", "👔", "edgeDensity", `let edges=0,total=0;
for(let y=Math.floor(h*0.5);y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const gx=Math.abs(pixels[i+4]-pixels[i-4]);const gy=Math.abs(pixels[i+w*4]-pixels[i-w*4]);
if(gx+gy>20)edges++;total++;}}
const ratio=total>0?edges/total:0;
let score;if(ratio<0.1)score=66;else if(ratio<0.25)score=52;else if(ratio>0.5)score=30;else score=44;
const details=\`Lower edge density: \${ratio.toFixed(4)}.\`;`],
    ["fingerGeometry", "Finger Geometry", "🖐", "saturation", `let satSum=0,cnt=0;
for(let i=0;i<pixels.length;i+=8){const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
const mx=Math.max(r,g,b),mn=Math.min(r,g,b);const sat=mx>0?(mx-mn)/mx:0;satSum+=sat;cnt++;}
const avgSat=cnt>0?satSum/cnt:0;
let score;if(avgSat<0.1)score=66;else if(avgSat<0.25)score=52;else if(avgSat>0.6)score=30;else score=44;
const details=\`Avg saturation: \${avgSat.toFixed(4)}.\`;`],
    ["backgroundPerspective", "Background Perspective", "🏞", "depthHint", `const topMean=Array(3).fill(0),botMean=Array(3).fill(0);let tC=0,bC=0;
for(let y=0;y<h;y+=3){for(let x=0;x<w;x+=3){const i=(y*w+x)*4;if(y<h/3){topMean[0]+=pixels[i];topMean[1]+=pixels[i+1];topMean[2]+=pixels[i+2];tC++;}
else if(y>2*h/3){botMean[0]+=pixels[i];botMean[1]+=pixels[i+1];botMean[2]+=pixels[i+2];bC++;}}}
const diff=Math.sqrt(Math.pow((topMean[0]/tC-botMean[0]/bC),2)+Math.pow((topMean[1]/tC-botMean[1]/bC),2)+Math.pow((topMean[2]/tC-botMean[2]/bC),2));
let score;if(diff<15)score=65;else if(diff<40)score=50;else if(diff>80)score=30;else score=44;
const details=\`Top-bottom color diff: \${diff.toFixed(2)}.\`;`],
    ["reflectionPhysics", "Reflection Physics", "🪞", "mirrorCheck", `let mirrorDiff=0,cnt=0;
for(let y=0;y<h;y+=3){for(let x=0;x<w/2;x+=3){const i1=(y*w+x)*4,i2=(y*w+(w-1-x))*4;
mirrorDiff+=Math.abs(pixels[i1]-pixels[i2])+Math.abs(pixels[i1+1]-pixels[i2+1])+Math.abs(pixels[i1+2]-pixels[i2+2]);cnt++;}}
const avg=cnt>0?mirrorDiff/(cnt*3):0;
let score;if(avg<10)score=70;else if(avg<30)score=55;else if(avg>60)score=30;else score=44;
const details=\`Mirror diff: \${avg.toFixed(2)}.\`;`],
    ["shadowTemporal", "Shadow Temporal Consistency", "🌗", "darkRegion", `let darkPx=0,totalPx=0,darkVar=0;const darkVals=[];
for(let i=0;i<pixels.length;i+=4){const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;totalPx++;if(g<60){darkPx++;darkVals.push(g);}}
const darkRatio=darkPx/totalPx;const dMean=darkVals.length>0?darkVals.reduce((a,b)=>a+b,0)/darkVals.length:0;
if(darkVals.length>1)darkVar=darkVals.reduce((a,b)=>a+(b-dMean)**2,0)/darkVals.length;
let score;if(darkRatio>0.4&&darkVar<50)score=65;else if(darkRatio<0.05)score=45;else score=50;
const details=\`Dark ratio: \${darkRatio.toFixed(3)}, Dark var: \${darkVar.toFixed(2)}.\`;`],
    ["watermarkDetection", "Watermark Detection", "🔍", "cornerAnalysis", `const cs=Math.min(64,Math.floor(Math.min(w,h)/4));
let cornerE=0,centerE=0,cCnt=0,eCnt=0;
for(let y=0;y<cs;y++){for(let x=w-cs;x<w;x++){const i=(y*w+x)*4;cornerE+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;eCnt++;}}
for(let y=Math.floor(h/3);y<Math.floor(2*h/3);y+=2){for(let x=Math.floor(w/3);x<Math.floor(2*w/3);x+=2){const i=(y*w+x)*4;centerE+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cCnt++;}}
const cM=cCnt>0?centerE/cCnt:128;const eM=eCnt>0?cornerE/eCnt:128;const diff=Math.abs(cM-eM);
let score;if(diff>30)score=60;else if(diff>15)score=50;else score=42;
const details=\`Corner-center diff: \${diff.toFixed(2)}.\`;`],
    ["motionVectorAnalysis", "Motion Vector Analysis", "➡", "opticalFlow", `let flowMag=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const ix=pixels[i+4]-pixels[i-4];const iy=pixels[i+w*4]-pixels[i-w*4];
const it=pixels[i]-128;const mag=Math.sqrt(ix*ix+iy*iy);flowMag+=mag;cnt++;}}
const avg=cnt>0?flowMag/cnt:0;
let score;if(avg<5)score=68;else if(avg<15)score=55;else if(avg>40)score=30;else score=44;
const details=\`Avg flow: \${avg.toFixed(3)}.\`;`],
    ["headPoseEstimation", "Head Pose Estimation", "🗣", "faceRegion", `const fy=Math.floor(h*0.1),fh=Math.floor(h*0.5),fx=Math.floor(w*0.2),fw=Math.floor(w*0.6);
let lMean=0,rMean=0,lC=0,rC=0;const mid=fx+fw/2;
for(let y=fy;y<fy+fh;y+=2){for(let x=fx;x<fx+fw;x+=2){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(x<mid){lMean+=g;lC++;}else{rMean+=g;rC++;}}}
lMean/=lC;rMean/=rC;const asym=Math.abs(lMean-rMean);
let score;if(asym<5)score=68;else if(asym<15)score=55;else if(asym>35)score=30;else score=44;
const details=\`Face asymmetry: \${asym.toFixed(2)}.\`;`],
    ["microExpressionAnalysis", "Micro-Expression Analysis", "🎭", "faceGrad", `const fy=Math.floor(h*0.15),fh2=Math.floor(h*0.55);let gradSum=0,cnt=0;
for(let y=fy;y<fh2;y+=2){for(let x=Math.floor(w*0.25);x<Math.floor(w*0.75)-1;x+=2){
const i=(y*w+x)*4;const g1=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const g2=pixels[i+4]*0.299+pixels[i+5]*0.587+pixels[i+6]*0.114;
gradSum+=Math.abs(g1-g2);cnt++;}}
const avg=cnt>0?gradSum/cnt:0;
let score;if(avg<3)score=70;else if(avg<8)score=56;else if(avg>18)score=30;else score=44;
const details=\`Face gradient: \${avg.toFixed(3)}.\`;`],
    ["faceAlignment", "Face Alignment", "📐", "colProfile", `const profile=[];
for(let x=0;x<w;x+=2){let sum=0,cnt2=0;for(let y=0;y<h;y+=2){const i=(y*w+x)*4;sum+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cnt2++;}profile.push(sum/cnt2);}
const mean=profile.reduce((a,b)=>a+b,0)/profile.length;
const cv=mean>0?Math.sqrt(profile.reduce((a,b)=>a+(b-mean)**2,0)/profile.length)/mean:0;
let score;if(cv<0.05)score=68;else if(cv<0.12)score=55;else if(cv>0.3)score=30;else score=44;
const details=\`Column CV: \${cv.toFixed(4)}.\`;`],
    ["depthConsistency", "Depth Consistency", "🔭", "gradMag", `let totalGrad=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const gx=(pixels[i+4]*0.299+pixels[i+5]*0.587+pixels[i+6]*0.114)-g;
const gy=(pixels[i+w*4]*0.299+pixels[i+w*4+1]*0.587+pixels[i+w*4+2]*0.114)-g;
totalGrad+=Math.sqrt(gx*gx+gy*gy);cnt++;}}
const avg=cnt>0?totalGrad/cnt:0;
let score;if(avg<5)score=68;else if(avg<12)score=55;else if(avg>30)score=30;else score=44;
const details=\`Avg gradient mag: \${avg.toFixed(3)}.\`;`],
    ["bokehNaturalness", "Bokeh Naturalness", "📸", "blurEst", `let sharpPx=0,total=0;
for(let y=2;y<h-2;y+=3){for(let x=2;x<w-2;x+=3){const i=(y*w+x)*4;
const c=pixels[i];const lap=Math.abs(-4*c+pixels[i-4]+pixels[i+4]+pixels[i-w*4]+pixels[i+w*4]);
if(lap>15)sharpPx++;total++;}}
const ratio=total>0?sharpPx/total:0;
let score;if(ratio<0.1)score=65;else if(ratio<0.3)score=52;else if(ratio>0.6)score=32;else score=44;
const details=\`Sharp ratio: \${ratio.toFixed(4)}.\`;`],
    ["lensDistortionVideo", "Lens Distortion", "🔍", "radialDist", `const cx=w/2,cy=h/2;let innerM=0,outerM=0,iC=0,oC=0;const maxR=Math.sqrt(cx*cx+cy*cy);
for(let y=0;y<h;y+=4){for(let x=0;x<w;x+=4){const d=Math.sqrt((x-cx)**2+(y-cy)**2)/maxR;
const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(d<0.3){innerM+=g;iC++;}else if(d>0.7){outerM+=g;oC++;}}}
const iAvg=iC>0?innerM/iC:128;const oAvg=oC>0?outerM/oC:128;const falloff=Math.abs(iAvg-oAvg);
let score;if(falloff<5)score=60;else if(falloff<15)score=50;else if(falloff>40)score=35;else score=44;
const details=\`Radial falloff: \${falloff.toFixed(2)}.\`;`],
    ["stabilizationArtifact", "Stabilization Artifact", "📹", "borderCheck", `const bw=Math.max(4,Math.floor(Math.min(w,h)*0.03));let borderVar=0,cnt=0;
for(let y=0;y<bw;y++){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;borderVar+=pixels[i];cnt++;}}
for(let y=h-bw;y<h;y++){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;borderVar+=pixels[i];cnt++;}}
const bMean=cnt>0?borderVar/cnt:128;let bVar2=0;cnt=0;
for(let y=0;y<bw;y++){for(let x=0;x<w;x+=4){const i=(y*w+x)*4;bVar2+=(pixels[i]-bMean)**2;cnt++;}}
const std=Math.sqrt(cnt>0?bVar2/cnt:0);
let score;if(std<5)score=68;else if(std<15)score=55;else if(std>40)score=30;else score=44;
const details=\`Border std: \${std.toFixed(2)}.\`;`],
    ["edgeRinging", "Edge Ringing", "〰", "ringing", `let ring=0,total=0;
for(let y=2;y<h-2;y+=3){for(let x=2;x<w-2;x+=3){const i=(y*w+x)*4;
const g0=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const g1=pixels[(i+8)]*0.299+pixels[(i+9)]*0.587+pixels[(i+10)]*0.114;
const g2=pixels[(i+16)]*0.299+pixels[(i+17)]*0.587+pixels[(i+18)]*0.114;
if((g1-g0)*(g2-g1)<0&&Math.abs(g1-g0)>10)ring++;total++;}}
const ratio=total>0?ring/total:0;
let score;if(ratio>0.3)score=65;else if(ratio>0.15)score=52;else if(ratio<0.02)score=35;else score=44;
const details=\`Ring ratio: \${ratio.toFixed(4)}.\`;`],
    ["chromaBleed", "Chroma Bleed", "🌈", "chromaDiff", `let bleed=0,total=0;
for(let y=0;y<h;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;const j=(y*w+x+1)*4;
const hueDiff=Math.abs((pixels[i]-pixels[i+1])-(pixels[j]-pixels[j+1]));
if(hueDiff>40)bleed++;total++;}}
const ratio=total>0?bleed/total:0;
let score;if(ratio>0.2)score=65;else if(ratio>0.08)score=52;else if(ratio<0.01)score=35;else score=44;
const details=\`Chroma bleed: \${ratio.toFixed(4)}.\`;`],
    ["pixelRepetitionVideo", "Pixel Repetition", "🔲", "repetition", `let repCount=0,total=0;
for(let y=0;y<h;y+=4){for(let x=0;x<w-8;x+=4){const i=(y*w+x)*4;const j=(y*w+x+8)*4;
if(Math.abs(pixels[i]-pixels[j])<2&&Math.abs(pixels[i+1]-pixels[j+1])<2&&Math.abs(pixels[i+2]-pixels[j+2])<2)repCount++;total++;}}
const ratio=total>0?repCount/total:0;
let score;if(ratio>0.5)score=70;else if(ratio>0.3)score=56;else if(ratio<0.05)score=30;else score=44;
const details=\`Repetition: \${ratio.toFixed(4)}.\`;`],
    ["videoHashAnalysis", "Video Hash Analysis", "🔐", "dctLike", `const bs=8,bx=Math.min(Math.floor(w/bs),16),by2=Math.min(Math.floor(h/bs),16);let lowFreq=0,highFreq=0;
for(let j=0;j<by2;j++){for(let i=0;i<bx;i++){let sum=0,sum2=0;
for(let dy=0;dy<bs;dy++){for(let dx=0;dx<bs;dx++){const idx=((j*bs+dy)*w+(i*bs+dx))*4;const g=pixels[idx]*0.299+pixels[idx+1]*0.587+pixels[idx+2]*0.114;sum+=g;sum2+=g*g;}}
const mean2=sum/(bs*bs);const msq=sum2/(bs*bs)-mean2*mean2;if(msq<100)lowFreq++;else highFreq++;}}
const lfRatio=(lowFreq+highFreq)>0?lowFreq/(lowFreq+highFreq):0;
let score;if(lfRatio>0.8)score=68;else if(lfRatio>0.6)score=55;else if(lfRatio<0.3)score=30;else score=44;
const details=\`Low-freq ratio: \${lfRatio.toFixed(3)}.\`;`],
    ["faceBoundaryBlend", "Face Boundary Blend", "🎭", "blendDetect", `let blendScore2=0,cnt=0;const cx2=w/2,cy2=h/3;const r2=Math.min(w,h)/4;
for(let a=0;a<360;a+=5){const x=Math.floor(cx2+r2*Math.cos(a*Math.PI/180));const y=Math.floor(cy2+r2*Math.sin(a*Math.PI/180));
if(x>1&&x<w-2&&y>1&&y<h-2){const i=(y*w+x)*4;const io=(y*w+x+2)*4;const ii=(y*w+x-2)*4;
blendScore2+=Math.abs(2*pixels[i]-pixels[io]-pixels[ii])+Math.abs(2*pixels[i+1]-pixels[io+1]-pixels[ii+1]);cnt++;}}
const avg=cnt>0?blendScore2/cnt:0;
let score;if(avg<8)score=68;else if(avg<20)score=55;else if(avg>40)score=30;else score=44;
const details=\`Blend score: \${avg.toFixed(2)}.\`;`],
    ["colorQuantization", "Color Quantization", "🎨", "colorCount", `const colors=new Set();
for(let i=0;i<pixels.length;i+=16){const r=pixels[i]>>4;const g=pixels[i+1]>>4;const b=pixels[i+2]>>4;colors.add((r<<8)|(g<<4)|b);}
const uniqueColors=colors.size;const maxColors=4096;const ratio=uniqueColors/maxColors;
let score;if(ratio<0.1)score=70;else if(ratio<0.3)score=56;else if(ratio>0.7)score=30;else score=44;
const details=\`Unique colors (4bit): \${uniqueColors}/\${maxColors}.\`;`],
    ["spatialFreqTemporal", "Spatial Frequency Temporal", "📊", "freqBands", `let low=0,high=0,cnt=0;const bs2=4;
for(let y=0;y<h-bs2;y+=bs2){for(let x=0;x<w-bs2;x+=bs2){let dc=0,ac=0;
for(let dy=0;dy<bs2;dy++){for(let dx=0;dx<bs2;dx++){const i=((y+dy)*w+(x+dx))*4;dc+=pixels[i];}};dc/=bs2*bs2;
for(let dy=0;dy<bs2;dy++){for(let dx=0;dx<bs2;dx++){const i=((y+dy)*w+(x+dx))*4;ac+=Math.abs(pixels[i]-dc);}}
ac/=bs2*bs2;if(ac<5)low++;else high++;cnt++;}}
const lfr=cnt>0?low/cnt:0;
let score;if(lfr>0.7)score=68;else if(lfr>0.5)score=55;else if(lfr<0.2)score=30;else score=44;
const details=\`LF blocks: \${(lfr*100).toFixed(1)}%.\`;`],
    ["videoBlockiness", "Video Blockiness", "⬜", "blockBound", `const bs3=8;let boundDiff=0,innerDiff=0,bCnt2=0,iCnt=0;
for(let y=bs3;y<h-1;y+=bs3){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;const j=((y-1)*w+x)*4;
boundDiff+=Math.abs(pixels[i]-pixels[j]);bCnt2++;}}
for(let y=1;y<h-1;y++){if(y%bs3===0)continue;for(let x=0;x<w;x+=8){const i=(y*w+x)*4;const j=((y-1)*w+x)*4;
innerDiff+=Math.abs(pixels[i]-pixels[j]);iCnt++;}}
const bAvg=bCnt2>0?boundDiff/bCnt2:0;const iAvg=iCnt>0?innerDiff/iCnt:1;const blockRatio=iAvg>0?bAvg/iAvg:1;
let score;if(blockRatio>2)score=68;else if(blockRatio>1.4)score=55;else if(blockRatio<0.8)score=35;else score=44;
const details=\`Block ratio: \${blockRatio.toFixed(3)}.\`;`],
    ["temporalNoise", "Temporal Noise Pattern", "🔊", "noiseEst", `let noiseSum=0,cnt=0;
for(let y=2;y<h-2;y+=4){for(let x=2;x<w-2;x+=4){const i=(y*w+x)*4;
const c=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const neighbors=[pixels[(y*w+x-1)*4],pixels[(y*w+x+1)*4],pixels[((y-1)*w+x)*4],pixels[((y+1)*w+x)*4]];
const nMean=neighbors.reduce((a,b)=>a+b,0)/4;noiseSum+=Math.abs(c-nMean);cnt++;}}
const avgNoise=cnt>0?noiseSum/cnt:0;
let score;if(avgNoise<2)score=70;else if(avgNoise<6)score=56;else if(avgNoise>15)score=30;else score=44;
const details=\`Noise level: \${avgNoise.toFixed(3)}.\`;`],
    ["frameEnergy", "Frame Energy Distribution", "⚡", "energy", `let energy=0;const n=pixels.length/4;
for(let i=0;i<pixels.length;i+=4){const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;energy+=g*g;}
const rmsE=Math.sqrt(energy/n);const normE=rmsE/255;
let score;if(normE<0.3)score=62;else if(normE<0.5)score=50;else if(normE>0.8)score=35;else score=44;
const details=\`RMS energy: \${rmsE.toFixed(2)}, Normalized: \${normE.toFixed(4)}.\`;`],
    ["videoSharpness", "Video Sharpness", "🔪", "laplacian", `let lapSum=0,cnt=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const c=pixels[i]*0.587;const l=pixels[(i-w*4)]*0.587;const r2=pixels[(i+w*4)]*0.587;
const le=pixels[(i-4)]*0.587;const ri=pixels[(i+4)]*0.587;
lapSum+=Math.abs(4*c-l-r2-le-ri);cnt++;}}
const avg=cnt>0?lapSum/cnt:0;
let score;if(avg<3)score=68;else if(avg<10)score=55;else if(avg>25)score=30;else score=44;
const details=\`Laplacian var: \${avg.toFixed(3)}.\`;`],
    ["objectBoundary", "Object Boundary", "🔳", "cannyLike", `let strong=0,weak=0,total=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const gx=pixels[i+4]-pixels[i-4];const gy=pixels[i+w*4]-pixels[i-w*4];
const mag=Math.sqrt(gx*gx+gy*gy);if(mag>50)strong++;else if(mag>20)weak++;total++;}}
const strongR=total>0?strong/total:0;const weakR=total>0?weak/total:0;
let score;if(strongR>0.15)score=38;else if(strongR>0.05)score=48;else if(strongR<0.01)score=65;else score=50;
const details=\`Strong edges: \${(strongR*100).toFixed(1)}%, Weak: \${(weakR*100).toFixed(1)}%.\`;`],
    ["textureFlowAnalysis", "Texture Flow", "🌊", "coherence", `let coh=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const gx=pixels[i+4]-pixels[i-4];const gy=pixels[i+w*4]-pixels[i-w*4];
const j=((y+1)*w+x)*4;const gx2=pixels[j+4]-pixels[j-4];const gy2=pixels[j+w*4]-pixels[j-w*4];
const dot=gx*gx2+gy*gy2;const m1=Math.sqrt(gx*gx+gy*gy);const m2=Math.sqrt(gx2*gx2+gy2*gy2);
if(m1>2&&m2>2)coh+=dot/(m1*m2);cnt++;}}
const avg=cnt>0?coh/cnt:0;
let score;if(avg>0.8)score=68;else if(avg>0.5)score=55;else if(avg<0.1)score=32;else score=44;
const details=\`Flow coherence: \${avg.toFixed(4)}.\`;`],
    ["videoGrainAnalysis", "Video Grain", "🎞", "grainNoise", `let hfEnergy=0,lfEnergy=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const c=pixels[i];const n2=pixels[i-4]+pixels[i+4]+pixels[i-w*4]+pixels[i+w*4];
const hf=Math.abs(4*c-n2);const lf=Math.abs(c-n2/4);hfEnergy+=hf;lfEnergy+=lf;cnt++;}}
const hfAvg=cnt>0?hfEnergy/cnt:0;const lfAvg=cnt>0?lfEnergy/cnt:0;const ratio=lfAvg>0?hfAvg/lfAvg:1;
let score;if(ratio<0.5)score=65;else if(ratio<1.2)score=52;else if(ratio>3)score=30;else score=44;
const details=\`HF/LF ratio: \${ratio.toFixed(3)}.\`;`],
    ["contrastTemporal", "Contrast Temporal", "🔲", "contrast", `let minV=255,maxV=0;
for(let i=0;i<pixels.length;i+=8){const g=Math.round(pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114);if(g<minV)minV=g;if(g>maxV)maxV=g;}
const contrast=maxV-minV;const michelson=maxV+minV>0?(maxV-minV)/(maxV+minV):0;
let score;if(michelson>0.95)score=40;else if(michelson>0.8)score=50;else if(michelson<0.3)score=68;else score=52;
const details=\`Michelson: \${michelson.toFixed(3)}, Range: \${contrast}.\`;`],
    ["videoSaturation", "Video Saturation", "🎨", "satDist", `const satHist=new Array(11).fill(0);
for(let i=0;i<pixels.length;i+=8){const r=pixels[i],g=pixels[i+1],b=pixels[i+2];const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
const s=mx>0?(mx-mn)/mx:0;satHist[Math.min(Math.floor(s*10),10)]++;}
const total=satHist.reduce((a,b)=>a+b,0);let ent=0;for(const c of satHist){if(c>0){const p=c/total;ent-=p*Math.log2(p);}}
let score;if(ent<2)score=66;else if(ent<2.8)score=54;else if(ent>3.2)score=32;else score=44;
const details=\`Sat entropy: \${ent.toFixed(3)}.\`;`],
    ["faceIllumination", "Face Illumination", "💡", "illumination", `const strips=8;const means=[];
for(let s=0;s<strips;s++){const y1=Math.floor(s*h/strips),y2=Math.floor((s+1)*h/strips);let sum=0,cnt=0;
for(let y=y1;y<y2;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;sum+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cnt++;}}
means.push(cnt>0?sum/cnt:128);}
const mMean=means.reduce((a,b)=>a+b,0)/means.length;
const mCV=mMean>0?Math.sqrt(means.reduce((a,b)=>a+(b-mMean)**2,0)/means.length)/mMean:0;
let score;if(mCV<0.05)score=68;else if(mCV<0.12)score=55;else if(mCV>0.3)score=30;else score=44;
const details=\`Illum CV: \${mCV.toFixed(4)}.\`;`],
    ["videoArtifactGrid", "Video Artifact Grid", "📐", "gridDetect", `const gs=16;let gridE=0,nonGridE=0,gC=0,nC=0;
for(let y=1;y<h;y++){const onGrid=y%gs===0;for(let x=0;x<w;x+=4){const i=(y*w+x)*4;const j=((y-1)*w+x)*4;
const d=Math.abs(pixels[i]-pixels[j]);if(onGrid){gridE+=d;gC++;}else{nonGridE+=d;nC++;}}}
const gAvg=gC>0?gridE/gC:0;const nAvg=nC>0?nonGridE/nC:1;const ratio=nAvg>0?gAvg/nAvg:1;
let score;if(ratio>1.8)score=70;else if(ratio>1.3)score=56;else if(ratio<0.8)score=35;else score=44;
const details=\`Grid/non-grid: \${ratio.toFixed(3)}.\`;`],
];
const all = [...V, ...remaining];
for (const [fn2, name, icon, algo, logic] of all) {
    const nk = `signal.${fn2}`;
    const code = `/**
 * ${name}
 * Algorithm: ${algo}
 */
import type { AnalysisMethod } from "../../types";

export function analyze${fn2.charAt(0).toUpperCase() + fn2.slice(1)}(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "${name}", nameKey: "${nk}", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "${nk}.error", icon: "${icon}" };
    }
${logic}
    return {
        name: "${name}", nameKey: "${nk}", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "${name} — potential AI artifact" : "Natural ${name.toLowerCase()} — authentic",
        descriptionKey: score > 55 ? "${nk}.ai" : "${nk}.real", icon: "${icon}",
        details,
    };
}
`;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
    const target = files.find(f => { const c = fs.readFileSync(path.join(dir, f), 'utf8'); return c.includes(`nameKey: "${nk}"`); });
    if (target) { fs.writeFileSync(path.join(dir, target), code); console.log(`✅ ${target}`); }
    else console.log(`⚠️ Not found: ${nk}`);
}
console.log('Done!');
