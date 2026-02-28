/**
 * Signal modules barrel export
 * 43 forensic analysis signals based on peer-reviewed research
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
