const fs = require('fs'), p = require('path'), dir = p.join(__dirname, '..', 'src', 'lib', 'methods', 'text');
const methods = [
    {
        file: 'typoErrorPattern', fn: 'analyzeTypoErrorPattern', name: 'Typo Error Pattern', key: 'signal.typoErrorPattern', icon: '✏️',
        logic: `const words=text.split(/\\s+/).filter(w=>w.length>0);const common=new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);let typoLike=0;for(const w of words){const lower=w.toLowerCase().replace(/[^a-z]/g,'');if(lower.length>3&&!common.has(lower)){const doubled=/([a-z])\\1{2,}/.test(lower);const endPattern=/[^aeiou]{4,}$/.test(lower);if(doubled||endPattern)typoLike++;}}const typoR=words.length>0?typoLike/words.length:0;`,
        scoring: `if(typoR<0.001)score=66;else if(typoR<0.01)score=50;else if(typoR>0.03)score=30;else score=42;`,
        det: `\`Typo-like: \${typoLike}, Ratio: \${typoR.toFixed(4)}\``, aiMsg: 'No natural typos/errors — typical of AI generation', realMsg: 'Natural error patterns — consistent with human writing', yr: 2023
    },
    {
        file: 'culturalReference', fn: 'analyzeCulturalReference', name: 'Cultural Reference', key: 'signal.culturalReference', icon: '🌍',
        logic: `const refs=['lol','btw','tbh','imo','fyi','smh','ngl','idk','omg','bruh','vibe','literally','basically','honestly','apparently','supposedly','allegedly'];let refCount=0;const lower=text.toLowerCase();for(const r of refs){const regex=new RegExp('\\\\b'+r+'\\\\b','gi');const matches=lower.match(regex);if(matches)refCount+=matches.length;}const words=text.split(/\\s+/).length;const refR=words>0?refCount/words:0;`,
        scoring: `if(refR<0.001)score=64;else if(refR<0.01)score=48;else if(refR>0.03)score=32;else score=44;`,
        det: `\`Cultural refs: \${refCount}, Ratio: \${refR.toFixed(4)}\``, aiMsg: 'Lack of cultural references — suggests AI generation', realMsg: 'Natural cultural references — consistent with human writing', yr: 2023
    },
    {
        file: 'personalExperience', fn: 'analyzePersonalExperience', name: 'Personal Experience', key: 'signal.personalExperience', icon: '📝',
        logic: `const markers=['i remember','i think','i feel','i believe','in my experience','personally','from my perspective','i\'ve seen','i\'ve been','i noticed','i realized','i learned','my friend','my family','when i was','i used to','i always','i once','i never','i sometimes'];let count=0;const lower=text.toLowerCase();for(const m of markers)if(lower.includes(m))count++;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?count/sents:0;`,
        scoring: `if(ratio<0.02)score=66;else if(ratio<0.08)score=50;else if(ratio>0.2)score=32;else score=44;`,
        det: `\`Personal markers: \${count}, Ratio: \${ratio.toFixed(4)}\``, aiMsg: 'Lack of personal experience markers — suggests AI generation', realMsg: 'Personal experience references — consistent with human writing', yr: 2023
    },
    {
        file: 'fillerWordUsage', fn: 'analyzeFillerWordUsage', name: 'Filler Word Usage', key: 'signal.fillerWordUsage', icon: '💬',
        logic: `const fillers=['well','um','uh','like','you know','i mean','sort of','kind of','actually','basically','honestly','right','okay','so','anyway','whatever','stuff','things','yeah'];let count=0;const lower=text.toLowerCase();for(const f of fillers){const regex=new RegExp('\\\\b'+f.replace(/ /g,'\\\\s+')+'\\\\b','gi');const m=lower.match(regex);if(m)count+=m.length;}const words=text.split(/\\s+/).length;const ratio=words>0?count/words:0;`,
        scoring: `if(ratio<0.005)score=66;else if(ratio<0.02)score=48;else if(ratio>0.05)score=30;else score=44;`,
        det: `\`Fillers: \${count}, Ratio: \${ratio.toFixed(4)}\``, aiMsg: 'No filler words — typical of polished AI writing', realMsg: 'Natural filler word usage — consistent with human writing', yr: 2023
    },
    {
        file: 'sentenceFragmentUsage', fn: 'analyzeSentenceFragmentUsage', name: 'Sentence Fragment', key: 'signal.sentenceFragment', icon: '📎',
        logic: `const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);let fragments=0;for(const s of sents){const words=s.trim().split(/\\s+/);if(words.length<=3&&words.length>0)fragments++;}const fragR=sents.length>0?fragments/sents.length:0;`,
        scoring: `if(fragR<0.02)score=64;else if(fragR<0.1)score=48;else if(fragR>0.3)score=35;else score=44;`,
        det: `\`Fragments: \${fragments}, Ratio: \${fragR.toFixed(4)}\``, aiMsg: 'No sentence fragments — suggests polished AI generation', realMsg: 'Natural sentence fragments — consistent with human writing', yr: 2023
    },
    {
        file: 'exclamationPattern', fn: 'analyzeExclamationPattern', name: 'Exclamation Pattern', key: 'signal.exclamationPattern', icon: '❗',
        logic: `const exclCount=(text.match(/!/g)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?exclCount/sents:0;const multiExcl=(text.match(/!{2,}/g)||[]).length;`,
        scoring: `if(ratio<0.01&&multiExcl===0)score=62;else if(ratio<0.1)score=46;else if(ratio>0.3)score=35;else score=44;`,
        det: `\`Exclamations: \${exclCount}, Multi: \${multiExcl}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Minimal exclamation usage — typical of measured AI writing', realMsg: 'Natural exclamation patterns — consistent with human writing', yr: 2023
    },
    {
        file: 'parentheticalUsage', fn: 'analyzeParentheticalUsage', name: 'Parenthetical Usage', key: 'signal.parentheticalUsage', icon: '🔗',
        logic: `const parens=(text.match(/\\([^)]+\\)/g)||[]).length;const dashes=(text.match(/—[^—]+—|--[^-]+--/g)||[]).length;const total=parens+dashes;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?total/sents:0;`,
        scoring: `if(ratio<0.01)score=62;else if(ratio<0.08)score=46;else if(ratio>0.25)score=35;else score=44;`,
        det: `\`Parentheticals: \${total} (parens:\${parens}, dashes:\${dashes}), Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Minimal parenthetical use — suggests structured AI writing', realMsg: 'Natural parenthetical usage — consistent with human writing', yr: 2023
    },
    {
        file: 'listEnumerationPattern', fn: 'analyzeListEnumerationPattern', name: 'List Enumeration', key: 'signal.listEnumeration', icon: '📋',
        logic: `const numbered=(text.match(/^\\s*\\d+[.)]/gm)||[]).length;const bulleted=(text.match(/^\\s*[-*•]/gm)||[]).length;const ordinals=(text.match(/\\b(first|second|third|finally|lastly|moreover|furthermore|additionally)\\b/gi)||[]).length;const total=numbered+bulleted+ordinals;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?total/sents:0;`,
        scoring: `if(ratio>0.3)score=72;else if(ratio>0.15)score=58;else if(ratio<0.02)score=35;else score=44;`,
        det: `\`Lists: \${total}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Heavy list/enumeration usage — typical of AI writing structure', realMsg: 'Natural enumeration — consistent with human writing', yr: 2023
    },
    {
        file: 'vocabularyGrowthRate', fn: 'analyzeVocabularyGrowthRate', name: 'Vocabulary Growth Rate', key: 'signal.vocabGrowthRate', icon: '📈',
        logic: `const words=text.split(/\\s+/).filter(w=>w.length>0).map(w=>w.toLowerCase().replace(/[^a-z]/g,''));const seen=new Set();const rates=[];const chunk=Math.max(10,Math.floor(words.length/10));for(let i=0;i<words.length;i+=chunk){const before=seen.size;for(let j=i;j<Math.min(i+chunk,words.length);j++)seen.add(words[j]);rates.push(seen.size-before);}let declining=0;for(let i=1;i<rates.length;i++)if(rates[i]<rates[i-1])declining++;const decR=rates.length>1?declining/(rates.length-1):0;`,
        scoring: `if(decR>0.8)score=64;else if(decR>0.5)score=48;else if(decR<0.2)score=35;else score=44;`,
        det: `\`Declining rate: \${decR.toFixed(3)}\``, aiMsg: 'Monotonic vocab decline — suggests uniform AI vocabulary', realMsg: 'Natural vocabulary growth — consistent with human writing', yr: 2023
    },
    {
        file: 'wordSpecificityIndex', fn: 'analyzeWordSpecificityIndex', name: 'Word Specificity', key: 'signal.wordSpecificity', icon: '🎯',
        logic: `const generic=new Set(['thing','stuff','something','someone','somewhere','somehow','anything','anyone','everything','everyone','good','bad','nice','great','big','small','many','much','very','really','quite','rather','somewhat','kind','sort','lot','lots','way','ways','place','time','people','person']);const words=text.split(/\\s+/).filter(w=>w.length>0);let genCount=0;for(const w of words)if(generic.has(w.toLowerCase()))genCount++;const ratio=words.length>0?genCount/words.length:0;`,
        scoring: `if(ratio<0.01)score=60;else if(ratio<0.03)score=46;else if(ratio>0.08)score=35;else score=44;`,
        det: `\`Generic words: \${genCount}, Ratio: \${ratio.toFixed(4)}\``, aiMsg: 'Low word specificity — suggests generic AI writing', realMsg: 'Natural word specificity — consistent with human writing', yr: 2021
    },
    {
        file: 'rhetoricalDevice', fn: 'analyzeRhetoricalDevice', name: 'Rhetorical Device', key: 'signal.rhetoricalDevice', icon: '🎤',
        logic: `const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);let rhetorical=0;for(const s of sents){const t=s.trim();if(t.endsWith('?')&&!t.startsWith('What')&&!t.startsWith('How')&&!t.startsWith('Why'))rhetorical++;}const anaphora=new Map();for(const s of sents){const first=s.trim().split(/\\s+/)[0]?.toLowerCase();if(first)anaphora.set(first,(anaphora.get(first)||0)+1);}let anaphoraCount=0;for(const v of anaphora.values())if(v>=3)anaphoraCount++;const ratio=sents.length>0?(rhetorical+anaphoraCount)/sents.length:0;`,
        scoring: `if(ratio<0.01)score=62;else if(ratio<0.05)score=48;else if(ratio>0.15)score=35;else score=44;`,
        det: `\`Rhetorical: \${rhetorical}, Anaphora groups: \${anaphoraCount}\``, aiMsg: 'Minimal rhetorical devices — suggests AI generation', realMsg: 'Natural rhetorical usage — consistent with human writing', yr: 2020
    },
    {
        file: 'colloquialExpression', fn: 'analyzeColloquialExpression', name: 'Colloquial Expression', key: 'signal.colloquialExpression', icon: '🗨️',
        logic: `const colloquials=['gonna','wanna','gotta','kinda','sorta','dunno','ain\\'t','cuz','cos','y\\'all',''bout','prolly','lemme','gimme','c\\'mon','nah','yep','nope','yup','haha','lmao','omg','btw'];let count=0;const lower=text.toLowerCase();for(const c of colloquials){const regex=new RegExp('\\\\b'+c.replace(/'/g,"'?")+'\\\\b','gi');const m=lower.match(regex);if(m)count+=m.length;}const words=text.split(/\\s+/).length;const ratio=words>0?count/words:0;`,
        scoring: `if(ratio<0.001)score=64;else if(ratio<0.01)score=48;else if(ratio>0.03)score=32;else score=44;`,
        det: `\`Colloquials: \${count}, Ratio: \${ratio.toFixed(4)}\``, aiMsg: 'No colloquial expressions — suggests formal AI writing', realMsg: 'Natural colloquial language — consistent with human writing', yr: 2023
    },
    {
        file: 'sentenceRhythm', fn: 'analyzeSentenceRhythm', name: 'Sentence Rhythm', key: 'signal.sentenceRhythm', icon: '🎵',
        logic: `const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const lengths=sents.map(s=>s.trim().split(/\\s+/).length);if(lengths.length<3){const r=0;`,
        scoring: `score=50;}else{let diffs=0;for(let i=1;i<lengths.length;i++)diffs+=Math.abs(lengths[i]-lengths[i-1]);const avgDiff=diffs/(lengths.length-1);const maxL=Math.max(...lengths);const r=maxL>0?avgDiff/maxL:0;if(r<0.1)score=66;else if(r<0.25)score=50;else if(r>0.5)score=30;else score=44;}`,
        det: `\`Rhythm variance: \${lengths.length}\``, aiMsg: 'Monotonous sentence rhythm — suggests AI generation', realMsg: 'Natural sentence rhythm — consistent with human writing', yr: 2023
    },
    {
        file: 'topicDepthAnalysis', fn: 'analyzeTopicDepthAnalysis', name: 'Topic Depth', key: 'signal.topicDepth', icon: '🔎',
        logic: `const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const words=text.split(/\\s+/).filter(w=>w.length>3).map(w=>w.toLowerCase());const unique=new Set(words);const contentWords=words.filter(w=>!new Set(['that','this','with','from','have','been','were','will','would','could','should','about','their','which','there','other','than']).has(w));const repeatMap=new Map();for(const w of contentWords)repeatMap.set(w,(repeatMap.get(w)||0)+1);let deepWords=0;for(const[,c]of repeatMap)if(c>=3)deepWords++;const ratio=sents.length>0?deepWords/sents.length:0;`,
        scoring: `if(ratio>0.3)score=62;else if(ratio>0.1)score=48;else if(ratio<0.03)score=35;else score=44;`,
        det: `\`Deep topic words: \${deepWords}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Surface-level topic coverage — suggests AI generation', realMsg: 'Deep topic exploration — consistent with human writing', yr: 2021
    },
    {
        file: 'narrativeStructure', fn: 'analyzeNarrativeStructure', name: 'Narrative Structure', key: 'signal.narrativeStructure', icon: '📖',
        logic: `const lower=text.toLowerCase();const timeWords=['then','after','before','when','while','during','finally','eventually','meanwhile','suddenly','later','soon','next','first','last','once'];let timeCount=0;for(const t of timeWords){const regex=new RegExp('\\\\b'+t+'\\\\b','gi');const m=lower.match(regex);if(m)timeCount+=m.length;}const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?timeCount/sents:0;`,
        scoring: `if(ratio<0.02)score=60;else if(ratio<0.08)score=46;else if(ratio>0.2)score=35;else score=44;`,
        det: `\`Temporal words: \${timeCount}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Weak narrative structure — suggests AI generation', realMsg: 'Natural narrative flow — consistent with human writing', yr: 2020
    },
    {
        file: 'dialoguePattern', fn: 'analyzeDialoguePattern', name: 'Dialogue Pattern', key: 'signal.dialoguePattern', icon: '💭',
        logic: `const quotes=(text.match(/"[^"]+"|'[^']+'/g)||[]).length;const saidVerbs=(text.match(/\\b(said|asked|replied|answered|whispered|shouted|muttered|exclaimed)\\b/gi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?(quotes+saidVerbs)/sents:0;`,
        scoring: `if(ratio<0.01)score=58;else if(ratio<0.1)score=46;else if(ratio>0.3)score=38;else score=44;`,
        det: `\`Quotes: \${quotes}, Said-verbs: \${saidVerbs}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Minimal dialogue elements — suggests non-narrative AI writing', realMsg: 'Natural dialogue patterns — consistent with human writing', yr: 2020
    },
    {
        file: 'evidenceCitation', fn: 'analyzeEvidenceCitation', name: 'Evidence Citation', key: 'signal.evidenceCitation', icon: '📚',
        logic: `const citations=(text.match(/\\b(according to|research shows|studies suggest|evidence indicates|data shows|as shown by|et al|\\(\\d{4}\\)|\\[\\d+\\])/gi)||[]).length;const hedges=(text.match(/\\b(suggests|indicates|appears|seems|may|might|could|possibly|potentially|likely|presumably)/gi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?(citations+hedges)/sents:0;`,
        scoring: `if(ratio>0.2)score=65;else if(ratio>0.08)score=52;else if(ratio<0.02)score=35;else score=44;`,
        det: `\`Citations: \${citations}, Hedges: \${hedges}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Heavy citation hedging — typical of AI-generated academic text', realMsg: 'Natural evidence usage — consistent with human writing', yr: 2023
    },
    {
        file: 'emotionalArc', fn: 'analyzeEmotionalArc', name: 'Emotional Arc', key: 'signal.emotionalArc', icon: '📉',
        logic: `const pos=new Set(['happy','great','wonderful','excellent','amazing','love','beautiful','fantastic','brilliant','perfect','joy','delight','excited','thrilled']);const neg=new Set(['sad','terrible','horrible','awful','hate','ugly','disgusting','worst','pain','suffer','angry','frustrated','disappointed','depressed']);const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const scores=sents.map(s=>{const words=s.toLowerCase().split(/\\s+/);let sc=0;for(const w of words){if(pos.has(w))sc++;if(neg.has(w))sc--;}return sc;});let changes=0;for(let i=1;i<scores.length;i++)if(Math.sign(scores[i])!==Math.sign(scores[i-1])&&scores[i]!==0)changes++;const changeR=scores.length>1?changes/(scores.length-1):0;`,
        scoring: `if(changeR<0.05)score=64;else if(changeR<0.15)score=48;else if(changeR>0.3)score=32;else score=44;`,
        det: `\`Emotional changes: \${changes}, Rate: \${changeR.toFixed(3)}\``, aiMsg: 'Flat emotional arc — suggests AI generation', realMsg: 'Natural emotional progression — consistent with human writing', yr: 2021
    },
    {
        file: 'ambiguityTolerance', fn: 'analyzeAmbiguityTolerance', name: 'Ambiguity Tolerance', key: 'signal.ambiguityTolerance', icon: '❓',
        logic: `const ambig=['perhaps','maybe','it depends','on the other hand','however','although','nevertheless','yet','still','but then','arguably','debatable','unclear','uncertain','complicated','complex','nuanced'];let count=0;const lower=text.toLowerCase();for(const a of ambig)if(lower.includes(a))count++;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?count/sents:0;`,
        scoring: `if(ratio>0.15)score=64;else if(ratio>0.05)score=48;else if(ratio<0.01)score=35;else score=44;`,
        det: `\`Ambiguity markers: \${count}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'High ambiguity hedging — typical of cautious AI writing', realMsg: 'Natural ambiguity tolerance — consistent with human writing', yr: 2023
    },
    {
        file: 'anaphoraResolution', fn: 'analyzeAnaphoraResolution', name: 'Anaphora Resolution', key: 'signal.anaphoraResolution', icon: '🔄',
        logic: `const pronouns=['it','they','them','this','that','these','those','he','she','him','her','its','their'];const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);let pronounStart=0;for(const s of sents){const first=s.trim().split(/\\s+/)[0]?.toLowerCase();if(first&&pronouns.includes(first))pronounStart++;}const ratio=sents.length>0?pronounStart/sents.length:0;`,
        scoring: `if(ratio<0.05)score=62;else if(ratio<0.15)score=46;else if(ratio>0.3)score=35;else score=44;`,
        det: `\`Pronoun-start sents: \${pronounStart}, Ratio: \${ratio.toFixed(3)}\``, aiMsg: 'Low anaphoric reference — suggests structured AI generation', realMsg: 'Natural anaphora usage — consistent with human writing', yr: 2020
    },
];

for (const m of methods) {
    const code = `/**
 * ${m.name}
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function ${m.fn}(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "${m.name}", nameKey: "${m.key}", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "${m.key}.error", icon: "${m.icon}" };
    }
    ${m.logic}
    let score: number;
    ${m.scoring}
    return {
        name: "${m.name}", nameKey: "${m.key}", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "${m.aiMsg}" : "${m.realMsg}",
        descriptionKey: score > 55 ? "${m.key}.ai" : "${m.key}.real", icon: "${m.icon}",
        details: ${m.det},
    };
}
`;
    fs.writeFileSync(p.join(dir, m.file + '.ts'), code);
    console.log('Created:', m.file + '.ts');
}
console.log('Done! Created', methods.length, 'text methods');
