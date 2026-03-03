const fs = require('fs'), p = require('path');

// === 1. UPDATE index.ts ===
const idxPath = p.join(__dirname, '..', 'src', 'lib', 'methods', 'index.ts');
let idx = fs.readFileSync(idxPath, 'utf8');

const imgExports = `
// Image Analysis Methods v11 (20 new methods)
export { analyzeMoirePattern } from "./image/moirePattern";
export { analyzeVignetteNatural } from "./image/vignetteAnalysis";
export { analyzeDepthMapConsistency } from "./image/depthMapConsistency";
export { analyzeTexturePeriodicity } from "./image/texturePeriodicity";
export { analyzeNoiseFloorLevel } from "./image/noiseFloorLevel";
export { analyzeAntiAliasingConsistency } from "./image/antiAliasingConsistency";
export { analyzeColorChannelNoise } from "./image/colorChannelNoise";
export { analyzeSpectralDecayRate } from "./image/spectralDecayRate";
export { analyzePatchSimilarityMatrix } from "./image/patchSimilarityMatrix";
export { analyzeJpegCoefficientDist } from "./image/jpegCoefficientDist";
export { analyzeEdgeDensityMap } from "./image/edgeDensityMap";
export { analyzeChannelIndependence } from "./image/channelIndependence";
export { analyzeImageComplexity } from "./image/imageComplexity";
export { analyzeMicroTextureAnalysis } from "./image/microTextureAnalysis";
export { analyzeColorMomentStatistics } from "./image/colorMomentStatistics";
export { analyzeApertureDiffraction } from "./image/apertureDiffraction";
export { analyzeChromaSubsampling } from "./image/chromaSubsampling";
export { analyzeLensDistortionImage } from "./image/lensDistortionImage";
export { analyzeHotPixelDetection } from "./image/hotPixelDetection";
export { analyzeToneMappingDetect } from "./image/toneMapping";
`;

const vidExports = `
// Video Analysis Methods v4 (20 new methods)
export { analyzeBreathingPattern } from "./video/breathingPattern";
export { analyzeBloodFlowRPPG } from "./video/bloodFlowRPPG";
export { analyzeTongueConsistency } from "./video/tongueConsistency";
export { analyzeAccessoryConsistency } from "./video/accessoryConsistency";
export { analyzeAudioSpectral } from "./video/audioSpectral";
export { analyzeAudioNoiseFloor } from "./video/audioNoiseFloor";
export { analyzePhonemeCorrelation } from "./video/phonemeCorrelation";
export { analyzeGaitAnalysis } from "./video/gaitAnalysis";
export { analyzeBodyMovementFluidity } from "./video/bodyMovementFluidity";
export { analyzeEyeContactConsistency } from "./video/eyeContactConsistency";
export { analyzeFacialBoundaryFreq } from "./video/facialBoundaryFreq";
export { analyzeHairStrandConsistency } from "./video/hairStrandConsistency";
export { analyzeFaceWarpingArtifact } from "./video/faceWarpingArtifact";
export { analyzeTemporalColorHistogram } from "./video/temporalColorHistogram";
export { analyzeVideoFrameRateConsistency } from "./video/videoFrameRateConsistency";
export { analyzeSceneGeometryConsistency } from "./video/sceneGeometryConsistency";
export { analyzeAudioVisualDelay } from "./video/audioVisualDelay";
export { analyzeFacialMusclePhysics } from "./video/facialMusclePhysics";
export { analyzeSpectralFlicker } from "./video/spectralFlicker";
export { analyzeVideoResolutionMap } from "./video/videoResolutionMap";
`;

const txtExports = `
// Text Analysis Methods v4 (20 new methods)
export { analyzeTypoErrorPattern } from "./text/typoErrorPattern";
export { analyzeCulturalReference } from "./text/culturalReference";
export { analyzePersonalExperience } from "./text/personalExperience";
export { analyzeFillerWordUsage } from "./text/fillerWordUsage";
export { analyzeSentenceFragmentUsage } from "./text/sentenceFragmentUsage";
export { analyzeExclamationPattern } from "./text/exclamationPattern";
export { analyzeParentheticalUsage } from "./text/parentheticalUsage";
export { analyzeListEnumerationPattern } from "./text/listEnumerationPattern";
export { analyzeVocabularyGrowthRate } from "./text/vocabularyGrowthRate";
export { analyzeWordSpecificityIndex } from "./text/wordSpecificityIndex";
export { analyzeRhetoricalDevice } from "./text/rhetoricalDevice";
export { analyzeColloquialExpression } from "./text/colloquialExpression";
export { analyzeSentenceRhythm } from "./text/sentenceRhythm";
export { analyzeTopicDepthAnalysis } from "./text/topicDepthAnalysis";
export { analyzeNarrativeStructure } from "./text/narrativeStructure";
export { analyzeDialoguePattern } from "./text/dialoguePattern";
export { analyzeEvidenceCitation } from "./text/evidenceCitation";
export { analyzeEmotionalArc } from "./text/emotionalArc";
export { analyzeAmbiguityTolerance } from "./text/ambiguityTolerance";
export { analyzeAnaphoraResolution } from "./text/anaphoraResolution";
`;

idx = idx.trimEnd() + '\n' + imgExports + vidExports + txtExports;
fs.writeFileSync(idxPath, idx);
console.log('Updated index.ts');

// === 2. UPDATE data.ts ===
const dataPath = p.join(__dirname, '..', 'src', 'app', 'methods', 'data.ts');
let data = fs.readFileSync(dataPath, 'utf8');

const newDataEntries = `    // Image Analysis Methods v11 (20 new)
    { id: "moire_pattern", category: "sensor" as Category, mediaType: "image" as MediaType, weight: 0.03, year: 2020 },
    { id: "vignette_analysis", category: "sensor" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2018 },
    { id: "depth_map_consistency", category: "pixel" as Category, mediaType: "image" as MediaType, weight: 0.03, year: 2021 },
    { id: "texture_periodicity", category: "pixel" as Category, mediaType: "image" as MediaType, weight: 0.03, year: 2021 },
    { id: "noise_floor_level", category: "sensor" as Category, mediaType: "image" as MediaType, weight: 0.03, year: 2019 },
    { id: "anti_aliasing", category: "pixel" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2020 },
    { id: "color_channel_noise", category: "sensor" as Category, mediaType: "image" as MediaType, weight: 0.03, year: 2019 },
    { id: "spectral_decay", category: "frequency" as Category, mediaType: "image" as MediaType, weight: 0.03, year: 2020 },
    { id: "patch_similarity", category: "pixel" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2021 },
    { id: "jpeg_coefficient", category: "frequency" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2014 },
    { id: "edge_density", category: "pixel" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2019 },
    { id: "channel_independence", category: "statistical" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2018 },
    { id: "image_complexity", category: "statistical" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2020 },
    { id: "micro_texture", category: "pixel" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2022 },
    { id: "color_moments", category: "statistical" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2017 },
    { id: "aperture_diffraction", category: "sensor" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2019 },
    { id: "chroma_subsampling", category: "frequency" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2016 },
    { id: "lens_distortion_img", category: "sensor" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2018 },
    { id: "hot_pixel", category: "sensor" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2017 },
    { id: "tone_mapping", category: "statistical" as Category, mediaType: "image" as MediaType, weight: 0.02, year: 2019 },
    // Video Analysis Methods v4 (20 new)
    { id: "breathing_pattern", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.03, year: 2021 },
    { id: "blood_flow_rppg", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.04, year: 2020 },
    { id: "tongue_consistency", category: "pixel" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2022 },
    { id: "accessory_consistency", category: "pixel" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2021 },
    { id: "audio_spectral", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2020 },
    { id: "audio_noise_floor", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2019 },
    { id: "phoneme_correlation", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.03, year: 2021 },
    { id: "gait_analysis", category: "pixel" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2020 },
    { id: "body_movement_fluidity", category: "pixel" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2021 },
    { id: "eye_contact_consistency", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.03, year: 2021 },
    { id: "facial_boundary_freq", category: "frequency" as Category, mediaType: "video" as MediaType, weight: 0.03, year: 2020 },
    { id: "hair_strand_consistency", category: "pixel" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2022 },
    { id: "face_warping_artifact", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.03, year: 2020 },
    { id: "temporal_color_histogram", category: "statistical" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2019 },
    { id: "video_frame_rate", category: "frequency" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2019 },
    { id: "scene_geometry", category: "pixel" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2020 },
    { id: "audio_visual_delay", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.03, year: 2021 },
    { id: "facial_muscle_physics", category: "sensor" as Category, mediaType: "video" as MediaType, weight: 0.03, year: 2022 },
    { id: "spectral_flicker_v", category: "frequency" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2020 },
    { id: "video_resolution_map", category: "pixel" as Category, mediaType: "video" as MediaType, weight: 0.02, year: 2021 },
    // Text Analysis Methods v4 (20 new)
    { id: "typo_error_pattern", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "cultural_reference", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "personal_experience", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "filler_word_usage", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "sentence_fragment", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "exclamation_pattern", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "parenthetical_usage", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "list_enumeration", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "vocab_growth_rate", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "word_specificity", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2021 },
    { id: "rhetorical_device", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2020 },
    { id: "colloquial_expression", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "sentence_rhythm", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "topic_depth", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2021 },
    { id: "narrative_structure", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2020 },
    { id: "dialogue_pattern", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2020 },
    { id: "evidence_citation", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "emotional_arc", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2021 },
    { id: "ambiguity_tolerance", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },
    { id: "anaphora_resolution", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2020 },
`;

data = data.replace('];', '    ' + newDataEntries + '];');
fs.writeFileSync(dataPath, data);
console.log('Updated data.ts');
console.log('DONE - All registration files updated!');
