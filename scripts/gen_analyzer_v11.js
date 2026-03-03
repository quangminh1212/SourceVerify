const fs = require('fs'), p = require('path');
const aPath = p.join(__dirname, '..', 'src', 'lib', 'analyzer.ts');
let a = fs.readFileSync(aPath, 'utf8');

// 1. Add imports before "} from "./methods";"
const newImports = `    // Image Analysis v11 (20)
    analyzeMoirePattern, analyzeVignetteNatural, analyzeDepthMapConsistency,
    analyzeTexturePeriodicity, analyzeNoiseFloorLevel, analyzeAntiAliasingConsistency,
    analyzeColorChannelNoise, analyzeSpectralDecayRate, analyzePatchSimilarityMatrix,
    analyzeJpegCoefficientDist, analyzeEdgeDensityMap, analyzeChannelIndependence,
    analyzeImageComplexity, analyzeMicroTextureAnalysis, analyzeColorMomentStatistics,
    analyzeApertureDiffraction, analyzeChromaSubsampling, analyzeLensDistortionImage,
    analyzeHotPixelDetection, analyzeToneMappingDetect,
    // Video Analysis v4 (20)
    analyzeBreathingPattern, analyzeBloodFlowRPPG, analyzeTongueConsistency,
    analyzeAccessoryConsistency, analyzeAudioSpectral, analyzeAudioNoiseFloor,
    analyzePhonemeCorrelation, analyzeGaitAnalysis, analyzeBodyMovementFluidity,
    analyzeEyeContactConsistency, analyzeFacialBoundaryFreq, analyzeHairStrandConsistency,
    analyzeFaceWarpingArtifact, analyzeTemporalColorHistogram, analyzeVideoFrameRateConsistency,
    analyzeSceneGeometryConsistency, analyzeAudioVisualDelay, analyzeFacialMusclePhysics,
    analyzeSpectralFlicker, analyzeVideoResolutionMap,
    // Text Analysis v4 (20)
    analyzeTypoErrorPattern, analyzeCulturalReference, analyzePersonalExperience,
    analyzeFillerWordUsage, analyzeSentenceFragmentUsage, analyzeExclamationPattern,
    analyzeParentheticalUsage, analyzeListEnumerationPattern, analyzeVocabularyGrowthRate,
    analyzeWordSpecificityIndex, analyzeRhetoricalDevice, analyzeColloquialExpression,
    analyzeSentenceRhythm, analyzeTopicDepthAnalysis, analyzeNarrativeStructure,
    analyzeDialoguePattern, analyzeEvidenceCitation, analyzeEmotionalArc,
    analyzeAmbiguityTolerance, analyzeAnaphoraResolution,`;

a = a.replace('} from "./methods";', newImports + '\n} from "./methods";');

// 2. Add image method calls - before the filter in analyzeImageFile
const imgCalls = `        // Image Analysis v11 (20)
        analyzeMoirePattern(pixels, w, h),
        analyzeVignetteNatural(pixels, w, h),
        analyzeDepthMapConsistency(pixels, w, h),
        analyzeTexturePeriodicity(pixels, w, h),
        analyzeNoiseFloorLevel(pixels, w, h),
        analyzeAntiAliasingConsistency(pixels, w, h),
        analyzeColorChannelNoise(pixels, w, h),
        analyzeSpectralDecayRate(pixels, w, h),
        analyzePatchSimilarityMatrix(pixels, w, h),
        analyzeJpegCoefficientDist(pixels, w, h),
        analyzeEdgeDensityMap(pixels, w, h),
        analyzeChannelIndependence(pixels, w, h),
        analyzeImageComplexity(pixels, w, h),
        analyzeMicroTextureAnalysis(pixels, w, h),
        analyzeColorMomentStatistics(pixels, w, h),
        analyzeApertureDiffraction(pixels, w, h),
        analyzeChromaSubsampling(pixels, w, h),
        analyzeLensDistortionImage(pixels, w, h),
        analyzeHotPixelDetection(pixels, w, h),
        analyzeToneMappingDetect(pixels, w, h),`;

// Insert image calls before "    ];" in analyzeImageFile
// Find the first "];" after "analyzeSoftwareFingerprint(metadata, exifData)," in image section
a = a.replace(
    'analyzeSoftwareFingerprint(metadata, exifData),\n    ];\n\n    // Filter methods based on enabled set',
    'analyzeSoftwareFingerprint(metadata, exifData),\n' + imgCalls + '\n    ];\n\n    // Filter methods based on enabled set'
);

// 3. Add video method calls
const vidCalls = `                    // Video Analysis v4 (20)
                    analyzeBreathingPattern(pixels, w, h),
                    analyzeBloodFlowRPPG(pixels, w, h),
                    analyzeTongueConsistency(pixels, w, h),
                    analyzeAccessoryConsistency(pixels, w, h),
                    analyzeAudioSpectral(pixels, w, h),
                    analyzeAudioNoiseFloor(pixels, w, h),
                    analyzePhonemeCorrelation(pixels, w, h),
                    analyzeGaitAnalysis(pixels, w, h),
                    analyzeBodyMovementFluidity(pixels, w, h),
                    analyzeEyeContactConsistency(pixels, w, h),
                    analyzeFacialBoundaryFreq(pixels, w, h),
                    analyzeHairStrandConsistency(pixels, w, h),
                    analyzeFaceWarpingArtifact(pixels, w, h),
                    analyzeTemporalColorHistogram(pixels, w, h),
                    analyzeVideoFrameRateConsistency(pixels, w, h),
                    analyzeSceneGeometryConsistency(pixels, w, h),
                    analyzeAudioVisualDelay(pixels, w, h),
                    analyzeFacialMusclePhysics(pixels, w, h),
                    analyzeSpectralFlicker(pixels, w, h),
                    analyzeVideoResolutionMap(pixels, w, h),`;

// Insert after "analyzeSoftwareFingerprint(metadata, exifData)," in video section (second occurrence)
// Find the video section's closing
a = a.replace(
    'analyzeSoftwareFingerprint(metadata, exifData),\n                ];\n\n                const methods = allMethods.filter',
    'analyzeSoftwareFingerprint(metadata, exifData),\n' + vidCalls + '\n                ];\n\n                const methods = allMethods.filter'
);

// 4. Add text method calls
const txtCalls = `        // Text Analysis v4 (20)
        analyzeTypoErrorPattern(text),
        analyzeCulturalReference(text),
        analyzePersonalExperience(text),
        analyzeFillerWordUsage(text),
        analyzeSentenceFragmentUsage(text),
        analyzeExclamationPattern(text),
        analyzeParentheticalUsage(text),
        analyzeListEnumerationPattern(text),
        analyzeVocabularyGrowthRate(text),
        analyzeWordSpecificityIndex(text),
        analyzeRhetoricalDevice(text),
        analyzeColloquialExpression(text),
        analyzeSentenceRhythm(text),
        analyzeTopicDepthAnalysis(text),
        analyzeNarrativeStructure(text),
        analyzeDialoguePattern(text),
        analyzeEvidenceCitation(text),
        analyzeEmotionalArc(text),
        analyzeAmbiguityTolerance(text),
        analyzeAnaphoraResolution(text),`;

a = a.replace(
    'analyzeTextCoherence(text),\n    ];\n\n    const methods = allMethods.filter(s => {\n        const ids = TEXT_NAMEKEY_TO_IDS',
    'analyzeTextCoherence(text),\n' + txtCalls + '\n    ];\n\n    const methods = allMethods.filter(s => {\n        const ids = TEXT_NAMEKEY_TO_IDS'
);

// 5. Add METHOD_MAP entries for image
const imgMap = `    // Image v11 (20)
    moire_pattern: "signal.moirePattern",
    vignette_analysis: "signal.vignetteAnalysis",
    depth_map_consistency: "signal.depthMapConsistency",
    texture_periodicity: "signal.texturePeriodicity",
    noise_floor_level: "signal.noiseFloorLevel",
    anti_aliasing: "signal.antiAliasingConsistency",
    color_channel_noise: "signal.colorChannelNoise",
    spectral_decay: "signal.spectralDecayRate",
    patch_similarity: "signal.patchSimilarityMatrix",
    jpeg_coefficient: "signal.jpegCoefficientDist",
    edge_density: "signal.edgeDensityMap",
    channel_independence: "signal.channelIndependence",
    image_complexity: "signal.imageComplexity",
    micro_texture: "signal.microTexture",
    color_moments: "signal.colorMoments",
    aperture_diffraction: "signal.apertureDiffraction",
    chroma_subsampling: "signal.chromaSubsampling",
    lens_distortion_img: "signal.lensDistortionImage",
    hot_pixel: "signal.hotPixelDetection",
    tone_mapping: "signal.toneMapping",`;

a = a.replace(
    'software_fingerprint: "signal.softwareFingerprint",\n};',
    'software_fingerprint: "signal.softwareFingerprint",\n' + imgMap + '\n};'
);

// 6. Add VIDEO_METHOD_MAP entries
const vidMap = `    // Video v4 (20)
    breathing_pattern: "signal.breathingPattern",
    blood_flow_rppg: "signal.bloodFlowRPPG",
    tongue_consistency: "signal.tongueConsistency",
    accessory_consistency: "signal.accessoryConsistency",
    audio_spectral: "signal.audioSpectral",
    audio_noise_floor: "signal.audioNoiseFloor",
    phoneme_correlation: "signal.phonemeCorrelation",
    gait_analysis: "signal.gaitAnalysis",
    body_movement_fluidity: "signal.bodyMovementFluidity",
    eye_contact_consistency: "signal.eyeContactConsistency",
    facial_boundary_freq: "signal.facialBoundaryFreq",
    hair_strand_consistency: "signal.hairStrandConsistency",
    face_warping_artifact: "signal.faceWarpingArtifact",
    temporal_color_histogram: "signal.temporalColorHistogram",
    video_frame_rate: "signal.videoFrameRateConsistency",
    scene_geometry: "signal.sceneGeometryConsistency",
    audio_visual_delay: "signal.audioVisualDelay",
    facial_muscle_physics: "signal.facialMusclePhysics",
    spectral_flicker_v: "signal.spectralFlicker",
    video_resolution_map: "signal.videoResolutionMap",`;

a = a.replace(
    'video_artifact_grid: "signal.videoArtifactGrid",\n};',
    'video_artifact_grid: "signal.videoArtifactGrid",\n' + vidMap + '\n};'
);

// 7. Add TEXT_METHOD_MAP entries
const txtMap = `    // Text v4 (20)
    typo_error_pattern: "signal.typoErrorPattern",
    cultural_reference: "signal.culturalReference",
    personal_experience: "signal.personalExperience",
    filler_word_usage: "signal.fillerWordUsage",
    sentence_fragment: "signal.sentenceFragment",
    exclamation_pattern: "signal.exclamationPattern",
    parenthetical_usage: "signal.parentheticalUsage",
    list_enumeration: "signal.listEnumeration",
    vocab_growth_rate: "signal.vocabGrowthRate",
    word_specificity: "signal.wordSpecificity",
    rhetorical_device: "signal.rhetoricalDevice",
    colloquial_expression: "signal.colloquialExpression",
    sentence_rhythm: "signal.sentenceRhythm",
    topic_depth: "signal.topicDepth",
    narrative_structure: "signal.narrativeStructure",
    dialogue_pattern: "signal.dialoguePattern",
    evidence_citation: "signal.evidenceCitation",
    emotional_arc: "signal.emotionalArc",
    ambiguity_tolerance: "signal.ambiguityTolerance",
    anaphora_resolution: "signal.anaphoraResolution",`;

a = a.replace(
    'text_coherence: "signal.textCoherence",\n};',
    'text_coherence: "signal.textCoherence",\n' + txtMap + '\n};'
);

fs.writeFileSync(aPath, a);
console.log('Updated analyzer.ts with 60 new methods!');
