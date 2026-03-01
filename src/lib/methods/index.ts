/**
 * Analysis methods barrel export
 * 75+ forensic analysis methods based on peer-reviewed research
 * Each method is in its own file for maintainability
 */

// Original 13 signals
export { analyzeMetadata } from "./metadata";
export { analyzeSpectralNyquist } from "./spectral";
export { analyzeMultiscaleReconstruction } from "./reconstruction";
export { analyzeNoiseResidual } from "./noise";
export { analyzeEdgeCoherence } from "./edge";
export { analyzeGradientMicroTexture } from "./gradient";
export { analyzeBenfordsLaw } from "./benford";
export { analyzeChromaticAberration } from "./chromatic";
export { analyzeTextureConsistency } from "./texture";
export { analyzeCFAPattern } from "./cfa";
export { analyzeVideoSpecific } from "./video";
export { analyzeDCTBlockArtifacts } from "./dct";
export { analyzeColorChannelCorrelation } from "./color";
export { analyzePRNUPattern } from "./prnu";

// Spatial Domain (6 signals)
export { analyzeLocalBinaryPattern } from "./localBinaryPattern";
export { analyzeHOGAnomaly } from "./hogAnomaly";
export { analyzeGLCM } from "./glcm";
export { analyzeLocalVarianceMap } from "./localVarianceMap";
export { analyzeMorphologicalGradient } from "./morphologicalGradient";
export { analyzeWeberDescriptor } from "./weberDescriptor";

// Frequency Domain (6 signals)
export { analyzeWaveletStatistics } from "./waveletStatistics";
export { analyzeGaborResponse } from "./gaborResponse";
export { analyzePowerSpectralDensity } from "./powerSpectralDensity";
export { analyzePhaseCongruency } from "./phaseCongruency";
export { analyzeRadialSpectrum } from "./radialSpectrum";
export { analyzeFrequencyBandRatio } from "./frequencyBandRatio";

// Statistical (6 signals)
export { analyzeEntropyMap } from "./entropyMap";
export { analyzeHigherOrderStatistics } from "./higherOrderStatistics";
export { analyzeZipfLaw } from "./zipfLaw";
export { analyzeChiSquareUniformity } from "./chiSquareUniformity";
export { analyzeMarkovTransition } from "./markovTransition";
export { analyzeSaturationDistribution } from "./saturationDistribution";

// Compression (4 signals)
export { analyzeJPEGGhost } from "./jpegGhost";
export { analyzeQuantizationFingerprint } from "./quantizationFingerprint";
export { analyzeErrorLevel } from "./errorLevel";
export { analyzeColorBanding } from "./colorBanding";

// Generative Model Detection (3 signals)
export { analyzeGANFingerprint } from "./ganFingerprint";
export { analyzeUpsamplingArtifact } from "./upsamplingArtifact";
export { analyzeDiffusionArtifact } from "./diffusionArtifact";

// Geometric (3 signals)
export { analyzePerspectiveConsistency } from "./perspectiveConsistency";
export { analyzeLightingConsistency } from "./lightingConsistency";
export { analyzeShadowConsistency } from "./shadowConsistency";

// Advanced Color (2 signals)
export { analyzeColorGamut } from "./colorGamut";
export { analyzeWhiteBalance } from "./whiteBalance";

// Advanced Forensic (4 signals)
export { analyzeCopyMoveForensics } from "./copyMove";
export { analyzeDoubleJPEG } from "./doubleJpeg";
export { analyzeAutocorrelation } from "./autocorrelation";
export { analyzePixelCooccurrence } from "./pixelCooccurrence";

// Perceptual Texture (4 signals)
export { analyzeTamuraTexture } from "./tamura";
export { analyzeLocalPhaseQuantization } from "./lpq";
export { analyzeFractalDimension } from "./fractal";
export { analyzeBilateralSymmetry } from "./bilateralSymmetry";

// Histogram & Info Theory (4 signals)
export { analyzeHistogramGradient } from "./histogramGradient";
export { analyzeColorCoherence } from "./colorCoherence";
export { analyzeMutualInformation } from "./mutualInfo";
export { analyzeLaplacianEdge } from "./laplacianEdge";

// Forensic Methods v8 (20 signals)
export { analyzeMedianFilter } from "./medianFilter";
export { analyzeResampling } from "./resamplingDetect";
export { analyzeContrastEnhancement } from "./contrastEnhancement";
export { analyzeBrisque } from "./brisque";
export { analyzeDemosaicing } from "./demosaicingDetect";
export { analyzeSteganalysis } from "./steganalysisDetect";
export { analyzeThumbnailConsistency } from "./thumbnailAnalysis";
export { analyzePerceptualHash } from "./perceptualHash";
export { analyzeIlluminantMap } from "./illuminantMap";
export { analyzeRadonTransform } from "./radonTransform";
export { analyzeZernikeMoments } from "./zernikeMoments";
export { analyzeCameraModel } from "./cameraModel";
export { analyzeImagePhylogeny } from "./imagePhylogeny";
export { analyzeBlockingArtifact } from "./blockingArtifact";
export { analyzeEfficientnetFeatures } from "./efficientnetDetect";
export { analyzeAttentionConsistency } from "./attentionConsistency";
export { analyzeStyleTransfer } from "./styleTransfer";
export { analyzeColorTemperature } from "./colorTemperature";
export { analyzeSiftForensics } from "./siftForensics";
export { analyzeNeuralCompression } from "./neuralCompression";

// Extended forensic methods v9 (12 signals)
export { analyzeSplicingDetection } from "./splicingDetection";
export { analyzeNoiseprintExtraction } from "./noiseprintExtraction";
export { analyzeUpscalingDetection } from "./upscalingDetection";
export { analyzeFaceLandmarkConsistency } from "./faceLandmarkConsistency";
export { analyzeReflectionConsistency } from "./reflectionConsistency";
export { analyzePatchForensics } from "./patchForensics";
export { analyzeClipDetection } from "./clipDetection";
export { analyzeFourierRing } from "./fourierRing";
export { analyzeResnetClassifier } from "./resnetClassifier";
export { analyzeVitDetection } from "./vitDetection";
export { analyzeGramMatrix } from "./gramMatrix";
export { analyzeSRMFilter } from "./srmFilter";
