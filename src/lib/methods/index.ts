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
