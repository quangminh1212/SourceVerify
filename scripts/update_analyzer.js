const fs = require('fs');
const path = require('path');

const analyzerPath = path.join(__dirname, '..', 'src', 'lib', 'analyzer.ts');
let content = fs.readFileSync(analyzerPath, 'utf8');

// ===== 1. Add new video imports (existing 16 + 50 new) =====
const existingVideoImports = [
    'analyzeTemporalConsistency', 'analyzeAudioVisualSync', 'analyzeFrameInterpolation',
    'analyzeLipSyncAnalysis', 'analyzeOpticalFlowAnomaly', 'analyzeDeepfakeArtifact',
    'analyzeSceneTransition', 'analyzeMotionBlurConsistency', 'analyzeBackgroundStability',
    'analyzeGazeDirection', 'analyzeFacialReenactment', 'analyzeVideoCompressionTrace',
    'analyzeFlickerAnalysis', 'analyzeHandGestureConsistency', 'analyzeBodyProportion',
];

const newVideoImports = [
    'analyzeColorTemporalShift', 'analyzeFrameDropDetection', 'analyzeBlinkRateAnalysis',
    'analyzeVideoNoiseConsistency', 'analyzeSkinTextureRealism', 'analyzeHairDetailAnalysis',
    'analyzeEyeReflectionConsistency', 'analyzeJawlineConsistency', 'analyzeEarSymmetryAnalysis',
    'analyzeExpressionNaturalness', 'analyzePupilDilation', 'analyzeFacialWrinkle',
    'analyzeNoseGeometry', 'analyzeForeheadTexture', 'analyzeTeethConsistency',
    'analyzeEyebrowNaturalness', 'analyzeNeckTransition', 'analyzeShoulderAlignment',
    'analyzeClothingFold', 'analyzeFingerGeometry', 'analyzeBackgroundPerspective',
    'analyzeReflectionPhysics', 'analyzeShadowTemporal', 'analyzeWatermarkDetection',
    'analyzeMotionVectorAnalysis', 'analyzeHeadPoseEstimation', 'analyzeMicroExpressionAnalysis',
    'analyzeFaceAlignment', 'analyzeDepthConsistency', 'analyzeBokehNaturalness',
    'analyzeLensDistortionVideo', 'analyzeStabilizationArtifact', 'analyzeEdgeRinging',
    'analyzeChromaBleed', 'analyzePixelRepetitionVideo', 'analyzeVideoHashAnalysis',
    'analyzeFaceBoundaryBlend', 'analyzeColorQuantizationVideo', 'analyzeSpatialFreqTemporal',
    'analyzeVideoBlockiness', 'analyzeTemporalNoise', 'analyzeFrameEnergy',
    'analyzeVideoSharpness', 'analyzeObjectBoundary', 'analyzeTextureFlowAnalysis',
    'analyzeVideoGrainAnalysis', 'analyzeContrastTemporal', 'analyzeVideoSaturation',
    'analyzeFaceIllumination', 'analyzeVideoArtifactGrid',
];

const newTextImports = [
    'analyzeAdverbFrequency', 'analyzeContractionUsage', 'analyzeSentenceOpener',
    'analyzeEmotionalTone', 'analyzeMetaphorDensity', 'analyzeQuestionFrequency',
    'analyzeParagraphStructure', 'analyzeTransitionQuality', 'analyzeIdiomDetection',
    'analyzeAbstractConcrete', 'analyzeFirstPersonUsage', 'analyzeTechnicalJargon',
    'analyzeRedundancyDetection', 'analyzeWordLengthDist', 'analyzeHapaxLegomena',
    'analyzeConjunctionDensity', 'analyzePrepositionPattern', 'analyzeModalVerbFrequency',
    'analyzeSubordinateClause', 'analyzeArgumentStructure', 'analyzeTextFormality',
    'analyzeNegationPattern', 'analyzeComparativeStructure', 'analyzeQuantifierUsage',
    'analyzeReferentialDensity', 'analyzeLogicalConnector', 'analyzeTopicShiftAnalysis',
    'analyzeInformationDensity', 'analyzeSentimentVariance', 'analyzeLexicalChainRepetition',
    'analyzeGenreConformity', 'analyzeConclusionPattern', 'analyzeVocabComplexity',
    'analyzeSentenceConnectivity', 'analyzeTextCoherence',
];

// Add imports after existing analyzeTemporalExpression import
const importInsertPoint = 'analyzeTemporalExpression,\n} from "./methods";';
const allNewImports = [
    '    // Video Analysis Methods (existing 15 + 50 new)',
    ...existingVideoImports.map(i => `    ${i},`),
    ...newVideoImports.map(i => `    ${i},`),
    '    // Text Analysis Methods v3 (35 new)',
    ...newTextImports.map(i => `    ${i},`),
].join('\n');

content = content.replace(
    importInsertPoint,
    `analyzeTemporalExpression,\n${allNewImports}\n} from "./methods";`
);

// ===== 2. Add VIDEO_METHOD_MAP =====
const videoMethodMapEntries = [
    // existing 16
    `    face_landmark_v: "signal.faceLandmarkConsistency",`,
    `    temporal_consistency: "signal.temporalConsistency",`,
    `    audio_visual_sync: "signal.audioVisualSync",`,
    `    frame_interpolation: "signal.frameInterpolation",`,
    `    lip_sync: "signal.lipSyncAnalysis",`,
    `    optical_flow: "signal.opticalFlowAnomaly",`,
    `    deepfake_artifact: "signal.deepfakeArtifact",`,
    `    scene_transition: "signal.sceneTransition",`,
    `    motion_blur: "signal.motionBlurConsistency",`,
    `    background_stability: "signal.backgroundStability",`,
    `    gaze_direction: "signal.gazeDirection",`,
    `    facial_reenactment: "signal.facialReenactment",`,
    `    video_compression: "signal.videoCompressionTrace",`,
    `    flicker: "signal.flickerAnalysis",`,
    `    hand_gesture: "signal.handGestureConsistency",`,
    `    body_proportion: "signal.bodyProportion",`,
];

const newVideoMethodMap = [
    ['color_temporal_shift', 'signal.colorTemporalShift'], ['frame_drop', 'signal.frameDropDetection'],
    ['blink_rate', 'signal.blinkRateAnalysis'], ['video_noise', 'signal.videoNoiseConsistency'],
    ['skin_texture', 'signal.skinTextureRealism'], ['hair_detail', 'signal.hairDetailAnalysis'],
    ['eye_reflection', 'signal.eyeReflectionConsistency'], ['jawline', 'signal.jawlineConsistency'],
    ['ear_symmetry', 'signal.earSymmetryAnalysis'], ['expression', 'signal.expressionNaturalness'],
    ['pupil_dilation', 'signal.pupilDilation'], ['facial_wrinkle', 'signal.facialWrinkle'],
    ['nose_geometry', 'signal.noseGeometry'], ['forehead_texture', 'signal.foreheadTexture'],
    ['teeth', 'signal.teethConsistency'], ['eyebrow', 'signal.eyebrowNaturalness'],
    ['neck_transition', 'signal.neckTransition'], ['shoulder', 'signal.shoulderAlignment'],
    ['clothing_fold', 'signal.clothingFold'], ['finger_geometry', 'signal.fingerGeometry'],
    ['bg_perspective', 'signal.backgroundPerspective'], ['reflection_physics', 'signal.reflectionPhysics'],
    ['shadow_temporal', 'signal.shadowTemporal'], ['watermark', 'signal.watermarkDetection'],
    ['motion_vector', 'signal.motionVectorAnalysis'], ['head_pose', 'signal.headPoseEstimation'],
    ['micro_expression', 'signal.microExpressionAnalysis'], ['face_alignment_v', 'signal.faceAlignment'],
    ['depth_consistency', 'signal.depthConsistency'], ['bokeh', 'signal.bokehNaturalness'],
    ['lens_distortion_v', 'signal.lensDistortionVideo'], ['stabilization', 'signal.stabilizationArtifact'],
    ['edge_ringing', 'signal.edgeRinging'], ['chroma_bleed', 'signal.chromaBleed'],
    ['pixel_repetition_v', 'signal.pixelRepetitionVideo'], ['video_hash', 'signal.videoHashAnalysis'],
    ['face_boundary_blend', 'signal.faceBoundaryBlend'], ['color_quant_v', 'signal.colorQuantizationVideo'],
    ['spatial_freq_temporal', 'signal.spatialFreqTemporal'], ['video_blockiness', 'signal.videoBlockiness'],
    ['temporal_noise', 'signal.temporalNoise'], ['frame_energy', 'signal.frameEnergy'],
    ['video_sharpness', 'signal.videoSharpness'], ['object_boundary', 'signal.objectBoundary'],
    ['texture_flow', 'signal.textureFlowAnalysis'], ['video_grain', 'signal.videoGrainAnalysis'],
    ['contrast_temporal', 'signal.contrastTemporal'], ['video_saturation', 'signal.videoSaturation'],
    ['face_illumination', 'signal.faceIllumination'], ['video_artifact_grid', 'signal.videoArtifactGrid'],
].map(([k, v]) => `    ${k}: "${v}",`);

const videoMapStr = `\n/** Video method ID → nameKey mapping */\nexport const VIDEO_METHOD_MAP: Record<string, string> = {\n${videoMethodMapEntries.join('\n')}\n${newVideoMethodMap.join('\n')}\n};\n\nexport const ALL_VIDEO_METHOD_IDS = Object.keys(VIDEO_METHOD_MAP);\n`;

// Insert VIDEO_METHOD_MAP after TEXT_METHOD_MAP
content = content.replace(
    'export const ALL_TEXT_METHOD_IDS = Object.keys(TEXT_METHOD_MAP);',
    `export const ALL_TEXT_METHOD_IDS = Object.keys(TEXT_METHOD_MAP);\n${videoMapStr}`
);

// Add reverse map for video
content = content.replace(
    'const TEXT_NAMEKEY_TO_IDS: Map<string, string[]> = new Map();',
    `const VIDEO_NAMEKEY_TO_IDS: Map<string, string[]> = new Map();\nfor (const [id, nameKey] of Object.entries(VIDEO_METHOD_MAP)) {\n    const arr = VIDEO_NAMEKEY_TO_IDS.get(nameKey);\n    if (arr) arr.push(id);\n    else VIDEO_NAMEKEY_TO_IDS.set(nameKey, [id]);\n}\n\nconst TEXT_NAMEKEY_TO_IDS: Map<string, string[]> = new Map();`
);

// ===== 3. Add new text method map entries =====
const newTextMethodMapEntries = [
    ['adverb_frequency', 'signal.adverbFrequency'], ['contraction_usage', 'signal.contractionUsage'],
    ['sentence_opener', 'signal.sentenceOpener'], ['emotional_tone', 'signal.emotionalTone'],
    ['metaphor_density', 'signal.metaphorDensity'], ['question_frequency', 'signal.questionFrequency'],
    ['paragraph_structure', 'signal.paragraphStructure'], ['transition_quality', 'signal.transitionQuality'],
    ['idiom_detection', 'signal.idiomDetection'], ['abstract_concrete', 'signal.abstractConcrete'],
    ['first_person_usage', 'signal.firstPersonUsage'], ['technical_jargon', 'signal.technicalJargon'],
    ['redundancy_detection', 'signal.redundancyDetection'], ['word_length_dist', 'signal.wordLengthDist'],
    ['hapax_legomena', 'signal.hapaxLegomena'], ['conjunction_density', 'signal.conjunctionDensity'],
    ['preposition_pattern', 'signal.prepositionPattern'], ['modal_verb_frequency', 'signal.modalVerbFrequency'],
    ['subordinate_clause', 'signal.subordinateClause'], ['argument_structure', 'signal.argumentStructure'],
    ['text_formality', 'signal.textFormality'], ['negation_pattern', 'signal.negationPattern'],
    ['comparative_structure', 'signal.comparativeStructure'], ['quantifier_usage', 'signal.quantifierUsage'],
    ['referential_density', 'signal.referentialDensity'], ['logical_connector', 'signal.logicalConnector'],
    ['topic_shift_analysis', 'signal.topicShiftAnalysis'], ['information_density', 'signal.informationDensity'],
    ['sentiment_variance', 'signal.sentimentVariance'], ['lexical_chain_repetition', 'signal.lexicalChainRepetition'],
    ['genre_conformity', 'signal.genreConformity'], ['conclusion_pattern', 'signal.conclusionPattern'],
    ['vocab_complexity', 'signal.vocabComplexity'], ['sentence_connectivity', 'signal.sentenceConnectivity'],
    ['text_coherence', 'signal.textCoherence'],
].map(([k, v]) => `    ${k}: "${v}",`).join('\n');

content = content.replace(
    '    temporal_expression: "signal.temporalExpression",\n};',
    `    temporal_expression: "signal.temporalExpression",\n${newTextMethodMapEntries}\n};`
);

// ===== 4. Add video methods to analyzeVideoFile =====
const videoMethodCalls = [
    '                    // Video-specific methods (existing 16)',
    '                    analyzeTemporalConsistency(pixels, w, h),',
    '                    analyzeAudioVisualSync(pixels, w, h),',
    '                    analyzeFrameInterpolation(pixels, w, h),',
    '                    analyzeLipSyncAnalysis(pixels, w, h),',
    '                    analyzeOpticalFlowAnomaly(pixels, w, h),',
    '                    analyzeDeepfakeArtifact(pixels, w, h),',
    '                    analyzeSceneTransition(pixels, w, h),',
    '                    analyzeMotionBlurConsistency(pixels, w, h),',
    '                    analyzeBackgroundStability(pixels, w, h),',
    '                    analyzeGazeDirection(pixels, w, h),',
    '                    analyzeFacialReenactment(pixels, w, h),',
    '                    analyzeVideoCompressionTrace(pixels, w, h),',
    '                    analyzeFlickerAnalysis(pixels, w, h),',
    '                    analyzeHandGestureConsistency(pixels, w, h),',
    '                    analyzeBodyProportion(pixels, w, h),',
    '                    // Video-specific methods v2 (50 new)',
    ...newVideoImports.map(fn => `                    ${fn}(pixels, w, h),`),
].join('\n');

// Insert before the closing of allMethods in analyzeVideoFile
// Find the metadata methods at end of video analysis and add before them
content = content.replace(
    '                    // Metadata Analysis v10 (10)\n                    analyzeExifIntegrity(metadata, exifData),\n                    analyzeXmpProvenance(metadata, exifData),\n                    analyzeIptcVerification(metadata, exifData),\n                    analyzeGpsConsistency(metadata, exifData),\n                    analyzeTimestampForensics(metadata, exifData),\n                    analyzeFileStructure(metadata, exifData),\n                    analyzeColorProfileMeta(metadata, exifData),\n                    analyzeC2paVerification(metadata, exifData),\n                    analyzeResolutionConsistency(metadata, exifData),\n                    analyzeSoftwareFingerprint(metadata, exifData),\n                ];\n\n                const methods = allMethods.filter(s => {\n                    if (s.nameKey === "signal.videoProperties") return true;',
    `${videoMethodCalls}\n                    // Metadata Analysis v10 (10)\n                    analyzeExifIntegrity(metadata, exifData),\n                    analyzeXmpProvenance(metadata, exifData),\n                    analyzeIptcVerification(metadata, exifData),\n                    analyzeGpsConsistency(metadata, exifData),\n                    analyzeTimestampForensics(metadata, exifData),\n                    analyzeFileStructure(metadata, exifData),\n                    analyzeColorProfileMeta(metadata, exifData),\n                    analyzeC2paVerification(metadata, exifData),\n                    analyzeResolutionConsistency(metadata, exifData),\n                    analyzeSoftwareFingerprint(metadata, exifData),\n                ];\n\n                const methods = allMethods.filter(s => {\n                    if (s.nameKey === "signal.videoProperties") return true;\n                    // Check video-specific methods\n                    const vids = VIDEO_NAMEKEY_TO_IDS.get(s.nameKey);\n                    if (vids) return true;`
);

// ===== 5. Add new text methods to analyzeText =====
const textMethodCalls = newTextImports.map(fn => `        ${fn}(text),`).join('\n');

content = content.replace(
    '        analyzeTemporalExpression(text),\n    ];',
    `        analyzeTemporalExpression(text),\n        // Text Analysis Methods v3 (35 new)\n${textMethodCalls}\n    ];`
);

// ===== 6. Update video method filtering to use VIDEO_METHOD_MAP =====
content = content.replace(
    '    const enabled = new Set(enabledMethods || ALL_METHOD_IDS);\n\n    const allMethods: AnalysisMethod[] = [\n        // Original 13 (without CFA for video)',
    '    const enabled = new Set(enabledMethods || [...ALL_METHOD_IDS, ...ALL_VIDEO_METHOD_IDS]);\n\n    const allMethods: AnalysisMethod[] = [\n        // Original 13 (without CFA for video)'
);

// Update FREE_TEXT_METHOD_IDS to include a couple more free text methods
// (keep existing)

fs.writeFileSync(analyzerPath, content);
console.log('Updated analyzer.ts');
