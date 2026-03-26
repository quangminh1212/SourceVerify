/**
 * SourceVerify AI Detection Engine v9
 * Main orchestrator — imports and coordinates all 87 analysis methods
 *
 * Terminology: "method" = phương pháp phân tích (analysis method)
 * Each method analyzes a specific aspect of the image and returns a result with a score.
 */

export type { AnalysisResult, AnalysisMethod, FileMetadata } from "./types";

export { formatFileSize } from "./utils";

import type { AnalysisResult, AnalysisMethod, FileMetadata } from "./types";
import {
    DEFAULT_VIDEO_METHOD_IDS,
    PAPER_FAITHFUL_IMAGE_METHOD_IDS,
    PAPER_FAITHFUL_TEXT_METHOD_IDS,
} from "./types";
import { loadImage, extractBasicMetadata, validateFileMagicBytes, createConsistentContext } from "./utils";
import {
    // Original 13 methods
    analyzeMetadata,
    analyzeSpectralNyquist,
    analyzeMultiscaleReconstruction,
    analyzeNoiseResidual,
    analyzeEdgeCoherence,
    analyzeGradientMicroTexture,
    analyzeBenfordsLaw,
    analyzeChromaticAberration,
    analyzeTextureConsistency,
    analyzeCFAPattern,
    analyzeVideoSpecific,
    analyzeDCTBlockArtifacts,
    analyzeColorChannelCorrelation,
    analyzePRNUPattern,
    // New: Spatial Domain (6)
    analyzeLocalBinaryPattern,
    analyzeHOGAnomaly,
    analyzeGLCM,
    analyzeLocalVarianceMap,
    analyzeMorphologicalGradient,
    analyzeWeberDescriptor,
    // New: Frequency Domain (6)
    analyzeWaveletStatistics,
    analyzeGaborResponse,
    analyzePowerSpectralDensity,
    analyzePhaseCongruency,
    analyzeRadialSpectrum,
    analyzeFrequencyBandRatio,
    // New: Statistical (6)
    analyzeEntropyMap,
    analyzeHigherOrderStatistics,
    analyzeZipfLaw,
    analyzeChiSquareUniformity,
    analyzeMarkovTransition,
    analyzeSaturationDistribution,
    // New: Compression (4)
    analyzeJPEGGhost,
    analyzeQuantizationFingerprint,
    analyzeErrorLevel,
    analyzeColorBanding,
    // New: Generative (3)
    analyzeGANFingerprint,
    analyzeUpsamplingArtifact,
    analyzeDiffusionArtifact,
    // New: Geometric (3)
    analyzePerspectiveConsistency,
    analyzeLightingConsistency,
    analyzeShadowConsistency,
    // New: Advanced Color (2)
    analyzeColorGamut,
    analyzeWhiteBalance,
    // New: Advanced Forensic (4) — v7
    analyzeCopyMoveForensics,
    analyzeDoubleJPEG,
    analyzeAutocorrelation,
    analyzePixelCooccurrence,
    // New: Perceptual Texture (4) — v7
    analyzeTamuraTexture,
    analyzeLocalPhaseQuantization,
    analyzeFractalDimension,
    analyzeBilateralSymmetry,
    // New: Histogram & Info Theory (5) — v7
    analyzeHistogramDistribution,
    analyzeHistogramGradient,
    analyzeColorCoherence,
    analyzeMutualInformation,
    analyzeLaplacianEdge,
    // New: Forensic Methods v8 (20)
    analyzeMedianFilter,
    analyzeResampling,
    analyzeContrastEnhancement,
    analyzeBrisque,
    analyzeDemosaicing,
    analyzeSteganalysis,
    analyzeThumbnailConsistency,
    analyzePerceptualHash,
    analyzeIlluminantMap,
    analyzeRadonTransform,
    analyzeZernikeMoments,
    analyzeCameraModel,
    analyzeImagePhylogeny,
    analyzeBlockingArtifact,
    analyzeEfficientnetFeatures,
    analyzeAttentionConsistency,
    analyzeStyleTransfer,
    analyzeColorTemperature,
    analyzeSiftForensics,
    analyzeNeuralCompression,
    // New: Extended Forensic Methods v9 (12)
    analyzeSplicingDetection,
    analyzeNoiseprintExtraction,
    analyzeUpscalingDetection,
    analyzeFaceLandmarkConsistency,
    analyzeReflectionConsistency,
    analyzePatchForensics,
    analyzeClipDetection,
    analyzeFourierRing,
    analyzeResnetClassifier,
    analyzeVitDetection,
    analyzeGramMatrix,
    analyzeSRMFilter,
    // Metadata Analysis v10 (10)
    analyzeExifIntegrity,
    analyzeXmpProvenance,
    analyzeIptcVerification,
    analyzeGpsConsistency,
    analyzeTimestampForensics,
    analyzeFileStructure,
    analyzeColorProfileMeta,
    analyzeC2paVerification,
    analyzeResolutionConsistency,
    analyzeSoftwareFingerprint,
    // Text Analysis Methods (30)
    analyzePerplexityAnalysis,
    analyzeBurstinessDetection,
    analyzeVocabularyDiversity,
    analyzeStylometricAnalysis,
    analyzeNgramFrequency,
    analyzeRepetitionPattern,
    analyzeCoherenceAnalysis,
    analyzeEntropyDistribution,
    analyzeSentenceLengthVariance,
    analyzeReadabilityScore,
    analyzePunctuationPattern,
    analyzeTopicConsistency,
    analyzeWordFrequencyRank,
    analyzeSemanticDensity,
    analyzeWritingRhythm,
    analyzePosTagAnalysis,
    analyzeDiscourseMarkers,
    analyzeCoreferenceChain,
    analyzeNamedEntityConsistency,
    analyzeHedgingLanguage,
    analyzeTypeTokenRatio,
    analyzeSyntacticComplexity,
    analyzePassiveVoiceFrequency,
    analyzeLexicalSophistication,
    analyzeTextCompressionRatio,
    analyzeFunctionWordDistribution,
    analyzePronounUsagePattern,
    analyzeClauseDepthAnalysis,
    analyzeCollocationStrength,
    analyzeTemporalExpression,
    // Video Analysis Methods (existing 15 + 50 new)
    analyzeTemporalConsistency,
    analyzeAudioVisualSync,
    analyzeFrameInterpolation,
    analyzeLipSyncAnalysis,
    analyzeOpticalFlowAnomaly,
    analyzeDeepfakeArtifact,
    analyzeSceneTransition,
    analyzeMotionBlurConsistency,
    analyzeBackgroundStability,
    analyzeGazeDirection,
    analyzeFacialReenactment,
    analyzeVideoCompressionTrace,
    analyzeFlickerAnalysis,
    analyzeHandGestureConsistency,
    analyzeBodyProportion,
    analyzeColorTemporalShift,
    analyzeFrameDropDetection,
    analyzeBlinkRateAnalysis,
    analyzeVideoNoiseConsistency,
    analyzeSkinTextureRealism,
    analyzeHairDetailAnalysis,
    analyzeEyeReflectionConsistency,
    analyzeJawlineConsistency,
    analyzeEarSymmetryAnalysis,
    analyzeExpressionNaturalness,
    analyzePupilDilation,
    analyzeFacialWrinkle,
    analyzeNoseGeometry,
    analyzeForeheadTexture,
    analyzeTeethConsistency,
    analyzeEyebrowNaturalness,
    analyzeNeckTransition,
    analyzeShoulderAlignment,
    analyzeClothingFold,
    analyzeFingerGeometry,
    analyzeBackgroundPerspective,
    analyzeReflectionPhysics,
    analyzeShadowTemporal,
    analyzeWatermarkDetection,
    analyzeMotionVectorAnalysis,
    analyzeHeadPoseEstimation,
    analyzeMicroExpressionAnalysis,
    analyzeFaceAlignment,
    analyzeDepthConsistency,
    analyzeBokehNaturalness,
    analyzeLensDistortionVideo,
    analyzeStabilizationArtifact,
    analyzeEdgeRinging,
    analyzeChromaBleed,
    analyzePixelRepetitionVideo,
    analyzeVideoHashAnalysis,
    analyzeFaceBoundaryBlend,
    analyzeColorQuantizationVideo,
    analyzeSpatialFreqTemporal,
    analyzeVideoBlockiness,
    analyzeTemporalNoise,
    analyzeFrameEnergy,
    analyzeVideoSharpness,
    analyzeObjectBoundary,
    analyzeTextureFlowAnalysis,
    analyzeVideoGrainAnalysis,
    analyzeContrastTemporal,
    analyzeVideoSaturation,
    analyzeFaceIllumination,
    analyzeVideoArtifactGrid,
    // Text Analysis Methods v3 (35 new)
    analyzeAdverbFrequency,
    analyzeContractionUsage,
    analyzeSentenceOpener,
    analyzeEmotionalTone,
    analyzeMetaphorDensity,
    analyzeQuestionFrequency,
    analyzeParagraphStructure,
    analyzeTransitionQuality,
    analyzeIdiomDetection,
    analyzeAbstractConcrete,
    analyzeFirstPersonUsage,
    analyzeTechnicalJargon,
    analyzeRedundancyDetection,
    analyzeWordLengthDist,
    analyzeHapaxLegomena,
    analyzeConjunctionDensity,
    analyzePrepositionPattern,
    analyzeModalVerbFrequency,
    analyzeSubordinateClause,
    analyzeArgumentStructure,
    analyzeTextFormality,
    analyzeNegationPattern,
    analyzeComparativeStructure,
    analyzeQuantifierUsage,
    analyzeReferentialDensity,
    analyzeLogicalConnector,
    analyzeTopicShiftAnalysis,
    analyzeInformationDensity,
    analyzeSentimentVariance,
    analyzeLexicalChainRepetition,
    analyzeGenreConformity,
    analyzeConclusionPattern,
    analyzeVocabComplexity,
    analyzeSentenceConnectivity,
    analyzeTextCoherence,
    // Image Analysis v11 (20)
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
    analyzeAmbiguityTolerance, analyzeAnaphoraResolution,
    // Image v12
    analyzeSkinTextureFreq, analyzeBloomArtifact, analyzeGammaDistortion, analyzeLinearPatternDetect, analyzeDynamicRangeAnalysis, analyzeIntensityKurtosis, analyzeCrossGradient, analyzePixelSymmetry, analyzeLocalEntropy, analyzeLumaGradientAngle, analyzeRGBCorrelation, analyzeIsolatedPixel, analyzeSpatialCoherence, analyzeContourSmooth, analyzeColorEntropy, analyzeBrightnessGradient, analyzeNoiseGranularity, analyzeHueConsistency, analyzePixelBitPlane, analyzeContrastMapImg, analyzeFlatRegionRatio, analyzePosterizationDetect, analyzeMeanShiftCluster, analyzeGradientMagnitudeHist,
    // Video v5
    analyzeSkinColorDrift, analyzeFacialSymmetryVideo, analyzeLipTextureDetail, analyzeForeheadWrinkle, analyzeIrisDetail, analyzeNoseShadow, analyzeChinJawDetail, analyzeBackgroundComplexity, analyzeColorBleeding, analyzeFaceMaskEdge, analyzeMotionBlurDir, analyzeVideoGlobalIllum, analyzePixelJitter, analyzeFrameEdgeEnergy, analyzeFacialPoreTexture, analyzeTemporalGradient, analyzeVideoSaturationMap, analyzeNeckSkinConsistency, analyzeVideoLumaRange, analyzeCheekTexture, analyzeVideoColorBalance, analyzeEdgeAntiAliasingVideo, analyzeTemporalCoherenceMap, analyzeVideoFreqSpectrum,
    // Text v5
    analyzeAcronymUsage,
    analyzeQuestionMarkDensity,
    analyzeSentenceStartVariety,
    analyzeVerbTenseConsistency,
    analyzeCommaFrequency,
    analyzeSemicolonUsage,
    analyzeSuperlativeUsage,
    analyzeContractionDetect,
    analyzeAverageWordLength,
    analyzeEmphasisPattern,
    analyzeDefiniteArticle,
    analyzeNumberUsage,
    analyzeQualifierDensity,
    analyzePassiveActiveMix,
    analyzeQuotationUsage,
    analyzeAnalogySimile,
    analyzeConjunctionPair,
    analyzeAbstractnessIndex,
    analyzeInstructionalTone,
    analyzeTransitionSmooth,
    analyzeDefinitionPattern,
    analyzeConditionalUsage,
    analyzeRepetitivePhrase,
    analyzeConclusionIndicator,
    // v13
    analyzeRichardsonLucy, analyzeWienerResidual, analyzeSecondOrderGrad, analyzeDctEnergyCompact, analyzeSpatialRichModel, analyzeMidFreqEnergy, analyzeLaplacianVariance, analyzeSobelMagnitude, analyzeCannyDensity, analyzeCoocEntropy, analyzeBoxFilterResidual, analyzeMaximalGradFlow, analyzeDifferenceHistogram, analyzeSubBandDev, analyzeGradOrientHist, analyzeKirschEdge, analyzeLawsTextureE, analyzeGaborEnergy, analyzeScharrGradient, analyzeStructuralComplexity,
    analyzeFaceXray, analyzeFaceBlendBound, analyzeColorHistShift, analyzeFaceSkinSmoothV, analyzeSpecularHighlight, analyzeContourContinuity, analyzeSkinMicroMotion, analyzeBGFreqMap, analyzeInterFrameBlend, analyzeEdgeSharpnessVar, analyzeNostrilDarkness, analyzeEarDetailConsistency, analyzeClothingEdgeBlend, analyzeTemporalJitter, analyzeSkinPoreSimulation,
    analyzeZipfDeviation,
    analyzeTokenPredictability,
    analyzeLogLikelihoodRank,
    analyzeEntropyPerWord,
    analyzeCurieDetect,
    analyzeVocabularyRichness,
    analyzeMeanDepParse,
    analyzeWordRarityScore,
    analyzeClauseBalance,
    analyzeTextRepetitionMicro,
    analyzeTextDNAWatermark,
    analyzeIntrinsicDimension,
    analyzeSentenceEntropy,
    analyzeLexicalDensity,
    analyzeTextBurstiness2,
    // AUTO_ADDED_IMPORTS
    analyzeCensusTransform, analyzeContourletAnalysis, analyzeConvolutionalTrace, analyzeCurveletTransform, analyzeDiscreteCosineEnergy, analyzeGaborPhase, analyzeGaborWaveletBank, analyzeGradientDivergence, analyzeGradientWeightedCam, analyzeHarrisCorner, analyzeHessianMatrix, analyzeLaplacianPyramid, analyzeLogGaborFilter, analyzeMomentInvariants, analyzeMultiscaleEntropy, analyzeNiqeScore, analyzePixelValueDiff, analyzeRunLengthMatrix, analyzeShearletAnalysis, analyzeSparseRepresentation, analyzeSsimMap, analyzeSteerablePyramid, analyzeSvdDecomposition, analyzeTotalVariation, analyzeWaveletPacket, analyzeArgumentDensity, analyzeBinocularsDetect, analyzeCausalReasoning, analyzeCohMetrixIndex, analyzeContextualEmbeddingVar, analyzeCrossEntropyVariance, analyzeDiscourseRelationDepth, analyzeDnaGptUniqueness, analyzeEntityGrounding, analyzeFastDetectgpt, analyzeGhostbusterDetect, analyzeInformationTheoreticProfile, analyzeLikelihoodDivergence, analyzeLocalCoherenceModel, analyzeMaxSoftmaxProb, analyzePhdDetection, analyzePragmaticAdequacy, analyzeRadarDetect, analyzeRankProbability, analyzeRegisterVariation, analyzeSemanticCoherenceGraph, analyzeSyntacticTreeDepth, analyzeTextFingerprint, analyzeTopicModelDivergence, analyzeVocabularyAge, analyzeAudioFormant, analyzeBackgroundObjectPhysics, analyzeBframeConsistency, analyzeClothingConsistency, analyzeEarConsistency, analyzeFace3dReconstruction, analyzeFacialActionTiming, analyzeFacialAgingConsistency, analyzeFacsAnalysis, analyzeGazeVergence, analyzeHairDynamics, analyzeHandFingerCount, analyzeHeadNodShake, analyzeHeadPoseV2, analyzeHeartbeatDetection, analyzeIdentitySwitch, analyzeInterFrameForgery, analyzeIntraPrediction, analyzeLipReadingScore, analyzeMicroExpressionV2, analyzeMicroTremor, analyzeMotionEstimationRes, analyzePhonemeVisemeMap, analyzePupilDynamics, analyzePupillaryUnrest, analyzeQpAnalysis, analyzeReflectionConsistencyVideo, analyzeSaccadeAnalysis, analyzeSceneCutAnomaly, analyzeShadowConsistencyVideo, analyzeSkinSpecularReflection, analyzeSkinTextureTemporal, analyzeSpeechCadence, analyzeTemporalFaceEmbedding, analyzeTemporalFrequencyAnomaly, analyzeVideoCodecAnalysis, analyzeVideoDenoisingTrace, analyzeVideoNoisePattern, analyzeVideoSpectralCoherence, analyzeVoiceF0Analysis,
} from "./methods";

// ============================
// MAIN ENTRY
// ============================

export async function analyzeMedia(file: File, enabledMethods?: string[], customWeights?: Record<string, number>): Promise<AnalysisResult> {
    const start = performance.now();

    // Security: validate file magic bytes match claimed MIME type
    const isValid = await validateFileMagicBytes(file);
    if (!isValid) {
        throw new Error("File content does not match declared type");
    }

    const isVideo = file.type.startsWith("video/");

    let methods: AnalysisMethod[];
    let metadata: FileMetadata;

    if (isVideo) {
        const result = await analyzeVideoFile(file, enabledMethods);
        methods = result.methods;
        metadata = result.metadata;
    } else {
        const result = await analyzeImageFile(file, enabledMethods);
        methods = result.methods;
        metadata = result.metadata;
    }

    // Apply custom weights if provided (percentage scale: 100 = full, 0 = ignore)
    if (customWeights && Object.keys(customWeights).length > 0) {
        for (const method of methods) {
            for (const [id, nameKey] of Object.entries(METHOD_MAP)) {
                if (method.nameKey === nameKey && customWeights[id] !== undefined) {
                    method.weight = method.weight * (customWeights[id] / 100);
                }
            }
        }
    }

    // Calculate weighted AI score with advanced verdict engine
    const { aiScore, verdict, confidence } = calculateVerdict(methods);

    return { verdict, confidence, aiScore, methods, signals: methods, metadata, processingTimeMs: Math.round(performance.now() - start) };
}

// ============================
// SCORING ENGINE v4
// ============================

function calculateVerdict(methods: AnalysisMethod[]): { aiScore: number; verdict: "ai" | "real" | "uncertain"; confidence: number } {
    // Step 1: Weighted average as baseline
    let totalWeight = 0;
    let weightedSum = 0;
    for (const method of methods) {
        totalWeight += method.weight;
        weightedSum += method.score * method.weight;
    }
    let aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);

    // Step 2: Count method agreement (v4 thresholds, proven better recall)
    let aiLeaningWeight = 0;
    let realLeaningWeight = 0;
    let strongAI = 0;
    let strongReal = 0;
    let veryStrongAI = 0;
    let veryStrongReal = 0;

    for (const method of methods) {
        if (method.score > 50) aiLeaningWeight += method.weight;
        if (method.score < 50) realLeaningWeight += method.weight;
        if (method.score >= 65) strongAI++;
        if (method.score <= 35) strongReal++;
        if (method.score >= 78) veryStrongAI++;
        if (method.score <= 22) veryStrongReal++;
    }

    // Step 3: Consensus amplification (v4 power, proven with benchmark)
    let adjustment = 0;

    if (veryStrongAI >= 3) adjustment += 14;
    else if (strongAI >= 5) adjustment += 12;
    else if (strongAI >= 3) adjustment += 8;
    else if (strongAI >= 2) adjustment += 5;
    else if (strongAI >= 1) adjustment += 2;

    if (veryStrongReal >= 3) adjustment -= 14;
    else if (strongReal >= 5) adjustment -= 12;
    else if (strongReal >= 3) adjustment -= 8;
    else if (strongReal >= 2) adjustment -= 5;
    else if (strongReal >= 1) adjustment -= 2;

    // Weighted majority vote (v4 strength)
    const weightRatio = totalWeight > 0
        ? (aiLeaningWeight - realLeaningWeight) / totalWeight
        : 0;
    adjustment += Math.round(weightRatio * 14);

    // Step 4: Directional amplification (v4 strength)
    const deviation = aiScore - 50;
    if (Math.abs(deviation) > 1) {
        const linear = deviation * 1.1;
        const quadratic = Math.sign(deviation) * (deviation * deviation) * 0.025;
        adjustment += Math.round(linear + quadratic);
    }

    // Step 5: Metadata definitive override
    const metadataMethod = methods.find(s => s.nameKey === "signal.metadataAnalysis");
    if (metadataMethod) {
        if (metadataMethod.score >= 90) adjustment += 25;
        else if (metadataMethod.score <= 15) adjustment -= 25;
    }

    // Step 5b: Anti-FP guard (v5: stronger)
    let heavyRealCount = 0;
    let heavyAICount = 0;
    for (const method of methods) {
        if (method.weight >= 3.0) {
            if (method.score < 40) heavyRealCount++;
            if (method.score > 60) heavyAICount++;
        }
    }
    if (heavyRealCount >= 2 && heavyAICount === 0 && aiScore + adjustment > 50) {
        adjustment -= 5;
    }

    aiScore = Math.round(Math.max(3, Math.min(97, aiScore + adjustment)));

    // Step 6: Verdict (v5.1: threshold 55/40 — best balance from benchmark)
    let verdict: "ai" | "real" | "uncertain";
    let confidence: number;

    if (aiScore >= 55) {
        verdict = "ai";
        confidence = Math.min(100, Math.round(50 + (aiScore - 55) * 1.1));
    } else if (aiScore <= 40) {
        verdict = "real";
        confidence = Math.min(100, Math.round(50 + (40 - aiScore) * 1.3));
    } else {
        verdict = "uncertain";
        confidence = Math.round(100 - Math.abs(aiScore - 47) * 6);
    }

    return { aiScore, verdict, confidence };

}

// ============================
// IMAGE ANALYSIS (88 methods)
// ============================

// Method ID → nameKey mapping
export const METHOD_MAP: Record<string, string> = {
    // Original 13
    metadata: "signal.metadataAnalysis",
    spectral: "signal.spectralNyquist",
    reconstruction: "signal.multiScaleReconstruction",
    noise: "signal.noiseResidual",
    edge: "signal.edgeCoherence",
    gradient: "signal.gradientSmoothness",
    benford: "signal.benfordsLaw",
    chromatic: "signal.chromaticAberration",
    texture: "signal.textureConsistency",
    cfa: "signal.cfaPattern",
    dct: "signal.dctBlock",
    color: "signal.colorCorrelation",
    prnu: "signal.prnuPattern",
    // Spatial Domain (6)
    lbp: "signal.localBinaryPattern",
    hog: "signal.hogAnomaly",
    glcm: "signal.glcmTexture",
    localVariance: "signal.localVarianceMap",
    morphGradient: "signal.morphGradient",
    weber: "signal.weberDescriptor",
    // Frequency Domain (6)
    wavelet: "signal.waveletStats",
    gabor: "signal.gaborResponse",
    psd: "signal.psdSlope",
    phase: "signal.phaseCongruency",
    radial: "signal.radialSpectrum",
    freqBand: "signal.freqBandRatio",
    // Statistical (6)
    entropy: "signal.entropyMap",
    hos: "signal.higherOrderStats",
    zipf: "signal.zipfLaw",
    chiSquare: "signal.chiSquareUniformity",
    markov: "signal.markovTransition",
    saturation: "signal.saturationDist",
    // Compression (4)
    jpegGhost: "signal.jpegGhost",
    quantization: "signal.quantFingerprint",
    ela: "signal.errorLevel",
    banding: "signal.colorBanding",
    // Generative (3)
    ganFingerprint: "signal.ganFingerprint",
    upsampling: "signal.upsamplingArtifact",
    diffusion: "signal.diffusionArtifact",
    // Geometric (3)
    perspective: "signal.perspectiveConsistency",
    lighting: "signal.lightingConsistency",
    shadow: "signal.shadowConsistency",
    // Advanced Color (2)
    gamut: "signal.colorGamut",
    whiteBalance: "signal.whiteBalance",
    // Advanced Forensic (4) — v7
    copyMove: "signal.copyMove",
    doubleJpeg: "signal.doubleJpeg",
    autocorrelation: "signal.autocorrelation",
    pixelCooccurrence: "signal.pixelCooccurrence",
    // Perceptual Texture (4) — v7
    tamura: "signal.tamuraTexture",
    lpq: "signal.lpq",
    fractal: "signal.fractalDimension",
    bilateralSymmetry: "signal.bilateralSymmetry",
    // Histogram & Info Theory (5) — v7
    histogram: "signal.histogram",
    histogramGradient: "signal.histogramGradient",
    colorCoherence: "signal.colorCoherence",
    mutualInfo: "signal.mutualInfo",
    laplacianEdge: "signal.laplacianEdge",
    // Forensic Methods v8 (20)
    medianFilter: "signal.medianFilter",
    resampling: "signal.resampling",
    contrastEnhancement: "signal.contrastEnhancement",
    brisque: "signal.brisque",
    demosaicing: "signal.demosaicing",
    steganalysis: "signal.steganalysis",
    thumbnailAnalysis: "signal.thumbnailAnalysis",
    perceptualHash: "signal.perceptualHash",
    illuminantMap: "signal.illuminantMap",
    radonTransform: "signal.radonTransform",
    zernikeMoments: "signal.zernikeMoments",
    cameraModel: "signal.cameraModel",
    imagePhylogeny: "signal.imagePhylogeny",
    blockingArtifact: "signal.blockingArtifact",
    efficientnetDetection: "signal.efficientnetDetection",
    attentionConsistency: "signal.attentionConsistency",
    styleTransfer: "signal.styleTransfer",
    colorTemperature: "signal.colorTemperature",
    siftForensics: "signal.siftForensics",
    neuralCompression: "signal.neuralCompression",
    // Extended Forensic Methods v9 (12)
    splicing: "signal.splicingDetection",
    noiseprint: "signal.noiseprintExtraction",
    upscaling: "signal.upscalingDetection",
    face_landmark: "signal.faceLandmarkConsistency",
    reflection: "signal.reflectionConsistency",
    patchforensics: "signal.patchForensics",
    clip_detection: "signal.clipDetection",
    fourier_ring: "signal.fourierRing",
    resnet_classifier: "signal.resnetClassifier",
    vit_detection: "signal.vitDetection",
    gram_matrix: "signal.gramMatrix",
    srm_filter: "signal.srmFilter",
    // Alias mappings for data.ts IDs → existing methods
    copymove: "signal.copyMove",
    jpeg_ghost: "signal.jpegGhost",
    chi_square: "signal.chiSquareUniformity",
    frequency_band: "signal.freqBandRatio",
    double_jpeg: "signal.doubleJpeg",
    tamura_texture: "signal.tamuraTexture",
    lpq_analysis: "signal.lpq",
    fractal_dimension: "signal.fractalDimension",
    bilateral_symmetry: "signal.bilateralSymmetry",
    histogram_gradient: "signal.histogramGradient",
    color_coherence: "signal.colorCoherence",
    mutual_information: "signal.mutualInfo",
    laplacian_edge: "signal.laplacianEdge",
    copy_move_forensics: "signal.copyMove",
    double_jpeg_detection: "signal.doubleJpeg",
    pixel_cooccurrence: "signal.pixelCooccurrence",
    median_filter: "signal.medianFilter",
    contrast_enhancement: "signal.contrastEnhancement",
    thumbnail_analysis: "signal.thumbnailAnalysis",
    perceptual_hash: "signal.perceptualHash",
    illuminant_map: "signal.illuminantMap",
    radon_transform: "signal.radonTransform",
    zernike_moments: "signal.zernikeMoments",
    camera_model: "signal.cameraModel",
    image_phylogeny: "signal.imagePhylogeny",
    blocking_artifact: "signal.blockingArtifact",
    efficientnet_detection: "signal.efficientnetDetection",
    attention_consistency: "signal.attentionConsistency",
    style_transfer: "signal.styleTransfer",
    color_temperature: "signal.colorTemperature",
    sift_forensics: "signal.siftForensics",
    neural_compression: "signal.neuralCompression",
    gan_fingerprint: "signal.ganFingerprint",
    // New UI method IDs → existing lib nameKeys
    local_binary_pattern: "signal.localBinaryPattern",
    hog_anomaly: "signal.hogAnomaly",
    local_variance_map: "signal.localVarianceMap",
    morphological_gradient: "signal.morphGradient",
    weber_descriptor: "signal.weberDescriptor",
    gabor_response: "signal.gaborResponse",
    power_spectral_density: "signal.psdSlope",
    phase_congruency: "signal.phaseCongruency",
    radial_spectrum: "signal.radialSpectrum",
    higher_order_statistics: "signal.higherOrderStats",
    zipf_law: "signal.zipfLaw",
    markov_transition: "signal.markovTransition",
    saturation_distribution: "signal.saturationDist",
    quantization_fingerprint: "signal.quantFingerprint",
    color_banding: "signal.colorBanding",
    upsampling_artifact: "signal.upsamplingArtifact",
    color_gamut: "signal.colorGamut",
    white_balance: "signal.whiteBalance",
    // Metadata Analysis v10 (10)
    exif_integrity: "signal.exifIntegrity",
    xmp_provenance: "signal.xmpProvenance",
    iptc_verification: "signal.iptcVerification",
    gps_consistency: "signal.gpsConsistency",
    timestamp_forensics: "signal.timestampForensics",
    file_structure: "signal.fileStructure",
    color_profile_meta: "signal.colorProfileMeta",
    c2pa_verification: "signal.c2paVerification",
    resolution_consistency: "signal.resolutionConsistency",
    software_fingerprint: "signal.softwareFingerprint",
    // Image v11 (20)
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
    tone_mapping: "signal.toneMapping",
    // Image v12
    skin_texture_freq: "signal.skinTextureFreq",
    bloom_artifact: "signal.bloomArtifact",
    gamma_distortion: "signal.gammaDistortion",
    linear_pattern: "signal.linearPattern",
    dynamic_range: "signal.dynamicRange",
    intensity_kurtosis: "signal.intensityKurtosis",
    cross_gradient: "signal.crossGradient",
    pixel_symmetry: "signal.pixelSymmetry",
    local_entropy: "signal.localEntropy",
    luma_gradient_angle: "signal.lumaGradientAngle",
    rgb_correlation: "signal.rgbCorrelation",
    isolated_pixel: "signal.isolatedPixel",
    spatial_coherence: "signal.spatialCoherence",
    contour_smooth: "signal.contourSmooth",
    color_entropy: "signal.colorEntropy",
    brightness_gradient: "signal.brightnessGradient",
    noise_granularity: "signal.noiseGranularity",
    hue_consistency: "signal.hueConsistency",
    pixel_bit_plane: "signal.pixelBitPlane",
    contrast_map: "signal.contrastMap",
    flat_region_ratio: "signal.flatRegionRatio",
    posterization: "signal.posterization",
    mean_shift_cluster: "signal.meanShiftCluster",
    gradient_magnitude: "signal.gradientMagHist",
    // Image v13
    richardson_lucy: "signal.richardsonLucy",
    wiener_residual: "signal.wienerResidual",
    second_order_grad: "signal.secondOrderGrad",
    dct_energy_compact: "signal.dctEnergyCompact",
    spatial_rich_model: "signal.spatialRichModel",
    mid_freq_energy: "signal.midFreqEnergy",
    laplacian_variance: "signal.laplacianVar",
    sobel_magnitude: "signal.sobelMagDist",
    canny_density: "signal.cannyDensity",
    cooc_entropy: "signal.coocEntropy",
    box_filter_residual: "signal.boxFilterResid",
    maximal_grad_flow: "signal.maxGradFlow",
    difference_histogram: "signal.diffHistogram",
    sub_band_dev: "signal.subBandDev",
    grad_orient_hist: "signal.gradOrientHist",
    kirsch_edge: "signal.kirschEdge",
    laws_texture_e: "signal.lawsTextureE",
    gabor_energy: "signal.gaborEnergy",
    scharr_gradient: "signal.scharrGrad",
    structural_complexity: "signal.structComplexity",
    // AUTO_ADDED_MAPS
    censusTransform: "signal.censusTransform",
    contourletAnalysis: "signal.contourletAnalysis",
    convolutionalTrace: "signal.convolutionalTrace",
    curveletTransform: "signal.curveletTransform",
    discreteCosineEnergy: "signal.discreteCosineEnergy",
    gaborPhase: "signal.gaborPhase",
    gaborWaveletBank: "signal.gaborWaveletBank",
    gradientDivergence: "signal.gradientDivergence",
    gradientWeightedCam: "signal.gradientWeightedCam",
    harrisCorner: "signal.harrisCorner",
    hessianMatrix: "signal.hessianMatrix",
    laplacianPyramid: "signal.laplacianPyramid",
    logGaborFilter: "signal.logGaborFilter",
    momentInvariants: "signal.momentInvariants",
    multiscaleEntropy: "signal.multiscaleEntropy",
    niqeScore: "signal.niqeScore",
    pixelValueDiff: "signal.pixelValueDiff",
    runLengthMatrix: "signal.runLengthMatrix",
    shearletAnalysis: "signal.shearletAnalysis",
    sparseRepresentation: "signal.sparseRepresentation",
    ssimMap: "signal.ssimMap",
    steerablePyramid: "signal.steerablePyramid",
    svdDecomposition: "signal.svdDecomposition",
    totalVariation: "signal.totalVariation",
    waveletPacket: "signal.waveletPacket",
    audioFormant: "signal.audioFormant",
    backgroundObjectPhysics: "signal.backgroundObjectPhysics",
    bframeConsistency: "signal.bframeConsistency",
    clothingConsistency: "signal.clothingConsistency",
    earConsistency: "signal.earConsistency",
    face3dReconstruction: "signal.face3dReconstruction",
    facialActionTiming: "signal.facialActionTiming",
    facialAgingConsistency: "signal.facialAgingConsistency",
    facsAnalysis: "signal.facsAnalysis",
    gazeVergence: "signal.gazeVergence",
    hairDynamics: "signal.hairDynamics",
    handFingerCount: "signal.handFingerCount",
    headNodShake: "signal.headNodShake",
    headPoseV2: "signal.headPoseV2",
    heartbeatDetection: "signal.heartbeatDetection",
    identitySwitch: "signal.identitySwitch",
    interFrameForgery: "signal.interFrameForgery",
    intraPrediction: "signal.intraPrediction",
    lipReadingScore: "signal.lipReadingScore",
    microExpressionV2: "signal.microExpressionV2",
    microTremor: "signal.microTremor",
    motionEstimationRes: "signal.motionEstimationRes",
    phonemeVisemeMap: "signal.phonemeVisemeMap",
    pupilDynamics: "signal.pupilDynamics",
    pupillaryUnrest: "signal.pupillaryUnrest",
    qpAnalysis: "signal.qpAnalysis",
    reflectionConsistencyVideo: "signal.reflectionConsistencyVideo",
    saccadeAnalysis: "signal.saccadeAnalysis",
    sceneCutAnomaly: "signal.sceneCutAnomaly",
    shadowConsistencyVideo: "signal.shadowConsistencyVideo",
    skinSpecularReflection: "signal.skinSpecularReflection",
    skinTextureTemporal: "signal.skinTextureTemporal",
    speechCadence: "signal.speechCadence",
    temporalFaceEmbedding: "signal.temporalFaceEmbedding",
    temporalFrequencyAnomaly: "signal.temporalFrequencyAnomaly",
    videoCodecAnalysis: "signal.videoCodecAnalysis",
    videoDenoisingTrace: "signal.videoDenoisingTrace",
    videoNoisePattern: "signal.videoNoisePattern",
    videoSpectralCoherence: "signal.videoSpectralCoherence",
    voiceF0Analysis: "signal.voiceF0Analysis",
};

/** Text method ID → nameKey mapping */
export const TEXT_METHOD_MAP: Record<string, string> = {
    perplexity_analysis: "signal.perplexityAnalysis",
    burstiness_detection: "signal.burstinessDetection",
    vocabulary_diversity: "signal.vocabularyDiversity",
    stylometric_analysis: "signal.stylometricAnalysis",
    ngram_frequency: "signal.ngramFrequency",
    repetition_pattern: "signal.repetitionPattern",
    coherence_analysis: "signal.coherenceAnalysis",
    entropy_distribution: "signal.entropyDistribution",
    sentence_length_variance: "signal.sentenceLengthVariance",
    readability_score: "signal.readabilityScore",
    punctuation_pattern: "signal.punctuationPattern",
    topic_consistency: "signal.topicConsistency",
    word_frequency_rank: "signal.wordFrequencyRank",
    semantic_density: "signal.semanticDensity",
    writing_rhythm: "signal.writingRhythm",
    pos_tag_analysis: "signal.posTagAnalysis",
    discourse_markers: "signal.discourseMarkers",
    coreference_chain: "signal.coreferenceChain",
    named_entity_consistency: "signal.namedEntityConsistency",
    hedging_language: "signal.hedgingLanguage",
    type_token_ratio: "signal.typeTokenRatio",
    syntactic_complexity: "signal.syntacticComplexity",
    passive_voice_frequency: "signal.passiveVoiceFrequency",
    lexical_sophistication: "signal.lexicalSophistication",
    text_compression_ratio: "signal.textCompressionRatio",
    function_word_distribution: "signal.functionWordDistribution",
    pronoun_usage_pattern: "signal.pronounUsagePattern",
    clause_depth_analysis: "signal.clauseDepthAnalysis",
    collocation_strength: "signal.collocationStrength",
    temporal_expression: "signal.temporalExpression",
    adverb_frequency: "signal.adverbFrequency",
    contraction_usage: "signal.contractionUsage",
    sentence_opener: "signal.sentenceOpener",
    emotional_tone: "signal.emotionalTone",
    metaphor_density: "signal.metaphorDensity",
    question_frequency: "signal.questionFrequency",
    paragraph_structure: "signal.paragraphStructure",
    transition_quality: "signal.transitionQuality",
    idiom_detection: "signal.idiomDetection",
    abstract_concrete: "signal.abstractConcrete",
    first_person_usage: "signal.firstPersonUsage",
    technical_jargon: "signal.technicalJargon",
    redundancy_detection: "signal.redundancyDetection",
    word_length_dist: "signal.wordLengthDist",
    hapax_legomena: "signal.hapaxLegomena",
    conjunction_density: "signal.conjunctionDensity",
    preposition_pattern: "signal.prepositionPattern",
    modal_verb_frequency: "signal.modalVerbFrequency",
    subordinate_clause: "signal.subordinateClause",
    argument_structure: "signal.argumentStructure",
    text_formality: "signal.textFormality",
    negation_pattern: "signal.negationPattern",
    comparative_structure: "signal.comparativeStructure",
    quantifier_usage: "signal.quantifierUsage",
    referential_density: "signal.referentialDensity",
    logical_connector: "signal.logicalConnector",
    topic_shift_analysis: "signal.topicShiftAnalysis",
    information_density: "signal.informationDensity",
    sentiment_variance: "signal.sentimentVariance",
    lexical_chain_repetition: "signal.lexicalChainRepetition",
    genre_conformity: "signal.genreConformity",
    conclusion_pattern: "signal.conclusionPattern",
    vocab_complexity: "signal.vocabComplexity",
    sentence_connectivity: "signal.sentenceConnectivity",
    text_coherence: "signal.textCoherence",
    // Text v4 (20)
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
    anaphora_resolution: "signal.anaphoraResolution",
    // Text v5
    acronym_usage: "signal.acronymUsage",
    question_density: "signal.questionDensity",
    sent_start_variety: "signal.sentStartVariety",
    verb_tense: "signal.verbTense",
    comma_freq: "signal.commaFreq",
    semicolon_usage: "signal.semicolonUsage",
    superlative_usage: "signal.superlativeUsage",
    contraction_detect: "signal.contractionDetect",
    avg_word_length: "signal.avgWordLength",
    emphasis_pattern: "signal.emphasisPattern",
    definite_article: "signal.definiteArticle",
    number_usage: "signal.numberUsage",
    qualifier_density: "signal.qualifierDensity",
    passive_active_mix: "signal.passiveActiveMix",
    quotation_usage: "signal.quotationUsage",
    analogy_simile: "signal.analogySimile",
    conjunction_pair: "signal.conjunctionPair",
    abstractness: "signal.abstractness",
    instructional_tone: "signal.instructionalTone",
    transition_smooth: "signal.transitionSmooth",
    definition_pattern: "signal.definitionPattern",
    conditional_usage: "signal.conditionalUsage",
    repetitive_phrase: "signal.repetitivePhrase",
    conclusion_indicator: "signal.conclusionIndicator",
    // Text v6
    zipf_deviation: "signal.zipfDeviation",
    token_predictability: "signal.tokenPredict",
    log_likelihood_rank: "signal.logLikelihood",
    entropy_per_word: "signal.entropyPerWord",
    curie_detect: "signal.curieDetect",
    vocabulary_richness: "signal.vocabRichness",
    mean_dep_parse: "signal.meanDepParse",
    word_rarity: "signal.wordRarity",
    clause_balance: "signal.clauseBalance",
    micro_repetition: "signal.microRepetition",
    text_dna: "signal.textDNA",
    intrinsic_dimension: "signal.intrinsicDim",
    sentence_entropy: "signal.sentenceEntropy",
    lexical_density: "signal.lexicalDensity",
    text_burstiness2: "signal.textBurstiness2",
    // AUTO_ADDED_MAPS
    argumentDensity: "signal.argumentDensity",
    binocularsDetect: "signal.binocularsDetect",
    causalReasoning: "signal.causalReasoning",
    cohMetrixIndex: "signal.cohMetrixIndex",
    contextualEmbeddingVar: "signal.contextualEmbeddingVar",
    crossEntropyVariance: "signal.crossEntropyVariance",
    discourseRelationDepth: "signal.discourseRelationDepth",
    dnaGptUniqueness: "signal.dnaGptUniqueness",
    entityGrounding: "signal.entityGrounding",
    fastDetectgpt: "signal.fastDetectgpt",
    ghostbusterDetect: "signal.ghostbusterDetect",
    informationTheoreticProfile: "signal.informationTheoreticProfile",
    likelihoodDivergence: "signal.likelihoodDivergence",
    localCoherenceModel: "signal.localCoherenceModel",
    maxSoftmaxProb: "signal.maxSoftmaxProb",
    phdDetection: "signal.phdDetection",
    pragmaticAdequacy: "signal.pragmaticAdequacy",
    radarDetect: "signal.radarDetect",
    rankProbability: "signal.rankProbability",
    registerVariation: "signal.registerVariation",
    semanticCoherenceGraph: "signal.semanticCoherenceGraph",
    syntacticTreeDepth: "signal.syntacticTreeDepth",
    textFingerprint: "signal.textFingerprint",
    topicModelDivergence: "signal.topicModelDivergence",
    vocabularyAge: "signal.vocabularyAge",
};

export const ALL_METHOD_IDS = [...PAPER_FAITHFUL_IMAGE_METHOD_IDS];
export const ALL_TEXT_METHOD_IDS = [...PAPER_FAITHFUL_TEXT_METHOD_IDS];

/** Video method ID → nameKey mapping */
export const VIDEO_METHOD_MAP: Record<string, string> = {
    face_landmark_v: "signal.faceLandmarkConsistency",
    temporal_consistency: "signal.temporalConsistency",
    audio_visual_sync: "signal.audioVisualSync",
    frame_interpolation: "signal.frameInterpolation",
    lip_sync: "signal.lipSyncAnalysis",
    optical_flow: "signal.opticalFlowAnomaly",
    deepfake_artifact: "signal.deepfakeArtifact",
    scene_transition: "signal.sceneTransition",
    motion_blur: "signal.motionBlurConsistency",
    background_stability: "signal.backgroundStability",
    gaze_direction: "signal.gazeDirection",
    facial_reenactment: "signal.facialReenactment",
    video_compression: "signal.videoCompressionTrace",
    flicker: "signal.flickerAnalysis",
    hand_gesture: "signal.handGestureConsistency",
    body_proportion: "signal.bodyProportion",
    color_temporal_shift: "signal.colorTemporalShift",
    frame_drop: "signal.frameDropDetection",
    blink_rate: "signal.blinkRateAnalysis",
    video_noise: "signal.videoNoiseConsistency",
    skin_texture: "signal.skinTextureRealism",
    hair_detail: "signal.hairDetailAnalysis",
    eye_reflection: "signal.eyeReflectionConsistency",
    jawline: "signal.jawlineConsistency",
    ear_symmetry: "signal.earSymmetryAnalysis",
    expression: "signal.expressionNaturalness",
    pupil_dilation: "signal.pupilDilation",
    facial_wrinkle: "signal.facialWrinkle",
    nose_geometry: "signal.noseGeometry",
    forehead_texture: "signal.foreheadTexture",
    teeth: "signal.teethConsistency",
    eyebrow: "signal.eyebrowNaturalness",
    neck_transition: "signal.neckTransition",
    shoulder: "signal.shoulderAlignment",
    clothing_fold: "signal.clothingFold",
    finger_geometry: "signal.fingerGeometry",
    bg_perspective: "signal.backgroundPerspective",
    reflection_physics: "signal.reflectionPhysics",
    shadow_temporal: "signal.shadowTemporal",
    watermark: "signal.watermarkDetection",
    motion_vector: "signal.motionVectorAnalysis",
    head_pose: "signal.headPoseEstimation",
    micro_expression: "signal.microExpressionAnalysis",
    face_alignment_v: "signal.faceAlignment",
    depth_consistency: "signal.depthConsistency",
    bokeh: "signal.bokehNaturalness",
    lens_distortion_v: "signal.lensDistortionVideo",
    stabilization: "signal.stabilizationArtifact",
    edge_ringing: "signal.edgeRinging",
    chroma_bleed: "signal.chromaBleed",
    pixel_repetition_v: "signal.pixelRepetitionVideo",
    video_hash: "signal.videoHashAnalysis",
    face_boundary_blend: "signal.faceBoundaryBlend",
    color_quant_v: "signal.colorQuantizationVideo",
    spatial_freq_temporal: "signal.spatialFreqTemporal",
    video_blockiness: "signal.videoBlockiness",
    temporal_noise: "signal.temporalNoise",
    frame_energy: "signal.frameEnergy",
    video_sharpness: "signal.videoSharpness",
    object_boundary: "signal.objectBoundary",
    texture_flow: "signal.textureFlowAnalysis",
    video_grain: "signal.videoGrainAnalysis",
    contrast_temporal: "signal.contrastTemporal",
    video_saturation: "signal.videoSaturation",
    face_illumination: "signal.faceIllumination",
    video_artifact_grid: "signal.videoArtifactGrid",
    // Video v4 (20)
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
    video_resolution_map: "signal.videoResolutionMap",
    // Video v5
    skin_color_drift: "signal.skinColorDrift",
    facial_symmetry_v: "signal.facialSymmetryVideo",
    lip_texture_detail: "signal.lipTextureDetail",
    forehead_wrinkle: "signal.foreheadWrinkle",
    iris_detail: "signal.irisDetail",
    nose_shadow: "signal.noseShadow",
    chin_jaw_detail: "signal.chinJawDetail",
    bg_complexity: "signal.bgComplexity",
    color_bleeding: "signal.colorBleeding",
    face_mask_edge: "signal.faceMaskEdge",
    motion_blur_dir: "signal.motionBlurDir",
    video_global_illum: "signal.videoGlobalIllum",
    pixel_jitter: "signal.pixelJitter",
    frame_edge_energy: "signal.frameEdgeEnergy",
    facial_pore_texture: "signal.facialPoreTexture",
    temporal_gradient: "signal.temporalGradient",
    video_saturation_map: "signal.videoSaturationMap",
    neck_skin: "signal.neckSkinConsistency",
    video_luma_range: "signal.videoLumaRange",
    cheek_texture: "signal.cheekTexture",
    video_color_balance: "signal.videoColorBalance",
    edge_aa_video: "signal.edgeAAVideo",
    temporal_coherence_map: "signal.tempCoherenceMap",
    video_freq_spectrum: "signal.videoFreqSpectrum",
    // Video v6
    face_xray: "signal.faceXray",
    face_blend_bound: "signal.faceBlendBound",
    color_hist_shift: "signal.colorHistShift",
    face_skin_smooth_v: "signal.faceSkinSmoothV",
    specular_highlight: "signal.specularHighlight",
    contour_continuity: "signal.contourContinuity",
    skin_micro_motion: "signal.skinMicroMotion",
    bg_freq_map: "signal.bgFreqMap",
    inter_frame_blend: "signal.interFrameBlend",
    edge_sharpness_var: "signal.edgeSharpnessVar",
    nostril_darkness: "signal.nostrilDarkness",
    ear_detail: "signal.earDetail",
    clothing_edge_blend: "signal.clothingEdgeBlend",
    temporal_jitter: "signal.temporalJitter",
    skin_pore_sim: "signal.skinPoreSim",
};

export const ALL_VIDEO_METHOD_IDS = Object.keys(VIDEO_METHOD_MAP);


// Reverse map: nameKey → Set of method IDs (for O(1) filtering)
const NAMEKEY_TO_IDS: Map<string, string[]> = new Map();
for (const [id, nameKey] of Object.entries(METHOD_MAP)) {
    const arr = NAMEKEY_TO_IDS.get(nameKey);
    if (arr) arr.push(id);
    else NAMEKEY_TO_IDS.set(nameKey, [id]);
}

const VIDEO_NAMEKEY_TO_IDS: Map<string, string[]> = new Map();
for (const [id, nameKey] of Object.entries(VIDEO_METHOD_MAP)) {
    const arr = VIDEO_NAMEKEY_TO_IDS.get(nameKey);
    if (arr) arr.push(id);
    else VIDEO_NAMEKEY_TO_IDS.set(nameKey, [id]);
}

const VIDEO_NAMEKEY_TO_IDS: Map<string, string[]> = new Map();
for (const [id, nameKey] of Object.entries(VIDEO_METHOD_MAP)) {
    const arr = VIDEO_NAMEKEY_TO_IDS.get(nameKey);
    if (arr) arr.push(id);
    else VIDEO_NAMEKEY_TO_IDS.set(nameKey, [id]);
}

const TEXT_NAMEKEY_TO_IDS: Map<string, string[]> = new Map();
for (const [id, nameKey] of Object.entries(TEXT_METHOD_MAP)) {
    const arr = TEXT_NAMEKEY_TO_IDS.get(nameKey);
    if (arr) arr.push(id);
    else TEXT_NAMEKEY_TO_IDS.set(nameKey, [id]);
}

/** Free-tier methods (original 13) — available without login */
export const FREE_METHOD_IDS = [
    "metadata", "spectral", "reconstruction", "noise", "edge",
    "gradient", "benford", "chromatic", "texture", "cfa",
    "dct", "color", "prnu",
];

/** Free-tier text methods — available without login */
export const FREE_TEXT_METHOD_IDS = [
    "perplexity_analysis", "burstiness_detection", "vocabulary_diversity",
];

async function analyzeImageFile(file: File, enabledMethods?: string[]): Promise<{ methods: AnalysisMethod[]; metadata: FileMetadata }> {
    const { canvas, ctx } = await loadImage(file);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const w = canvas.width, h = canvas.height;

    const exifData = await extractBasicMetadata(file);
    const metadata: FileMetadata = {
        fileName: file.name, fileSize: file.size, fileType: file.type,
        width: w, height: h, isVideo: false, exifData,
    };

    const enabled = new Set(enabledMethods || ALL_METHOD_IDS);

    const allMethods: AnalysisMethod[] = [
        // Original 13
        analyzeMetadata(metadata, exifData),
        analyzeSpectralNyquist(pixels, w, h),
        analyzeMultiscaleReconstruction(canvas, ctx),
        analyzeNoiseResidual(pixels, w, h),
        analyzeEdgeCoherence(pixels, w, h),
        analyzeGradientMicroTexture(pixels, w, h),
        analyzeBenfordsLaw(pixels, w, h),
        analyzeChromaticAberration(pixels, w, h),
        analyzeTextureConsistency(pixels, w, h),
        analyzeCFAPattern(pixels, w, h),
        analyzeDCTBlockArtifacts(pixels, w, h),
        analyzeColorChannelCorrelation(pixels, w, h),
        analyzePRNUPattern(pixels, w, h),
        // Spatial Domain (6)
        analyzeLocalBinaryPattern(pixels, w, h),
        analyzeHOGAnomaly(pixels, w, h),
        analyzeGLCM(pixels, w, h),
        analyzeLocalVarianceMap(pixels, w, h),
        analyzeMorphologicalGradient(pixels, w, h),
        analyzeWeberDescriptor(pixels, w, h),
        // Frequency Domain (6)
        analyzeWaveletStatistics(pixels, w, h),
        analyzeGaborResponse(pixels, w, h),
        analyzePowerSpectralDensity(pixels, w, h),
        analyzePhaseCongruency(pixels, w, h),
        analyzeRadialSpectrum(pixels, w, h),
        analyzeFrequencyBandRatio(pixels, w, h),
        // Statistical (6)
        analyzeEntropyMap(pixels, w, h),
        analyzeHigherOrderStatistics(pixels, w, h),
        analyzeZipfLaw(pixels, w, h),
        analyzeChiSquareUniformity(pixels, w, h),
        analyzeMarkovTransition(pixels, w, h),
        analyzeSaturationDistribution(pixels, w, h),
        // Compression (4)
        analyzeJPEGGhost(pixels, w, h),
        analyzeQuantizationFingerprint(pixels, w, h),
        analyzeErrorLevel(pixels, w, h),
        analyzeColorBanding(pixels, w, h),
        // Generative (3)
        analyzeGANFingerprint(pixels, w, h),
        analyzeUpsamplingArtifact(pixels, w, h),
        analyzeDiffusionArtifact(pixels, w, h),
        // Geometric (3)
        analyzePerspectiveConsistency(pixels, w, h),
        analyzeLightingConsistency(pixels, w, h),
        analyzeShadowConsistency(pixels, w, h),
        // Advanced Color (2)
        analyzeColorGamut(pixels, w, h),
        analyzeWhiteBalance(pixels, w, h),
        // Advanced Forensic (4) — v7
        analyzeCopyMoveForensics(pixels, w, h),
        analyzeDoubleJPEG(pixels, w, h),
        analyzeAutocorrelation(pixels, w, h),
        analyzePixelCooccurrence(pixels, w, h),
        // Perceptual Texture (4) — v7
        analyzeTamuraTexture(pixels, w, h),
        analyzeLocalPhaseQuantization(pixels, w, h),
        analyzeFractalDimension(pixels, w, h),
        analyzeBilateralSymmetry(pixels, w, h),
        // Histogram & Info Theory (5) — v7
        analyzeHistogramDistribution(pixels, w, h),
        analyzeHistogramGradient(pixels, w, h),
        analyzeColorCoherence(pixels, w, h),
        analyzeMutualInformation(pixels, w, h),
        analyzeLaplacianEdge(pixels, w, h),
        // Forensic Methods v8 (20)
        analyzeMedianFilter(pixels, w, h),
        analyzeResampling(pixels, w, h),
        analyzeContrastEnhancement(pixels, w, h),
        analyzeBrisque(pixels, w, h),
        analyzeDemosaicing(pixels, w, h),
        analyzeSteganalysis(pixels, w, h),
        analyzeThumbnailConsistency(pixels, w, h),
        analyzePerceptualHash(pixels, w, h),
        analyzeIlluminantMap(pixels, w, h),
        analyzeRadonTransform(pixels, w, h),
        analyzeZernikeMoments(pixels, w, h),
        analyzeCameraModel(pixels, w, h),
        analyzeImagePhylogeny(pixels, w, h),
        analyzeBlockingArtifact(pixels, w, h),
        analyzeEfficientnetFeatures(pixels, w, h),
        analyzeAttentionConsistency(pixels, w, h),
        analyzeStyleTransfer(pixels, w, h),
        analyzeColorTemperature(pixels, w, h),
        analyzeSiftForensics(pixels, w, h),
        analyzeNeuralCompression(pixels, w, h),
        // Extended Forensic Methods v9 (12)
        analyzeSplicingDetection(pixels, w, h),
        analyzeNoiseprintExtraction(pixels, w, h),
        analyzeUpscalingDetection(pixels, w, h),
        analyzeFaceLandmarkConsistency(pixels, w, h),
        analyzeReflectionConsistency(pixels, w, h),
        analyzePatchForensics(pixels, w, h),
        analyzeClipDetection(pixels, w, h),
        analyzeFourierRing(pixels, w, h),
        analyzeResnetClassifier(pixels, w, h),
        analyzeVitDetection(pixels, w, h),
        analyzeGramMatrix(pixels, w, h),
        analyzeSRMFilter(pixels, w, h),
        // Metadata Analysis v10 (10)
        analyzeExifIntegrity(metadata, exifData),
        analyzeXmpProvenance(metadata, exifData),
        analyzeIptcVerification(metadata, exifData),
        analyzeGpsConsistency(metadata, exifData),
        analyzeTimestampForensics(metadata, exifData),
        analyzeFileStructure(metadata, exifData),
        analyzeColorProfileMeta(metadata, exifData),
        analyzeC2paVerification(metadata, exifData),
        analyzeResolutionConsistency(metadata, exifData),
        analyzeSoftwareFingerprint(metadata, exifData),
        // Image Analysis v11 (20)
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
        analyzeToneMappingDetect(pixels, w, h),
        // Image v12
        analyzeSkinTextureFreq(pixels, w, h),
        analyzeBloomArtifact(pixels, w, h),
        analyzeGammaDistortion(pixels, w, h),
        analyzeLinearPatternDetect(pixels, w, h),
        analyzeDynamicRangeAnalysis(pixels, w, h),
        analyzeIntensityKurtosis(pixels, w, h),
        analyzeCrossGradient(pixels, w, h),
        analyzePixelSymmetry(pixels, w, h),
        analyzeLocalEntropy(pixels, w, h),
        analyzeLumaGradientAngle(pixels, w, h),
        analyzeRGBCorrelation(pixels, w, h),
        analyzeIsolatedPixel(pixels, w, h),
        analyzeSpatialCoherence(pixels, w, h),
        analyzeContourSmooth(pixels, w, h),
        analyzeColorEntropy(pixels, w, h),
        analyzeBrightnessGradient(pixels, w, h),
        analyzeNoiseGranularity(pixels, w, h),
        analyzeHueConsistency(pixels, w, h),
        analyzePixelBitPlane(pixels, w, h),
        analyzeContrastMapImg(pixels, w, h),
        analyzeFlatRegionRatio(pixels, w, h),
        analyzePosterizationDetect(pixels, w, h),
        analyzeMeanShiftCluster(pixels, w, h),
        analyzeGradientMagnitudeHist(pixels, w, h),
        // Image v13
        analyzeRichardsonLucy(pixels, w, h),
        analyzeWienerResidual(pixels, w, h),
        analyzeSecondOrderGrad(pixels, w, h),
        analyzeDctEnergyCompact(pixels, w, h),
        analyzeSpatialRichModel(pixels, w, h),
        analyzeMidFreqEnergy(pixels, w, h),
        analyzeLaplacianVariance(pixels, w, h),
        analyzeSobelMagnitude(pixels, w, h),
        analyzeCannyDensity(pixels, w, h),
        analyzeCoocEntropy(pixels, w, h),
        analyzeBoxFilterResidual(pixels, w, h),
        analyzeMaximalGradFlow(pixels, w, h),
        analyzeDifferenceHistogram(pixels, w, h),
        analyzeSubBandDev(pixels, w, h),
        analyzeGradOrientHist(pixels, w, h),
        analyzeKirschEdge(pixels, w, h),
        analyzeLawsTextureE(pixels, w, h),
        analyzeGaborEnergy(pixels, w, h),
        analyzeScharrGradient(pixels, w, h),
        analyzeStructuralComplexity(pixels, w, h),
        // AUTO_ADDED_IMGE
        analyzeCensusTransform(pixels, w, h),
        analyzeContourletAnalysis(pixels, w, h),
        analyzeConvolutionalTrace(pixels, w, h),
        analyzeCurveletTransform(pixels, w, h),
        analyzeDiscreteCosineEnergy(pixels, w, h),
        analyzeGaborPhase(pixels, w, h),
        analyzeGaborWaveletBank(pixels, w, h),
        analyzeGradientDivergence(pixels, w, h),
        analyzeGradientWeightedCam(pixels, w, h),
        analyzeHarrisCorner(pixels, w, h),
        analyzeHessianMatrix(pixels, w, h),
        analyzeLaplacianPyramid(pixels, w, h),
        analyzeLogGaborFilter(pixels, w, h),
        analyzeMomentInvariants(pixels, w, h),
        analyzeMultiscaleEntropy(pixels, w, h),
        analyzeNiqeScore(pixels, w, h),
        analyzePixelValueDiff(pixels, w, h),
        analyzeRunLengthMatrix(pixels, w, h),
        analyzeShearletAnalysis(pixels, w, h),
        analyzeSparseRepresentation(pixels, w, h),
        analyzeSsimMap(pixels, w, h),
        analyzeSteerablePyramid(pixels, w, h),
        analyzeSvdDecomposition(pixels, w, h),
        analyzeTotalVariation(pixels, w, h),
        analyzeWaveletPacket(pixels, w, h),
        // AUTO_IMGS
        analyzeCensusTransform(pixels, w, h),
        // AUTO_VIDS
        analyzeCensusTransform(pixels, w, h),
                    ];

                    // Filter methods based on enabled set using O(1) reverse map lookup
    const methods = allMethods.filter(s => {
        const ids = NAMEKEY_TO_IDS.get(s.nameKey);
        return ids ? ids.some(id => enabled.has(id)) : false;
    });

    return { methods, metadata };
}

// ============================
// VIDEO ANALYSIS
// ============================

async function analyzeVideoFile(file: File, enabledMethods?: string[]): Promise<{ methods: AnalysisMethod[]; metadata: FileMetadata }> {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    const enabled = new Set(enabledMethods || DEFAULT_VIDEO_METHOD_IDS);

    return new Promise((resolve, reject) => {
        // Timeout guard: reject after 30s to prevent hanging
        const timeout = setTimeout(() => {
            URL.revokeObjectURL(url);
            reject(new Error("Video analysis timed out after 30 seconds"));
        }, 30000);

        video.onerror = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load video file"));
        };

        video.onloadedmetadata = async () => {
            const metadata: FileMetadata = {
                fileName: file.name, fileSize: file.size, fileType: file.type,
                width: video.videoWidth, height: video.videoHeight, isVideo: true,
            };

            video.currentTime = Math.min(1, video.duration / 2);

            video.onseeked = async () => {
                clearTimeout(timeout);
                // Downscale video frame like image analysis (MAX_PROCESS_DIMENSION)
                let w = video.videoWidth, h = video.videoHeight;
                if (w > 1024 || h > 1024) {
                    const scale = 1024 / Math.max(w, h);
                    w = Math.round(w * scale);
                    h = Math.round(h * scale);
                }
                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const ctx = createConsistentContext(canvas);
                ctx.drawImage(video, 0, 0, w, h);
                const imageData = ctx.getImageData(0, 0, w, h);
                const pixels = imageData.data;
                URL.revokeObjectURL(url);

                const exifData = await extractBasicMetadata(file);
                metadata.exifData = exifData;

                const allMethods: AnalysisMethod[] = [
                    // Original 13 (without CFA for video)
                    analyzeMetadata(metadata, exifData),
                    analyzeSpectralNyquist(pixels, w, h),
                    analyzeMultiscaleReconstruction(canvas, ctx),
                    analyzeNoiseResidual(pixels, w, h),
                    analyzeEdgeCoherence(pixels, w, h),
                    analyzeGradientMicroTexture(pixels, w, h),
                    analyzeBenfordsLaw(pixels, w, h),
                    analyzeChromaticAberration(pixels, w, h),
                    analyzeTextureConsistency(pixels, w, h),
                    analyzeDCTBlockArtifacts(pixels, w, h),
                    analyzeColorChannelCorrelation(pixels, w, h),
                    analyzePRNUPattern(pixels, w, h),
                    analyzeVideoSpecific(file, video),
                    // Spatial Domain (6)
                    analyzeLocalBinaryPattern(pixels, w, h),
                    analyzeHOGAnomaly(pixels, w, h),
                    analyzeGLCM(pixels, w, h),
                    analyzeLocalVarianceMap(pixels, w, h),
                    analyzeMorphologicalGradient(pixels, w, h),
                    analyzeWeberDescriptor(pixels, w, h),
                    // Frequency Domain (6)
                    analyzeWaveletStatistics(pixels, w, h),
                    analyzeGaborResponse(pixels, w, h),
                    analyzePowerSpectralDensity(pixels, w, h),
                    analyzePhaseCongruency(pixels, w, h),
                    analyzeRadialSpectrum(pixels, w, h),
                    analyzeFrequencyBandRatio(pixels, w, h),
                    // Statistical (6)
                    analyzeEntropyMap(pixels, w, h),
                    analyzeHigherOrderStatistics(pixels, w, h),
                    analyzeZipfLaw(pixels, w, h),
                    analyzeChiSquareUniformity(pixels, w, h),
                    analyzeMarkovTransition(pixels, w, h),
                    analyzeSaturationDistribution(pixels, w, h),
                    // Compression (4)
                    analyzeJPEGGhost(pixels, w, h),
                    analyzeQuantizationFingerprint(pixels, w, h),
                    analyzeErrorLevel(pixels, w, h),
                    analyzeColorBanding(pixels, w, h),
                    // Generative (3)
                    analyzeGANFingerprint(pixels, w, h),
                    analyzeUpsamplingArtifact(pixels, w, h),
                    analyzeDiffusionArtifact(pixels, w, h),
                    // Geometric (3)
                    analyzePerspectiveConsistency(pixels, w, h),
                    analyzeLightingConsistency(pixels, w, h),
                    analyzeShadowConsistency(pixels, w, h),
                    // Advanced Color (2)
                    analyzeColorGamut(pixels, w, h),
                    analyzeWhiteBalance(pixels, w, h),
                    // Advanced Forensic (4) — v7
                    analyzeCopyMoveForensics(pixels, w, h),
                    analyzeDoubleJPEG(pixels, w, h),
                    analyzeAutocorrelation(pixels, w, h),
                    analyzePixelCooccurrence(pixels, w, h),
                    // Perceptual Texture (4) — v7
                    analyzeTamuraTexture(pixels, w, h),
                    analyzeLocalPhaseQuantization(pixels, w, h),
                    analyzeFractalDimension(pixels, w, h),
                    analyzeBilateralSymmetry(pixels, w, h),
                    // Histogram & Info Theory (5) — v7
                    analyzeHistogramDistribution(pixels, w, h),
                    analyzeHistogramGradient(pixels, w, h),
                    analyzeColorCoherence(pixels, w, h),
                    analyzeMutualInformation(pixels, w, h),
                    analyzeLaplacianEdge(pixels, w, h),
                    // Forensic Methods v8 (20)
                    analyzeMedianFilter(pixels, w, h),
                    analyzeResampling(pixels, w, h),
                    analyzeContrastEnhancement(pixels, w, h),
                    analyzeBrisque(pixels, w, h),
                    analyzeDemosaicing(pixels, w, h),
                    analyzeSteganalysis(pixels, w, h),
                    analyzeThumbnailConsistency(pixels, w, h),
                    analyzePerceptualHash(pixels, w, h),
                    analyzeIlluminantMap(pixels, w, h),
                    analyzeRadonTransform(pixels, w, h),
                    analyzeZernikeMoments(pixels, w, h),
                    analyzeCameraModel(pixels, w, h),
                    analyzeImagePhylogeny(pixels, w, h),
                    analyzeBlockingArtifact(pixels, w, h),
                    analyzeEfficientnetFeatures(pixels, w, h),
                    analyzeAttentionConsistency(pixels, w, h),
                    analyzeStyleTransfer(pixels, w, h),
                    analyzeColorTemperature(pixels, w, h),
                    analyzeSiftForensics(pixels, w, h),
                    analyzeNeuralCompression(pixels, w, h),
                    // Extended Forensic Methods v9 (12)
                    analyzeSplicingDetection(pixels, w, h),
                    analyzeNoiseprintExtraction(pixels, w, h),
                    analyzeUpscalingDetection(pixels, w, h),
                    analyzeFaceLandmarkConsistency(pixels, w, h),
                    analyzeReflectionConsistency(pixels, w, h),
                    analyzePatchForensics(pixels, w, h),
                    analyzeClipDetection(pixels, w, h),
                    analyzeFourierRing(pixels, w, h),
                    analyzeResnetClassifier(pixels, w, h),
                    analyzeVitDetection(pixels, w, h),
                    analyzeGramMatrix(pixels, w, h),
                    analyzeSRMFilter(pixels, w, h),
                    // Video-specific methods (existing 16)
                    analyzeTemporalConsistency(pixels, w, h),
                    analyzeAudioVisualSync(pixels, w, h),
                    analyzeFrameInterpolation(pixels, w, h),
                    analyzeLipSyncAnalysis(pixels, w, h),
                    analyzeOpticalFlowAnomaly(pixels, w, h),
                    analyzeDeepfakeArtifact(pixels, w, h),
                    analyzeSceneTransition(pixels, w, h),
                    analyzeMotionBlurConsistency(pixels, w, h),
                    analyzeBackgroundStability(pixels, w, h),
                    analyzeGazeDirection(pixels, w, h),
                    analyzeFacialReenactment(pixels, w, h),
                    analyzeVideoCompressionTrace(pixels, w, h),
                    analyzeFlickerAnalysis(pixels, w, h),
                    analyzeHandGestureConsistency(pixels, w, h),
                    analyzeBodyProportion(pixels, w, h),
                    // Video-specific methods v2 (50 new)
                    analyzeColorTemporalShift(pixels, w, h),
                    analyzeFrameDropDetection(pixels, w, h),
                    analyzeBlinkRateAnalysis(pixels, w, h),
                    analyzeVideoNoiseConsistency(pixels, w, h),
                    analyzeSkinTextureRealism(pixels, w, h),
                    analyzeHairDetailAnalysis(pixels, w, h),
                    analyzeEyeReflectionConsistency(pixels, w, h),
                    analyzeJawlineConsistency(pixels, w, h),
                    analyzeEarSymmetryAnalysis(pixels, w, h),
                    analyzeExpressionNaturalness(pixels, w, h),
                    analyzePupilDilation(pixels, w, h),
                    analyzeFacialWrinkle(pixels, w, h),
                    analyzeNoseGeometry(pixels, w, h),
                    analyzeForeheadTexture(pixels, w, h),
                    analyzeTeethConsistency(pixels, w, h),
                    analyzeEyebrowNaturalness(pixels, w, h),
                    analyzeNeckTransition(pixels, w, h),
                    analyzeShoulderAlignment(pixels, w, h),
                    analyzeClothingFold(pixels, w, h),
                    analyzeFingerGeometry(pixels, w, h),
                    analyzeBackgroundPerspective(pixels, w, h),
                    analyzeReflectionPhysics(pixels, w, h),
                    analyzeShadowTemporal(pixels, w, h),
                    analyzeWatermarkDetection(pixels, w, h),
                    analyzeMotionVectorAnalysis(pixels, w, h),
                    analyzeHeadPoseEstimation(pixels, w, h),
                    analyzeMicroExpressionAnalysis(pixels, w, h),
                    analyzeFaceAlignment(pixels, w, h),
                    analyzeDepthConsistency(pixels, w, h),
                    analyzeBokehNaturalness(pixels, w, h),
                    analyzeLensDistortionVideo(pixels, w, h),
                    analyzeStabilizationArtifact(pixels, w, h),
                    analyzeEdgeRinging(pixels, w, h),
                    analyzeChromaBleed(pixels, w, h),
                    analyzePixelRepetitionVideo(pixels, w, h),
                    analyzeVideoHashAnalysis(pixels, w, h),
                    analyzeFaceBoundaryBlend(pixels, w, h),
                    analyzeColorQuantizationVideo(pixels, w, h),
                    analyzeSpatialFreqTemporal(pixels, w, h),
                    analyzeVideoBlockiness(pixels, w, h),
                    analyzeTemporalNoise(pixels, w, h),
                    analyzeFrameEnergy(pixels, w, h),
                    analyzeVideoSharpness(pixels, w, h),
                    analyzeObjectBoundary(pixels, w, h),
                    analyzeTextureFlowAnalysis(pixels, w, h),
                    analyzeVideoGrainAnalysis(pixels, w, h),
                    analyzeContrastTemporal(pixels, w, h),
                    analyzeVideoSaturation(pixels, w, h),
                    analyzeFaceIllumination(pixels, w, h),
                    analyzeVideoArtifactGrid(pixels, w, h),
                    // Metadata Analysis v10 (10)
                    analyzeExifIntegrity(metadata, exifData),
                    analyzeXmpProvenance(metadata, exifData),
                    analyzeIptcVerification(metadata, exifData),
                    analyzeGpsConsistency(metadata, exifData),
                    analyzeTimestampForensics(metadata, exifData),
                    analyzeFileStructure(metadata, exifData),
                    analyzeColorProfileMeta(metadata, exifData),
                    analyzeC2paVerification(metadata, exifData),
                    analyzeResolutionConsistency(metadata, exifData),
                    analyzeSoftwareFingerprint(metadata, exifData),
                    // Video Analysis v4 (20)
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
                    analyzeVideoResolutionMap(pixels, w, h),
                    // Video v5
                    analyzeSkinColorDrift(pixels, w, h),
                    analyzeFacialSymmetryVideo(pixels, w, h),
                    analyzeLipTextureDetail(pixels, w, h),
                    analyzeForeheadWrinkle(pixels, w, h),
                    analyzeIrisDetail(pixels, w, h),
                    analyzeNoseShadow(pixels, w, h),
                    analyzeChinJawDetail(pixels, w, h),
                    analyzeBackgroundComplexity(pixels, w, h),
                    analyzeColorBleeding(pixels, w, h),
                    analyzeFaceMaskEdge(pixels, w, h),
                    analyzeMotionBlurDir(pixels, w, h),
                    analyzeVideoGlobalIllum(pixels, w, h),
                    analyzePixelJitter(pixels, w, h),
                    analyzeFrameEdgeEnergy(pixels, w, h),
                    analyzeFacialPoreTexture(pixels, w, h),
                    analyzeTemporalGradient(pixels, w, h),
                    analyzeVideoSaturationMap(pixels, w, h),
                    analyzeNeckSkinConsistency(pixels, w, h),
                    analyzeVideoLumaRange(pixels, w, h),
                    analyzeCheekTexture(pixels, w, h),
                    analyzeVideoColorBalance(pixels, w, h),
                    analyzeEdgeAntiAliasingVideo(pixels, w, h),
                    analyzeTemporalCoherenceMap(pixels, w, h),
                    analyzeVideoFreqSpectrum(pixels, w, h),
                    // Video v6
                    analyzeFaceXray(pixels, w, h),
                    analyzeFaceBlendBound(pixels, w, h),
                    analyzeColorHistShift(pixels, w, h),
                    analyzeFaceSkinSmoothV(pixels, w, h),
                    analyzeSpecularHighlight(pixels, w, h),
                    analyzeContourContinuity(pixels, w, h),
                    analyzeSkinMicroMotion(pixels, w, h),
                    analyzeBGFreqMap(pixels, w, h),
                    analyzeInterFrameBlend(pixels, w, h),
                    analyzeEdgeSharpnessVar(pixels, w, h),
                    analyzeNostrilDarkness(pixels, w, h),
                    analyzeEarDetailConsistency(pixels, w, h),
                    analyzeClothingEdgeBlend(pixels, w, h),
                    analyzeTemporalJitter(pixels, w, h),
                    analyzeSkinPoreSimulation(pixels, w, h),
                // AUTO_ADDED_VIDE
        analyzeAudioFormant(pixels, w, h),
        analyzeBackgroundObjectPhysics(pixels, w, h),
        analyzeBframeConsistency(pixels, w, h),
        analyzeClothingConsistency(pixels, w, h),
        analyzeEarConsistency(pixels, w, h),
        analyzeFace3dReconstruction(pixels, w, h),
        analyzeFacialActionTiming(pixels, w, h),
        analyzeFacialAgingConsistency(pixels, w, h),
        analyzeFacsAnalysis(pixels, w, h),
        analyzeGazeVergence(pixels, w, h),
        analyzeHairDynamics(pixels, w, h),
        analyzeHandFingerCount(pixels, w, h),
        analyzeHeadNodShake(pixels, w, h),
        analyzeHeadPoseV2(pixels, w, h),
        analyzeHeartbeatDetection(pixels, w, h),
        analyzeIdentitySwitch(pixels, w, h),
        analyzeInterFrameForgery(pixels, w, h),
        analyzeIntraPrediction(pixels, w, h),
        analyzeLipReadingScore(pixels, w, h),
        analyzeMicroExpressionV2(pixels, w, h),
        analyzeMicroTremor(pixels, w, h),
        analyzeMotionEstimationRes(pixels, w, h),
        analyzePhonemeVisemeMap(pixels, w, h),
        analyzePupilDynamics(pixels, w, h),
        analyzePupillaryUnrest(pixels, w, h),
        analyzeQpAnalysis(pixels, w, h),
        analyzeReflectionConsistencyVideo(pixels, w, h),
        analyzeSaccadeAnalysis(pixels, w, h),
        analyzeSceneCutAnomaly(pixels, w, h),
        analyzeShadowConsistencyVideo(pixels, w, h),
        analyzeSkinSpecularReflection(pixels, w, h),
        analyzeSkinTextureTemporal(pixels, w, h),
        analyzeSpeechCadence(pixels, w, h),
        analyzeTemporalFaceEmbedding(pixels, w, h),
        analyzeTemporalFrequencyAnomaly(pixels, w, h),
        analyzeVideoCodecAnalysis(pixels, w, h),
        analyzeVideoDenoisingTrace(pixels, w, h),
        analyzeVideoNoisePattern(pixels, w, h),
        analyzeVideoSpectralCoherence(pixels, w, h),
        analyzeVoiceF0Analysis(pixels, w, h),
                    ];

                const methods = allMethods.filter(s => {
                    const vids = VIDEO_NAMEKEY_TO_IDS.get(s.nameKey);
                    if (vids) return vids.some(id => enabled.has(id));
                    const ids = NAMEKEY_TO_IDS.get(s.nameKey);
                    return ids ? ids.some(id => enabled.has(id)) : false;
                });

                resolve({ methods, metadata });
            };
        };
        video.src = url;
    });
}

// ============================
// TEXT ANALYSIS
// ============================

export async function analyzeText(text: string, enabledMethods?: string[], customWeights?: Record<string, number>): Promise<AnalysisResult> {
    const start = performance.now();
    if (!text || text.trim().length < 50) {
        throw new Error("Text too short for analysis (minimum 50 characters)");
    }

    const enabled = new Set(enabledMethods || ALL_TEXT_METHOD_IDS);

    const allMethods: AnalysisMethod[] = [
        analyzePerplexityAnalysis(text),
        analyzeBurstinessDetection(text),
        analyzeVocabularyDiversity(text),
        analyzeStylometricAnalysis(text),
        analyzeNgramFrequency(text),
        analyzeRepetitionPattern(text),
        analyzeCoherenceAnalysis(text),
        analyzeEntropyDistribution(text),
        analyzeSentenceLengthVariance(text),
        analyzeReadabilityScore(text),
        analyzePunctuationPattern(text),
        analyzeTopicConsistency(text),
        analyzeWordFrequencyRank(text),
        analyzeSemanticDensity(text),
        analyzeWritingRhythm(text),
        analyzePosTagAnalysis(text),
        analyzeDiscourseMarkers(text),
        analyzeCoreferenceChain(text),
        analyzeNamedEntityConsistency(text),
        analyzeHedgingLanguage(text),
        analyzeTypeTokenRatio(text),
        analyzeSyntacticComplexity(text),
        analyzePassiveVoiceFrequency(text),
        analyzeLexicalSophistication(text),
        analyzeTextCompressionRatio(text),
        analyzeFunctionWordDistribution(text),
        analyzePronounUsagePattern(text),
        analyzeClauseDepthAnalysis(text),
        analyzeCollocationStrength(text),
        analyzeTemporalExpression(text),
        // Text Analysis Methods v3 (35 new)
        analyzeAdverbFrequency(text),
        analyzeContractionUsage(text),
        analyzeSentenceOpener(text),
        analyzeEmotionalTone(text),
        analyzeMetaphorDensity(text),
        analyzeQuestionFrequency(text),
        analyzeParagraphStructure(text),
        analyzeTransitionQuality(text),
        analyzeIdiomDetection(text),
        analyzeAbstractConcrete(text),
        analyzeFirstPersonUsage(text),
        analyzeTechnicalJargon(text),
        analyzeRedundancyDetection(text),
        analyzeWordLengthDist(text),
        analyzeHapaxLegomena(text),
        analyzeConjunctionDensity(text),
        analyzePrepositionPattern(text),
        analyzeModalVerbFrequency(text),
        analyzeSubordinateClause(text),
        analyzeArgumentStructure(text),
        analyzeTextFormality(text),
        analyzeNegationPattern(text),
        analyzeComparativeStructure(text),
        analyzeQuantifierUsage(text),
        analyzeReferentialDensity(text),
        analyzeLogicalConnector(text),
        analyzeTopicShiftAnalysis(text),
        analyzeInformationDensity(text),
        analyzeSentimentVariance(text),
        analyzeLexicalChainRepetition(text),
        analyzeGenreConformity(text),
        analyzeConclusionPattern(text),
        analyzeVocabComplexity(text),
        analyzeSentenceConnectivity(text),
        analyzeTextCoherence(text),
        // Text Analysis v4 (20)
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
        analyzeAnaphoraResolution(text),
        // Text v5
        analyzeAcronymUsage(text),
        analyzeQuestionMarkDensity(text),
        analyzeSentenceStartVariety(text),
        analyzeVerbTenseConsistency(text),
        analyzeCommaFrequency(text),
        analyzeSemicolonUsage(text),
        analyzeSuperlativeUsage(text),
        analyzeContractionDetect(text),
        analyzeAverageWordLength(text),
        analyzeEmphasisPattern(text),
        analyzeDefiniteArticle(text),
        analyzeNumberUsage(text),
        analyzeQualifierDensity(text),
        analyzePassiveActiveMix(text),
        analyzeQuotationUsage(text),
        analyzeAnalogySimile(text),
        analyzeConjunctionPair(text),
        analyzeAbstractnessIndex(text),
        analyzeInstructionalTone(text),
        analyzeTransitionSmooth(text),
        analyzeDefinitionPattern(text),
        analyzeConditionalUsage(text),
        analyzeRepetitivePhrase(text),
        analyzeConclusionIndicator(text),
        // Text v6
        analyzeZipfDeviation(text),
        analyzeTokenPredictability(text),
        analyzeLogLikelihoodRank(text),
        analyzeEntropyPerWord(text),
        analyzeCurieDetect(text),
        analyzeVocabularyRichness(text),
        analyzeMeanDepParse(text),
        analyzeWordRarityScore(text),
        analyzeClauseBalance(text),
        analyzeTextRepetitionMicro(text),
        analyzeTextDNAWatermark(text),
        analyzeIntrinsicDimension(text),
        analyzeSentenceEntropy(text),
        analyzeLexicalDensity(text),
        analyzeTextBurstiness2(text),
    // AUTO_ADDED_TEXTE
        analyzeArgumentDensity(text),
        analyzeBinocularsDetect(text),
        analyzeCausalReasoning(text),
        analyzeCohMetrixIndex(text),
        analyzeContextualEmbeddingVar(text),
        analyzeCrossEntropyVariance(text),
        analyzeDiscourseRelationDepth(text),
        analyzeDnaGptUniqueness(text),
        analyzeEntityGrounding(text),
        analyzeFastDetectgpt(text),
        analyzeGhostbusterDetect(text),
        analyzeInformationTheoreticProfile(text),
        analyzeLikelihoodDivergence(text),
        analyzeLocalCoherenceModel(text),
        analyzeMaxSoftmaxProb(text),
        analyzePhdDetection(text),
        analyzePragmaticAdequacy(text),
        analyzeRadarDetect(text),
        analyzeRankProbability(text),
        analyzeRegisterVariation(text),
        analyzeSemanticCoherenceGraph(text),
        analyzeSyntacticTreeDepth(text),
        analyzeTextFingerprint(text),
        analyzeTopicModelDivergence(text),
        analyzeVocabularyAge(text),
    ];

    const methods = allMethods.filter(s => {
        const ids = TEXT_NAMEKEY_TO_IDS.get(s.nameKey);
        return ids ? ids.some(id => enabled.has(id)) : false;
    });

    // Apply custom weights
    if (customWeights && Object.keys(customWeights).length > 0) {
        for (const method of methods) {
            for (const [id, nameKey] of Object.entries(TEXT_METHOD_MAP)) {
                if (method.nameKey === nameKey && customWeights[id] !== undefined) {
                    method.weight = method.weight * (customWeights[id] / 100);
                }
            }
        }
    }

    const { aiScore, verdict, confidence } = calculateVerdict(methods);

    const metadata: FileMetadata = {
        fileName: "text-input", fileSize: new Blob([text]).size, fileType: "text/plain",
        width: 0, height: 0, isVideo: false,
    };

    return { verdict, confidence, aiScore, methods, signals: methods, metadata, processingTimeMs: Math.round(performance.now() - start) };
}
