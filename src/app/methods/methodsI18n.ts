/**
 * Aggregated method translations — imported directly from each method's i18n folder.
 * This lets the listing page render method names/descriptions without relying on global i18n keys.
 */
import type { Locale } from "@/i18n/translations";

/* ── static imports for every method ── */
import metadata_en from "./image/metadata/i18n/en.json";
import metadata_vi from "./image/metadata/i18n/vi.json";
import spectral_en from "./image/spectral/i18n/en.json";
import spectral_vi from "./image/spectral/i18n/vi.json";
import reconstruction_en from "./image/reconstruction/i18n/en.json";
import reconstruction_vi from "./image/reconstruction/i18n/vi.json";
import noise_en from "./image/noise/i18n/en.json";
import noise_vi from "./image/noise/i18n/vi.json";
import edge_en from "./image/edge/i18n/en.json";
import edge_vi from "./image/edge/i18n/vi.json";
import gradient_en from "./image/gradient/i18n/en.json";
import gradient_vi from "./image/gradient/i18n/vi.json";
import benford_en from "./image/benford/i18n/en.json";
import benford_vi from "./image/benford/i18n/vi.json";
import chromatic_en from "./image/chromatic/i18n/en.json";
import chromatic_vi from "./image/chromatic/i18n/vi.json";
import texture_en from "./image/texture/i18n/en.json";
import texture_vi from "./image/texture/i18n/vi.json";
import cfa_en from "./image/cfa/i18n/en.json";
import cfa_vi from "./image/cfa/i18n/vi.json";
import dct_en from "./image/dct/i18n/en.json";
import dct_vi from "./image/dct/i18n/vi.json";
import color_en from "./image/color/i18n/en.json";
import color_vi from "./image/color/i18n/vi.json";
import prnu_en from "./image/prnu/i18n/en.json";
import prnu_vi from "./image/prnu/i18n/vi.json";
import ela_en from "./image/ela/i18n/en.json";
import ela_vi from "./image/ela/i18n/vi.json";
import copymove_en from "./image/copymove/i18n/en.json";
import copymove_vi from "./image/copymove/i18n/vi.json";
import splicing_en from "./image/splicing/i18n/en.json";
import splicing_vi from "./image/splicing/i18n/vi.json";
import histogram_en from "./image/histogram/i18n/en.json";
import histogram_vi from "./image/histogram/i18n/vi.json";
import wavelet_en from "./image/wavelet/i18n/en.json";
import wavelet_vi from "./image/wavelet/i18n/vi.json";
import jpeg_ghost_en from "./image/jpeg_ghost/i18n/en.json";
import jpeg_ghost_vi from "./image/jpeg_ghost/i18n/vi.json";
import chi_square_en from "./image/chi_square/i18n/en.json";
import chi_square_vi from "./image/chi_square/i18n/vi.json";
import entropy_en from "./image/entropy/i18n/en.json";
import entropy_vi from "./image/entropy/i18n/vi.json";
import gan_fingerprint_en from "./image/gan_fingerprint/i18n/en.json";
import gan_fingerprint_vi from "./image/gan_fingerprint/i18n/vi.json";
import diffusion_en from "./image/diffusion/i18n/en.json";
import diffusion_vi from "./image/diffusion/i18n/vi.json";
import noiseprint_en from "./image/noiseprint/i18n/en.json";
import noiseprint_vi from "./image/noiseprint/i18n/vi.json";
import upscaling_en from "./image/upscaling/i18n/en.json";
import upscaling_vi from "./image/upscaling/i18n/vi.json";
import frequency_band_en from "./image/frequency_band/i18n/en.json";
import frequency_band_vi from "./image/frequency_band/i18n/vi.json";
import face_landmark_en from "./video/face_landmark/i18n/en.json";
import face_landmark_vi from "./video/face_landmark/i18n/vi.json";
import lighting_en from "./image/lighting/i18n/en.json";
import lighting_vi from "./image/lighting/i18n/vi.json";
import shadow_en from "./image/shadow/i18n/en.json";
import shadow_vi from "./image/shadow/i18n/vi.json";
import perspective_en from "./image/perspective/i18n/en.json";
import perspective_vi from "./image/perspective/i18n/vi.json";
import reflection_en from "./image/reflection/i18n/en.json";
import reflection_vi from "./image/reflection/i18n/vi.json";
import double_jpeg_en from "./image/double_jpeg/i18n/en.json";
import double_jpeg_vi from "./image/double_jpeg/i18n/vi.json";
import patchforensics_en from "./image/patchforensics/i18n/en.json";
import patchforensics_vi from "./image/patchforensics/i18n/vi.json";
import clip_detection_en from "./image/clip_detection/i18n/en.json";
import clip_detection_vi from "./image/clip_detection/i18n/vi.json";
import fourier_ring_en from "./image/fourier_ring/i18n/en.json";
import fourier_ring_vi from "./image/fourier_ring/i18n/vi.json";
import resnet_classifier_en from "./image/resnet_classifier/i18n/en.json";
import resnet_classifier_vi from "./image/resnet_classifier/i18n/vi.json";
import vit_detection_en from "./image/vit_detection/i18n/en.json";
import vit_detection_vi from "./image/vit_detection/i18n/vi.json";
import gram_matrix_en from "./image/gram_matrix/i18n/en.json";
import gram_matrix_vi from "./image/gram_matrix/i18n/vi.json";
import srm_filter_en from "./image/srm_filter/i18n/en.json";
import srm_filter_vi from "./image/srm_filter/i18n/vi.json";
import autocorrelation_en from "./image/autocorrelation/i18n/en.json";
import autocorrelation_vi from "./image/autocorrelation/i18n/vi.json";
import pixel_cooccurrence_en from "./image/pixel_cooccurrence/i18n/en.json";
import pixel_cooccurrence_vi from "./image/pixel_cooccurrence/i18n/vi.json";
import tamura_texture_en from "./image/tamura_texture/i18n/en.json";
import tamura_texture_vi from "./image/tamura_texture/i18n/vi.json";
import lpq_analysis_en from "./image/lpq_analysis/i18n/en.json";
import lpq_analysis_vi from "./image/lpq_analysis/i18n/vi.json";
import fractal_dimension_en from "./image/fractal_dimension/i18n/en.json";
import fractal_dimension_vi from "./image/fractal_dimension/i18n/vi.json";
import bilateral_symmetry_en from "./image/bilateral_symmetry/i18n/en.json";
import bilateral_symmetry_vi from "./image/bilateral_symmetry/i18n/vi.json";
import histogram_gradient_en from "./image/histogram_gradient/i18n/en.json";
import histogram_gradient_vi from "./image/histogram_gradient/i18n/vi.json";
import color_coherence_en from "./image/color_coherence/i18n/en.json";
import color_coherence_vi from "./image/color_coherence/i18n/vi.json";
import mutual_information_en from "./image/mutual_information/i18n/en.json";
import mutual_information_vi from "./image/mutual_information/i18n/vi.json";
import laplacian_edge_en from "./image/laplacian_edge/i18n/en.json";
import laplacian_edge_vi from "./image/laplacian_edge/i18n/vi.json";
// 19 new method imports
import color_banding_en from "./image/color_banding/i18n/en.json";
import color_banding_vi from "./image/color_banding/i18n/vi.json";
import color_gamut_en from "./image/color_gamut/i18n/en.json";
import color_gamut_vi from "./image/color_gamut/i18n/vi.json";
import gabor_response_en from "./image/gabor_response/i18n/en.json";
import gabor_response_vi from "./image/gabor_response/i18n/vi.json";
import glcm_en from "./image/glcm/i18n/en.json";
import glcm_vi from "./image/glcm/i18n/vi.json";
import higher_order_statistics_en from "./image/higher_order_statistics/i18n/en.json";
import higher_order_statistics_vi from "./image/higher_order_statistics/i18n/vi.json";
import hog_anomaly_en from "./image/hog_anomaly/i18n/en.json";
import hog_anomaly_vi from "./image/hog_anomaly/i18n/vi.json";
import local_binary_pattern_en from "./image/local_binary_pattern/i18n/en.json";
import local_binary_pattern_vi from "./image/local_binary_pattern/i18n/vi.json";
import local_variance_map_en from "./image/local_variance_map/i18n/en.json";
import local_variance_map_vi from "./image/local_variance_map/i18n/vi.json";
import markov_transition_en from "./image/markov_transition/i18n/en.json";
import markov_transition_vi from "./image/markov_transition/i18n/vi.json";
import morphological_gradient_en from "./image/morphological_gradient/i18n/en.json";
import morphological_gradient_vi from "./image/morphological_gradient/i18n/vi.json";
import phase_congruency_en from "./image/phase_congruency/i18n/en.json";
import phase_congruency_vi from "./image/phase_congruency/i18n/vi.json";
import power_spectral_density_en from "./image/power_spectral_density/i18n/en.json";
import power_spectral_density_vi from "./image/power_spectral_density/i18n/vi.json";
import quantization_fingerprint_en from "./image/quantization_fingerprint/i18n/en.json";
import quantization_fingerprint_vi from "./image/quantization_fingerprint/i18n/vi.json";
import radial_spectrum_en from "./image/radial_spectrum/i18n/en.json";
import radial_spectrum_vi from "./image/radial_spectrum/i18n/vi.json";
import saturation_distribution_en from "./image/saturation_distribution/i18n/en.json";
import saturation_distribution_vi from "./image/saturation_distribution/i18n/vi.json";
import upsampling_artifact_en from "./image/upsampling_artifact/i18n/en.json";
import upsampling_artifact_vi from "./image/upsampling_artifact/i18n/vi.json";
import weber_descriptor_en from "./image/weber_descriptor/i18n/en.json";
import weber_descriptor_vi from "./image/weber_descriptor/i18n/vi.json";
import white_balance_en from "./image/white_balance/i18n/en.json";
import white_balance_vi from "./image/white_balance/i18n/vi.json";
import zipf_law_en from "./image/zipf_law/i18n/en.json";
import zipf_law_vi from "./image/zipf_law/i18n/vi.json";
import median_filter_en from "./image/median_filter/i18n/en.json";
import median_filter_vi from "./image/median_filter/i18n/vi.json";
import resampling_en from "./image/resampling/i18n/en.json";
import resampling_vi from "./image/resampling/i18n/vi.json";
import contrast_enhancement_en from "./image/contrast_enhancement/i18n/en.json";
import contrast_enhancement_vi from "./image/contrast_enhancement/i18n/vi.json";
import brisque_en from "./image/brisque/i18n/en.json";
import brisque_vi from "./image/brisque/i18n/vi.json";
import demosaicing_en from "./image/demosaicing/i18n/en.json";
import demosaicing_vi from "./image/demosaicing/i18n/vi.json";
import steganalysis_en from "./image/steganalysis/i18n/en.json";
import steganalysis_vi from "./image/steganalysis/i18n/vi.json";
import thumbnail_analysis_en from "./image/thumbnail_analysis/i18n/en.json";
import thumbnail_analysis_vi from "./image/thumbnail_analysis/i18n/vi.json";
import perceptual_hash_en from "./image/perceptual_hash/i18n/en.json";
import perceptual_hash_vi from "./image/perceptual_hash/i18n/vi.json";
import illuminant_map_en from "./image/illuminant_map/i18n/en.json";
import illuminant_map_vi from "./image/illuminant_map/i18n/vi.json";
import radon_transform_en from "./image/radon_transform/i18n/en.json";
import radon_transform_vi from "./image/radon_transform/i18n/vi.json";
import zernike_moments_en from "./image/zernike_moments/i18n/en.json";
import zernike_moments_vi from "./image/zernike_moments/i18n/vi.json";
import camera_model_en from "./image/camera_model/i18n/en.json";
import camera_model_vi from "./image/camera_model/i18n/vi.json";
import image_phylogeny_en from "./image/image_phylogeny/i18n/en.json";
import image_phylogeny_vi from "./image/image_phylogeny/i18n/vi.json";
import blocking_artifact_en from "./image/blocking_artifact/i18n/en.json";
import blocking_artifact_vi from "./image/blocking_artifact/i18n/vi.json";
import efficientnet_detection_en from "./image/efficientnet_detection/i18n/en.json";
import efficientnet_detection_vi from "./image/efficientnet_detection/i18n/vi.json";
import attention_consistency_en from "./image/attention_consistency/i18n/en.json";
import attention_consistency_vi from "./image/attention_consistency/i18n/vi.json";
import style_transfer_en from "./image/style_transfer/i18n/en.json";
import style_transfer_vi from "./image/style_transfer/i18n/vi.json";
import color_temperature_en from "./image/color_temperature/i18n/en.json";
import color_temperature_vi from "./image/color_temperature/i18n/vi.json";
import sift_forensics_en from "./image/sift_forensics/i18n/en.json";
import sift_forensics_vi from "./image/sift_forensics/i18n/vi.json";
import neural_compression_en from "./image/neural_compression/i18n/en.json";
import neural_compression_vi from "./image/neural_compression/i18n/vi.json";
// Metadata Analysis v10 (10)
import exif_integrity_en from "./image/exif_integrity/i18n/en.json";
import exif_integrity_vi from "./image/exif_integrity/i18n/vi.json";
import xmp_provenance_en from "./image/xmp_provenance/i18n/en.json";
import xmp_provenance_vi from "./image/xmp_provenance/i18n/vi.json";
import iptc_verification_en from "./image/iptc_verification/i18n/en.json";
import iptc_verification_vi from "./image/iptc_verification/i18n/vi.json";
import gps_consistency_en from "./image/gps_consistency/i18n/en.json";
import gps_consistency_vi from "./image/gps_consistency/i18n/vi.json";
import timestamp_forensics_en from "./image/timestamp_forensics/i18n/en.json";
import timestamp_forensics_vi from "./image/timestamp_forensics/i18n/vi.json";
import file_structure_en from "./image/file_structure/i18n/en.json";
import file_structure_vi from "./image/file_structure/i18n/vi.json";
import color_profile_meta_en from "./image/color_profile_meta/i18n/en.json";
import color_profile_meta_vi from "./image/color_profile_meta/i18n/vi.json";
import c2pa_verification_en from "./image/c2pa_verification/i18n/en.json";
import c2pa_verification_vi from "./image/c2pa_verification/i18n/vi.json";
import resolution_consistency_en from "./image/resolution_consistency/i18n/en.json";
import resolution_consistency_vi from "./image/resolution_consistency/i18n/vi.json";
import software_fingerprint_en from "./image/software_fingerprint/i18n/en.json";
import software_fingerprint_vi from "./image/software_fingerprint/i18n/vi.json";
// Video Analysis Methods
import temporal_consistency_en from "./video/temporal_consistency/i18n/en.json";
import temporal_consistency_vi from "./video/temporal_consistency/i18n/vi.json";
import lip_sync_analysis_en from "./video/lip_sync_analysis/i18n/en.json";
import lip_sync_analysis_vi from "./video/lip_sync_analysis/i18n/vi.json";
import frame_interpolation_en from "./video/frame_interpolation/i18n/en.json";
import frame_interpolation_vi from "./video/frame_interpolation/i18n/vi.json";
import optical_flow_anomaly_en from "./video/optical_flow_anomaly/i18n/en.json";
import optical_flow_anomaly_vi from "./video/optical_flow_anomaly/i18n/vi.json";
import audio_visual_sync_en from "./video/audio_visual_sync/i18n/en.json";
import audio_visual_sync_vi from "./video/audio_visual_sync/i18n/vi.json";
import deepfake_artifact_en from "./video/deepfake_artifact/i18n/en.json";
import deepfake_artifact_vi from "./video/deepfake_artifact/i18n/vi.json";
import scene_transition_en from "./video/scene_transition/i18n/en.json";
import scene_transition_vi from "./video/scene_transition/i18n/vi.json";
import motion_blur_consistency_en from "./video/motion_blur_consistency/i18n/en.json";
import motion_blur_consistency_vi from "./video/motion_blur_consistency/i18n/vi.json";
import background_stability_en from "./video/background_stability/i18n/en.json";
import background_stability_vi from "./video/background_stability/i18n/vi.json";
import gaze_direction_en from "./video/gaze_direction/i18n/en.json";
import gaze_direction_vi from "./video/gaze_direction/i18n/vi.json";
import facial_reenactment_en from "./video/facial_reenactment/i18n/en.json";
import facial_reenactment_vi from "./video/facial_reenactment/i18n/vi.json";
import video_compression_trace_en from "./video/video_compression_trace/i18n/en.json";
import video_compression_trace_vi from "./video/video_compression_trace/i18n/vi.json";
import flicker_analysis_en from "./video/flicker_analysis/i18n/en.json";
import flicker_analysis_vi from "./video/flicker_analysis/i18n/vi.json";
import hand_gesture_consistency_en from "./video/hand_gesture_consistency/i18n/en.json";
import hand_gesture_consistency_vi from "./video/hand_gesture_consistency/i18n/vi.json";
import body_proportion_en from "./video/body_proportion/i18n/en.json";
import body_proportion_vi from "./video/body_proportion/i18n/vi.json";
// Text Analysis Methods
import perplexity_analysis_en from "./text/perplexity_analysis/i18n/en.json";
import perplexity_analysis_vi from "./text/perplexity_analysis/i18n/vi.json";
import burstiness_detection_en from "./text/burstiness_detection/i18n/en.json";
import burstiness_detection_vi from "./text/burstiness_detection/i18n/vi.json";
import vocabulary_diversity_en from "./text/vocabulary_diversity/i18n/en.json";
import vocabulary_diversity_vi from "./text/vocabulary_diversity/i18n/vi.json";
import stylometric_analysis_en from "./text/stylometric_analysis/i18n/en.json";
import stylometric_analysis_vi from "./text/stylometric_analysis/i18n/vi.json";
import ngram_frequency_en from "./text/ngram_frequency/i18n/en.json";
import ngram_frequency_vi from "./text/ngram_frequency/i18n/vi.json";
import repetition_pattern_en from "./text/repetition_pattern/i18n/en.json";
import repetition_pattern_vi from "./text/repetition_pattern/i18n/vi.json";
import coherence_analysis_en from "./text/coherence_analysis/i18n/en.json";
import coherence_analysis_vi from "./text/coherence_analysis/i18n/vi.json";
import entropy_distribution_en from "./text/entropy_distribution/i18n/en.json";
import entropy_distribution_vi from "./text/entropy_distribution/i18n/vi.json";
import sentence_length_variance_en from "./text/sentence_length_variance/i18n/en.json";
import sentence_length_variance_vi from "./text/sentence_length_variance/i18n/vi.json";
import readability_score_en from "./text/readability_score/i18n/en.json";
import readability_score_vi from "./text/readability_score/i18n/vi.json";
import punctuation_pattern_en from "./text/punctuation_pattern/i18n/en.json";
import punctuation_pattern_vi from "./text/punctuation_pattern/i18n/vi.json";
import topic_consistency_en from "./text/topic_consistency/i18n/en.json";
import topic_consistency_vi from "./text/topic_consistency/i18n/vi.json";
import word_frequency_rank_en from "./text/word_frequency_rank/i18n/en.json";
import word_frequency_rank_vi from "./text/word_frequency_rank/i18n/vi.json";
import semantic_density_en from "./text/semantic_density/i18n/en.json";
import semantic_density_vi from "./text/semantic_density/i18n/vi.json";
import writing_rhythm_en from "./text/writing_rhythm/i18n/en.json";
import writing_rhythm_vi from "./text/writing_rhythm/i18n/vi.json";

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
    ["clip_detection", clip_detection_en],
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
    // Metadata Analysis v10
    ["exif_integrity", exif_integrity_en], ["xmp_provenance", xmp_provenance_en],
    ["iptc_verification", iptc_verification_en], ["gps_consistency", gps_consistency_en],
    ["timestamp_forensics", timestamp_forensics_en], ["file_structure", file_structure_en],
    ["color_profile_meta", color_profile_meta_en], ["c2pa_verification", c2pa_verification_en],
    ["resolution_consistency", resolution_consistency_en], ["software_fingerprint", software_fingerprint_en],
    // Video Analysis Methods
    ["temporal_consistency", temporal_consistency_en], ["lip_sync_analysis", lip_sync_analysis_en],
    ["frame_interpolation", frame_interpolation_en], ["optical_flow_anomaly", optical_flow_anomaly_en],
    ["audio_visual_sync", audio_visual_sync_en],
    ["deepfake_artifact", deepfake_artifact_en], ["scene_transition", scene_transition_en],
    ["motion_blur_consistency", motion_blur_consistency_en], ["background_stability", background_stability_en],
    ["gaze_direction", gaze_direction_en], ["facial_reenactment", facial_reenactment_en],
    ["video_compression_trace", video_compression_trace_en], ["flicker_analysis", flicker_analysis_en],
    ["hand_gesture_consistency", hand_gesture_consistency_en], ["body_proportion", body_proportion_en],
    // Text Analysis Methods
    ["perplexity_analysis", perplexity_analysis_en], ["burstiness_detection", burstiness_detection_en],
    ["vocabulary_diversity", vocabulary_diversity_en], ["stylometric_analysis", stylometric_analysis_en],
    ["ngram_frequency", ngram_frequency_en],
    ["repetition_pattern", repetition_pattern_en], ["coherence_analysis", coherence_analysis_en],
    ["entropy_distribution", entropy_distribution_en], ["sentence_length_variance", sentence_length_variance_en],
    ["readability_score", readability_score_en], ["punctuation_pattern", punctuation_pattern_en],
    ["topic_consistency", topic_consistency_en], ["word_frequency_rank", word_frequency_rank_en],
    ["semantic_density", semantic_density_en], ["writing_rhythm", writing_rhythm_en],
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
    ["clip_detection", clip_detection_vi],
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
    // Metadata Analysis v10
    ["exif_integrity", exif_integrity_vi], ["xmp_provenance", xmp_provenance_vi],
    ["iptc_verification", iptc_verification_vi], ["gps_consistency", gps_consistency_vi],
    ["timestamp_forensics", timestamp_forensics_vi], ["file_structure", file_structure_vi],
    ["color_profile_meta", color_profile_meta_vi], ["c2pa_verification", c2pa_verification_vi],
    ["resolution_consistency", resolution_consistency_vi], ["software_fingerprint", software_fingerprint_vi],
    // Video Analysis Methods
    ["temporal_consistency", temporal_consistency_vi], ["lip_sync_analysis", lip_sync_analysis_vi],
    ["frame_interpolation", frame_interpolation_vi], ["optical_flow_anomaly", optical_flow_anomaly_vi],
    ["audio_visual_sync", audio_visual_sync_vi],
    ["deepfake_artifact", deepfake_artifact_vi], ["scene_transition", scene_transition_vi],
    ["motion_blur_consistency", motion_blur_consistency_vi], ["background_stability", background_stability_vi],
    ["gaze_direction", gaze_direction_vi], ["facial_reenactment", facial_reenactment_vi],
    ["video_compression_trace", video_compression_trace_vi], ["flicker_analysis", flicker_analysis_vi],
    ["hand_gesture_consistency", hand_gesture_consistency_vi], ["body_proportion", body_proportion_vi],
    // Text Analysis Methods
    ["perplexity_analysis", perplexity_analysis_vi], ["burstiness_detection", burstiness_detection_vi],
    ["vocabulary_diversity", vocabulary_diversity_vi], ["stylometric_analysis", stylometric_analysis_vi],
    ["ngram_frequency", ngram_frequency_vi],
    ["repetition_pattern", repetition_pattern_vi], ["coherence_analysis", coherence_analysis_vi],
    ["entropy_distribution", entropy_distribution_vi], ["sentence_length_variance", sentence_length_variance_vi],
    ["readability_score", readability_score_vi], ["punctuation_pattern", punctuation_pattern_vi],
    ["topic_consistency", topic_consistency_vi], ["word_frequency_rank", word_frequency_rank_vi],
    ["semantic_density", semantic_density_vi], ["writing_rhythm", writing_rhythm_vi],
]);

const METHOD_I18N: Record<string, Record<string, MethodLocaleEntry>> = { en, vi };

/**
 * Get the translated name & description for a method, falling back to English.
 */
export function getMethodTranslation(methodId: string, locale: Locale): MethodLocaleEntry {
    return METHOD_I18N[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? { name: methodId, description: "" };
}

