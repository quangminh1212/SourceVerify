const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '..', 'src', 'lib', 'methodsI18n.ts');
let content = fs.readFileSync(i18nPath, 'utf8');

// VIDEO i18n entries (English)
const videoI18nEn = [
    // Existing 16 video methods
    [`"signal.temporalConsistency"`, `"Temporal Consistency"`],
    [`"signal.temporalConsistency.ai"`, `"Unnaturally smooth temporal transitions — may indicate AI video generation"`],
    [`"signal.temporalConsistency.real"`, `"Natural temporal variation — consistent with real video footage"`],
    [`"signal.audioVisualSync"`, `"Audio-Visual Sync"`],
    [`"signal.audioVisualSync.ai"`, `"Mouth region shows unnaturally smooth patterns — potential audio-visual desync"`],
    [`"signal.audioVisualSync.real"`, `"Mouth region texture appears natural — consistent with real speech"`],
    [`"signal.frameInterpolation"`, `"Frame Interpolation"`],
    [`"signal.frameInterpolation.ai"`, `"Interpolation artifacts detected — potential AI frame generation"`],
    [`"signal.frameInterpolation.real"`, `"Natural frame transitions — consistent with real video"`],
    [`"signal.lipSyncAnalysis"`, `"Lip Sync Analysis"`],
    [`"signal.lipSyncAnalysis.ai"`, `"Lip sync anomaly detected — potential deepfake indicator"`],
    [`"signal.lipSyncAnalysis.real"`, `"Lip sync appears natural — consistent with authentic video"`],
    [`"signal.opticalFlowAnomaly"`, `"Optical Flow Anomaly"`],
    [`"signal.opticalFlowAnomaly.ai"`, `"Optical flow shows unnatural patterns — potential AI generation"`],
    [`"signal.opticalFlowAnomaly.real"`, `"Optical flow appears natural — consistent with real motion"`],
    [`"signal.deepfakeArtifact"`, `"Deepfake Artifact"`],
    [`"signal.deepfakeArtifact.ai"`, `"Face boundary artifacts detected — characteristic of deepfake generation"`],
    [`"signal.deepfakeArtifact.real"`, `"Natural face texture — consistent with authentic video"`],
    [`"signal.sceneTransition"`, `"Scene Transition"`],
    [`"signal.sceneTransition.ai"`, `"Unnatural scene transitions detected — potential AI generation"`],
    [`"signal.sceneTransition.real"`, `"Natural scene transitions — consistent with real video editing"`],
    [`"signal.motionBlurConsistency"`, `"Motion Blur Consistency"`],
    [`"signal.motionBlurConsistency.ai"`, `"Inconsistent motion blur — potential AI generation artifact"`],
    [`"signal.motionBlurConsistency.real"`, `"Natural motion blur — consistent with real camera capture"`],
    [`"signal.backgroundStability"`, `"Background Stability"`],
    [`"signal.backgroundStability.ai"`, `"Unnatural background stability — potential AI generation"`],
    [`"signal.backgroundStability.real"`, `"Natural background variation — consistent with real video"`],
    [`"signal.gazeDirection"`, `"Gaze Direction"`],
    [`"signal.gazeDirection.ai"`, `"Unnatural gaze pattern — potential AI generation"`],
    [`"signal.gazeDirection.real"`, `"Natural gaze direction — consistent with real footage"`],
    [`"signal.facialReenactment"`, `"Facial Reenactment"`],
    [`"signal.facialReenactment.ai"`, `"Facial reenactment artifacts detected — potential deepfake"`],
    [`"signal.facialReenactment.real"`, `"Natural facial movement — consistent with authentic video"`],
    [`"signal.videoCompressionTrace"`, `"Video Compression Trace"`],
    [`"signal.videoCompressionTrace.ai"`, `"Unusual compression pattern — potential AI generation"`],
    [`"signal.videoCompressionTrace.real"`, `"Natural compression artifacts — consistent with standard encoding"`],
    [`"signal.flickerAnalysis"`, `"Flicker Analysis"`],
    [`"signal.flickerAnalysis.ai"`, `"Unnatural flicker pattern — potential AI generation"`],
    [`"signal.flickerAnalysis.real"`, `"Natural intensity variation — consistent with real capture"`],
    [`"signal.handGestureConsistency"`, `"Hand Gesture Consistency"`],
    [`"signal.handGestureConsistency.ai"`, `"Unnatural hand geometry — potential AI generation"`],
    [`"signal.handGestureConsistency.real"`, `"Natural hand detail — consistent with real footage"`],
    [`"signal.bodyProportion"`, `"Body Proportion"`],
    [`"signal.bodyProportion.ai"`, `"Unnatural body proportions — potential AI generation"`],
    [`"signal.bodyProportion.real"`, `"Natural body proportions — consistent with real footage"`],
];

// New 50 video methods
const newVideoNames = [
    ["colorTemporalShift", "Color Temporal Shift", "Color drift pattern"],
    ["frameDropDetection", "Frame Drop Detection", "Frame continuity"],
    ["blinkRateAnalysis", "Blink Rate Analysis", "Eye blink pattern"],
    ["videoNoiseConsistency", "Video Noise Consistency", "Noise pattern"],
    ["skinTextureRealism", "Skin Texture Realism", "Skin micro-texture"],
    ["hairDetailAnalysis", "Hair Detail Analysis", "Hair strand detail"],
    ["eyeReflectionConsistency", "Eye Reflection Consistency", "Catchlight pattern"],
    ["jawlineConsistency", "Jawline Consistency", "Jaw boundary"],
    ["earSymmetryAnalysis", "Ear Symmetry Analysis", "Ear shape"],
    ["expressionNaturalness", "Expression Naturalness", "Facial expression"],
    ["pupilDilation", "Pupil Dilation", "Pupil response"],
    ["facialWrinkle", "Facial Wrinkle Consistency", "Wrinkle pattern"],
    ["noseGeometry", "Nose Geometry", "Nose 3D consistency"],
    ["foreheadTexture", "Forehead Texture", "Forehead micro-pattern"],
    ["teethConsistency", "Teeth Consistency", "Teeth rendering"],
    ["eyebrowNaturalness", "Eyebrow Naturalness", "Eyebrow texture"],
    ["neckTransition", "Neck Transition", "Neck-face boundary"],
    ["shoulderAlignment", "Shoulder Alignment", "Shoulder geometry"],
    ["clothingFold", "Clothing Fold Physics", "Clothing fold"],
    ["fingerGeometry", "Finger Geometry", "Finger geometry"],
    ["backgroundPerspective", "Background Perspective", "Background geometry"],
    ["reflectionPhysics", "Reflection Physics", "Reflection consistency"],
    ["shadowTemporal", "Shadow Temporal Consistency", "Shadow movement"],
    ["watermarkDetection", "Watermark Detection", "AI watermark"],
    ["motionVectorAnalysis", "Motion Vector Analysis", "Motion vector"],
    ["headPoseEstimation", "Head Pose Estimation", "Head pose physics"],
    ["microExpressionAnalysis", "Micro-Expression Analysis", "Micro-expression"],
    ["faceAlignment", "Face Alignment", "Face alignment geometry"],
    ["depthConsistency", "Depth Consistency", "Depth map"],
    ["bokehNaturalness", "Bokeh Naturalness", "Bokeh effect"],
    ["lensDistortionVideo", "Lens Distortion", "Lens distortion"],
    ["stabilizationArtifact", "Stabilization Artifact", "Stabilization"],
    ["edgeRinging", "Edge Ringing", "Edge ringing"],
    ["chromaBleed", "Chroma Bleed", "Chroma bleed"],
    ["pixelRepetitionVideo", "Pixel Repetition", "Pixel repetition"],
    ["videoHashAnalysis", "Video Hash Analysis", "Video hash"],
    ["faceBoundaryBlend", "Face Boundary Blend", "Face boundary blend"],
    ["colorQuantizationVideo", "Color Quantization", "Color quantization"],
    ["spatialFreqTemporal", "Spatial Frequency Temporal", "Spatial frequency"],
    ["videoBlockiness", "Video Blockiness", "Video blockiness"],
    ["temporalNoise", "Temporal Noise Pattern", "Temporal noise"],
    ["frameEnergy", "Frame Energy Distribution", "Frame energy"],
    ["videoSharpness", "Video Sharpness", "Video sharpness"],
    ["objectBoundary", "Object Boundary", "Object boundary"],
    ["textureFlowAnalysis", "Texture Flow", "Texture flow"],
    ["videoGrainAnalysis", "Video Grain", "Video grain"],
    ["contrastTemporal", "Contrast Temporal", "Contrast temporal"],
    ["videoSaturation", "Video Saturation", "Video saturation"],
    ["faceIllumination", "Face Illumination", "Face illumination"],
    ["videoArtifactGrid", "Video Artifact Grid", "Grid-based artifact"],
];

for (const [key, name, desc] of newVideoNames) {
    videoI18nEn.push([`"signal.${key}"`, `"${name}"`]);
    videoI18nEn.push([`"signal.${key}.ai"`, `"Unnatural ${desc.toLowerCase()} detected — potential AI-generated video"`]);
    videoI18nEn.push([`"signal.${key}.real"`, `"Natural ${desc.toLowerCase()} — consistent with authentic video"`]);
    videoI18nEn.push([`"signal.${key}.error"`, `"Frame too small for ${desc.toLowerCase()} analysis"`]);
}

// New 35 text methods
const newTextNames = [
    ["adverbFrequency", "Adverb Frequency", "adverb usage"],
    ["contractionUsage", "Contraction Usage", "contraction usage"],
    ["sentenceOpener", "Sentence Opener Diversity", "sentence opener diversity"],
    ["emotionalTone", "Emotional Tone Variance", "emotional variation"],
    ["metaphorDensity", "Metaphor Density", "figurative language density"],
    ["questionFrequency", "Question Frequency", "question usage"],
    ["paragraphStructure", "Paragraph Structure", "paragraph organization"],
    ["transitionQuality", "Transition Quality", "transition smoothness"],
    ["idiomDetection", "Idiom Detection", "idiomatic expression usage"],
    ["abstractConcrete", "Abstract-Concrete Ratio", "abstract-concrete balance"],
    ["firstPersonUsage", "First Person Usage", "first person perspective"],
    ["technicalJargon", "Technical Jargon", "technical term density"],
    ["redundancyDetection", "Redundancy Detection", "redundant phrases"],
    ["wordLengthDist", "Word Length Distribution", "word length distribution"],
    ["hapaxLegomena", "Hapax Legomena", "unique word occurrence"],
    ["conjunctionDensity", "Conjunction Density", "conjunction usage"],
    ["prepositionPattern", "Preposition Pattern", "preposition distribution"],
    ["modalVerbFrequency", "Modal Verb Frequency", "modal verb usage"],
    ["subordinateClause", "Subordinate Clause", "subordinate clause frequency"],
    ["argumentStructure", "Argument Structure", "argument chain"],
    ["textFormality", "Text Formality", "formality level"],
    ["negationPattern", "Negation Pattern", "negation usage"],
    ["comparativeStructure", "Comparative Structure", "comparison usage"],
    ["quantifierUsage", "Quantifier Usage", "quantifier frequency"],
    ["referentialDensity", "Referential Density", "reference density"],
    ["logicalConnector", "Logical Connector", "logical connector distribution"],
    ["topicShiftAnalysis", "Topic Shift Analysis", "topic transition"],
    ["informationDensity", "Information Density", "information per sentence"],
    ["sentimentVariance", "Sentiment Variance", "sentiment variation"],
    ["lexicalChainRepetition", "Lexical Chain Repetition", "lexical chain repetition"],
    ["genreConformity", "Genre Conformity", "genre style conformity"],
    ["conclusionPattern", "Conclusion Pattern", "conclusion structure"],
    ["vocabComplexity", "Vocabulary Complexity", "vocabulary complexity"],
    ["sentenceConnectivity", "Sentence Connectivity", "sentence connectivity"],
    ["textCoherence", "Text Coherence Score", "text coherence"],
];

// Build english entries
let enEntries = '\n        // === Video Analysis Methods ===\n';
for (const [k, v] of videoI18nEn) {
    enEntries += `        ${k}: ${v},\n`;
}
enEntries += '\n        // === Text Analysis Methods v3 ===\n';
for (const [key, name, desc] of newTextNames) {
    enEntries += `        "signal.${key}": "${name}",\n`;
    enEntries += `        "signal.${key}.ai": "Unnatural ${desc} — pattern suggests AI generation",\n`;
    enEntries += `        "signal.${key}.real": "Natural ${desc} — consistent with human writing",\n`;
    enEntries += `        "signal.${key}.error": "Text too short for ${desc} analysis",\n`;
}

// Build vietnamese entries
let viEntries = '\n        // === Video Analysis Methods ===\n';
for (const [k, v] of videoI18nEn) {
    // Simple VI translation by keeping English name for signal keys
    const key = k.replace(/"/g, '');
    if (key.endsWith('.ai')) viEntries += `        ${k}: ${v.replace('Unnatural', 'Bất thường').replace('detected', 'phát hiện').replace('potential AI', 'có thể là AI')},\n`;
    else if (key.endsWith('.real')) viEntries += `        ${k}: ${v.replace('Natural', 'Tự nhiên').replace('consistent with', 'phù hợp với')},\n`;
    else if (key.endsWith('.error')) viEntries += `        ${k}: ${v.replace('Frame too small', 'Khung hình quá nhỏ').replace('analysis', 'phân tích')},\n`;
    else viEntries += `        ${k}: ${v},\n`;
}
viEntries += '\n        // === Text Analysis Methods v3 ===\n';
for (const [key, name, desc] of newTextNames) {
    viEntries += `        "signal.${key}": "${name}",\n`;
    viEntries += `        "signal.${key}.ai": "Bất thường ${desc} — mẫu gợi ý nội dung AI",\n`;
    viEntries += `        "signal.${key}.real": "Tự nhiên ${desc} — phù hợp với văn bản con người",\n`;
    viEntries += `        "signal.${key}.error": "Văn bản quá ngắn để phân tích ${desc}",\n`;
}

// Insert english entries before method categories
content = content.replace(
    '        // === Method Categories ===\n        "methods.catSpatial": "Spatial Analysis",',
    `${enEntries}\n        // === Method Categories ===\n        "methods.catSpatial": "Spatial Analysis",`
);

// Insert vietnamese entries before vietnamese method categories
content = content.replace(
    '        // === Method Categories ===\n        "methods.catSpatial": "Phân tích không gian",',
    `${viEntries}\n        // === Method Categories ===\n        "methods.catSpatial": "Phân tích không gian",`
);

fs.writeFileSync(i18nPath, content);
console.log('Updated methodsI18n.ts');
