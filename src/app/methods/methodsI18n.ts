/**
 * Aggregated method translations — imported directly from each method's i18n folder.
 * This lets the listing page render method names/descriptions without relying on global i18n keys.
 */
import type { Locale } from "@/i18n/translations";

/* ── static imports for every method ── */
import metadata_en from "./metadata/i18n/en.json";
import metadata_vi from "./metadata/i18n/vi.json";
import spectral_en from "./spectral/i18n/en.json";
import spectral_vi from "./spectral/i18n/vi.json";
import reconstruction_en from "./reconstruction/i18n/en.json";
import reconstruction_vi from "./reconstruction/i18n/vi.json";
import noise_en from "./noise/i18n/en.json";
import noise_vi from "./noise/i18n/vi.json";
import edge_en from "./edge/i18n/en.json";
import edge_vi from "./edge/i18n/vi.json";
import gradient_en from "./gradient/i18n/en.json";
import gradient_vi from "./gradient/i18n/vi.json";
import benford_en from "./benford/i18n/en.json";
import benford_vi from "./benford/i18n/vi.json";
import chromatic_en from "./chromatic/i18n/en.json";
import chromatic_vi from "./chromatic/i18n/vi.json";
import texture_en from "./texture/i18n/en.json";
import texture_vi from "./texture/i18n/vi.json";
import cfa_en from "./cfa/i18n/en.json";
import cfa_vi from "./cfa/i18n/vi.json";
import dct_en from "./dct/i18n/en.json";
import dct_vi from "./dct/i18n/vi.json";
import color_en from "./color/i18n/en.json";
import color_vi from "./color/i18n/vi.json";
import prnu_en from "./prnu/i18n/en.json";
import prnu_vi from "./prnu/i18n/vi.json";
import ela_en from "./ela/i18n/en.json";
import ela_vi from "./ela/i18n/vi.json";
import copymove_en from "./copymove/i18n/en.json";
import copymove_vi from "./copymove/i18n/vi.json";
import splicing_en from "./splicing/i18n/en.json";
import splicing_vi from "./splicing/i18n/vi.json";
import histogram_en from "./histogram/i18n/en.json";
import histogram_vi from "./histogram/i18n/vi.json";
import wavelet_en from "./wavelet/i18n/en.json";
import wavelet_vi from "./wavelet/i18n/vi.json";
import jpeg_ghost_en from "./jpeg_ghost/i18n/en.json";
import jpeg_ghost_vi from "./jpeg_ghost/i18n/vi.json";
import chi_square_en from "./chi_square/i18n/en.json";
import chi_square_vi from "./chi_square/i18n/vi.json";
import entropy_en from "./entropy/i18n/en.json";
import entropy_vi from "./entropy/i18n/vi.json";
import gan_fingerprint_en from "./gan_fingerprint/i18n/en.json";
import gan_fingerprint_vi from "./gan_fingerprint/i18n/vi.json";
import diffusion_en from "./diffusion/i18n/en.json";
import diffusion_vi from "./diffusion/i18n/vi.json";
import noiseprint_en from "./noiseprint/i18n/en.json";
import noiseprint_vi from "./noiseprint/i18n/vi.json";
import upscaling_en from "./upscaling/i18n/en.json";
import upscaling_vi from "./upscaling/i18n/vi.json";
import frequency_band_en from "./frequency_band/i18n/en.json";
import frequency_band_vi from "./frequency_band/i18n/vi.json";
import face_landmark_en from "./face_landmark/i18n/en.json";
import face_landmark_vi from "./face_landmark/i18n/vi.json";
import lighting_en from "./lighting/i18n/en.json";
import lighting_vi from "./lighting/i18n/vi.json";
import shadow_en from "./shadow/i18n/en.json";
import shadow_vi from "./shadow/i18n/vi.json";
import perspective_en from "./perspective/i18n/en.json";
import perspective_vi from "./perspective/i18n/vi.json";
import reflection_en from "./reflection/i18n/en.json";
import reflection_vi from "./reflection/i18n/vi.json";
import double_jpeg_en from "./double_jpeg/i18n/en.json";
import double_jpeg_vi from "./double_jpeg/i18n/vi.json";
import patchforensics_en from "./patchforensics/i18n/en.json";
import patchforensics_vi from "./patchforensics/i18n/vi.json";
import clip_detection_en from "./clip_detection/i18n/en.json";
import clip_detection_vi from "./clip_detection/i18n/vi.json";
import binary_pattern_en from "./binary_pattern/i18n/en.json";
import binary_pattern_vi from "./binary_pattern/i18n/vi.json";
import fourier_ring_en from "./fourier_ring/i18n/en.json";
import fourier_ring_vi from "./fourier_ring/i18n/vi.json";
import resnet_classifier_en from "./resnet_classifier/i18n/en.json";
import resnet_classifier_vi from "./resnet_classifier/i18n/vi.json";
import vit_detection_en from "./vit_detection/i18n/en.json";
import vit_detection_vi from "./vit_detection/i18n/vi.json";
import gram_matrix_en from "./gram_matrix/i18n/en.json";
import gram_matrix_vi from "./gram_matrix/i18n/vi.json";
import srm_filter_en from "./srm_filter/i18n/en.json";
import srm_filter_vi from "./srm_filter/i18n/vi.json";
import autocorrelation_en from "./autocorrelation/i18n/en.json";
import autocorrelation_vi from "./autocorrelation/i18n/vi.json";
import pixel_cooccurrence_en from "./pixel_cooccurrence/i18n/en.json";
import pixel_cooccurrence_vi from "./pixel_cooccurrence/i18n/vi.json";
import tamura_texture_en from "./tamura_texture/i18n/en.json";
import tamura_texture_vi from "./tamura_texture/i18n/vi.json";
import lpq_analysis_en from "./lpq_analysis/i18n/en.json";
import lpq_analysis_vi from "./lpq_analysis/i18n/vi.json";
import fractal_dimension_en from "./fractal_dimension/i18n/en.json";
import fractal_dimension_vi from "./fractal_dimension/i18n/vi.json";
import bilateral_symmetry_en from "./bilateral_symmetry/i18n/en.json";
import bilateral_symmetry_vi from "./bilateral_symmetry/i18n/vi.json";
import histogram_gradient_en from "./histogram_gradient/i18n/en.json";
import histogram_gradient_vi from "./histogram_gradient/i18n/vi.json";
import color_coherence_en from "./color_coherence/i18n/en.json";
import color_coherence_vi from "./color_coherence/i18n/vi.json";
import mutual_information_en from "./mutual_information/i18n/en.json";
import mutual_information_vi from "./mutual_information/i18n/vi.json";
import laplacian_edge_en from "./laplacian_edge/i18n/en.json";
import laplacian_edge_vi from "./laplacian_edge/i18n/vi.json";
// 19 new method imports
import color_banding_en from "./color_banding/i18n/en.json";
import color_banding_vi from "./color_banding/i18n/vi.json";
import color_gamut_en from "./color_gamut/i18n/en.json";
import color_gamut_vi from "./color_gamut/i18n/vi.json";
import gabor_response_en from "./gabor_response/i18n/en.json";
import gabor_response_vi from "./gabor_response/i18n/vi.json";
import glcm_en from "./glcm/i18n/en.json";
import glcm_vi from "./glcm/i18n/vi.json";
import higher_order_statistics_en from "./higher_order_statistics/i18n/en.json";
import higher_order_statistics_vi from "./higher_order_statistics/i18n/vi.json";
import hog_anomaly_en from "./hog_anomaly/i18n/en.json";
import hog_anomaly_vi from "./hog_anomaly/i18n/vi.json";
import local_binary_pattern_en from "./local_binary_pattern/i18n/en.json";
import local_binary_pattern_vi from "./local_binary_pattern/i18n/vi.json";
import local_variance_map_en from "./local_variance_map/i18n/en.json";
import local_variance_map_vi from "./local_variance_map/i18n/vi.json";
import markov_transition_en from "./markov_transition/i18n/en.json";
import markov_transition_vi from "./markov_transition/i18n/vi.json";
import morphological_gradient_en from "./morphological_gradient/i18n/en.json";
import morphological_gradient_vi from "./morphological_gradient/i18n/vi.json";
import phase_congruency_en from "./phase_congruency/i18n/en.json";
import phase_congruency_vi from "./phase_congruency/i18n/vi.json";
import power_spectral_density_en from "./power_spectral_density/i18n/en.json";
import power_spectral_density_vi from "./power_spectral_density/i18n/vi.json";
import quantization_fingerprint_en from "./quantization_fingerprint/i18n/en.json";
import quantization_fingerprint_vi from "./quantization_fingerprint/i18n/vi.json";
import radial_spectrum_en from "./radial_spectrum/i18n/en.json";
import radial_spectrum_vi from "./radial_spectrum/i18n/vi.json";
import saturation_distribution_en from "./saturation_distribution/i18n/en.json";
import saturation_distribution_vi from "./saturation_distribution/i18n/vi.json";
import upsampling_artifact_en from "./upsampling_artifact/i18n/en.json";
import upsampling_artifact_vi from "./upsampling_artifact/i18n/vi.json";
import weber_descriptor_en from "./weber_descriptor/i18n/en.json";
import weber_descriptor_vi from "./weber_descriptor/i18n/vi.json";
import white_balance_en from "./white_balance/i18n/en.json";
import white_balance_vi from "./white_balance/i18n/vi.json";
import zipf_law_en from "./zipf_law/i18n/en.json";
import zipf_law_vi from "./zipf_law/i18n/vi.json";
import median_filter_en from "./median_filter/i18n/en.json";
import median_filter_vi from "./median_filter/i18n/vi.json";
import resampling_en from "./resampling/i18n/en.json";
import resampling_vi from "./resampling/i18n/vi.json";
import contrast_enhancement_en from "./contrast_enhancement/i18n/en.json";
import contrast_enhancement_vi from "./contrast_enhancement/i18n/vi.json";
import brisque_en from "./brisque/i18n/en.json";
import brisque_vi from "./brisque/i18n/vi.json";
import demosaicing_en from "./demosaicing/i18n/en.json";
import demosaicing_vi from "./demosaicing/i18n/vi.json";
import steganalysis_en from "./steganalysis/i18n/en.json";
import steganalysis_vi from "./steganalysis/i18n/vi.json";
import thumbnail_analysis_en from "./thumbnail_analysis/i18n/en.json";
import thumbnail_analysis_vi from "./thumbnail_analysis/i18n/vi.json";
import perceptual_hash_en from "./perceptual_hash/i18n/en.json";
import perceptual_hash_vi from "./perceptual_hash/i18n/vi.json";
import illuminant_map_en from "./illuminant_map/i18n/en.json";
import illuminant_map_vi from "./illuminant_map/i18n/vi.json";
import radon_transform_en from "./radon_transform/i18n/en.json";
import radon_transform_vi from "./radon_transform/i18n/vi.json";
import zernike_moments_en from "./zernike_moments/i18n/en.json";
import zernike_moments_vi from "./zernike_moments/i18n/vi.json";
import camera_model_en from "./camera_model/i18n/en.json";
import camera_model_vi from "./camera_model/i18n/vi.json";
import image_phylogeny_en from "./image_phylogeny/i18n/en.json";
import image_phylogeny_vi from "./image_phylogeny/i18n/vi.json";
import blocking_artifact_en from "./blocking_artifact/i18n/en.json";
import blocking_artifact_vi from "./blocking_artifact/i18n/vi.json";
import efficientnet_detection_en from "./efficientnet_detection/i18n/en.json";
import efficientnet_detection_vi from "./efficientnet_detection/i18n/vi.json";
import attention_consistency_en from "./attention_consistency/i18n/en.json";
import attention_consistency_vi from "./attention_consistency/i18n/vi.json";
import style_transfer_en from "./style_transfer/i18n/en.json";
import style_transfer_vi from "./style_transfer/i18n/vi.json";
import color_temperature_en from "./color_temperature/i18n/en.json";
import color_temperature_vi from "./color_temperature/i18n/vi.json";
import sift_forensics_en from "./sift_forensics/i18n/en.json";
import sift_forensics_vi from "./sift_forensics/i18n/vi.json";
import neural_compression_en from "./neural_compression/i18n/en.json";
import neural_compression_vi from "./neural_compression/i18n/vi.json";

type MethodLocaleEntry = { name: string; description: string };

/** Build a per-locale map: methodId → { name, description } */
function buildMap(entries: [string, { name: string; description: string }][]): Record<string, MethodLocaleEntry> {
    const map: Record<string, MethodLocaleEntry> = {};
    for (const [id, data] of entries) {
        map[id] = { name: data.name, description: data.description };
    }
    return map;
}

const en = buildMap([
    ["metadata", metadata_en], ["spectral", spectral_en], ["reconstruction", reconstruction_en],
    ["noise", noise_en], ["edge", edge_en], ["gradient", gradient_en], ["benford", benford_en],
    ["chromatic", chromatic_en], ["texture", texture_en], ["cfa", cfa_en], ["dct", dct_en],
    ["color", color_en], ["prnu", prnu_en], ["ela", ela_en], ["copymove", copymove_en],
    ["splicing", splicing_en], ["histogram", histogram_en], ["wavelet", wavelet_en],
    ["jpeg_ghost", jpeg_ghost_en], ["chi_square", chi_square_en], ["entropy", entropy_en],
    ["gan_fingerprint", gan_fingerprint_en], ["diffusion", diffusion_en], ["noiseprint", noiseprint_en],
    ["upscaling", upscaling_en], ["frequency_band", frequency_band_en], ["face_landmark", face_landmark_en],
    ["lighting", lighting_en], ["shadow", shadow_en], ["perspective", perspective_en],
    ["reflection", reflection_en], ["double_jpeg", double_jpeg_en], ["patchforensics", patchforensics_en],
    ["clip_detection", clip_detection_en], ["binary_pattern", binary_pattern_en],
    ["fourier_ring", fourier_ring_en], ["resnet_classifier", resnet_classifier_en],
    ["vit_detection", vit_detection_en], ["gram_matrix", gram_matrix_en], ["srm_filter", srm_filter_en],
    ["autocorrelation", autocorrelation_en], ["pixel_cooccurrence", pixel_cooccurrence_en],
    ["tamura_texture", tamura_texture_en], ["lpq_analysis", lpq_analysis_en],
    ["fractal_dimension", fractal_dimension_en], ["bilateral_symmetry", bilateral_symmetry_en],
    ["histogram_gradient", histogram_gradient_en], ["color_coherence", color_coherence_en],
    ["mutual_information", mutual_information_en], ["laplacian_edge", laplacian_edge_en],
    ["color_banding", color_banding_en], ["color_gamut", color_gamut_en],
    ["gabor_response", gabor_response_en], ["glcm", glcm_en],
    ["higher_order_statistics", higher_order_statistics_en], ["hog_anomaly", hog_anomaly_en],
    ["local_binary_pattern", local_binary_pattern_en], ["local_variance_map", local_variance_map_en],
    ["markov_transition", markov_transition_en], ["morphological_gradient", morphological_gradient_en],
    ["phase_congruency", phase_congruency_en], ["power_spectral_density", power_spectral_density_en],
    ["quantization_fingerprint", quantization_fingerprint_en], ["radial_spectrum", radial_spectrum_en],
    ["saturation_distribution", saturation_distribution_en], ["upsampling_artifact", upsampling_artifact_en],
    ["weber_descriptor", weber_descriptor_en], ["white_balance", white_balance_en],
    ["zipf_law", zipf_law_en],
    ["median_filter", median_filter_en], ["resampling", resampling_en],
    ["contrast_enhancement", contrast_enhancement_en], ["brisque", brisque_en],
    ["demosaicing", demosaicing_en], ["steganalysis", steganalysis_en],
    ["thumbnail_analysis", thumbnail_analysis_en], ["perceptual_hash", perceptual_hash_en],
    ["illuminant_map", illuminant_map_en], ["radon_transform", radon_transform_en],
    ["zernike_moments", zernike_moments_en], ["camera_model", camera_model_en],
    ["image_phylogeny", image_phylogeny_en], ["blocking_artifact", blocking_artifact_en],
    ["efficientnet_detection", efficientnet_detection_en], ["attention_consistency", attention_consistency_en],
    ["style_transfer", style_transfer_en], ["color_temperature", color_temperature_en],
    ["sift_forensics", sift_forensics_en], ["neural_compression", neural_compression_en],
]);

const vi = buildMap([
    ["metadata", metadata_vi], ["spectral", spectral_vi], ["reconstruction", reconstruction_vi],
    ["noise", noise_vi], ["edge", edge_vi], ["gradient", gradient_vi], ["benford", benford_vi],
    ["chromatic", chromatic_vi], ["texture", texture_vi], ["cfa", cfa_vi], ["dct", dct_vi],
    ["color", color_vi], ["prnu", prnu_vi], ["ela", ela_vi], ["copymove", copymove_vi],
    ["splicing", splicing_vi], ["histogram", histogram_vi], ["wavelet", wavelet_vi],
    ["jpeg_ghost", jpeg_ghost_vi], ["chi_square", chi_square_vi], ["entropy", entropy_vi],
    ["gan_fingerprint", gan_fingerprint_vi], ["diffusion", diffusion_vi], ["noiseprint", noiseprint_vi],
    ["upscaling", upscaling_vi], ["frequency_band", frequency_band_vi], ["face_landmark", face_landmark_vi],
    ["lighting", lighting_vi], ["shadow", shadow_vi], ["perspective", perspective_vi],
    ["reflection", reflection_vi], ["double_jpeg", double_jpeg_vi], ["patchforensics", patchforensics_vi],
    ["clip_detection", clip_detection_vi], ["binary_pattern", binary_pattern_vi],
    ["fourier_ring", fourier_ring_vi], ["resnet_classifier", resnet_classifier_vi],
    ["vit_detection", vit_detection_vi], ["gram_matrix", gram_matrix_vi], ["srm_filter", srm_filter_vi],
    ["autocorrelation", autocorrelation_vi], ["pixel_cooccurrence", pixel_cooccurrence_vi],
    ["tamura_texture", tamura_texture_vi], ["lpq_analysis", lpq_analysis_vi],
    ["fractal_dimension", fractal_dimension_vi], ["bilateral_symmetry", bilateral_symmetry_vi],
    ["histogram_gradient", histogram_gradient_vi], ["color_coherence", color_coherence_vi],
    ["mutual_information", mutual_information_vi], ["laplacian_edge", laplacian_edge_vi],
    ["color_banding", color_banding_vi], ["color_gamut", color_gamut_vi],
    ["gabor_response", gabor_response_vi], ["glcm", glcm_vi],
    ["higher_order_statistics", higher_order_statistics_vi], ["hog_anomaly", hog_anomaly_vi],
    ["local_binary_pattern", local_binary_pattern_vi], ["local_variance_map", local_variance_map_vi],
    ["markov_transition", markov_transition_vi], ["morphological_gradient", morphological_gradient_vi],
    ["phase_congruency", phase_congruency_vi], ["power_spectral_density", power_spectral_density_vi],
    ["quantization_fingerprint", quantization_fingerprint_vi], ["radial_spectrum", radial_spectrum_vi],
    ["saturation_distribution", saturation_distribution_vi], ["upsampling_artifact", upsampling_artifact_vi],
    ["weber_descriptor", weber_descriptor_vi], ["white_balance", white_balance_vi],
    ["zipf_law", zipf_law_vi],
    ["median_filter", median_filter_vi], ["resampling", resampling_vi],
    ["contrast_enhancement", contrast_enhancement_vi], ["brisque", brisque_vi],
    ["demosaicing", demosaicing_vi], ["steganalysis", steganalysis_vi],
    ["thumbnail_analysis", thumbnail_analysis_vi], ["perceptual_hash", perceptual_hash_vi],
    ["illuminant_map", illuminant_map_vi], ["radon_transform", radon_transform_vi],
    ["zernike_moments", zernike_moments_vi], ["camera_model", camera_model_vi],
    ["image_phylogeny", image_phylogeny_vi], ["blocking_artifact", blocking_artifact_vi],
    ["efficientnet_detection", efficientnet_detection_vi], ["attention_consistency", attention_consistency_vi],
    ["style_transfer", style_transfer_vi], ["color_temperature", color_temperature_vi],
    ["sift_forensics", sift_forensics_vi], ["neural_compression", neural_compression_vi],
]);

const METHOD_I18N: Record<string, Record<string, MethodLocaleEntry>> = { en, vi };

/**
 * Get the translated name & description for a method, falling back to English.
 */
export function getMethodTranslation(methodId: string, locale: Locale): MethodLocaleEntry {
    return METHOD_I18N[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? { name: methodId, description: "" };
}

