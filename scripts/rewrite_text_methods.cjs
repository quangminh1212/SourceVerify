const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'src', 'lib', 'methods', 'text');
const M = [
    ["adverbFrequency", "Adverb Frequency", "signal.adverbFrequency", "📝", `
    const ws=text.toLowerCase().split(/\\s+/).filter(w=>w.length>0);
    const advEndings=['ly','ally','fully','ously','ively','edly'];
    let advCount=0;
    for(const w of ws){for(const e of advEndings){if(w.endsWith(e)&&w.length>e.length+2){advCount++;break;}}}
    const ratio=ws.length>0?advCount/ws.length:0;
    let score;
    if(ratio>0.08)score=70;else if(ratio>0.05)score=60;else if(ratio<0.01)score=30;else score=45;
    const details=\`Adverb ratio: \${ratio.toFixed(4)}, Adverbs: \${advCount}/\${ws.length}.\`;`],
    ["contractionUsage", "Contraction Usage", "signal.contractionUsage", "📝", `
    const contractions=["n't","'re","'ve","'ll","'d","'m","'s","won't","can't","don't","isn't","aren't","wasn't","weren't","couldn't","wouldn't","shouldn't","hasn't","haven't","hadn't"];
    const lower=text.toLowerCase();
    let cCount=0;
    for(const c of contractions){let i=-1;while((i=lower.indexOf(c,i+1))!==-1)cCount++;}
    const ws=text.split(/\\s+/).length;
    const ratio=ws>0?cCount/ws:0;
    let score;
    if(ratio<0.005)score=68;else if(ratio<0.015)score=58;else if(ratio>0.06)score=28;else score=42;
    const details=\`Contraction ratio: \${ratio.toFixed(4)}, Found: \${cCount}.\`;`],
    ["sentenceOpener", "Sentence Opener Diversity", "signal.sentenceOpener", "🔤", `
    const sents=text.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>3);
    if(sents.length<5)return{name:"Sentence Opener Diversity",nameKey:"signal.sentenceOpener",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.sentenceOpener.error",icon:"🔤"};
    const openers=sents.map(s=>{const ws=s.split(/\\s+/);return ws.slice(0,Math.min(2,ws.length)).join(' ').toLowerCase();});
    const unique=new Set(openers).size;
    const diversity=unique/openers.length;
    let score;
    if(diversity<0.3)score=72;else if(diversity<0.5)score=60;else if(diversity>0.85)score=28;else score=44;
    const details=\`Opener diversity: \${diversity.toFixed(3)}, Unique: \${unique}/\${openers.length}.\`;`],
    ["emotionalTone", "Emotional Tone Variance", "signal.emotionalTone", "💭", `
    const posWords=['happy','good','great','love','wonderful','excellent','amazing','beautiful','fantastic','brilliant','joy','delight','pleasant','cheerful','glad'];
    const negWords=['bad','terrible','awful','horrible','hate','ugly','disgusting','miserable','dreadful','tragic','sad','angry','fear','pain','worst'];
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
    const scores=sents.map(s=>{const w=s.toLowerCase().split(/\\s+/);let p=0,n=0;for(const x of w){if(posWords.includes(x))p++;if(negWords.includes(x))n++;}return w.length>0?(p-n)/w.length:0;});
    const mean=scores.reduce((a,b)=>a+b,0)/scores.length;
    const variance=scores.reduce((a,b)=>a+(b-mean)**2,0)/scores.length;
    let score;
    if(variance<0.001)score=70;else if(variance<0.005)score=58;else if(variance>0.05)score=28;else score=42;
    const details=\`Tone variance: \${variance.toFixed(5)}, Mean tone: \${mean.toFixed(4)}.\`;`],
    ["metaphorDensity", "Metaphor Density", "signal.metaphorDensity", "🎭", `
    const markers=['like a','as if','as though','resembles','mirror','echoes','shadow of','heart of','ocean of','mountain of','river of','sea of','flood of','storm of','fire of','light of','wave of','bridge between','wall of','door to','window into','key to','path to','garden of','forest of'];
    const lower=text.toLowerCase();
    let count=0;for(const m of markers){let i=-1;while((i=lower.indexOf(m,i+1))!==-1)count++;}
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const density=sents>0?count/sents:0;
    let score;
    if(density<0.05)score=65;else if(density<0.15)score=55;else if(density>0.5)score=30;else score=42;
    const details=\`Figurative density: \${density.toFixed(3)}, Markers: \${count}, Sentences: \${sents}.\`;`],
    ["questionFrequency", "Question Frequency", "signal.questionFrequency", "❓", `
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const questions=(text.match(/\\?/g)||[]).length;
    const ratio=sents>0?questions/sents:0;
    let score;
    if(ratio<0.02)score=65;else if(ratio<0.08)score=55;else if(ratio>0.3)score=30;else score=42;
    const details=\`Question ratio: \${ratio.toFixed(3)}, Questions: \${questions}, Sentences: \${sents}.\`;`],
    ["paragraphStructure", "Paragraph Structure", "signal.paragraphStructure", "📄", `
    const paras=text.split(/\\n\\s*\\n/).filter(p=>p.trim().length>0);
    if(paras.length<2)return{name:"Paragraph Structure",nameKey:"signal.paragraphStructure",category:"statistical",score:50,weight:0.2,description:"Too few paragraphs",descriptionKey:"signal.paragraphStructure.error",icon:"📄"};
    const lens=paras.map(p=>p.split(/\\s+/).length);
    const mean=lens.reduce((a,b)=>a+b,0)/lens.length;
    const cv=mean>0?Math.sqrt(lens.reduce((a,b)=>a+(b-mean)**2,0)/lens.length)/mean:0;
    let score;
    if(cv<0.15)score=72;else if(cv<0.3)score=58;else if(cv>0.8)score=28;else score=44;
    const details=\`Para CV: \${cv.toFixed(3)}, Mean len: \${mean.toFixed(1)}, Paras: \${paras.length}.\`;`],
    ["transitionQuality", "Transition Quality", "signal.transitionQuality", "🔗", `
    const transitions=['however','moreover','furthermore','additionally','nevertheless','consequently','therefore','thus','meanwhile','subsequently','likewise','similarly','conversely','nonetheless','alternatively','accordingly','hence','otherwise','instead','besides'];
    const ws=text.toLowerCase().split(/\\s+/);
    let count=0;for(const w of ws)if(transitions.includes(w))count++;
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const ratio=sents>0?count/sents:0;
    let score;
    if(ratio>0.15)score=70;else if(ratio>0.08)score=58;else if(ratio<0.01)score=30;else score=44;
    const details=\`Transition ratio: \${ratio.toFixed(3)}, Found: \${count}.\`;`],
    ["idiomDetection", "Idiom Detection", "signal.idiomDetection", "💬", `
    const idioms=['break the ice','hit the nail','piece of cake','once in a blue moon','bite the bullet','burn the midnight','cost an arm','call it a day','get out of hand','go the extra mile','in the same boat','let the cat out','miss the boat','under the weather','break a leg','back to square','beat around the bush','better late than','on the same page','speak of the devil'];
    const lower=text.toLowerCase();
    let count=0;for(const id of idioms)if(lower.includes(id))count++;
    const ws=text.split(/\\s+/).length;
    const density=ws>0?count/(ws/100):0;
    let score;
    if(density<0.05)score=62;else if(density<0.2)score=50;else if(density>1)score=30;else score=40;
    const details=\`Idiom density: \${density.toFixed(3)}/100w, Found: \${count}.\`;`],
    ["abstractConcrete", "Abstract-Concrete Ratio", "signal.abstractConcrete", "🔬", `
    const abstractW=['concept','idea','theory','freedom','justice','beauty','truth','knowledge','wisdom','belief','faith','hope','democracy','philosophy','morality','virtue','dignity','consciousness','reality','existence'];
    const concreteW=['table','chair','dog','car','house','tree','book','phone','water','food','door','window','road','building','hand','face','wall','floor','stone','glass'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>2);
    let abs=0,con=0;for(const w of ws){if(abstractW.includes(w))abs++;if(concreteW.includes(w))con++;}
    const total=abs+con;const ratio=total>0?abs/total:0.5;
    let score;
    if(ratio>0.8)score=68;else if(ratio>0.6)score=56;else if(ratio<0.2)score=32;else score=44;
    const details=\`Abstract ratio: \${ratio.toFixed(3)}, Abstract: \${abs}, Concrete: \${con}.\`;`],
    ["firstPersonUsage", "First Person Usage", "signal.firstPersonUsage", "👤", `
    const fp=['i','me','my','mine','myself','we','us','our','ours','ourselves'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(fp.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio<0.005)score=65;else if(ratio<0.02)score=55;else if(ratio>0.08)score=30;else score=42;
    const details=\`First person ratio: \${ratio.toFixed(4)}, Count: \${count}/\${ws.length}.\`;`],
    ["technicalJargon", "Technical Jargon", "signal.technicalJargon", "🔧", `
    const ws=text.split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let techCount=0;
    for(const w of ws){if(w.length>10)techCount++;else if(/[A-Z]{2,}/.test(w))techCount++;else if(/\\d+/.test(w)&&/[a-zA-Z]/.test(w))techCount++;}
    const ratio=ws.length>0?techCount/ws.length:0;
    let score;
    if(ratio>0.15)score=35;else if(ratio>0.08)score=45;else if(ratio<0.02)score=62;else score=50;
    const details=\`Technical ratio: \${ratio.toFixed(4)}, Tech words: \${techCount}/\${ws.length}.\`;`],
    ["redundancyDetection", "Redundancy Detection", "signal.redundancyDetection", "🔁", `
    const sents=text.split(/[.!?]+/).map(s=>s.trim().toLowerCase()).filter(s=>s.length>5);
    if(sents.length<3)return{name:"Redundancy Detection",nameKey:"signal.redundancyDetection",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.redundancyDetection.error",icon:"🔁"};
    let overlapSum=0,pairs=0;
    for(let i=0;i<sents.length-1;i++){const w1=new Set(sents[i].split(/\\s+/));const w2=new Set(sents[i+1].split(/\\s+/));let common=0;for(const w of w1)if(w2.has(w))common++;const union=new Set([...w1,...w2]).size;if(union>0){overlapSum+=common/union;pairs++;}}
    const avgOverlap=pairs>0?overlapSum/pairs:0;
    let score;
    if(avgOverlap>0.6)score=72;else if(avgOverlap>0.4)score=60;else if(avgOverlap<0.1)score=30;else score=44;
    const details=\`Avg Jaccard overlap: \${avgOverlap.toFixed(3)}, Pairs: \${pairs}.\`;`],
    ["wordLengthDist", "Word Length Distribution", "signal.wordLengthDist", "📏", `
    const ws=text.split(/\\s+/).filter(w=>w.length>0);
    const lens=ws.map(w=>w.replace(/[^a-zA-Z]/g,'').length).filter(l=>l>0);
    if(lens.length<10)return{name:"Word Length Distribution",nameKey:"signal.wordLengthDist",category:"statistical",score:50,weight:0.2,description:"Too few words",descriptionKey:"signal.wordLengthDist.error",icon:"📏"};
    const bins=new Array(15).fill(0);for(const l of lens)bins[Math.min(l,14)]++;
    const total=lens.length;const probs=bins.map(b=>b/total);
    let entropy=0;for(const p of probs)if(p>0)entropy-=p*Math.log2(p);
    let score;
    if(entropy<2.5)score=68;else if(entropy<3.0)score=56;else if(entropy>3.5)score=32;else score=44;
    const details=\`Length entropy: \${entropy.toFixed(3)}, Mean len: \${(lens.reduce((a,b)=>a+b,0)/lens.length).toFixed(2)}.\`;`],
    ["hapaxLegomena", "Hapax Legomena", "signal.hapaxLegomena", "🆕", `
    const ws=text.toLowerCase().replace(/[^\\w\\s]/g,'').split(/\\s+/).filter(w=>w.length>0);
    if(ws.length<20)return{name:"Hapax Legomena",nameKey:"signal.hapaxLegomena",category:"statistical",score:50,weight:0.2,description:"Too few words",descriptionKey:"signal.hapaxLegomena.error",icon:"🆕"};
    const freq=new Map();for(const w of ws)freq.set(w,(freq.get(w)||0)+1);
    let hapax=0,dis=0;for(const c of freq.values()){if(c===1)hapax++;if(c===2)dis++;}
    const hapaxRatio=freq.size>0?hapax/freq.size:0;
    const sichelS=freq.size>0?dis/freq.size:0;
    let score;
    if(hapaxRatio<0.35&&sichelS>0.3)score=70;else if(hapaxRatio<0.45)score=58;else if(hapaxRatio>0.7)score=28;else score=44;
    const details=\`Hapax ratio: \${hapaxRatio.toFixed(3)}, Sichel's S: \${sichelS.toFixed(3)}, Unique: \${freq.size}.\`;`],
    ["conjunctionDensity", "Conjunction Density", "signal.conjunctionDensity", "🔗", `
    const conj=['and','but','or','nor','yet','so','for','because','although','while','whereas','since','unless','until','after','before','when','if','though','whether'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(conj.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.08)score=35;else if(ratio>0.05)score=45;else if(ratio<0.02)score=65;else score=50;
    const details=\`Conjunction ratio: \${ratio.toFixed(4)}, Count: \${count}/\${ws.length}.\`;`],
    ["prepositionPattern", "Preposition Pattern", "signal.prepositionPattern", "📌", `
    const preps=['in','on','at','to','for','with','by','from','of','about','into','through','during','before','after','above','below','between','under','over','against','among','within','without','along','across','behind','beyond','upon','toward','throughout','beneath','beside','unlike'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(preps.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.15)score=65;else if(ratio>0.1)score=55;else if(ratio<0.04)score=35;else score=45;
    const details=\`Preposition ratio: \${ratio.toFixed(4)}, Count: \${count}/\${ws.length}.\`;`],
    ["modalVerbFrequency", "Modal Verb Frequency", "signal.modalVerbFrequency", "📝", `
    const modals=['can','could','may','might','must','shall','should','will','would','ought','need','dare'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(modals.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio<0.005)score=64;else if(ratio<0.015)score=54;else if(ratio>0.05)score=32;else score=44;
    const details=\`Modal ratio: \${ratio.toFixed(4)}, Count: \${count}/\${ws.length}.\`;`],
    ["subordinateClause", "Subordinate Clause", "signal.subordinateClause", "📐", `
    const markers=['which','that','who','whom','whose','where','when','while','although','because','since','unless','until','after','before','if','though','whereas','whenever','wherever'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    let count=0;for(const w of ws)if(markers.includes(w))count++;
    const perSent=sents>0?count/sents:0;
    let score;
    if(perSent>2.5)score=35;else if(perSent>1.5)score=45;else if(perSent<0.3)score=65;else score=50;
    const details=\`Subordinate/sent: \${perSent.toFixed(3)}, Markers: \${count}.\`;`],
    ["argumentStructure", "Argument Structure", "signal.argumentStructure", "🏗", `
    const claimW=['therefore','thus','hence','consequently','argue','claim','suggest','propose','conclude','evidence','proves','demonstrates','implies','indicates'];
    const lower=text.toLowerCase();const ws=lower.split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(claimW.includes(w))count++;
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const ratio=sents>0?count/sents:0;
    let score;
    if(ratio>0.2)score=68;else if(ratio>0.1)score=56;else if(ratio<0.02)score=35;else score=45;
    const details=\`Argument marker ratio: \${ratio.toFixed(3)}, Found: \${count}.\`;`],
    ["textFormality", "Text Formality", "signal.textFormality", "🎩", `
    const informal=["gonna","wanna","gotta","kinda","sorta","dunno","ain't","y'all","yeah","nah","ok","okay","lol","omg","btw","idk","imo","tbh","ngl","bruh","dude","stuff","things","cool","awesome","totally","super","really","pretty","basically","literally","actually"];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let infCount=0;for(const w of ws)if(informal.includes(w))infCount++;
    const ratio=ws.length>0?infCount/ws.length:0;
    const avgWordLen=ws.length>0?ws.reduce((a,w)=>a+w.length,0)/ws.length:0;
    const formality=1-ratio+avgWordLen/20;
    let score;
    if(formality>0.95&&ratio<0.005)score=68;else if(formality>0.9)score=56;else if(formality<0.7)score=30;else score=44;
    const details=\`Formality: \${formality.toFixed(3)}, Informal ratio: \${ratio.toFixed(4)}.\`;`],
    ["negationPattern", "Negation Pattern", "signal.negationPattern", "🚫", `
    const negs=["not","no","never","neither","nor","nobody","nothing","nowhere","none","don't","doesn't","didn't","won't","wouldn't","couldn't","shouldn't","can't","isn't","aren't","wasn't","weren't","hasn't","haven't","hadn't"];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(negs.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.06)score=35;else if(ratio>0.04)score=45;else if(ratio<0.01)score=62;else score=50;
    const details=\`Negation ratio: \${ratio.toFixed(4)}, Count: \${count}/\${ws.length}.\`;`],
    ["comparativeStructure", "Comparative Structure", "signal.comparativeStructure", "⚖", `
    const compW=['more','less','better','worse','greater','smaller','larger','higher','lower','faster','slower','than','compared','whereas','unlike','similarly','likewise','contrast'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(compW.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.04)score=62;else if(ratio>0.02)score=52;else if(ratio<0.005)score=35;else score=44;
    const details=\`Comparative ratio: \${ratio.toFixed(4)}, Found: \${count}.\`;`],
    ["quantifierUsage", "Quantifier Usage", "signal.quantifierUsage", "🔢", `
    const quants=['all','every','each','most','many','much','some','few','several','any','no','none','both','either','neither','plenty','enough','various','numerous','countless'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(quants.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.04)score=62;else if(ratio>0.025)score=52;else if(ratio<0.005)score=38;else score=46;
    const details=\`Quantifier ratio: \${ratio.toFixed(4)}, Found: \${count}.\`;`],
    ["referentialDensity", "Referential Density", "signal.referentialDensity", "🔗", `
    const refs=['this','that','these','those','it','its','they','them','their','he','she','him','her','his','such','said','the former','the latter'];
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(refs.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio<0.03)score=64;else if(ratio<0.06)score=54;else if(ratio>0.12)score=32;else score=44;
    const details=\`Referential ratio: \${ratio.toFixed(4)}, Count: \${count}.\`;`],
    ["logicalConnector", "Logical Connector", "signal.logicalConnector", "🧩", `
    const logical=['if','then','therefore','because','since','thus','hence','so','consequently','accordingly','as a result','for this reason','due to','owing to','in order to','provided that','assuming that','given that'];
    const lower=text.toLowerCase();
    let count=0;for(const l of logical){let i=-1;while((i=lower.indexOf(l,i+1))!==-1)count++;}
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const ratio=sents>0?count/sents:0;
    let score;
    if(ratio>0.5)score=66;else if(ratio>0.25)score=54;else if(ratio<0.05)score=35;else score=45;
    const details=\`Logical connector/sent: \${ratio.toFixed(3)}, Found: \${count}.\`;`],
    ["topicShiftAnalysis", "Topic Shift Analysis", "signal.topicShiftAnalysis", "🔄", `
    const sents=text.split(/[.!?]+/).map(s=>s.trim().toLowerCase()).filter(s=>s.length>5);
    if(sents.length<4)return{name:"Topic Shift Analysis",nameKey:"signal.topicShiftAnalysis",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.topicShiftAnalysis.error",icon:"🔄"};
    const sentWords=sents.map(s=>new Set(s.split(/\\s+/).filter(w=>w.length>3)));
    let shiftCount=0;
    for(let i=1;i<sentWords.length;i++){let common=0;for(const w of sentWords[i])if(sentWords[i-1].has(w))common++;const overlap=sentWords[i].size>0?common/sentWords[i].size:0;if(overlap<0.1)shiftCount++;}
    const shiftRatio=shiftCount/(sentWords.length-1);
    let score;
    if(shiftRatio<0.1)score=68;else if(shiftRatio<0.25)score=56;else if(shiftRatio>0.6)score=30;else score=44;
    const details=\`Shift ratio: \${shiftRatio.toFixed(3)}, Shifts: \${shiftCount}.\`;`],
    ["informationDensity", "Information Density", "signal.informationDensity", "📊", `
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
    const ws=text.split(/\\s+/).filter(w=>w.length>0);
    const uniqueWords=new Set(ws.map(w=>w.toLowerCase())).size;
    const density=ws.length>0?uniqueWords/ws.length:0;
    const wordsPerSent=sents.length>0?ws.length/sents.length:0;
    const infoDensity=density*wordsPerSent;
    let score;
    if(infoDensity<5)score=66;else if(infoDensity<8)score=54;else if(infoDensity>15)score=30;else score=44;
    const details=\`Info density: \${infoDensity.toFixed(2)}, Lexical diversity: \${density.toFixed(3)}.\`;`],
    ["sentimentVariance", "Sentiment Variance", "signal.sentimentVariance", "📈", `
    const pos=['good','great','best','happy','love','excellent','wonderful','amazing','fantastic','brilliant','perfect','beautiful','outstanding','superb','magnificent'];
    const neg=['bad','worst','terrible','awful','horrible','hate','ugly','disgusting','poor','dreadful','miserable','pathetic','disappointing','atrocious','abysmal'];
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>3);
    const sentScores=sents.map(s=>{const w=s.toLowerCase().split(/\\s+/);let sc=0;for(const x of w){if(pos.includes(x))sc++;if(neg.includes(x))sc--;}return sc;});
    const mean=sentScores.reduce((a,b)=>a+b,0)/sentScores.length;
    const variance=sentScores.reduce((a,b)=>a+(b-mean)**2,0)/sentScores.length;
    let score;
    if(variance<0.05)score=68;else if(variance<0.2)score=56;else if(variance>1)score=28;else score=44;
    const details=\`Sentiment var: \${variance.toFixed(4)}, Mean: \${mean.toFixed(3)}.\`;`],
    ["lexicalChainRepetition", "Lexical Chain Repetition", "signal.lexicalChainRepetition", "🔗", `
    const ws=text.toLowerCase().replace(/[^\\w\\s]/g,'').split(/\\s+/).filter(w=>w.length>3);
    if(ws.length<20)return{name:"Lexical Chain Repetition",nameKey:"signal.lexicalChainRepetition",category:"statistical",score:50,weight:0.2,description:"Too few words",descriptionKey:"signal.lexicalChainRepetition.error",icon:"🔗"};
    const freq=new Map();for(const w of ws)freq.set(w,(freq.get(w)||0)+1);
    const sorted=[...freq.entries()].sort((a,b)=>b[1]-a[1]);
    const top10=sorted.slice(0,10);
    const top10Count=top10.reduce((a,b)=>a+b[1],0);
    const concentration=ws.length>0?top10Count/ws.length:0;
    let score;
    if(concentration>0.4)score=70;else if(concentration>0.25)score=58;else if(concentration<0.1)score=30;else score=44;
    const details=\`Top-10 concentration: \${concentration.toFixed(3)}, Total words: \${ws.length}.\`;`],
    ["genreConformity", "Genre Conformity", "signal.genreConformity", "📚", `
    const ws=text.toLowerCase().split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
    const avgSentLen=sents.length>0?ws.length/sents.length:0;
    const avgWordLen=ws.length>0?ws.reduce((a,w)=>a+w.length,0)/ws.length:0;
    const paraCount=text.split(/\\n\\s*\\n/).filter(p=>p.trim().length>0).length;
    const uniformity=Math.abs(avgSentLen-18)/18+Math.abs(avgWordLen-5)/5;
    let score;
    if(uniformity<0.3)score=70;else if(uniformity<0.5)score=58;else if(uniformity>1.2)score=30;else score=44;
    const details=\`Uniformity: \${uniformity.toFixed(3)}, AvgSent: \${avgSentLen.toFixed(1)}, AvgWord: \${avgWordLen.toFixed(2)}.\`;`],
    ["conclusionPattern", "Conclusion Pattern", "signal.conclusionPattern", "🏁", `
    const conclusionMarkers=['in conclusion','to conclude','in summary','to summarize','overall','in short','to sum up','finally','ultimately','all in all','on the whole','in the end','as a result','taking everything into account'];
    const lower=text.toLowerCase();
    let found=0;for(const m of conclusionMarkers)if(lower.includes(m))found++;
    const lastPara=text.split(/\\n\\s*\\n/).filter(p=>p.trim().length>0).pop()||'';
    const lastSents=lastPara.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    let score;
    if(found>=2)score=68;else if(found===1)score=56;else score=40;
    const details=\`Conclusion markers: \${found}, Last para sentences: \${lastSents}.\`;`],
    ["vocabComplexity", "Vocabulary Complexity", "signal.vocabComplexity", "🧠", `
    const ws=text.split(/[\\s,.;:!?]+/).filter(w=>w.length>0);
    const syllableCount=(w)=>{w=w.toLowerCase().replace(/[^a-z]/g,'');if(w.length<=3)return 1;let c=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').match(/[aeiouy]{1,2}/g);return c?c.length:1;};
    const syllables=ws.map(syllableCount);
    const avgSyl=syllables.length>0?syllables.reduce((a,b)=>a+b,0)/syllables.length:0;
    const complexWords=syllables.filter(s=>s>=3).length;
    const complexRatio=ws.length>0?complexWords/ws.length:0;
    let score;
    if(complexRatio<0.1)score=64;else if(complexRatio<0.2)score=52;else if(complexRatio>0.4)score=30;else score=44;
    const details=\`Complex ratio: \${complexRatio.toFixed(3)}, Avg syllables: \${avgSyl.toFixed(2)}.\`;`],
    ["sentenceConnectivity", "Sentence Connectivity", "signal.sentenceConnectivity", "🔗", `
    const sents=text.split(/[.!?]+/).map(s=>s.trim().toLowerCase()).filter(s=>s.length>5);
    if(sents.length<3)return{name:"Sentence Connectivity",nameKey:"signal.sentenceConnectivity",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.sentenceConnectivity.error",icon:"🔗"};
    let totalOverlap=0;
    for(let i=1;i<sents.length;i++){const prev=new Set(sents[i-1].split(/\\s+/).filter(w=>w.length>3));const curr=sents[i].split(/\\s+/).filter(w=>w.length>3);let shared=0;for(const w of curr)if(prev.has(w))shared++;totalOverlap+=curr.length>0?shared/curr.length:0;}
    const avgConnect=totalOverlap/(sents.length-1);
    let score;
    if(avgConnect>0.35)score=68;else if(avgConnect>0.2)score=56;else if(avgConnect<0.05)score=30;else score=44;
    const details=\`Avg connectivity: \${avgConnect.toFixed(3)}, Sentences: \${sents.length}.\`;`],
    ["textCoherence", "Text Coherence Score", "signal.textCoherence", "📋", `
    const sents=text.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>5);
    if(sents.length<3)return{name:"Text Coherence Score",nameKey:"signal.textCoherence",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.textCoherence.error",icon:"📋"};
    const ws=text.split(/\\s+/);const uniqueRatio=new Set(ws.map(w=>w.toLowerCase())).size/ws.length;
    const sentLens=sents.map(s=>s.split(/\\s+/).length);
    const meanLen=sentLens.reduce((a,b)=>a+b,0)/sentLens.length;
    const lenCV=meanLen>0?Math.sqrt(sentLens.reduce((a,b)=>a+(b-meanLen)**2,0)/sentLens.length)/meanLen:0;
    const coherence=uniqueRatio*(1-lenCV*0.5);
    let score;
    if(coherence>0.7)score=30;else if(coherence>0.55)score=42;else if(coherence<0.3)score=70;else score=55;
    const details=\`Coherence: \${coherence.toFixed(3)}, LenCV: \${lenCV.toFixed(3)}, LexDiv: \${uniqueRatio.toFixed(3)}.\`;`],
];
for (const [fn, name, nk, icon, logic] of M) {
    const code = `/**
 * ${name}
 * Unique algorithm for ${name.toLowerCase()} detection
 */
import type { AnalysisMethod } from "../../types";

export function analyze${fn.charAt(0).toUpperCase() + fn.slice(1)}(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "${name}", nameKey: "${nk}", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "${nk}.error", icon: "${icon}" };
    }
${logic}
    return {
        name: "${name}", nameKey: "${nk}", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "${name} pattern suggests AI generation" : "Natural ${name.toLowerCase()} — consistent with human writing",
        descriptionKey: score > 55 ? "${nk}.ai" : "${nk}.real", icon: "${icon}",
        details,
    };
}
`;
    const camelFile = fn.replace(/([A-Z])/g, (m) => m);
    // find actual filename
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
    const target = files.find(f => { const content = fs.readFileSync(path.join(dir, f), 'utf8'); return content.includes(`nameKey: "${nk}"`); });
    if (target) { fs.writeFileSync(path.join(dir, target), code); console.log(`✅ Rewrote ${target}`); }
    else console.log(`⚠️ Not found: ${nk}`);
}
console.log('Done rewriting text methods');
