/**
 * Analysis methods barrel export
 * 75+ forensic analysis methods based on peer-reviewed research
 * Organized by media type: image/, video/, text/
 */

// ===== IMAGE ANALYSIS METHODS =====

// Original 13 signals
export { analyzeMetadata } from "./image/metadata";
export { analyzeSpectralNyquist } from "./image/spectral";
export { analyzeMultiscaleReconstruction } from "./image/reconstruction";
export { analyzeNoiseResidual } from "./image/noise";
export { analyzeEdgeCoherence } from "./image/edge";
export { analyzeGradientMicroTexture } from "./image/gradient";
export { analyzeBenfordsLaw } from "./image/benford";
export { analyzeChromaticAberration } from "./image/chromatic";
export { analyzeTextureConsistency } from "./image/texture";
export { analyzeCFAPattern } from "./image/cfa";
export { analyzeVideoSpecific } from "../video";
export { analyzeDCTBlockArtifacts } from "./image/dct";
export { analyzeColorChannelCorrelation } from "./image/color";
export { analyzePRNUPattern } from "./image/prnu";

// Spatial Domain (6 signals)
export { analyzeLocalBinaryPattern } from "./image/localBinaryPattern";
export { analyzeHOGAnomaly } from "./image/hogAnomaly";
export { analyzeGLCM } from "./image/glcm";
export { analyzeLocalVarianceMap } from "./image/localVarianceMap";
export { analyzeMorphologicalGradient } from "./image/morphologicalGradient";
export { analyzeWeberDescriptor } from "./image/weberDescriptor";

// Frequency Domain (6 signals)
export { analyzeWaveletStatistics } from "./image/waveletStatistics";
export { analyzeGaborResponse } from "./image/gaborResponse";
export { analyzePowerSpectralDensity } from "./image/powerSpectralDensity";
export { analyzePhaseCongruency } from "./image/phaseCongruency";
export { analyzeRadialSpectrum } from "./image/radialSpectrum";
export { analyzeFrequencyBandRatio } from "./image/frequencyBandRatio";

// Statistical (6 signals)
export { analyzeEntropyMap } from "./image/entropyMap";
export { analyzeHigherOrderStatistics } from "./image/higherOrderStatistics";
export { analyzeZipfLaw } from "./image/zipfLaw";
export { analyzeChiSquareUniformity } from "./image/chiSquareUniformity";
export { analyzeMarkovTransition } from "./image/markovTransition";
export { analyzeSaturationDistribution } from "./image/saturationDistribution";

// Compression (4 signals)
export { analyzeJPEGGhost } from "./image/jpegGhost";
export { analyzeQuantizationFingerprint } from "./image/quantizationFingerprint";
export { analyzeErrorLevel } from "./image/errorLevel";
export { analyzeColorBanding } from "./image/colorBanding";

// Generative Model Detection (3 signals)
export { analyzeGANFingerprint } from "./image/ganFingerprint";
export { analyzeUpsamplingArtifact } from "./image/upsamplingArtifact";
export { analyzeDiffusionArtifact } from "./image/diffusionArtifact";

// Geometric (3 signals)
export { analyzePerspectiveConsistency } from "./image/perspectiveConsistency";
export { analyzeLightingConsistency } from "./image/lightingConsistency";
export { analyzeShadowConsistency } from "./image/shadowConsistency";

// Advanced Color (2 signals)
export { analyzeColorGamut } from "./image/colorGamut";
export { analyzeWhiteBalance } from "./image/whiteBalance";

// Advanced Forensic (4 signals)
export { analyzeCopyMoveForensics } from "./image/copyMove";
export { analyzeDoubleJPEG } from "./image/doubleJpeg";
export { analyzeAutocorrelation } from "./image/autocorrelation";
export { analyzePixelCooccurrence } from "./image/pixelCooccurrence";

// Perceptual Texture (4 signals)
export { analyzeTamuraTexture } from "./image/tamura";
export { analyzeLocalPhaseQuantization } from "./image/lpq";
export { analyzeFractalDimension } from "./image/fractal";
export { analyzeBilateralSymmetry } from "./image/bilateralSymmetry";

// Histogram & Info Theory (5 signals)
export { analyzeHistogramDistribution } from "./image/histogram";
export { analyzeHistogramGradient } from "./image/histogramGradient";
export { analyzeColorCoherence } from "./image/colorCoherence";
export { analyzeMutualInformation } from "./image/mutualInfo";
export { analyzeLaplacianEdge } from "./image/laplacianEdge";

// Forensic Methods v8 (20 signals)
export { analyzeMedianFilter } from "./image/medianFilter";
export { analyzeResampling } from "./image/resamplingDetect";
export { analyzeContrastEnhancement } from "./image/contrastEnhancement";
export { analyzeBrisque } from "./image/brisque";
export { analyzeDemosaicing } from "./image/demosaicingDetect";
export { analyzeSteganalysis } from "./image/steganalysisDetect";
export { analyzeThumbnailConsistency } from "./image/thumbnailAnalysis";
export { analyzePerceptualHash } from "./image/perceptualHash";
export { analyzeIlluminantMap } from "./image/illuminantMap";
export { analyzeRadonTransform } from "./image/radonTransform";
export { analyzeZernikeMoments } from "./image/zernikeMoments";
export { analyzeCameraModel } from "./image/cameraModel";
export { analyzeImagePhylogeny } from "./image/imagePhylogeny";
export { analyzeBlockingArtifact } from "./image/blockingArtifact";
export { analyzeEfficientnetFeatures } from "./image/efficientnetDetect";
export { analyzeAttentionConsistency } from "./image/attentionConsistency";
export { analyzeStyleTransfer } from "./image/styleTransfer";
export { analyzeColorTemperature } from "./image/colorTemperature";
export { analyzeSiftForensics } from "./image/siftForensics";
export { analyzeNeuralCompression } from "./image/neuralCompression";

// Extended forensic methods v9 (12 signals)
export { analyzeSplicingDetection } from "./image/splicingDetection";
export { analyzeNoiseprintExtraction } from "./image/noiseprintExtraction";
export { analyzeUpscalingDetection } from "./image/upscalingDetection";
export { analyzeReflectionConsistency } from "./image/reflectionConsistency";
export { analyzePatchForensics } from "./image/patchForensics";
export { analyzeClipDetection } from "./image/clipDetection";
export { analyzeFourierRing } from "./image/fourierRing";
export { analyzeResnetClassifier } from "./image/resnetClassifier";
export { analyzeVitDetection } from "./image/vitDetection";
export { analyzeGramMatrix } from "./image/gramMatrix";
export { analyzeSRMFilter } from "./image/srmFilter";

// Metadata Analysis v10 (10 signals)
export { analyzeExifIntegrity } from "./image/exifIntegrity";
export { analyzeXmpProvenance } from "./image/xmpProvenance";
export { analyzeIptcVerification } from "./image/iptcVerification";
export { analyzeGpsConsistency } from "./image/gpsConsistency";
export { analyzeTimestampForensics } from "./image/timestampForensics";
export { analyzeFileStructure } from "./image/fileStructure";
export { analyzeColorProfileMeta } from "./image/colorProfileMeta";
export { analyzeC2paVerification } from "./image/c2paVerification";
export { analyzeResolutionConsistency } from "./image/resolutionConsistency";
export { analyzeSoftwareFingerprint } from "./image/softwareFingerprint";

// ===== VIDEO ANALYSIS METHODS =====
export { analyzeFaceLandmarkConsistency } from "./video/faceLandmarkConsistency";
export { analyzeTemporalConsistency } from "./video/temporalConsistency";
export { analyzeAudioVisualSync } from "./video/audioVisualSync";
export { analyzeFrameInterpolation } from "./video/frameInterpolation";
export { analyzeLipSyncAnalysis } from "./video/lipSyncAnalysis";
export { analyzeOpticalFlowAnomaly } from "./video/opticalFlowAnomaly";
export { analyzeDeepfakeArtifact } from "./video/deepfakeArtifact";
export { analyzeSceneTransition } from "./video/sceneTransition";
export { analyzeMotionBlurConsistency } from "./video/motionBlurConsistency";
export { analyzeBackgroundStability } from "./video/backgroundStability";
export { analyzeGazeDirection } from "./video/gazeDirection";
export { analyzeFacialReenactment } from "./video/facialReenactment";
export { analyzeVideoCompressionTrace } from "./video/videoCompressionTrace";
export { analyzeFlickerAnalysis } from "./video/flickerAnalysis";
export { analyzeHandGestureConsistency } from "./video/handGestureConsistency";
export { analyzeBodyProportion } from "./video/bodyProportion";

// ===== TEXT ANALYSIS METHODS =====
export { analyzePerplexityAnalysis } from "./text/perplexityAnalysis";
export { analyzeBurstinessDetection } from "./text/burstinessDetection";
export { analyzeVocabularyDiversity } from "./text/vocabularyDiversity";
export { analyzeStylometricAnalysis } from "./text/stylometricAnalysis";
export { analyzeNgramFrequency } from "./text/ngramFrequency";
export { analyzeRepetitionPattern } from "./text/repetitionPattern";
export { analyzeCoherenceAnalysis } from "./text/coherenceAnalysis";
export { analyzeEntropyDistribution } from "./text/entropyDistribution";
export { analyzeSentenceLengthVariance } from "./text/sentenceLengthVariance";
export { analyzeReadabilityScore } from "./text/readabilityScore";
export { analyzePunctuationPattern } from "./text/punctuationPattern";
export { analyzeTopicConsistency } from "./text/topicConsistency";
export { analyzeWordFrequencyRank } from "./text/wordFrequencyRank";
export { analyzeSemanticDensity } from "./text/semanticDensity";
export { analyzeWritingRhythm } from "./text/writingRhythm";

// Text Analysis Methods v2 (15 new methods)
export { analyzePosTagAnalysis } from "./text/posTagAnalysis";
export { analyzeDiscourseMarkers } from "./text/discourseMarkers";
export { analyzeCoreferenceChain } from "./text/coreferenceChain";
export { analyzeNamedEntityConsistency } from "./text/namedEntityConsistency";
export { analyzeHedgingLanguage } from "./text/hedgingLanguage";
export { analyzeTypeTokenRatio } from "./text/typeTokenRatio";
export { analyzeSyntacticComplexity } from "./text/syntacticComplexity";
export { analyzePassiveVoiceFrequency } from "./text/passiveVoiceFrequency";
export { analyzeLexicalSophistication } from "./text/lexicalSophistication";
export { analyzeTextCompressionRatio } from "./text/textCompressionRatio";
export { analyzeFunctionWordDistribution } from "./text/functionWordDistribution";
export { analyzePronounUsagePattern } from "./text/pronounUsagePattern";
export { analyzeClauseDepthAnalysis } from "./text/clauseDepthAnalysis";
export { analyzeCollocationStrength } from "./text/collocationStrength";
export { analyzeTemporalExpression } from "./text/temporalExpression";

// Video Analysis Methods v2 (50 new methods)
export { analyzeColorTemporalShift } from "./video/colorTemporalShift";
export { analyzeFrameDropDetection } from "./video/frameDropDetection";
export { analyzeBlinkRateAnalysis } from "./video/blinkRateAnalysis";
export { analyzeVideoNoiseConsistency } from "./video/videoNoiseConsistency";
export { analyzeSkinTextureRealism } from "./video/skinTextureRealism";
export { analyzeHairDetailAnalysis } from "./video/hairDetailAnalysis";
export { analyzeEyeReflectionConsistency } from "./video/eyeReflectionConsistency";
export { analyzeJawlineConsistency } from "./video/jawlineConsistency";
export { analyzeEarSymmetryAnalysis } from "./video/earSymmetryAnalysis";
export { analyzeExpressionNaturalness } from "./video/expressionNaturalness";
export { analyzePupilDilation } from "./video/pupilDilation";
export { analyzeFacialWrinkle } from "./video/facialWrinkle";
export { analyzeNoseGeometry } from "./video/noseGeometry";
export { analyzeForeheadTexture } from "./video/foreheadTexture";
export { analyzeTeethConsistency } from "./video/teethConsistency";
export { analyzeEyebrowNaturalness } from "./video/eyebrowNaturalness";
export { analyzeNeckTransition } from "./video/neckTransition";
export { analyzeShoulderAlignment } from "./video/shoulderAlignment";
export { analyzeClothingFold } from "./video/clothingFold";
export { analyzeFingerGeometry } from "./video/fingerGeometry";
export { analyzeBackgroundPerspective } from "./video/backgroundPerspective";
export { analyzeReflectionPhysics } from "./video/reflectionPhysics";
export { analyzeShadowTemporal } from "./video/shadowTemporal";
export { analyzeWatermarkDetection } from "./video/watermarkDetection";
export { analyzeMotionVectorAnalysis } from "./video/motionVectorAnalysis";
export { analyzeHeadPoseEstimation } from "./video/headPoseEstimation";
export { analyzeMicroExpressionAnalysis } from "./video/microExpressionAnalysis";
export { analyzeFaceAlignment } from "./video/faceAlignment";
export { analyzeDepthConsistency } from "./video/depthConsistency";
export { analyzeBokehNaturalness } from "./video/bokehNaturalness";
export { analyzeLensDistortionVideo } from "./video/lensDistortionVideo";
export { analyzeStabilizationArtifact } from "./video/stabilizationArtifact";
export { analyzeEdgeRinging } from "./video/edgeRinging";
export { analyzeChromaBleed } from "./video/chromaBleed";
export { analyzePixelRepetitionVideo } from "./video/pixelRepetitionVideo";
export { analyzeVideoHashAnalysis } from "./video/videoHashAnalysis";
export { analyzeFaceBoundaryBlend } from "./video/faceBoundaryBlend";
export { analyzeColorQuantizationVideo } from "./video/colorQuantization";
export { analyzeSpatialFreqTemporal } from "./video/spatialFreqTemporal";
export { analyzeVideoBlockiness } from "./video/videoBlockiness";
export { analyzeTemporalNoise } from "./video/temporalNoise";
export { analyzeFrameEnergy } from "./video/frameEnergy";
export { analyzeVideoSharpness } from "./video/videoSharpness";
export { analyzeObjectBoundary } from "./video/objectBoundary";
export { analyzeTextureFlowAnalysis } from "./video/textureFlowAnalysis";
export { analyzeVideoGrainAnalysis } from "./video/videoGrainAnalysis";
export { analyzeContrastTemporal } from "./video/contrastTemporal";
export { analyzeVideoSaturation } from "./video/videoSaturation";
export { analyzeFaceIllumination } from "./video/faceIllumination";
export { analyzeVideoArtifactGrid } from "./video/videoArtifactGrid";

// Text Analysis Methods v3 (35 new methods)
export { analyzeAdverbFrequency } from "./text/adverbFrequency";
export { analyzeContractionUsage } from "./text/contractionUsage";
export { analyzeSentenceOpener } from "./text/sentenceOpener";
export { analyzeEmotionalTone } from "./text/emotionalTone";
export { analyzeMetaphorDensity } from "./text/metaphorDensity";
export { analyzeQuestionFrequency } from "./text/questionFrequency";
export { analyzeParagraphStructure } from "./text/paragraphStructure";
export { analyzeTransitionQuality } from "./text/transitionQuality";
export { analyzeIdiomDetection } from "./text/idiomDetection";
export { analyzeAbstractConcrete } from "./text/abstractConcrete";
export { analyzeFirstPersonUsage } from "./text/firstPersonUsage";
export { analyzeTechnicalJargon } from "./text/technicalJargon";
export { analyzeRedundancyDetection } from "./text/redundancyDetection";
export { analyzeWordLengthDist } from "./text/wordLengthDist";
export { analyzeHapaxLegomena } from "./text/hapaxLegomena";
export { analyzeConjunctionDensity } from "./text/conjunctionDensity";
export { analyzePrepositionPattern } from "./text/prepositionPattern";
export { analyzeModalVerbFrequency } from "./text/modalVerbFrequency";
export { analyzeSubordinateClause } from "./text/subordinateClause";
export { analyzeArgumentStructure } from "./text/argumentStructure";
export { analyzeTextFormality } from "./text/textFormality";
export { analyzeNegationPattern } from "./text/negationPattern";
export { analyzeComparativeStructure } from "./text/comparativeStructure";
export { analyzeQuantifierUsage } from "./text/quantifierUsage";
export { analyzeReferentialDensity } from "./text/referentialDensity";
export { analyzeLogicalConnector } from "./text/logicalConnector";
export { analyzeTopicShiftAnalysis } from "./text/topicShiftAnalysis";
export { analyzeInformationDensity } from "./text/informationDensity";
export { analyzeSentimentVariance } from "./text/sentimentVariance";
export { analyzeLexicalChainRepetition } from "./text/lexicalChainRepetition";
export { analyzeGenreConformity } from "./text/genreConformity";
export { analyzeConclusionPattern } from "./text/conclusionPattern";
export { analyzeVocabComplexity } from "./text/vocabComplexity";
export { analyzeSentenceConnectivity } from "./text/sentenceConnectivity";
export { analyzeTextCoherence } from "./text/textCoherence";

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

// Image v12
export { analyzeSkinTextureFreq } from "./image/skinTextureFreq";
export { analyzeBloomArtifact } from "./image/bloomArtifact";
export { analyzeGammaDistortion } from "./image/gammaDistortion";
export { analyzeLinearPatternDetect } from "./image/linearPatternDetect";
export { analyzeDynamicRangeAnalysis } from "./image/dynamicRangeAnalysis";
export { analyzeIntensityKurtosis } from "./image/intensityKurtosis";
export { analyzeCrossGradient } from "./image/crossGradient";
export { analyzePixelSymmetry } from "./image/pixelSymmetry";
export { analyzeLocalEntropy } from "./image/localEntropy";
export { analyzeLumaGradientAngle } from "./image/lumaGradientAngle";
export { analyzeRGBCorrelation } from "./image/rgbCorrelation";
export { analyzeIsolatedPixel } from "./image/isolatedPixel";
export { analyzeSpatialCoherence } from "./image/spatialCoherence";
export { analyzeContourSmooth } from "./image/contourSmooth";
export { analyzeColorEntropy } from "./image/colorEntropy";
export { analyzeBrightnessGradient } from "./image/brightnessGradient";
export { analyzeNoiseGranularity } from "./image/noiseGranularity";
export { analyzeHueConsistency } from "./image/hueConsistency";
export { analyzePixelBitPlane } from "./image/pixelBitPlane";
export { analyzeContrastMapImg } from "./image/contrastMap";
export { analyzeFlatRegionRatio } from "./image/flatRegionRatio";
export { analyzePosterizationDetect } from "./image/posterizationDetect";
export { analyzeMeanShiftCluster } from "./image/meanShiftCluster";
export { analyzeGradientMagnitudeHist } from "./image/gradientMagnitudeHist";
// Video v5
export { analyzeSkinColorDrift } from "./video/skinColorDrift";
export { analyzeFacialSymmetryVideo } from "./video/facialSymmetryVideo";
export { analyzeLipTextureDetail } from "./video/lipTextureDetail";
export { analyzeForeheadWrinkle } from "./video/foreheadWrinkle";
export { analyzeIrisDetail } from "./video/irisDetail";
export { analyzeNoseShadow } from "./video/noseShadow";
export { analyzeChinJawDetail } from "./video/chinJawDetail";
export { analyzeBackgroundComplexity } from "./video/backgroundComplexity";
export { analyzeColorBleeding } from "./video/colorBleeding";
export { analyzeFaceMaskEdge } from "./video/faceMaskEdge";
export { analyzeMotionBlurDir } from "./video/motionBlurDir";
export { analyzeVideoGlobalIllum } from "./video/videoGlobalIllum";
export { analyzePixelJitter } from "./video/pixelJitter";
export { analyzeFrameEdgeEnergy } from "./video/frameEdgeEnergy";
export { analyzeFacialPoreTexture } from "./video/facialPoreTexture";
export { analyzeTemporalGradient } from "./video/temporalGradient";
export { analyzeVideoSaturationMap } from "./video/videoSaturationMap";
export { analyzeNeckSkinConsistency } from "./video/neckSkinConsistency";
export { analyzeVideoLumaRange } from "./video/videoLumaRange";
export { analyzeCheekTexture } from "./video/cheekTexture";
export { analyzeVideoColorBalance } from "./video/videoColorBalance";
export { analyzeEdgeAntiAliasingVideo } from "./video/edgeAntiAliasingVideo";
export { analyzeTemporalCoherenceMap } from "./video/temporalCoherenceMap";
export { analyzeVideoFreqSpectrum } from "./video/videoFreqSpectrum";
// Text v5
export { analyzeAcronymUsage } from "./text/acronymUsage";
export { analyzeQuestionMarkDensity } from "./text/questionMarkDensity";
export { analyzeSentenceStartVariety } from "./text/sentenceStartVariety";
export { analyzeVerbTenseConsistency } from "./text/verbTenseConsistency";
export { analyzeCommaFrequency } from "./text/commaFrequency";
export { analyzeSemicolonUsage } from "./text/semicolonUsage";
export { analyzeSuperlativeUsage } from "./text/superlativeUsage";
export { analyzeContractionDetect } from "./text/contractionDetect";
export { analyzeAverageWordLength } from "./text/averageWordLength";
export { analyzeEmphasisPattern } from "./text/emphasisPattern";
export { analyzeDefiniteArticle } from "./text/definiteArticle";
export { analyzeNumberUsage } from "./text/numberUsage";
export { analyzeQualifierDensity } from "./text/qualifierDensity";
export { analyzePassiveActiveMix } from "./text/passiveActiveMix";
export { analyzeQuotationUsage } from "./text/quotationUsage";
export { analyzeAnalogySimile } from "./text/analogySimile";
export { analyzeConjunctionPair } from "./text/conjunctionPair";
export { analyzeAbstractnessIndex } from "./text/abstractnessIndex";
export { analyzeInstructionalTone } from "./text/instructionalTone";
export { analyzeTransitionSmooth } from "./text/transitionSmooth";
export { analyzeDefinitionPattern } from "./text/definitionPattern";
export { analyzeConditionalUsage } from "./text/conditionalUsage";
export { analyzeRepetitivePhrase } from "./text/repetitivePhrase";
export { analyzeConclusionIndicator } from "./text/conclusionIndicator";
