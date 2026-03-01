/**
 * Analysis methods barrel export
 * 55 forensic analysis methods (phương pháp phân tích) based on peer-reviewed research
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

// New: Spatial Domain (6 signals) — Signals 14-19
export { analyzeLocalBinaryPattern, analyzeHOGAnomaly, analyzeGLCM, analyzeLocalVarianceMap, analyzeMorphologicalGradient, analyzeWeberDescriptor } from "./spatial";

// New: Frequency Domain (6 signals) — Signals 20-25
export { analyzeWaveletStatistics, analyzeGaborResponse, analyzePowerSpectralDensity, analyzePhaseCongruency, analyzeRadialSpectrum, analyzeFrequencyBandRatio } from "./frequencyAdvanced";

// New: Statistical (6 signals) — Signals 26-31
export { analyzeEntropyMap, analyzeHigherOrderStatistics, analyzeZipfLaw, analyzeChiSquareUniformity, analyzeMarkovTransition, analyzeSaturationDistribution } from "./statisticalAdvanced";

// New: Compression (4 signals) — Signals 32-35
export { analyzeJPEGGhost, analyzeQuantizationFingerprint, analyzeErrorLevel, analyzeColorBanding } from "./compression";

// New: Generative Model Detection (3 signals) — Signals 36-38
export { analyzeGANFingerprint, analyzeUpsamplingArtifact, analyzeDiffusionArtifact } from "./generative";

// New: Geometric (3 signals) — Signals 39-41
export { analyzePerspectiveConsistency, analyzeLightingConsistency, analyzeShadowConsistency } from "./geometric";

// New: Advanced Color (2 signals) — Signals 42-43
export { analyzeColorGamut, analyzeWhiteBalance } from "./colorAdvanced";

// New: Advanced Forensic (4 signals) — Signals 44-47
export { analyzeCopyMoveForensics } from "./copyMove";
export { analyzeDoubleJPEG } from "./doubleJpeg";
export { analyzeAutocorrelation } from "./autocorrelation";
export { analyzePixelCooccurrence } from "./pixelCooccurrence";

// New: Perceptual Texture (4 signals) — Signals 48-51
export { analyzeTamuraTexture } from "./tamura";
export { analyzeLocalPhaseQuantization } from "./lpq";
export { analyzeFractalDimension } from "./fractal";
export { analyzeBilateralSymmetry } from "./bilateralSymmetry";

// New: Histogram & Information Theory (4 signals) — Signals 52-55
export { analyzeHistogramGradient } from "./histogramGradient";
export { analyzeColorCoherence } from "./colorCoherence";
export { analyzeMutualInformation } from "./mutualInfo";
export { analyzeLaplacianEdge } from "./laplacianEdge";
