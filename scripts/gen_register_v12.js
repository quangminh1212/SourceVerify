const fs = require('fs'), p = require('path');

// IMAGE methods v12
const imgFns = ['analyzeSkinTextureFreq', 'analyzeBloomArtifact', 'analyzeGammaDistortion', 'analyzeLinearPatternDetect', 'analyzeDynamicRangeAnalysis', 'analyzeIntensityKurtosis', 'analyzeCrossGradient', 'analyzePixelSymmetry', 'analyzeLocalEntropy', 'analyzeLumaGradientAngle', 'analyzeRGBCorrelation', 'analyzeIsolatedPixel', 'analyzeSpatialCoherence', 'analyzeContourSmooth', 'analyzeColorEntropy', 'analyzeBrightnessGradient', 'analyzeNoiseGranularity', 'analyzeHueConsistency', 'analyzePixelBitPlane', 'analyzeContrastMapImg', 'analyzeFlatRegionRatio', 'analyzePosterizationDetect', 'analyzeMeanShiftCluster', 'analyzeGradientMagnitudeHist'];
const imgFiles = ['skinTextureFreq', 'bloomArtifact', 'gammaDistortion', 'linearPatternDetect', 'dynamicRangeAnalysis', 'intensityKurtosis', 'crossGradient', 'pixelSymmetry', 'localEntropy', 'lumaGradientAngle', 'rgbCorrelation', 'isolatedPixel', 'spatialCoherence', 'contourSmooth', 'colorEntropy', 'brightnessGradient', 'noiseGranularity', 'hueConsistency', 'pixelBitPlane', 'contrastMap', 'flatRegionRatio', 'posterizationDetect', 'meanShiftCluster', 'gradientMagnitudeHist'];
const imgKeys = ['signal.skinTextureFreq', 'signal.bloomArtifact', 'signal.gammaDistortion', 'signal.linearPattern', 'signal.dynamicRange', 'signal.intensityKurtosis', 'signal.crossGradient', 'signal.pixelSymmetry', 'signal.localEntropy', 'signal.lumaGradientAngle', 'signal.rgbCorrelation', 'signal.isolatedPixel', 'signal.spatialCoherence', 'signal.contourSmooth', 'signal.colorEntropy', 'signal.brightnessGradient', 'signal.noiseGranularity', 'signal.hueConsistency', 'signal.pixelBitPlane', 'signal.contrastMap', 'signal.flatRegionRatio', 'signal.posterization', 'signal.meanShiftCluster', 'signal.gradientMagHist'];
const imgIds = ['skin_texture_freq', 'bloom_artifact', 'gamma_distortion', 'linear_pattern', 'dynamic_range', 'intensity_kurtosis', 'cross_gradient', 'pixel_symmetry', 'local_entropy', 'luma_gradient_angle', 'rgb_correlation', 'isolated_pixel', 'spatial_coherence', 'contour_smooth', 'color_entropy', 'brightness_gradient', 'noise_granularity', 'hue_consistency', 'pixel_bit_plane', 'contrast_map', 'flat_region_ratio', 'posterization', 'mean_shift_cluster', 'gradient_magnitude'];
const imgCats = ['sensor', 'pixel', 'statistical', 'pixel', 'statistical', 'statistical', 'pixel', 'pixel', 'statistical', 'frequency', 'statistical', 'pixel', 'pixel', 'pixel', 'statistical', 'pixel', 'sensor', 'statistical', 'frequency', 'pixel', 'pixel', 'statistical', 'statistical', 'pixel'];

// VIDEO methods v5
const vidFns = ['analyzeSkinColorDrift', 'analyzeFacialSymmetryVideo', 'analyzeLipTextureDetail', 'analyzeForeheadWrinkle', 'analyzeIrisDetail', 'analyzeNoseShadow', 'analyzeChinJawDetail', 'analyzeBackgroundComplexity', 'analyzeColorBleeding', 'analyzeFaceMaskEdge', 'analyzeMotionBlurDir', 'analyzeVideoGlobalIllum', 'analyzePixelJitter', 'analyzeFrameEdgeEnergy', 'analyzeFacialPoreTexture', 'analyzeTemporalGradient', 'analyzeVideoSaturationMap', 'analyzeNeckSkinConsistency', 'analyzeVideoLumaRange', 'analyzeCheekTexture', 'analyzeVideoColorBalance', 'analyzeEdgeAntiAliasingVideo', 'analyzeTemporalCoherenceMap', 'analyzeVideoFreqSpectrum'];
const vidFiles = ['skinColorDrift', 'facialSymmetryVideo', 'lipTextureDetail', 'foreheadWrinkle', 'irisDetail', 'noseShadow', 'chinJawDetail', 'backgroundComplexity', 'colorBleeding', 'faceMaskEdge', 'motionBlurDir', 'videoGlobalIllum', 'pixelJitter', 'frameEdgeEnergy', 'facialPoreTexture', 'temporalGradient', 'videoSaturationMap', 'neckSkinConsistency', 'videoLumaRange', 'cheekTexture', 'videoColorBalance', 'edgeAntiAliasingVideo', 'temporalCoherenceMap', 'videoFreqSpectrum'];
const vidKeys = ['signal.skinColorDrift', 'signal.facialSymmetryVideo', 'signal.lipTextureDetail', 'signal.foreheadWrinkle', 'signal.irisDetail', 'signal.noseShadow', 'signal.chinJawDetail', 'signal.bgComplexity', 'signal.colorBleeding', 'signal.faceMaskEdge', 'signal.motionBlurDir', 'signal.videoGlobalIllum', 'signal.pixelJitter', 'signal.frameEdgeEnergy', 'signal.facialPoreTexture', 'signal.temporalGradient', 'signal.videoSaturationMap', 'signal.neckSkinConsistency', 'signal.videoLumaRange', 'signal.cheekTexture', 'signal.videoColorBalance', 'signal.edgeAAVideo', 'signal.tempCoherenceMap', 'signal.videoFreqSpectrum'];
const vidIds = ['skin_color_drift', 'facial_symmetry_v', 'lip_texture_detail', 'forehead_wrinkle', 'iris_detail', 'nose_shadow', 'chin_jaw_detail', 'bg_complexity', 'color_bleeding', 'face_mask_edge', 'motion_blur_dir', 'video_global_illum', 'pixel_jitter', 'frame_edge_energy', 'facial_pore_texture', 'temporal_gradient', 'video_saturation_map', 'neck_skin', 'video_luma_range', 'cheek_texture', 'video_color_balance', 'edge_aa_video', 'temporal_coherence_map', 'video_freq_spectrum'];
const vidCats = ['sensor', 'sensor', 'pixel', 'pixel', 'sensor', 'sensor', 'pixel', 'pixel', 'pixel', 'sensor', 'pixel', 'sensor', 'pixel', 'frequency', 'sensor', 'frequency', 'statistical', 'pixel', 'statistical', 'sensor', 'statistical', 'pixel', 'frequency', 'frequency'];

// TEXT methods v5
const txtFns = ['analyzeAcronymUsage', 'analyzeQuestionMarkDensity', 'analyzeSentenceStartVariety', 'analyzeVerbTenseConsistency', 'analyzeCommaFrequency', 'analyzeSemicolonUsage', 'analyzeSuperlativeUsage', 'analyzeContractionDetect', 'analyzeAverageWordLength', 'analyzeEmphasisPattern', 'analyzeDefiniteArticle', 'analyzeNumberUsage', 'analyzeQualifierDensity', 'analyzePassiveActiveMix', 'analyzeQuotationUsage', 'analyzeAnalogySimile', 'analyzeConjunctionPair', 'analyzeAbstractnessIndex', 'analyzeInstructionalTone', 'analyzeTransitionSmooth', 'analyzeDefinitionPattern', 'analyzeConditionalUsage', 'analyzeRepetitivePhrase', 'analyzeConclusionIndicator'];
const txtFiles = ['acronymUsage', 'questionMarkDensity', 'sentenceStartVariety', 'verbTenseConsistency', 'commaFrequency', 'semicolonUsage', 'superlativeUsage', 'contractionDetect', 'averageWordLength', 'emphasisPattern', 'definiteArticle', 'numberUsage', 'qualifierDensity', 'passiveActiveMix', 'quotationUsage', 'analogySimile', 'conjunctionPair', 'abstractnessIndex', 'instructionalTone', 'transitionSmooth', 'definitionPattern', 'conditionalUsage', 'repetitivePhrase', 'conclusionIndicator'];
const txtKeys = ['signal.acronymUsage', 'signal.questionDensity', 'signal.sentStartVariety', 'signal.verbTense', 'signal.commaFreq', 'signal.semicolonUsage', 'signal.superlativeUsage', 'signal.contractionDetect', 'signal.avgWordLength', 'signal.emphasisPattern', 'signal.definiteArticle', 'signal.numberUsage', 'signal.qualifierDensity', 'signal.passiveActiveMix', 'signal.quotationUsage', 'signal.analogySimile', 'signal.conjunctionPair', 'signal.abstractness', 'signal.instructionalTone', 'signal.transitionSmooth', 'signal.definitionPattern', 'signal.conditionalUsage', 'signal.repetitivePhrase', 'signal.conclusionIndicator'];
const txtIds = ['acronym_usage', 'question_density', 'sent_start_variety', 'verb_tense', 'comma_freq', 'semicolon_usage', 'superlative_usage', 'contraction_detect', 'avg_word_length', 'emphasis_pattern', 'definite_article', 'number_usage', 'qualifier_density', 'passive_active_mix', 'quotation_usage', 'analogy_simile', 'conjunction_pair', 'abstractness', 'instructional_tone', 'transition_smooth', 'definition_pattern', 'conditional_usage', 'repetitive_phrase', 'conclusion_indicator'];

// === UPDATE index.ts ===
const idxPath = p.join(__dirname, '..', 'src', 'lib', 'methods', 'index.ts');
let idx = fs.readFileSync(idxPath, 'utf8');
let exp = '\n// Image v12\n' + imgFns.map((fn, i) => `export { ${fn} } from "./image/${imgFiles[i]}";`).join('\n');
exp += '\n// Video v5\n' + vidFns.map((fn, i) => `export { ${fn} } from "./video/${vidFiles[i]}";`).join('\n');
exp += '\n// Text v5\n' + txtFns.map((fn, i) => `export { ${fn} } from "./text/${txtFiles[i]}";`).join('\n');
idx = idx.trimEnd() + '\n' + exp + '\n';
fs.writeFileSync(idxPath, idx);
console.log('Updated index.ts');

// === UPDATE analyzer.ts ===
const aPath = p.join(__dirname, '..', 'src', 'lib', 'analyzer.ts');
let a = fs.readFileSync(aPath, 'utf8');

// Imports
const importStr = '    // Image v12\n    ' + imgFns.join(', ') + ',\n    // Video v5\n    ' + vidFns.join(', ') + ',\n    // Text v5\n    ' + txtFns.join(',\n    ') + ',';
a = a.replace('} from "./methods";', importStr + '\n} from "./methods";');

// Image calls
const imgCallStr = '        // Image v12\n' + imgFns.map(fn => `        ${fn}(pixels, w, h),`).join('\n');
a = a.replace('analyzeToneMappingDetect(pixels, w, h),\n    ];\n\n    // Filter methods based on enabled set', 'analyzeToneMappingDetect(pixels, w, h),\n' + imgCallStr + '\n    ];\n\n    // Filter methods based on enabled set');

// Video calls
const vidCallStr = '                    // Video v5\n' + vidFns.map(fn => `                    ${fn}(pixels, w, h),`).join('\n');
a = a.replace('analyzeVideoResolutionMap(pixels, w, h),\n                ];\n\n                const methods = allMethods.filter', 'analyzeVideoResolutionMap(pixels, w, h),\n' + vidCallStr + '\n                ];\n\n                const methods = allMethods.filter');

// Text calls
const txtCallStr = '        // Text v5\n' + txtFns.map(fn => `        ${fn}(text),`).join('\n');
a = a.replace('analyzeAnaphoraResolution(text),\n    ];\n\n    const methods = allMethods.filter(s => {\n        const ids = TEXT_NAMEKEY_TO_IDS', 'analyzeAnaphoraResolution(text),\n' + txtCallStr + '\n    ];\n\n    const methods = allMethods.filter(s => {\n        const ids = TEXT_NAMEKEY_TO_IDS');

// METHOD_MAP
const imgMapStr = '    // Image v12\n' + imgIds.map((id, i) => `    ${id}: "${imgKeys[i]}",`).join('\n');
a = a.replace('tone_mapping: "signal.toneMapping",\n};', 'tone_mapping: "signal.toneMapping",\n' + imgMapStr + '\n};');

// VIDEO_METHOD_MAP
const vidMapStr = '    // Video v5\n' + vidIds.map((id, i) => `    ${id}: "${vidKeys[i]}",`).join('\n');
a = a.replace('video_resolution_map: "signal.videoResolutionMap",\n};', 'video_resolution_map: "signal.videoResolutionMap",\n' + vidMapStr + '\n};');

// TEXT_METHOD_MAP
const txtMapStr = '    // Text v5\n' + txtIds.map((id, i) => `    ${id}: "${txtKeys[i]}",`).join('\n');
a = a.replace('anaphora_resolution: "signal.anaphoraResolution",\n};', 'anaphora_resolution: "signal.anaphoraResolution",\n' + txtMapStr + '\n};');

fs.writeFileSync(aPath, a);
console.log('Updated analyzer.ts');

// === UPDATE data.ts ===
const dataPath = p.join(__dirname, '..', 'src', 'app', 'methods', 'data.ts');
let data = fs.readFileSync(dataPath, 'utf8');
const yrs = [2022, 2020, 2018, 2020, 2018, 2019, 2020, 2021, 2020, 2020, 2019, 2019, 2021, 2021, 2019, 2018, 2020, 2019, 2017, 2020, 2019, 2018, 2020, 2020];
const vyrs = [2021, 2021, 2022, 2022, 2022, 2021, 2022, 2020, 2020, 2020, 2020, 2019, 2021, 2020, 2023, 2020, 2019, 2022, 2019, 2022, 2019, 2020, 2021, 2020];
let entries = '    // Image v12\n';
imgIds.forEach((id, i) => { entries += `    { id: "${id}", category: "${imgCats[i]}" as Category, mediaType: "image" as MediaType, weight: 0.02, year: ${yrs[i]} },\n`; });
entries += '    // Video v5\n';
vidIds.forEach((id, i) => { entries += `    { id: "${id}", category: "${vidCats[i]}" as Category, mediaType: "video" as MediaType, weight: 0.02, year: ${vyrs[i]} },\n`; });
entries += '    // Text v5\n';
txtIds.forEach(id => { entries += `    { id: "${id}", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02, year: 2023 },\n`; });
data = data.replace('];', entries + '];');
fs.writeFileSync(dataPath, data);
console.log('Updated data.ts');
console.log('DONE!');
