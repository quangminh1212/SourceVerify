const fs = require('fs');
const path = require('path');

// ===== UPDATE index.ts =====
const indexPath = path.join(__dirname, '..', 'src', 'lib', 'methods', 'index.ts');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const newVideoExports = [
    'colorTemporalShift', 'frameDropDetection', 'blinkRateAnalysis', 'videoNoiseConsistency',
    'skinTextureRealism', 'hairDetailAnalysis', 'eyeReflectionConsistency', 'jawlineConsistency',
    'earSymmetryAnalysis', 'expressionNaturalness', 'pupilDilation', 'facialWrinkle',
    'noseGeometry', 'foreheadTexture', 'teethConsistency', 'eyebrowNaturalness',
    'neckTransition', 'shoulderAlignment', 'clothingFold', 'fingerGeometry',
    'backgroundPerspective', 'reflectionPhysics', 'shadowTemporal', 'watermarkDetection',
    'motionVectorAnalysis', 'headPoseEstimation', 'microExpressionAnalysis', 'faceAlignment',
    'depthConsistency', 'bokehNaturalness', 'lensDistortionVideo', 'stabilizationArtifact',
    'edgeRinging', 'chromaBleed', 'pixelRepetitionVideo', 'videoHashAnalysis',
    'faceBoundaryBlend', 'colorQuantization', 'spatialFreqTemporal', 'videoBlockiness',
    'temporalNoise', 'frameEnergy', 'videoSharpness', 'objectBoundary',
    'textureFlowAnalysis', 'videoGrainAnalysis', 'contrastTemporal', 'videoSaturation',
    'faceIllumination', 'videoArtifactGrid'
];

const funcNames = {
    colorTemporalShift: 'analyzeColorTemporalShift', frameDropDetection: 'analyzeFrameDropDetection',
    blinkRateAnalysis: 'analyzeBlinkRateAnalysis', videoNoiseConsistency: 'analyzeVideoNoiseConsistency',
    skinTextureRealism: 'analyzeSkinTextureRealism', hairDetailAnalysis: 'analyzeHairDetailAnalysis',
    eyeReflectionConsistency: 'analyzeEyeReflectionConsistency', jawlineConsistency: 'analyzeJawlineConsistency',
    earSymmetryAnalysis: 'analyzeEarSymmetryAnalysis', expressionNaturalness: 'analyzeExpressionNaturalness',
    pupilDilation: 'analyzePupilDilation', facialWrinkle: 'analyzeFacialWrinkle',
    noseGeometry: 'analyzeNoseGeometry', foreheadTexture: 'analyzeForeheadTexture',
    teethConsistency: 'analyzeTeethConsistency', eyebrowNaturalness: 'analyzeEyebrowNaturalness',
    neckTransition: 'analyzeNeckTransition', shoulderAlignment: 'analyzeShoulderAlignment',
    clothingFold: 'analyzeClothingFold', fingerGeometry: 'analyzeFingerGeometry',
    backgroundPerspective: 'analyzeBackgroundPerspective', reflectionPhysics: 'analyzeReflectionPhysics',
    shadowTemporal: 'analyzeShadowTemporal', watermarkDetection: 'analyzeWatermarkDetection',
    motionVectorAnalysis: 'analyzeMotionVectorAnalysis', headPoseEstimation: 'analyzeHeadPoseEstimation',
    microExpressionAnalysis: 'analyzeMicroExpressionAnalysis', faceAlignment: 'analyzeFaceAlignment',
    depthConsistency: 'analyzeDepthConsistency', bokehNaturalness: 'analyzeBokehNaturalness',
    lensDistortionVideo: 'analyzeLensDistortionVideo', stabilizationArtifact: 'analyzeStabilizationArtifact',
    edgeRinging: 'analyzeEdgeRinging', chromaBleed: 'analyzeChromaBleed',
    pixelRepetitionVideo: 'analyzePixelRepetitionVideo', videoHashAnalysis: 'analyzeVideoHashAnalysis',
    faceBoundaryBlend: 'analyzeFaceBoundaryBlend', colorQuantization: 'analyzeColorQuantizationVideo',
    spatialFreqTemporal: 'analyzeSpatialFreqTemporal', videoBlockiness: 'analyzeVideoBlockiness',
    temporalNoise: 'analyzeTemporalNoise', frameEnergy: 'analyzeFrameEnergy',
    videoSharpness: 'analyzeVideoSharpness', objectBoundary: 'analyzeObjectBoundary',
    textureFlowAnalysis: 'analyzeTextureFlowAnalysis', videoGrainAnalysis: 'analyzeVideoGrainAnalysis',
    contrastTemporal: 'analyzeContrastTemporal', videoSaturation: 'analyzeVideoSaturation',
    faceIllumination: 'analyzeFaceIllumination', videoArtifactGrid: 'analyzeVideoArtifactGrid',
};

const newTextExports = [
    'adverbFrequency', 'contractionUsage', 'sentenceOpener', 'emotionalTone',
    'metaphorDensity', 'questionFrequency', 'paragraphStructure', 'transitionQuality',
    'idiomDetection', 'abstractConcrete', 'firstPersonUsage', 'technicalJargon',
    'redundancyDetection', 'wordLengthDist', 'hapaxLegomena', 'conjunctionDensity',
    'prepositionPattern', 'modalVerbFrequency', 'subordinateClause', 'argumentStructure',
    'textFormality', 'negationPattern', 'comparativeStructure', 'quantifierUsage',
    'referentialDensity', 'logicalConnector', 'topicShiftAnalysis', 'informationDensity',
    'sentimentVariance', 'lexicalChainRepetition', 'genreConformity', 'conclusionPattern',
    'vocabComplexity', 'sentenceConnectivity', 'textCoherence'
];

const textFuncNames = {
    adverbFrequency: 'analyzeAdverbFrequency', contractionUsage: 'analyzeContractionUsage',
    sentenceOpener: 'analyzeSentenceOpener', emotionalTone: 'analyzeEmotionalTone',
    metaphorDensity: 'analyzeMetaphorDensity', questionFrequency: 'analyzeQuestionFrequency',
    paragraphStructure: 'analyzeParagraphStructure', transitionQuality: 'analyzeTransitionQuality',
    idiomDetection: 'analyzeIdiomDetection', abstractConcrete: 'analyzeAbstractConcrete',
    firstPersonUsage: 'analyzeFirstPersonUsage', technicalJargon: 'analyzeTechnicalJargon',
    redundancyDetection: 'analyzeRedundancyDetection', wordLengthDist: 'analyzeWordLengthDist',
    hapaxLegomena: 'analyzeHapaxLegomena', conjunctionDensity: 'analyzeConjunctionDensity',
    prepositionPattern: 'analyzePrepositionPattern', modalVerbFrequency: 'analyzeModalVerbFrequency',
    subordinateClause: 'analyzeSubordinateClause', argumentStructure: 'analyzeArgumentStructure',
    textFormality: 'analyzeTextFormality', negationPattern: 'analyzeNegationPattern',
    comparativeStructure: 'analyzeComparativeStructure', quantifierUsage: 'analyzeQuantifierUsage',
    referentialDensity: 'analyzeReferentialDensity', logicalConnector: 'analyzeLogicalConnector',
    topicShiftAnalysis: 'analyzeTopicShiftAnalysis', informationDensity: 'analyzeInformationDensity',
    sentimentVariance: 'analyzeSentimentVariance', lexicalChainRepetition: 'analyzeLexicalChainRepetition',
    genreConformity: 'analyzeGenreConformity', conclusionPattern: 'analyzeConclusionPattern',
    vocabComplexity: 'analyzeVocabComplexity', sentenceConnectivity: 'analyzeSentenceConnectivity',
    textCoherence: 'analyzeTextCoherence',
};

// Build new video export lines
let videoExportLines = '\n// Video Analysis Methods v2 (50 new methods)\n';
for (const fn of newVideoExports) {
    videoExportLines += `export { ${funcNames[fn]} } from "./video/${fn}";\n`;
}

// Build new text export lines
let textExportLines = '\n// Text Analysis Methods v3 (35 new methods)\n';
for (const fn of newTextExports) {
    textExportLines += `export { ${textFuncNames[fn]} } from "./text/${fn}";\n`;
}

indexContent = indexContent.trimEnd() + '\n' + videoExportLines + textExportLines;
fs.writeFileSync(indexPath, indexContent);
console.log('Updated index.ts');

console.log('Done updating index.ts');
console.log('Video exports added:', newVideoExports.length);
console.log('Text exports added:', newTextExports.length);
