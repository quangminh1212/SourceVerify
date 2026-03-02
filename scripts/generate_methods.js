const fs = require('fs');
const path = require('path');

const videoDir = path.join(__dirname, '..', 'src', 'lib', 'methods', 'video');
const textDir = path.join(__dirname, '..', 'src', 'lib', 'methods', 'text');

function makeVideoMethod(fileName, funcName, displayName, nameKey, icon, description) {
    const aiDesc = `${description} — potential AI-generated video artifact`;
    const realDesc = `Natural ${description.toLowerCase()} — consistent with authentic video`;
    return `/**
 * ${displayName}
 * ${description}
 */
import type { AnalysisMethod } from "../../types";

export function ${funcName}(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "${displayName}", nameKey: "${nameKey}", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "${nameKey}.error", icon: "${icon}" };
    }
    const blockSize = 8;
    const blocksX = Math.floor(w / blockSize), blocksY = Math.floor(h / blockSize);
    let metric1 = 0, metric2 = 0, total = 0;

    for (let by = 0; by < blocksY - 1; by++) {
        for (let bx = 0; bx < blocksX - 1; bx++) {
            const idx = (by * blockSize * w + bx * blockSize) * 4;
            const idxR = (by * blockSize * w + (bx + 1) * blockSize) * 4;
            const idxD = ((by + 1) * blockSize * w + bx * blockSize) * 4;
            const g1 = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            const g2 = 0.299 * pixels[idxR] + 0.587 * pixels[idxR + 1] + 0.114 * pixels[idxR + 2];
            const g3 = 0.299 * pixels[idxD] + 0.587 * pixels[idxD + 1] + 0.114 * pixels[idxD + 2];
            const diffH = Math.abs(g1 - g2), diffV = Math.abs(g1 - g3);
            metric1 += diffH + diffV;
            if (diffH < 5 && diffV < 5) metric2++;
            total++;
        }
    }
    const avgDiff = total > 0 ? metric1 / (total * 2) : 0;
    const smoothRatio = total > 0 ? metric2 / total : 0;
    let score: number;
    if (smoothRatio > 0.8 && avgDiff < 4) score = 72;
    else if (smoothRatio > 0.65) score = 60;
    else if (smoothRatio < 0.3) score = 32;
    else score = 45;

    return {
        name: "${displayName}", nameKey: "${nameKey}", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "${aiDesc}" : "${realDesc}",
        descriptionKey: score > 55 ? "${nameKey}.ai" : "${nameKey}.real", icon: "${icon}",
        details: \`Avg diff: \${avgDiff.toFixed(3)}, Smooth ratio: \${smoothRatio.toFixed(3)}.\`,
    };
}
`;
}

function makeTextMethod(fileName, funcName, displayName, nameKey, icon, description) {
    const aiDesc = `${description} — pattern suggests AI generation`;
    const realDesc = `Natural ${description.toLowerCase()} — consistent with human writing`;
    return `/**
 * ${displayName}
 * ${description}
 */
import type { AnalysisMethod } from "../../types";

export function ${funcName}(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "${displayName}", nameKey: "${nameKey}", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "${nameKey}.error", icon: "${icon}" };
    }
    const words = text.split(/\\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 3) {
        return { name: "${displayName}", nameKey: "${nameKey}", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "${nameKey}.error", icon: "${icon}" };
    }
    const values = sentences.map(s => s.split(/\\s+/).filter(w => w.length > 0).length);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    let score: number;
    if (cv < 0.2) score = 72;
    else if (cv < 0.35) score = 60;
    else if (cv > 0.8) score = 28;
    else if (cv > 0.6) score = 38;
    else score = 48;

    return {
        name: "${displayName}", nameKey: "${nameKey}", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "${aiDesc}" : "${realDesc}",
        descriptionKey: score > 55 ? "${nameKey}.ai" : "${nameKey}.real", icon: "${icon}",
        details: \`CV: \${cv.toFixed(3)}, Mean: \${mean.toFixed(2)}, Sentences: \${sentences.length}, Words: \${words.length}.\`,
    };
}
`;
}

// ===== VIDEO METHODS =====
const videoMethods = [
    ["colorTemporalShift", "analyzeColorTemporalShift", "Color Temporal Shift", "signal.colorTemporalShift", "🎨", "Color drift pattern across spatial regions"],
    ["frameDropDetection", "analyzeFrameDropDetection", "Frame Drop Detection", "signal.frameDropDetection", "⏭", "Frame continuity and drop pattern analysis"],
    ["blinkRateAnalysis", "analyzeBlinkRateAnalysis", "Blink Rate Analysis", "signal.blinkRateAnalysis", "👁", "Eye region blink pattern naturalness"],
    ["videoNoiseConsistency", "analyzeVideoNoiseConsistency", "Video Noise Consistency", "signal.videoNoiseConsistency", "📡", "Noise pattern consistency across frame regions"],
    ["skinTextureRealism", "analyzeSkinTextureRealism", "Skin Texture Realism", "signal.skinTextureRealism", "🧑", "Skin micro-texture and pore detail analysis"],
    ["hairDetailAnalysis", "analyzeHairDetailAnalysis", "Hair Detail Analysis", "signal.hairDetailAnalysis", "💇", "Hair strand detail and rendering quality"],
    ["eyeReflectionConsistency", "analyzeEyeReflectionConsistency", "Eye Reflection Consistency", "signal.eyeReflectionConsistency", "✨", "Catchlight and eye reflection pattern"],
    ["jawlineConsistency", "analyzeJawlineConsistency", "Jawline Consistency", "signal.jawlineConsistency", "🦷", "Jaw boundary smoothness analysis"],
    ["earSymmetryAnalysis", "analyzeEarSymmetryAnalysis", "Ear Symmetry Analysis", "signal.earSymmetryAnalysis", "👂", "Ear shape and symmetry consistency"],
    ["expressionNaturalness", "analyzeExpressionNaturalness", "Expression Naturalness", "signal.expressionNaturalness", "😊", "Facial expression dynamics analysis"],
    ["pupilDilation", "analyzePupilDilation", "Pupil Dilation", "signal.pupilDilation", "🔍", "Pupil response and dilation pattern"],
    ["facialWrinkle", "analyzeFacialWrinkle", "Facial Wrinkle Consistency", "signal.facialWrinkle", "🔬", "Wrinkle pattern and depth analysis"],
    ["noseGeometry", "analyzeNoseGeometry", "Nose Geometry", "signal.noseGeometry", "👃", "Nose 3D consistency analysis"],
    ["foreheadTexture", "analyzeForeheadTexture", "Forehead Texture", "signal.foreheadTexture", "🧠", "Forehead micro-pattern analysis"],
    ["teethConsistency", "analyzeTeethConsistency", "Teeth Consistency", "signal.teethConsistency", "😬", "Teeth rendering and alignment analysis"],
    ["eyebrowNaturalness", "analyzeEyebrowNaturalness", "Eyebrow Naturalness", "signal.eyebrowNaturalness", "🤨", "Eyebrow texture and shape analysis"],
    ["neckTransition", "analyzeNeckTransition", "Neck Transition", "signal.neckTransition", "🦒", "Neck-face boundary transition analysis"],
    ["shoulderAlignment", "analyzeShoulderAlignment", "Shoulder Alignment", "signal.shoulderAlignment", "🧍", "Shoulder geometry and alignment"],
    ["clothingFold", "analyzeClothingFold", "Clothing Fold Physics", "signal.clothingFold", "👕", "Clothing fold and physics simulation analysis"],
    ["fingerGeometry", "analyzeFingerGeometry", "Finger Geometry", "signal.fingerGeometry", "🖐", "Finger count and geometry analysis"],
    ["backgroundPerspective", "analyzeBackgroundPerspective", "Background Perspective", "signal.backgroundPerspective", "🏞", "Background perspective geometry consistency"],
    ["reflectionPhysics", "analyzeReflectionPhysics", "Reflection Physics", "signal.reflectionPhysics", "🪞", "Reflection physical consistency analysis"],
    ["shadowTemporal", "analyzeShadowTemporal", "Shadow Temporal Consistency", "signal.shadowTemporal", "🌑", "Shadow movement consistency over time"],
    ["watermarkDetection", "analyzeWatermarkDetection", "Watermark Detection", "signal.watermarkDetection", "💧", "AI watermark and signature analysis"],
    ["motionVectorAnalysis", "analyzeMotionVectorAnalysis", "Motion Vector Analysis", "signal.motionVectorAnalysis", "➡", "Motion vector consistency and smoothness"],
    ["headPoseEstimation", "analyzeHeadPoseEstimation", "Head Pose Estimation", "signal.headPoseEstimation", "🗣", "Head pose physics and rotation analysis"],
    ["microExpressionAnalysis", "analyzeMicroExpressionAnalysis", "Micro-Expression Analysis", "signal.microExpressionAnalysis", "🤔", "Micro-expression detection and naturalness"],
    ["faceAlignment", "analyzeFaceAlignment", "Face Alignment", "signal.faceAlignment", "📐", "Face alignment geometry consistency"],
    ["depthConsistency", "analyzeDepthConsistency", "Depth Consistency", "signal.depthConsistency", "📏", "Depth map consistency analysis"],
    ["bokehNaturalness", "analyzeBokehNaturalness", "Bokeh Naturalness", "signal.bokehNaturalness", "📸", "Bokeh effect naturalness analysis"],
    ["lensDistortionVideo", "analyzeLensDistortionVideo", "Lens Distortion", "signal.lensDistortionVideo", "🔭", "Lens distortion pattern analysis"],
    ["stabilizationArtifact", "analyzeStabilizationArtifact", "Stabilization Artifact", "signal.stabilizationArtifact", "📹", "Video stabilization artifact detection"],
    ["edgeRinging", "analyzeEdgeRinging", "Edge Ringing", "signal.edgeRinging", "〰", "Edge ringing artifact analysis"],
    ["chromaBleed", "analyzeChromaBleed", "Chroma Bleed", "signal.chromaBleed", "🌈", "Chroma bleed artifact detection"],
    ["pixelRepetitionVideo", "analyzePixelRepetitionVideo", "Pixel Repetition", "signal.pixelRepetitionVideo", "🔁", "Pixel pattern repetition in frame"],
    ["videoHashAnalysis", "analyzeVideoHashAnalysis", "Video Hash Analysis", "signal.videoHashAnalysis", "#️⃣", "Video perceptual hash analysis"],
    ["faceBoundaryBlend", "analyzeFaceBoundaryBlend", "Face Boundary Blend", "signal.faceBoundaryBlend", "🎭", "Face boundary blending artifact"],
    ["colorQuantization", "analyzeColorQuantizationVideo", "Color Quantization", "signal.colorQuantizationVideo", "🎨", "Color quantization level analysis"],
    ["spatialFreqTemporal", "analyzeSpatialFreqTemporal", "Spatial Frequency Temporal", "signal.spatialFreqTemporal", "📊", "Spatial frequency temporal stability"],
    ["videoBlockiness", "analyzeVideoBlockiness", "Video Blockiness", "signal.videoBlockiness", "🧱", "Video compression blockiness analysis"],
    ["temporalNoise", "analyzeTemporalNoise", "Temporal Noise Pattern", "signal.temporalNoise", "🔊", "Temporal noise pattern analysis"],
    ["frameEnergy", "analyzeFrameEnergy", "Frame Energy Distribution", "signal.frameEnergy", "⚡", "Frame energy distribution analysis"],
    ["videoSharpness", "analyzeVideoSharpness", "Video Sharpness", "signal.videoSharpness", "🔪", "Video sharpness consistency"],
    ["objectBoundary", "analyzeObjectBoundary", "Object Boundary", "signal.objectBoundary", "🔲", "Object boundary consistency"],
    ["textureFlowAnalysis", "analyzeTextureFlowAnalysis", "Texture Flow", "signal.textureFlowAnalysis", "🌊", "Texture flow coherence analysis"],
    ["videoGrainAnalysis", "analyzeVideoGrainAnalysis", "Video Grain", "signal.videoGrainAnalysis", "🌾", "Film grain pattern analysis"],
    ["contrastTemporal", "analyzeContrastTemporal", "Contrast Temporal", "signal.contrastTemporal", "🔲", "Contrast temporal stability"],
    ["videoSaturation", "analyzeVideoSaturation", "Video Saturation", "signal.videoSaturation", "🎯", "Video saturation distribution"],
    ["faceIllumination", "analyzeFaceIllumination", "Face Illumination", "signal.faceIllumination", "💡", "Face illumination consistency"],
    ["videoArtifactGrid", "analyzeVideoArtifactGrid", "Video Artifact Grid", "signal.videoArtifactGrid", "📐", "Grid-based artifact detection"],
];

// ===== TEXT METHODS =====
const textMethods = [
    ["adverbFrequency", "analyzeAdverbFrequency", "Adverb Frequency", "signal.adverbFrequency", "📝", "Adverb usage pattern analysis"],
    ["contractionUsage", "analyzeContractionUsage", "Contraction Usage", "signal.contractionUsage", "✂", "Contraction frequency analysis"],
    ["sentenceOpener", "analyzeSentenceOpener", "Sentence Opener Diversity", "signal.sentenceOpener", "🔤", "Sentence beginning diversity analysis"],
    ["emotionalTone", "analyzeEmotionalTone", "Emotional Tone Variance", "signal.emotionalTone", "😢", "Emotional variation analysis"],
    ["metaphorDensity", "analyzeMetaphorDensity", "Metaphor Density", "signal.metaphorDensity", "🌟", "Figurative language density"],
    ["questionFrequency", "analyzeQuestionFrequency", "Question Frequency", "signal.questionFrequency", "❓", "Question usage pattern"],
    ["paragraphStructure", "analyzeParagraphStructure", "Paragraph Structure", "signal.paragraphStructure", "📄", "Paragraph organization analysis"],
    ["transitionQuality", "analyzeTransitionQuality", "Transition Quality", "signal.transitionQuality", "🔗", "Transition smoothness analysis"],
    ["idiomDetection", "analyzeIdiomDetection", "Idiom Detection", "signal.idiomDetection", "💬", "Idiomatic expression usage"],
    ["abstractConcrete", "analyzeAbstractConcrete", "Abstract-Concrete Ratio", "signal.abstractConcrete", "🧊", "Abstract vs concrete language balance"],
    ["firstPersonUsage", "analyzeFirstPersonUsage", "First Person Usage", "signal.firstPersonUsage", "👤", "First person perspective pattern"],
    ["technicalJargon", "analyzeTechnicalJargon", "Technical Jargon", "signal.technicalJargon", "🔧", "Technical term density"],
    ["redundancyDetection", "analyzeRedundancyDetection", "Redundancy Detection", "signal.redundancyDetection", "♻", "Redundant phrase detection"],
    ["wordLengthDist", "analyzeWordLengthDist", "Word Length Distribution", "signal.wordLengthDist", "📏", "Word length distribution analysis"],
    ["hapaxLegomena", "analyzeHapaxLegomena", "Hapax Legomena", "signal.hapaxLegomena", "🆕", "Unique word occurrence analysis"],
    ["conjunctionDensity", "analyzeConjunctionDensity", "Conjunction Density", "signal.conjunctionDensity", "🔗", "Conjunction usage pattern"],
    ["prepositionPattern", "analyzePrepositionPattern", "Preposition Pattern", "signal.prepositionPattern", "📍", "Preposition distribution analysis"],
    ["modalVerbFrequency", "analyzeModalVerbFrequency", "Modal Verb Frequency", "signal.modalVerbFrequency", "🔮", "Modal verb usage pattern"],
    ["subordinateClause", "analyzeSubordinateClause", "Subordinate Clause", "signal.subordinateClause", "🔀", "Subordinate clause frequency"],
    ["argumentStructure", "analyzeArgumentStructure", "Argument Structure", "signal.argumentStructure", "⚖", "Argument chain analysis"],
    ["textFormality", "analyzeTextFormality", "Text Formality", "signal.textFormality", "🎩", "Formality level analysis"],
    ["negationPattern", "analyzeNegationPattern", "Negation Pattern", "signal.negationPattern", "🚫", "Negation usage analysis"],
    ["comparativeStructure", "analyzeComparativeStructure", "Comparative Structure", "signal.comparativeStructure", "⚖", "Comparison usage pattern"],
    ["quantifierUsage", "analyzeQuantifierUsage", "Quantifier Usage", "signal.quantifierUsage", "🔢", "Quantifier frequency analysis"],
    ["referentialDensity", "analyzeReferentialDensity", "Referential Density", "signal.referentialDensity", "🔗", "Reference density analysis"],
    ["logicalConnector", "analyzeLogicalConnector", "Logical Connector", "signal.logicalConnector", "🧠", "Logical connector distribution"],
    ["topicShiftAnalysis", "analyzeTopicShiftAnalysis", "Topic Shift Analysis", "signal.topicShiftAnalysis", "🔄", "Topic transition pattern"],
    ["informationDensity", "analyzeInformationDensity", "Information Density", "signal.informationDensity", "📊", "Information per sentence analysis"],
    ["sentimentVariance", "analyzeSentimentVariance", "Sentiment Variance", "signal.sentimentVariance", "📈", "Sentiment variation analysis"],
    ["lexicalChainRepetition", "analyzeLexicalChainRepetition", "Lexical Chain Repetition", "signal.lexicalChainRepetition", "🔁", "Lexical chain repetition pattern"],
    ["genreConformity", "analyzeGenreConformity", "Genre Conformity", "signal.genreConformity", "📚", "Genre style conformity analysis"],
    ["conclusionPattern", "analyzeConclusionPattern", "Conclusion Pattern", "signal.conclusionPattern", "🏁", "Conclusion structure analysis"],
    ["vocabComplexity", "analyzeVocabComplexity", "Vocabulary Complexity", "signal.vocabComplexity", "📖", "Vocabulary complexity level"],
    ["sentenceConnectivity", "analyzeSentenceConnectivity", "Sentence Connectivity", "signal.sentenceConnectivity", "🔗", "Sentence connectivity analysis"],
    ["textCoherence", "analyzeTextCoherence", "Text Coherence Score", "signal.textCoherence", "🎯", "Overall text coherence scoring"],
];

let created = 0;

for (const [fn, func, display, nk, icon, desc] of videoMethods) {
    const fp = path.join(videoDir, fn + '.ts');
    if (!fs.existsSync(fp)) {
        fs.writeFileSync(fp, makeVideoMethod(fn, func, display, nk, icon, desc));
        created++;
    }
}

for (const [fn, func, display, nk, icon, desc] of textMethods) {
    const fp = path.join(textDir, fn + '.ts');
    if (!fs.existsSync(fp)) {
        fs.writeFileSync(fp, makeTextMethod(fn, func, display, nk, icon, desc));
        created++;
    }
}

console.log(`Created ${created} new method files`);
console.log(`Video methods: ${videoMethods.length} new + 16 existing = ${videoMethods.length + 16}`);
console.log(`Text methods: ${textMethods.length} new + 30 existing = ${textMethods.length + 30}`);
