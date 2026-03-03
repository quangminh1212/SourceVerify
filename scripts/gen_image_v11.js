const fs = require('fs'), p = require('path'), dir = p.join(__dirname, '..', 'src', 'lib', 'methods', 'image');
const methods = [
    {
        file: 'moirePattern', fn: 'analyzeMoirePattern', name: 'Moiré Pattern', key: 'signal.moirePattern', cat: 'sensor', w: 0.3, icon: '🔲',
        logic: `const s=Math.min(64,Math.min(w,h)),ox=(w-s)>>1,oy=(h-s)>>1;let ac=0;for(let y=0;y<s-2;y++)for(let x=0;x<s-2;x++){const i=((oy+y)*w+(ox+x))*4,j=i+8,k=i+w*8;const d=Math.abs(p[i]-2*p[i+4]+p[j])+Math.abs(p[i]-2*p[i+w*4]+p[k]);if(d>30)ac++;}const r=ac/(s*s);`,
        scoring: `if(r<0.02)score=70;else if(r<0.06)score=55;else if(r>0.15)score=30;else score=42;`,
        det: `\`Moiré density: \${r.toFixed(4)}\``, aiMsg: 'Lack of moiré pattern suggests synthetic generation', realMsg: 'Natural moiré interference detected — consistent with real camera', yr: 2020
    },
    {
        file: 'vignetteAnalysis', fn: 'analyzeVignetteNatural', name: 'Vignette Analysis', key: 'signal.vignetteAnalysis', cat: 'sensor', w: 0.2, icon: '🔅',
        logic: `const cx=w/2,cy=h/2,maxR=Math.sqrt(cx*cx+cy*cy);let cBright=0,eBright=0,cc=0,ec=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4,b=(p[i]+p[i+1]+p[i+2])/3,d=Math.sqrt((x-cx)**2+(y-cy)**2)/maxR;if(d<0.3){cBright+=b;cc++;}else if(d>0.7){eBright+=b;ec++;}}const avgC=cc>0?cBright/cc:128,avgE=ec>0?eBright/ec:128,vDrop=(avgC-avgE)/avgC;`,
        scoring: `if(Math.abs(vDrop)<0.01)score=65;else if(vDrop>0.05&&vDrop<0.2)score=30;else if(vDrop>0.2)score=40;else score=50;`,
        det: `\`Vignette drop: \${(vDrop*100).toFixed(1)}%, Center: \${avgC.toFixed(1)}, Edge: \${avgE.toFixed(1)}\``, aiMsg: 'No natural vignetting — typical of AI-generated images', realMsg: 'Natural lens vignetting detected — consistent with real photo', yr: 2018
    },
    {
        file: 'depthMapConsistency', fn: 'analyzeDepthMapConsistency', name: 'Depth Map Consistency', key: 'signal.depthMapConsistency', cat: 'pixel', w: 0.3, icon: '🗺️',
        logic: `const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);const blurs=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let sum=0,cnt=0;for(let y=0;y<bSz-1;y++)for(let x=0;x<bSz-1;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;const dx=Math.abs(p[i]-p[i+4]),dy=Math.abs(p[i]-p[i+w*4]);sum+=dx+dy;cnt++;}blurs.push(cnt>0?sum/cnt:0);}let trans=0;for(let i=1;i<blurs.length;i++){const d=Math.abs(blurs[i]-blurs[i-1]);if(d>5)trans++;}const tRatio=blurs.length>1?trans/(blurs.length-1):0;`,
        scoring: `if(tRatio<0.1)score=68;else if(tRatio<0.25)score=55;else if(tRatio>0.5)score=30;else score=44;`,
        det: `\`Depth transitions: \${trans}, Ratio: \${tRatio.toFixed(3)}\``, aiMsg: 'Uniform depth field suggests AI generation', realMsg: 'Natural depth variation — consistent with real optics', yr: 2021
    },
    {
        file: 'texturePeriodicity', fn: 'analyzeTexturePeriodicity', name: 'Texture Periodicity', key: 'signal.texturePeriodicity', cat: 'pixel', w: 0.3, icon: '🔁',
        logic: `const sz=Math.min(64,Math.min(w,h));let repCount=0,total=0;for(let y=0;y<sz;y++){for(let lag=2;lag<sz/2;lag++){let corr=0;for(let x=0;x<sz-lag;x++){const i=((y)*w+x)*4,j=((y)*w+x+lag)*4;corr+=Math.abs(p[i]-p[j]);}corr/=(sz-lag);if(corr<8)repCount++;total++;}}const pRatio=total>0?repCount/total:0;`,
        scoring: `if(pRatio>0.3)score=75;else if(pRatio>0.15)score=60;else if(pRatio<0.05)score=30;else score=45;`,
        det: `\`Periodic ratio: \${pRatio.toFixed(4)}\``, aiMsg: 'High texture periodicity — characteristic of AI generation', realMsg: 'Natural texture variation — consistent with real image', yr: 2021
    },
    {
        file: 'noiseFloorLevel', fn: 'analyzeNoiseFloorLevel', name: 'Noise Floor Level', key: 'signal.noiseFloorLevel', cat: 'sensor', w: 0.3, icon: '📉',
        logic: `const step=3;let diffs=0,cnt=0;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4])+Math.abs(p[i+1]-p[i+5])+Math.abs(p[i+2]-p[i+6]);diffs+=d;cnt++;}const avgNoise=cnt>0?diffs/(cnt*3):0;`,
        scoring: `if(avgNoise<1.5)score=72;else if(avgNoise<3)score=58;else if(avgNoise>8)score=30;else score=42;`,
        det: `\`Avg noise floor: \${avgNoise.toFixed(3)}\``, aiMsg: 'Unnaturally low noise floor — typical of AI generation', realMsg: 'Natural sensor noise detected — consistent with real camera', yr: 2019
    },
    {
        file: 'antiAliasingConsistency', fn: 'analyzeAntiAliasingConsistency', name: 'Anti-aliasing Consistency', key: 'signal.antiAliasingConsistency', cat: 'pixel', w: 0.2, icon: '〰️',
        logic: `let sharpE=0,smoothE=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=Math.abs(p[i-4]-p[i+4]),gy=Math.abs(p[i-w*4]-p[i+w*4]),g=gx+gy;if(g>40){const nx=(p[i-4]+p[i+4])/2,diff=Math.abs(p[i]-nx);if(diff>20)sharpE++;else smoothE++;cnt++;}}const ratio=cnt>0?sharpE/(sharpE+smoothE):0.5;`,
        scoring: `if(ratio>0.8||ratio<0.1)score=65;else if(ratio>0.3&&ratio<0.6)score=35;else score=48;`,
        det: `\`Sharp edges: \${sharpE}, Smooth: \${smoothE}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Inconsistent anti-aliasing pattern suggests AI generation', realMsg: 'Consistent anti-aliasing — typical of real image processing', yr: 2020
    },
    {
        file: 'colorChannelNoise', fn: 'analyzeColorChannelNoise', name: 'Color Channel Noise', key: 'signal.colorChannelNoise', cat: 'sensor', w: 0.3, icon: '🎨',
        logic: `let rN=0,gN=0,bN=0,cnt=0;const step=3;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4,j=i+4;rN+=Math.abs(p[i]-p[j]);gN+=Math.abs(p[i+1]-p[j+1]);bN+=Math.abs(p[i+2]-p[j+2]);cnt++;}rN/=cnt;gN/=cnt;bN/=cnt;const avg=(rN+gN+bN)/3;const dev=Math.sqrt(((rN-avg)**2+(gN-avg)**2+(bN-avg)**2)/3);const ratio=avg>0?dev/avg:0;`,
        scoring: `if(ratio<0.05)score=68;else if(ratio<0.1)score=55;else if(ratio>0.25)score=30;else score=44;`,
        det: `\`R:\${rN.toFixed(2)} G:\${gN.toFixed(2)} B:\${bN.toFixed(2)}, Dev ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Uniform cross-channel noise suggests AI generation', realMsg: 'Natural channel noise variation — consistent with real sensor', yr: 2019
    },
    {
        file: 'spectralDecayRate', fn: 'analyzeSpectralDecayRate', name: 'Spectral Decay Rate', key: 'signal.spectralDecayRate', cat: 'frequency', w: 0.3, icon: '📊',
        logic: `const sz=Math.min(64,Math.min(w,h)),ox=(w-sz)>>1,oy=(h-sz)>>1;const pw=new Float64Array(sz/2+1);for(let r=0;r<sz;r++){for(let k=0;k<=sz/2;k++){let re=0,im=0;for(let n=0;n<sz;n++){const a=-2*Math.PI*k*n/sz,i=((oy+r)*w+(ox+n))*4;re+=p[i]*Math.cos(a);im+=p[i]*Math.sin(a);}pw[k]+=re*re+im*im;}}for(let k=0;k<=sz/2;k++)pw[k]/=sz;let s1=0,s2=0,n=0;for(let k=2;k<=sz/2;k++){const lk=Math.log(k),lp=Math.log(pw[k]+1);s1+=lk*lp;s2+=lk*lk;n++;s1-=lp;s2-=lk;}const slope=n>0?-s1/s2:0;`,
        scoring: `if(slope<0.5)score=70;else if(slope<1.0)score=55;else if(slope>2.0)score=28;else score=42;`,
        det: `\`Spectral decay slope: \${slope.toFixed(3)}\``, aiMsg: 'Unusual spectral decay — characteristic of synthetic generation', realMsg: 'Natural spectral decay rate — consistent with real image', yr: 2020
    },
    {
        file: 'patchSimilarityMatrix', fn: 'analyzePatchSimilarityMatrix', name: 'Patch Similarity Matrix', key: 'signal.patchSimilarityMatrix', cat: 'pixel', w: 0.2, icon: '🧩',
        logic: `const ps=8,gx=Math.min(8,Math.floor(w/ps)),gy=Math.min(8,Math.floor(h/ps));const patches=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let s=0;for(let y=0;y<ps;y++)for(let x=0;x<ps;x++){const i=((by*ps+y)*w+(bx*ps+x))*4;s+=p[i];}patches.push(s/(ps*ps));}let simCount=0,total=0;for(let i=0;i<patches.length;i++)for(let j=i+1;j<patches.length;j++){if(Math.abs(patches[i]-patches[j])<5)simCount++;total++;}const simR=total>0?simCount/total:0;`,
        scoring: `if(simR>0.4)score=72;else if(simR>0.2)score=58;else if(simR<0.05)score=30;else score=44;`,
        det: `\`Patch similarity: \${simR.toFixed(4)}\``, aiMsg: 'High patch similarity — suggests AI-generated content', realMsg: 'Natural patch variation — consistent with real image', yr: 2021
    },
    {
        file: 'jpegCoefficientDist', fn: 'analyzeJpegCoefficientDist', name: 'JPEG Coefficient Distribution', key: 'signal.jpegCoefficientDist', cat: 'frequency', w: 0.2, icon: '📦',
        logic: `const bSz=8,bins=new Float64Array(256);let total=0;for(let by=0;by<Math.min(h,64);by+=bSz)for(let bx=0;bx<Math.min(w,64);bx+=bSz){for(let y=0;y<bSz&&by+y<h;y++)for(let x=0;x<bSz&&bx+x<w;x++){const i=((by+y)*w+(bx+x))*4;const v=p[i]&0xFF;bins[v]++;total++;}}let nonZero=0,peak=0;for(let i=0;i<256;i++){if(bins[i]>0)nonZero++;if(bins[i]>bins[peak])peak=i;}const spread=nonZero/256;`,
        scoring: `if(spread<0.3)score=70;else if(spread<0.5)score=55;else if(spread>0.85)score=30;else score=44;`,
        det: `\`Spread: \${spread.toFixed(3)}, Peak bin: \${peak}\``, aiMsg: 'Unusual coefficient distribution — suggests synthetic image', realMsg: 'Natural JPEG coefficient distribution', yr: 2014
    },
    {
        file: 'edgeDensityMap', fn: 'analyzeEdgeDensityMap', name: 'Edge Density Map', key: 'signal.edgeDensityMap', cat: 'pixel', w: 0.2, icon: '📐',
        logic: `const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);const densities=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let edges=0,cnt=0;for(let y=0;y<bSz-1;y++)for(let x=0;x<bSz-1;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(g>25)edges++;cnt++;}densities.push(cnt>0?edges/cnt:0);}const avg=densities.reduce((a,b)=>a+b,0)/densities.length;const vari=densities.reduce((a,b)=>a+(b-avg)**2,0)/densities.length;const cv=avg>0?Math.sqrt(vari)/avg:0;`,
        scoring: `if(cv<0.3)score=68;else if(cv<0.5)score=52;else if(cv>1.0)score=28;else score=42;`,
        det: `\`Edge density CV: \${cv.toFixed(3)}, Avg: \${avg.toFixed(3)}\``, aiMsg: 'Uniform edge density — suggests AI generation', realMsg: 'Natural edge density variation — consistent with real image', yr: 2019
    },
    {
        file: 'channelIndependence', fn: 'analyzeChannelIndependence', name: 'Channel Independence', key: 'signal.channelIndependence', cat: 'statistical', w: 0.2, icon: '🔗',
        logic: `let rg=0,rb=0,gb=0,cnt=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;rg+=Math.abs(p[i]-p[i+1]);rb+=Math.abs(p[i]-p[i+2]);gb+=Math.abs(p[i+1]-p[i+2]);cnt++;}rg/=cnt;rb/=cnt;gb/=cnt;const avgDiff=(rg+rb+gb)/3;const dev=Math.sqrt(((rg-avgDiff)**2+(rb-avgDiff)**2+(gb-avgDiff)**2)/3);`,
        scoring: `if(dev<2)score=66;else if(dev<5)score=52;else if(dev>15)score=30;else score=42;`,
        det: `\`RG:\${rg.toFixed(1)} RB:\${rb.toFixed(1)} GB:\${gb.toFixed(1)}, Dev:\${dev.toFixed(2)}\``, aiMsg: 'Low channel independence — suggests correlated AI generation', realMsg: 'Natural channel independence — consistent with real sensor', yr: 2018
    },
    {
        file: 'imageComplexity', fn: 'analyzeImageComplexity', name: 'Image Complexity', key: 'signal.imageComplexity', cat: 'statistical', w: 0.2, icon: '🧮',
        logic: `let edges=0,cnt=0;const step=2;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(g>15)edges++;cnt++;}const complexity=cnt>0?edges/cnt:0;`,
        scoring: `if(complexity<0.1)score=65;else if(complexity<0.2)score=52;else if(complexity>0.5)score=30;else score=44;`,
        det: `\`Complexity index: \${complexity.toFixed(4)}\``, aiMsg: 'Low image complexity — typical of AI-smoothed generation', realMsg: 'Natural complexity level — consistent with real image', yr: 2020
    },
    {
        file: 'microTextureAnalysis', fn: 'analyzeMicroTextureAnalysis', name: 'Micro Texture', key: 'signal.microTexture', cat: 'pixel', w: 0.2, icon: '🔬',
        logic: `let microVar=0,cnt=0;for(let y=1;y<Math.min(h,128)-1;y+=2)for(let x=1;x<Math.min(w,128)-1;x+=2){const i=(y*w+x)*4;const c=p[i];const n=[p[i-4],p[i+4],p[i-w*4],p[i+w*4]];const avg=n.reduce((a,b)=>a+b,0)/4;microVar+=Math.abs(c-avg);cnt++;}const avgMicro=cnt>0?microVar/cnt:0;`,
        scoring: `if(avgMicro<1.5)score=72;else if(avgMicro<3)score=55;else if(avgMicro>8)score=28;else score=42;`,
        det: `\`Micro texture avg: \${avgMicro.toFixed(3)}\``, aiMsg: 'Over-smooth micro texture — characteristic of AI generation', realMsg: 'Natural micro texture — consistent with real sensor capture', yr: 2022
    },
    {
        file: 'colorMomentStatistics', fn: 'analyzeColorMomentStatistics', name: 'Color Moment Statistics', key: 'signal.colorMoments', cat: 'statistical', w: 0.2, icon: '🌈',
        logic: `const ch=[[],[],[]];const step=3;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;ch[0].push(p[i]);ch[1].push(p[i+1]);ch[2].push(p[i+2]);}const stats=ch.map(c=>{const m=c.reduce((a,b)=>a+b,0)/c.length;const v=c.reduce((a,b)=>a+(b-m)**2,0)/c.length;const sk=c.reduce((a,b)=>a+(b-m)**3,0)/(c.length*Math.pow(v,1.5)||1);return{m,v:Math.sqrt(v),sk};});const skewAvg=Math.abs(stats.reduce((a,s)=>a+s.sk,0)/3);`,
        scoring: `if(skewAvg<0.1)score=66;else if(skewAvg<0.3)score=52;else if(skewAvg>1.0)score=30;else score=44;`,
        det: `\`Avg skewness: \${skewAvg.toFixed(3)}\``, aiMsg: 'Symmetric color distribution — typical of AI generation', realMsg: 'Natural color moment skew — consistent with real image', yr: 2017
    },
    {
        file: 'apertureDiffraction', fn: 'analyzeApertureDiffraction', name: 'Aperture Diffraction', key: 'signal.apertureDiffraction', cat: 'sensor', w: 0.2, icon: '💎',
        logic: `let starCount=0,cnt=0;const step=3;for(let y=2;y<h-2;y+=step)for(let x=2;x<w-2;x+=step){const i=(y*w+x)*4;if(p[i]>240&&p[i+1]>240&&p[i+2]>240){const around=[p[(y*w+x-2)*4],p[(y*w+x+2)*4],p[((y-2)*w+x)*4],p[((y+2)*w+x)*4]];const avgA=around.reduce((a,b)=>a+b,0)/4;if(p[i]-avgA>50)starCount++;}cnt++;}const starR=cnt>0?starCount/cnt:0;`,
        scoring: `if(starR<0.0001)score=60;else if(starR<0.001)score=40;else if(starR>0.01)score=35;else score=48;`,
        det: `\`Diffraction points: \${starCount}, Ratio: \${starR.toFixed(6)}\``, aiMsg: 'No diffraction artifacts — suggests synthetic generation', realMsg: 'Diffraction patterns detected — consistent with real optics', yr: 2019
    },
    {
        file: 'chromaSubsampling', fn: 'analyzeChromaSubsampling', name: 'Chroma Subsampling', key: 'signal.chromaSubsampling', cat: 'frequency', w: 0.2, icon: '🔲',
        logic: `let chromaDiff=0,lumaDiff=0,cnt=0;for(let y=0;y<h-2;y+=2)for(let x=0;x<w-2;x+=2){const i=(y*w+x)*4;const cb1=(p[i+2]-p[i])/2,cb2=(p[(y*w+x+2)*4+2]-p[(y*w+x+2)*4])/2;chromaDiff+=Math.abs(cb1-cb2);const l1=p[i],l2=p[(y*w+x+2)*4];lumaDiff+=Math.abs(l1-l2);cnt++;}const cAvg=cnt>0?chromaDiff/cnt:0;const lAvg=cnt>0?lumaDiff/cnt:0;const ratio=lAvg>0?cAvg/lAvg:1;`,
        scoring: `if(ratio<0.3)score=65;else if(ratio<0.6)score=50;else if(ratio>1.2)score=30;else score=44;`,
        det: `\`Chroma: \${cAvg.toFixed(2)}, Luma: \${lAvg.toFixed(2)}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Unusual chroma subsampling — suggests AI generation', realMsg: 'Normal chroma subsampling — consistent with real compression', yr: 2016
    },
    {
        file: 'lensDistortionImage', fn: 'analyzeLensDistortionImage', name: 'Lens Distortion', key: 'signal.lensDistortionImage', cat: 'sensor', w: 0.2, icon: '🔍',
        logic: `const cx=w/2,cy=h/2;let innerG=0,outerG=0,ic=0,oc=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);const d=Math.sqrt((x-cx)**2+(y-cy)**2)/Math.max(cx,cy);if(d<0.3){innerG+=g;ic++;}else if(d>0.7){outerG+=g;oc++;}}const iAvg=ic>0?innerG/ic:0,oAvg=oc>0?outerG/oc:0;const distR=iAvg>0?oAvg/iAvg:1;`,
        scoring: `if(Math.abs(distR-1)<0.05)score=64;else if(distR>1.1&&distR<1.5)score=35;else if(distR<0.8)score=40;else score=48;`,
        det: `\`Inner grad: \${iAvg.toFixed(2)}, Outer: \${oAvg.toFixed(2)}, Ratio: \${distR.toFixed(3)}\``, aiMsg: 'No lens distortion detected — suggests AI generation', realMsg: 'Lens distortion pattern detected — consistent with real optics', yr: 2018
    },
    {
        file: 'hotPixelDetection', fn: 'analyzeHotPixelDetection', name: 'Hot Pixel Detection', key: 'signal.hotPixelDetection', cat: 'sensor', w: 0.2, icon: '⚡',
        logic: `let hotCount=0,deadCount=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const c=p[i]+p[i+1]+p[i+2];const nb=[p[(y*w+x-1)*4],p[(y*w+x+1)*4],p[((y-1)*w+x)*4],p[((y+1)*w+x)*4]];const avg=nb.reduce((a,b)=>a+b,0)/4;if(c>740&&avg<500)hotCount++;if(c<15&&avg>100)deadCount++;cnt++;}const hR=cnt>0?(hotCount+deadCount)/cnt:0;`,
        scoring: `if(hR<0.00001)score=62;else if(hR<0.0005)score=38;else if(hR>0.005)score=45;else score=42;`,
        det: `\`Hot: \${hotCount}, Dead: \${deadCount}, Ratio: \${hR.toFixed(6)}\``, aiMsg: 'No hot/dead pixels — suggests synthetic generation', realMsg: 'Sensor artifacts detected — consistent with real hardware', yr: 2017
    },
    {
        file: 'toneMapping', fn: 'analyzeToneMappingDetect', name: 'Tone Mapping Detection', key: 'signal.toneMapping', cat: 'statistical', w: 0.2, icon: '🎛️',
        logic: `const hist=new Float64Array(256);const step=2;let cnt=0;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const lum=Math.round(0.299*p[i]+0.587*p[i+1]+0.114*p[i+2]);hist[lum]++;cnt++;}let gaps=0,plateaus=0;for(let i=1;i<255;i++){if(hist[i]===0&&hist[i-1]>0&&hist[i+1]>0)gaps++;if(Math.abs(hist[i]-hist[i-1])<cnt*0.0001&&hist[i]>0)plateaus++;}`,
        scoring: `if(gaps>10)score=65;else if(gaps>5)score=55;else if(plateaus>50)score=60;else score=38;`,
        det: `\`Histogram gaps: \${gaps}, Plateaus: \${plateaus}\``, aiMsg: 'Tone mapping artifacts detected — suggests post-processing or AI', realMsg: 'Natural tonal distribution — consistent with real capture', yr: 2019
    },
];

for (const m of methods) {
    const code = `/**
 * ${m.name}
 * AI detection method - ${m.name}
 */
import type { AnalysisMethod } from "../../types";

export function ${m.fn}(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "${m.name}", nameKey: "${m.key}", category: "${m.cat}", score: 50, weight: ${m.w}, description: "Image too small", descriptionKey: "${m.key}.error", icon: "${m.icon}" };
    }
    ${m.logic}
    let score: number;
    ${m.scoring}
    return {
        name: "${m.name}", nameKey: "${m.key}", category: "${m.cat}", score, weight: ${m.w},
        description: score > 55 ? "${m.aiMsg}" : "${m.realMsg}",
        descriptionKey: score > 55 ? "${m.key}.ai" : "${m.key}.real", icon: "${m.icon}",
        details: ${m.det},
    };
}
`;
    fs.writeFileSync(p.join(dir, m.file + '.ts'), code);
    console.log('Created:', m.file + '.ts');
}
console.log('Done! Created', methods.length, 'image methods');
