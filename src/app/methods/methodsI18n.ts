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
// Video Analysis Methods v2
import speech_cadence_en from "./video/speech_cadence/i18n/en.json";
import speech_cadence_vi from "./video/speech_cadence/i18n/vi.json";
import ear_consistency_en from "./video/ear_consistency/i18n/en.json";
import ear_consistency_vi from "./video/ear_consistency/i18n/vi.json";
import hair_dynamics_en from "./video/hair_dynamics/i18n/en.json";
import hair_dynamics_vi from "./video/hair_dynamics/i18n/vi.json";
import skin_texture_temporal_en from "./video/skin_texture_temporal/i18n/en.json";
import skin_texture_temporal_vi from "./video/skin_texture_temporal/i18n/vi.json";
import shadow_consistency_video_en from "./video/shadow_consistency_video/i18n/en.json";
import shadow_consistency_video_vi from "./video/shadow_consistency_video/i18n/vi.json";
import reflection_consistency_video_en from "./video/reflection_consistency_video/i18n/en.json";
import reflection_consistency_video_vi from "./video/reflection_consistency_video/i18n/vi.json";
import pupil_dynamics_en from "./video/pupil_dynamics/i18n/en.json";
import pupil_dynamics_vi from "./video/pupil_dynamics/i18n/vi.json";
import head_pose_estimation_en from "./video/head_pose_estimation/i18n/en.json";
import head_pose_estimation_vi from "./video/head_pose_estimation/i18n/vi.json";
import video_noise_pattern_en from "./video/video_noise_pattern/i18n/en.json";
import video_noise_pattern_vi from "./video/video_noise_pattern/i18n/vi.json";
import heartbeat_detection_en from "./video/heartbeat_detection/i18n/en.json";
import heartbeat_detection_vi from "./video/heartbeat_detection/i18n/vi.json";
import micro_expression_en from "./video/micro_expression/i18n/en.json";
import micro_expression_vi from "./video/micro_expression/i18n/vi.json";
import clothing_consistency_en from "./video/clothing_consistency/i18n/en.json";
import clothing_consistency_vi from "./video/clothing_consistency/i18n/vi.json";
import face_3d_reconstruction_en from "./video/face_3d_reconstruction/i18n/en.json";
import face_3d_reconstruction_vi from "./video/face_3d_reconstruction/i18n/vi.json";
import video_codec_analysis_en from "./video/video_codec_analysis/i18n/en.json";
import video_codec_analysis_vi from "./video/video_codec_analysis/i18n/vi.json";
import inter_frame_forgery_en from "./video/inter_frame_forgery/i18n/en.json";
import inter_frame_forgery_vi from "./video/inter_frame_forgery/i18n/vi.json";
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
// Text Analysis Methods v2
import pos_tag_analysis_en from "./text/pos_tag_analysis/i18n/en.json";
import pos_tag_analysis_vi from "./text/pos_tag_analysis/i18n/vi.json";
import discourse_markers_en from "./text/discourse_markers/i18n/en.json";
import discourse_markers_vi from "./text/discourse_markers/i18n/vi.json";
import coreference_chain_en from "./text/coreference_chain/i18n/en.json";
import coreference_chain_vi from "./text/coreference_chain/i18n/vi.json";
import named_entity_consistency_en from "./text/named_entity_consistency/i18n/en.json";
import named_entity_consistency_vi from "./text/named_entity_consistency/i18n/vi.json";
import hedging_language_en from "./text/hedging_language/i18n/en.json";
import hedging_language_vi from "./text/hedging_language/i18n/vi.json";
import type_token_ratio_en from "./text/type_token_ratio/i18n/en.json";
import type_token_ratio_vi from "./text/type_token_ratio/i18n/vi.json";
import syntactic_complexity_en from "./text/syntactic_complexity/i18n/en.json";
import syntactic_complexity_vi from "./text/syntactic_complexity/i18n/vi.json";
import passive_voice_frequency_en from "./text/passive_voice_frequency/i18n/en.json";
import passive_voice_frequency_vi from "./text/passive_voice_frequency/i18n/vi.json";
import lexical_sophistication_en from "./text/lexical_sophistication/i18n/en.json";
import lexical_sophistication_vi from "./text/lexical_sophistication/i18n/vi.json";
import text_compression_ratio_en from "./text/text_compression_ratio/i18n/en.json";
import text_compression_ratio_vi from "./text/text_compression_ratio/i18n/vi.json";
import function_word_distribution_en from "./text/function_word_distribution/i18n/en.json";
import function_word_distribution_vi from "./text/function_word_distribution/i18n/vi.json";
import pronoun_usage_pattern_en from "./text/pronoun_usage_pattern/i18n/en.json";
import pronoun_usage_pattern_vi from "./text/pronoun_usage_pattern/i18n/vi.json";
import clause_depth_analysis_en from "./text/clause_depth_analysis/i18n/en.json";
import clause_depth_analysis_vi from "./text/clause_depth_analysis/i18n/vi.json";
import collocation_strength_en from "./text/collocation_strength/i18n/en.json";
import collocation_strength_vi from "./text/collocation_strength/i18n/vi.json";
import temporal_expression_en from "./text/temporal_expression/i18n/en.json";
import temporal_expression_vi from "./text/temporal_expression/i18n/vi.json";

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
    // Video Analysis Methods v2
    ["speech_cadence", speech_cadence_en], ["ear_consistency", ear_consistency_en],
    ["hair_dynamics", hair_dynamics_en], ["skin_texture_temporal", skin_texture_temporal_en],
    ["shadow_consistency_video", shadow_consistency_video_en], ["reflection_consistency_video", reflection_consistency_video_en],
    ["pupil_dynamics", pupil_dynamics_en], ["head_pose_estimation", head_pose_estimation_en],
    ["video_noise_pattern", video_noise_pattern_en], ["heartbeat_detection", heartbeat_detection_en],
    ["micro_expression", micro_expression_en], ["clothing_consistency", clothing_consistency_en],
    ["face_3d_reconstruction", face_3d_reconstruction_en], ["video_codec_analysis", video_codec_analysis_en],
    ["inter_frame_forgery", inter_frame_forgery_en],
    // Text Analysis Methods
    ["perplexity_analysis", perplexity_analysis_en], ["burstiness_detection", burstiness_detection_en],
    ["vocabulary_diversity", vocabulary_diversity_en], ["stylometric_analysis", stylometric_analysis_en],
    ["ngram_frequency", ngram_frequency_en],
    ["repetition_pattern", repetition_pattern_en], ["coherence_analysis", coherence_analysis_en],
    ["entropy_distribution", entropy_distribution_en], ["sentence_length_variance", sentence_length_variance_en],
    ["readability_score", readability_score_en], ["punctuation_pattern", punctuation_pattern_en],
    ["topic_consistency", topic_consistency_en], ["word_frequency_rank", word_frequency_rank_en],
    ["semantic_density", semantic_density_en], ["writing_rhythm", writing_rhythm_en],
    // Text Analysis Methods v2
    ["pos_tag_analysis", pos_tag_analysis_en], ["discourse_markers", discourse_markers_en],
    ["coreference_chain", coreference_chain_en], ["named_entity_consistency", named_entity_consistency_en],
    ["hedging_language", hedging_language_en], ["type_token_ratio", type_token_ratio_en],
    ["syntactic_complexity", syntactic_complexity_en], ["passive_voice_frequency", passive_voice_frequency_en],
    ["lexical_sophistication", lexical_sophistication_en], ["text_compression_ratio", text_compression_ratio_en],
    ["function_word_distribution", function_word_distribution_en], ["pronoun_usage_pattern", pronoun_usage_pattern_en],
    ["clause_depth_analysis", clause_depth_analysis_en], ["collocation_strength", collocation_strength_en],
    ["temporal_expression", temporal_expression_en],
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
    // Video Analysis Methods v2
    ["speech_cadence", speech_cadence_vi], ["ear_consistency", ear_consistency_vi],
    ["hair_dynamics", hair_dynamics_vi], ["skin_texture_temporal", skin_texture_temporal_vi],
    ["shadow_consistency_video", shadow_consistency_video_vi], ["reflection_consistency_video", reflection_consistency_video_vi],
    ["pupil_dynamics", pupil_dynamics_vi], ["head_pose_estimation", head_pose_estimation_vi],
    ["video_noise_pattern", video_noise_pattern_vi], ["heartbeat_detection", heartbeat_detection_vi],
    ["micro_expression", micro_expression_vi], ["clothing_consistency", clothing_consistency_vi],
    ["face_3d_reconstruction", face_3d_reconstruction_vi], ["video_codec_analysis", video_codec_analysis_vi],
    ["inter_frame_forgery", inter_frame_forgery_vi],
    // Text Analysis Methods
    ["perplexity_analysis", perplexity_analysis_vi], ["burstiness_detection", burstiness_detection_vi],
    ["vocabulary_diversity", vocabulary_diversity_vi], ["stylometric_analysis", stylometric_analysis_vi],
    ["ngram_frequency", ngram_frequency_vi],
    ["repetition_pattern", repetition_pattern_vi], ["coherence_analysis", coherence_analysis_vi],
    ["entropy_distribution", entropy_distribution_vi], ["sentence_length_variance", sentence_length_variance_vi],
    ["readability_score", readability_score_vi], ["punctuation_pattern", punctuation_pattern_vi],
    ["topic_consistency", topic_consistency_vi], ["word_frequency_rank", word_frequency_rank_vi],
    ["semantic_density", semantic_density_vi], ["writing_rhythm", writing_rhythm_vi],
    // Text Analysis Methods v2
    ["pos_tag_analysis", pos_tag_analysis_vi], ["discourse_markers", discourse_markers_vi],
    ["coreference_chain", coreference_chain_vi], ["named_entity_consistency", named_entity_consistency_vi],
    ["hedging_language", hedging_language_vi], ["type_token_ratio", type_token_ratio_vi],
    ["syntactic_complexity", syntactic_complexity_vi], ["passive_voice_frequency", passive_voice_frequency_vi],
    ["lexical_sophistication", lexical_sophistication_vi], ["text_compression_ratio", text_compression_ratio_vi],
    ["function_word_distribution", function_word_distribution_vi], ["pronoun_usage_pattern", pronoun_usage_pattern_vi],
    ["clause_depth_analysis", clause_depth_analysis_vi], ["collocation_strength", collocation_strength_vi],
    ["temporal_expression", temporal_expression_vi],
]);

const METHOD_I18N: Record<string, Record<string, MethodLocaleEntry>> = { en, vi };

// Video Analysis Methods v3 - Inline fallback data for 50 new methods
const VIDEO_V3_METHODS: Record<string, Record<string, MethodLocaleEntry>> = {
    en: {
        "color_temporal_shift": { name: "Color Temporal Shift", description: "Analyzes color drift patterns across spatial regions to detect AI generation artifacts" },
        "frame_drop": { name: "Frame Drop Detection", description: "Detects frame continuity breaks and drop patterns common in AI-generated video" },
        "blink_rate": { name: "Blink Rate Analysis", description: "Analyzes eye blink patterns for naturalness — AI often generates unnatural blink rates" },
        "video_noise": { name: "Video Noise Consistency", description: "Examines noise pattern consistency across frame regions" },
        "skin_texture": { name: "Skin Texture Realism", description: "Analyzes skin micro-texture and pore detail for realism" },
        "hair_detail": { name: "Hair Detail Analysis", description: "Examines hair strand detail and rendering quality" },
        "eye_reflection": { name: "Eye Reflection Consistency", description: "Analyzes catchlight and eye reflection patterns" },
        "jawline": { name: "Jawline Consistency", description: "Analyzes jaw boundary smoothness and consistency" },
        "ear_symmetry": { name: "Ear Symmetry Analysis", description: "Examines ear shape and symmetry consistency" },
        "expression": { name: "Expression Naturalness", description: "Analyzes facial expression dynamics for naturalness" },
        "pupil_dilation": { name: "Pupil Dilation", description: "Analyzes pupil response and dilation patterns" },
        "facial_wrinkle": { name: "Facial Wrinkle Consistency", description: "Analyzes wrinkle pattern and depth consistency" },
        "nose_geometry": { name: "Nose Geometry", description: "Analyzes nose 3D consistency and geometry" },
        "forehead_texture": { name: "Forehead Texture", description: "Analyzes forehead micro-pattern and texture" },
        "teeth": { name: "Teeth Consistency", description: "Analyzes teeth rendering and alignment" },
        "eyebrow": { name: "Eyebrow Naturalness", description: "Analyzes eyebrow texture and shape" },
        "neck_transition": { name: "Neck Transition", description: "Analyzes neck-face boundary transition" },
        "shoulder": { name: "Shoulder Alignment", description: "Analyzes shoulder geometry and alignment" },
        "clothing_fold": { name: "Clothing Fold Physics", description: "Analyzes clothing fold physics simulation" },
        "finger_geometry": { name: "Finger Geometry", description: "Analyzes finger count and geometry" },
        "bg_perspective": { name: "Background Perspective", description: "Analyzes background perspective geometry consistency" },
        "reflection_physics": { name: "Reflection Physics", description: "Analyzes reflection physical consistency" },
        "shadow_temporal": { name: "Shadow Temporal", description: "Analyzes shadow movement consistency over time" },
        "watermark": { name: "Watermark Detection", description: "Analyzes AI watermark and signature patterns" },
        "motion_vector": { name: "Motion Vector Analysis", description: "Analyzes motion vector consistency and smoothness" },
        "head_pose_v2": { name: "Head Pose Estimation v2", description: "Analyzes head pose physics and rotation" },
        "micro_expression_v2": { name: "Micro-Expression v2", description: "Detects micro-expression patterns and naturalness" },
        "face_alignment_v": { name: "Face Alignment", description: "Analyzes face alignment geometry consistency" },
        "depth_consistency": { name: "Depth Consistency", description: "Analyzes depth map consistency" },
        "bokeh": { name: "Bokeh Naturalness", description: "Analyzes bokeh effect naturalness" },
        "lens_distortion_v": { name: "Lens Distortion", description: "Analyzes lens distortion pattern" },
        "stabilization": { name: "Stabilization Artifact", description: "Detects video stabilization artifacts" },
        "edge_ringing": { name: "Edge Ringing", description: "Analyzes edge ringing artifacts" },
        "chroma_bleed": { name: "Chroma Bleed", description: "Detects chroma bleed artifacts" },
        "pixel_repetition_v": { name: "Pixel Repetition", description: "Analyzes pixel pattern repetition in frame" },
        "video_hash": { name: "Video Hash Analysis", description: "Analyzes video perceptual hash" },
        "face_boundary_blend": { name: "Face Boundary Blend", description: "Detects face boundary blending artifacts" },
        "color_quant_v": { name: "Color Quantization", description: "Analyzes color quantization level" },
        "spatial_freq_temporal": { name: "Spatial Freq Temporal", description: "Analyzes spatial frequency temporal stability" },
        "video_blockiness": { name: "Video Blockiness", description: "Analyzes video compression blockiness" },
        "temporal_noise": { name: "Temporal Noise Pattern", description: "Analyzes temporal noise pattern" },
        "frame_energy": { name: "Frame Energy", description: "Analyzes frame energy distribution" },
        "video_sharpness": { name: "Video Sharpness", description: "Analyzes video sharpness consistency" },
        "object_boundary": { name: "Object Boundary", description: "Analyzes object boundary consistency" },
        "texture_flow": { name: "Texture Flow", description: "Analyzes texture flow coherence" },
        "video_grain": { name: "Video Grain", description: "Analyzes film grain pattern" },
        "contrast_temporal": { name: "Contrast Temporal", description: "Analyzes contrast temporal stability" },
        "video_saturation": { name: "Video Saturation", description: "Analyzes video saturation distribution" },
        "face_illumination": { name: "Face Illumination", description: "Analyzes face illumination consistency" },
        "video_artifact_grid": { name: "Video Artifact Grid", description: "Grid-based artifact detection" },
    },
    vi: {
        "color_temporal_shift": { name: "Phân tích dịch chuyển màu", description: "Phân tích mẫu dịch chuyển màu sắc trên các vùng không gian để phát hiện dấu vết AI" },
        "frame_drop": { name: "Phát hiện mất khung hình", description: "Phát hiện sự gãy liên tục khung hình, phổ biến trong video AI" },
        "blink_rate": { name: "Phân tích tỷ lệ chớp mắt", description: "Phân tích mẫu chớp mắt tự nhiên — AI thường tạo tỷ lệ chớp mắt không tự nhiên" },
        "video_noise": { name: "Nhất quán nhiễu video", description: "Kiểm tra tính nhất quán của mẫu nhiễu trên các vùng khung hình" },
        "skin_texture": { name: "Chất cảm da thực tế", description: "Phân tích vi kết cấu da và chi tiết lỗ chân lông" },
        "hair_detail": { name: "Phân tích chi tiết tóc", description: "Kiểm tra chi tiết sợi tóc và chất lượng render" },
        "eye_reflection": { name: "Nhất quán phản chiếu mắt", description: "Phân tích mẫu phản chiếu ánh sáng trong mắt" },
        "jawline": { name: "Nhất quán đường hàm", description: "Phân tích độ mịn và nhất quán của đường viền hàm" },
        "ear_symmetry": { name: "Phân tích đối xứng tai", description: "Kiểm tra hình dạng và đối xứng tai" },
        "expression": { name: "Tự nhiên biểu cảm", description: "Phân tích động lực biểu cảm khuôn mặt" },
        "pupil_dilation": { name: "Giãn đồng tử", description: "Phân tích phản ứng và mẫu giãn nở đồng tử" },
        "facial_wrinkle": { name: "Nhất quán nếp nhăn", description: "Phân tích mẫu nếp nhăn và độ sâu" },
        "nose_geometry": { name: "Hình học mũi", description: "Phân tích tính nhất quán 3D của mũi" },
        "forehead_texture": { name: "Kết cấu trán", description: "Phân tích vi mẫu và kết cấu trán" },
        "teeth": { name: "Nhất quán răng", description: "Phân tích render và sắp xếp răng" },
        "eyebrow": { name: "Tự nhiên lông mày", description: "Phân tích kết cấu và hình dạng lông mày" },
        "neck_transition": { name: "Chuyển tiếp cổ", description: "Phân tích chuyển tiếp đường viền cổ-mặt" },
        "shoulder": { name: "Căn chỉnh vai", description: "Phân tích hình học và căn chỉnh vai" },
        "clothing_fold": { name: "Vật lý nếp gấp áo", description: "Phân tích mô phỏng vật lý nếp gấp quần áo" },
        "finger_geometry": { name: "Hình học ngón tay", description: "Phân tích số lượng và hình học ngón tay" },
        "bg_perspective": { name: "Phối cảnh nền", description: "Phân tích tính nhất quán hình học phối cảnh nền" },
        "reflection_physics": { name: "Vật lý phản chiếu", description: "Phân tích tính nhất quán vật lý phản chiếu" },
        "shadow_temporal": { name: "Bóng đổ thời gian", description: "Phân tích tính nhất quán chuyển động bóng đổ" },
        "watermark": { name: "Phát hiện watermark", description: "Phân tích watermark và dấu hiệu AI" },
        "motion_vector": { name: "Phân tích vector chuyển động", description: "Phân tích tính nhất quán vector chuyển động" },
        "head_pose_v2": { name: "Ước lượng tư thế đầu v2", description: "Phân tích vật lý tư thế và xoay đầu" },
        "micro_expression_v2": { name: "Vi biểu cảm v2", description: "Phát hiện mẫu vi biểu cảm và tính tự nhiên" },
        "face_alignment_v": { name: "Căn chỉnh khuôn mặt", description: "Phân tích tính nhất quán hình học căn chỉnh mặt" },
        "depth_consistency": { name: "Nhất quán độ sâu", description: "Phân tích tính nhất quán bản đồ độ sâu" },
        "bokeh": { name: "Tự nhiên bokeh", description: "Phân tích tính tự nhiên hiệu ứng bokeh" },
        "lens_distortion_v": { name: "Méo ống kính", description: "Phân tích mẫu méo ống kính" },
        "stabilization": { name: "Dấu vết ổn định", description: "Phát hiện dấu vết ổn định video" },
        "edge_ringing": { name: "Ringing biên", description: "Phân tích dấu vết ringing biên" },
        "chroma_bleed": { name: "Chảy sắc độ", description: "Phát hiện dấu vết chảy sắc độ" },
        "pixel_repetition_v": { name: "Lặp pixel", description: "Phân tích sự lặp lại mẫu pixel trong khung hình" },
        "video_hash": { name: "Phân tích hash video", description: "Phân tích hash nhận thức video" },
        "face_boundary_blend": { name: "Pha trộn biên mặt", description: "Phát hiện dấu vết pha trộn biên khuôn mặt" },
        "color_quant_v": { name: "Lượng tử hóa màu", description: "Phân tích mức lượng tử hóa màu" },
        "spatial_freq_temporal": { name: "Tần số không gian", description: "Phân tích ổn định tần số không gian theo thời gian" },
        "video_blockiness": { name: "Khối video", description: "Phân tích tính khối nén video" },
        "temporal_noise": { name: "Mẫu nhiễu thời gian", description: "Phân tích mẫu nhiễu theo thời gian" },
        "frame_energy": { name: "Năng lượng khung hình", description: "Phân tích phân bổ năng lượng khung hình" },
        "video_sharpness": { name: "Sắc nét video", description: "Phân tích tính nhất quán sắc nét video" },
        "object_boundary": { name: "Biên đối tượng", description: "Phân tích tính nhất quán biên đối tượng" },
        "texture_flow": { name: "Dòng kết cấu", description: "Phân tích tính liên kết dòng kết cấu" },
        "video_grain": { name: "Hạt phim video", description: "Phân tích mẫu hạt phim" },
        "contrast_temporal": { name: "Tương phản thời gian", description: "Phân tích ổn định tương phản theo thời gian" },
        "video_saturation": { name: "Bão hòa video", description: "Phân tích phân bổ bão hòa video" },
        "face_illumination": { name: "Chiếu sáng mặt", description: "Phân tích tính nhất quán chiếu sáng khuôn mặt" },
        "video_artifact_grid": { name: "Lưới dấu vết", description: "Phát hiện dấu vết dựa trên lưới" },
    },
};

// Text Analysis Methods v3 - Inline fallback data for 35 new methods
const TEXT_V3_METHODS: Record<string, Record<string, MethodLocaleEntry>> = {
    en: {
        "adverb_frequency": { name: "Adverb Frequency", description: "Analyzes adverb usage patterns — AI text often overuses adverbs" },
        "contraction_usage": { name: "Contraction Usage", description: "Measures contraction frequency — AI tends to use fewer contractions" },
        "sentence_opener": { name: "Sentence Opener Diversity", description: "Analyzes sentence beginning diversity" },
        "emotional_tone": { name: "Emotional Tone Variance", description: "Measures emotional variation across text" },
        "metaphor_density": { name: "Metaphor Density", description: "Analyzes figurative language density" },
        "question_frequency": { name: "Question Frequency", description: "Measures question usage patterns" },
        "paragraph_structure": { name: "Paragraph Structure", description: "Analyzes paragraph organization" },
        "transition_quality": { name: "Transition Quality", description: "Evaluates transition smoothness between ideas" },
        "idiom_detection": { name: "Idiom Detection", description: "Detects idiomatic expression usage" },
        "abstract_concrete": { name: "Abstract-Concrete Ratio", description: "Analyzes abstract vs concrete language balance" },
        "first_person_usage": { name: "First Person Usage", description: "Analyzes first person perspective patterns" },
        "technical_jargon": { name: "Technical Jargon", description: "Measures technical term density" },
        "redundancy_detection": { name: "Redundancy Detection", description: "Detects redundant phrases and repetition" },
        "word_length_dist": { name: "Word Length Distribution", description: "Analyzes word length distribution patterns" },
        "hapax_legomena": { name: "Hapax Legomena", description: "Analyzes unique word occurrence rate" },
        "conjunction_density": { name: "Conjunction Density", description: "Measures conjunction usage patterns" },
        "preposition_pattern": { name: "Preposition Pattern", description: "Analyzes preposition distribution" },
        "modal_verb_frequency": { name: "Modal Verb Frequency", description: "Measures modal verb usage patterns" },
        "subordinate_clause": { name: "Subordinate Clause", description: "Analyzes subordinate clause frequency" },
        "argument_structure": { name: "Argument Structure", description: "Analyzes argument chain structure" },
        "text_formality": { name: "Text Formality", description: "Measures text formality level" },
        "negation_pattern": { name: "Negation Pattern", description: "Analyzes negation usage patterns" },
        "comparative_structure": { name: "Comparative Structure", description: "Analyzes comparison usage patterns" },
        "quantifier_usage": { name: "Quantifier Usage", description: "Measures quantifier frequency" },
        "referential_density": { name: "Referential Density", description: "Analyzes reference density patterns" },
        "logical_connector": { name: "Logical Connector", description: "Analyzes logical connector distribution" },
        "topic_shift_analysis": { name: "Topic Shift Analysis", description: "Analyzes topic transition patterns" },
        "information_density": { name: "Information Density", description: "Measures information per sentence" },
        "sentiment_variance": { name: "Sentiment Variance", description: "Analyzes sentiment variation patterns" },
        "lexical_chain_repetition": { name: "Lexical Chain Repetition", description: "Analyzes lexical chain repetition" },
        "genre_conformity": { name: "Genre Conformity", description: "Analyzes genre style conformity" },
        "conclusion_pattern": { name: "Conclusion Pattern", description: "Analyzes conclusion structure patterns" },
        "vocab_complexity": { name: "Vocabulary Complexity", description: "Measures vocabulary complexity level" },
        "sentence_connectivity": { name: "Sentence Connectivity", description: "Analyzes sentence connectivity patterns" },
        "text_coherence": { name: "Text Coherence Score", description: "Overall text coherence scoring" },
    },
    vi: {
        "adverb_frequency": { name: "Tần suất trạng từ", description: "Phân tích mẫu sử dụng trạng từ — AI thường lạm dụng trạng từ" },
        "contraction_usage": { name: "Sử dụng viết tắt", description: "Đo tần suất viết tắt — AI thường ít dùng viết tắt" },
        "sentence_opener": { name: "Đa dạng mở đầu câu", description: "Phân tích sự đa dạng cách mở đầu câu" },
        "emotional_tone": { name: "Biến thiên cảm xúc", description: "Đo biến thiên cảm xúc trong văn bản" },
        "metaphor_density": { name: "Mật độ ẩn dụ", description: "Phân tích mật độ ngôn ngữ hình tượng" },
        "question_frequency": { name: "Tần suất câu hỏi", description: "Đo mẫu sử dụng câu hỏi" },
        "paragraph_structure": { name: "Cấu trúc đoạn văn", description: "Phân tích tổ chức đoạn văn" },
        "transition_quality": { name: "Chất lượng chuyển tiếp", description: "Đánh giá sự mượt mà chuyển tiếp giữa các ý" },
        "idiom_detection": { name: "Phát hiện thành ngữ", description: "Phát hiện sử dụng thành ngữ" },
        "abstract_concrete": { name: "Tỷ lệ trừu tượng", description: "Phân tích cân bằng ngôn ngữ trừu tượng và cụ thể" },
        "first_person_usage": { name: "Sử dụng ngôi thứ nhất", description: "Phân tích mẫu góc nhìn ngôi thứ nhất" },
        "technical_jargon": { name: "Thuật ngữ chuyên môn", description: "Đo mật độ thuật ngữ chuyên môn" },
        "redundancy_detection": { name: "Phát hiện dư thừa", description: "Phát hiện cụm từ dư thừa và lặp lại" },
        "word_length_dist": { name: "Phân bổ độ dài từ", description: "Phân tích mẫu phân bổ độ dài từ" },
        "hapax_legomena": { name: "Từ xuất hiện một lần", description: "Phân tích tỷ lệ từ xuất hiện duy nhất một lần" },
        "conjunction_density": { name: "Mật độ liên từ", description: "Đo mẫu sử dụng liên từ" },
        "preposition_pattern": { name: "Mẫu giới từ", description: "Phân tích phân bổ giới từ" },
        "modal_verb_frequency": { name: "Tần suất động từ khiếm khuyết", description: "Đo mẫu sử dụng động từ khiếm khuyết" },
        "subordinate_clause": { name: "Mệnh đề phụ", description: "Phân tích tần suất mệnh đề phụ" },
        "argument_structure": { name: "Cấu trúc lập luận", description: "Phân tích cấu trúc chuỗi lập luận" },
        "text_formality": { name: "Trang trọng văn bản", description: "Đo mức độ trang trọng văn bản" },
        "negation_pattern": { name: "Mẫu phủ định", description: "Phân tích mẫu sử dụng phủ định" },
        "comparative_structure": { name: "Cấu trúc so sánh", description: "Phân tích mẫu sử dụng so sánh" },
        "quantifier_usage": { name: "Sử dụng lượng từ", description: "Đo tần suất lượng từ" },
        "referential_density": { name: "Mật độ tham chiếu", description: "Phân tích mẫu mật độ tham chiếu" },
        "logical_connector": { name: "Liên kết logic", description: "Phân tích phân bổ liên kết logic" },
        "topic_shift_analysis": { name: "Phân tích chuyển chủ đề", description: "Phân tích mẫu chuyển đổi chủ đề" },
        "information_density": { name: "Mật độ thông tin", description: "Đo thông tin trên mỗi câu" },
        "sentiment_variance": { name: "Biến thiên cảm xúc", description: "Phân tích mẫu biến thiên cảm xúc" },
        "lexical_chain_repetition": { name: "Lặp chuỗi từ vựng", description: "Phân tích lặp chuỗi từ vựng" },
        "genre_conformity": { name: "Phù hợp thể loại", description: "Phân tích sự phù hợp phong cách thể loại" },
        "conclusion_pattern": { name: "Mẫu kết luận", description: "Phân tích mẫu cấu trúc kết luận" },
        "vocab_complexity": { name: "Độ phức tạp từ vựng", description: "Đo mức độ phức tạp từ vựng" },
        "sentence_connectivity": { name: "Kết nối câu", description: "Phân tích mẫu kết nối giữa các câu" },
        "text_coherence": { name: "Điểm mạch lạc", description: "Chấm điểm mạch lạc tổng thể văn bản" },
    },
};


/**
 * Get the translated name & description for a method, falling back to English.
 */

// All new methods v11-v13 fallback data
const NEW_METHODS_FALLBACK: Record<string, Record<string, MethodLocaleEntry>> = {
    en: {
        "anti_aliasing": { name: "Anti-aliasing Consistency", description: "Analyzes anti-aliasing pattern consistency — AI often produces overly smooth or inconsistent edge anti-aliasing" },
        "aperture_diffraction": { name: "Aperture Diffraction", description: "Analyzes optical diffraction patterns that real camera lenses produce" },
        "channel_independence": { name: "Channel Independence", description: "Tests pixel independence between RGB color channels" },
        "chroma_subsampling": { name: "Chroma Subsampling", description: "Detects chroma subsampling artifacts from image compression" },
        "color_channel_noise": { name: "Color Channel Noise", description: "Analyzes noise distribution across R, G, B channels" },
        "color_moment_statistics": { name: "Color Moment Statistics", description: "Computes statistical color moments (mean, std, skewness) for forensic analysis" },
        "depth_map": { name: "Depth Map Consistency", description: "Analyzes depth map consistency for 3D scene plausibility" },
        "edge_density_map": { name: "Edge Density Map", description: "Creates spatial edge density maps to find anomalous regions" },
        "hot_pixel": { name: "Hot Pixel Detection", description: "Detects hot/dead pixel patterns absent in AI images" },
        "image_complexity": { name: "Image Complexity", description: "Measures overall image structural complexity" },
        "jpeg_coefficient_dist": { name: "JPEG Coefficient Distribution", description: "Analyzes DCT coefficient distribution in JPEG compressed images" },
        "lens_distortion_i": { name: "Lens Distortion (Image)", description: "Detects barrel/pincushion lens distortion patterns" },
        "micro_texture": { name: "Micro Texture Analysis", description: "Analyzes micro-level texture patterns invisible to human eye" },
        "moire_pattern": { name: "Moiré Pattern", description: "Detects moiré interference patterns from screen capture" },
        "noise_floor": { name: "Noise Floor Level", description: "Measures base noise floor level across image" },
        "patch_similarity": { name: "Patch Similarity Matrix", description: "Computes self-similarity matrix of image patches" },
        "spectral_decay": { name: "Spectral Decay Rate", description: "Measures how fast frequency spectrum decays" },
        "texture_periodicity": { name: "Texture Periodicity", description: "Detects periodic texture patterns common in AI generation" },
        "tone_mapping": { name: "Tone Mapping Analysis", description: "Analyzes HDR tone mapping artifacts" },
        "vignette": { name: "Vignette Analysis", description: "Analyzes optical vignetting patterns" },
        "skin_texture_freq": { name: "Skin Texture Frequency", description: "Analyzes skin texture frequency patterns for AI artifacts" },
        "bloom_artifact": { name: "Bloom Artifact", description: "Detects light bloom artifacts common in AI generation" },
        "gamma_distortion": { name: "Gamma Distortion", description: "Analyzes gamma curve distortion patterns" },
        "linear_pattern": { name: "Linear Pattern Detection", description: "Detects unnatural linear patterns in image" },
        "dynamic_range": { name: "Dynamic Range Analysis", description: "Analyzes image dynamic range characteristics" },
        "intensity_kurtosis": { name: "Intensity Kurtosis", description: "Measures kurtosis of pixel intensity distribution" },
        "cross_gradient": { name: "Cross Gradient", description: "Analyzes cross-directional gradient patterns" },
        "pixel_symmetry": { name: "Pixel Symmetry", description: "Detects unnatural pixel symmetry patterns" },
        "local_entropy": { name: "Local Entropy", description: "Measures local entropy variation across image regions" },
        "luma_gradient_angle": { name: "Luma Gradient Angle", description: "Analyzes luminance gradient angle distribution" },
        "rgb_correlation": { name: "RGB Correlation", description: "Measures inter-channel correlation patterns" },
        "isolated_pixel": { name: "Isolated Pixel", description: "Detects isolated pixel anomalies" },
        "spatial_coherence": { name: "Spatial Coherence", description: "Analyzes spatial coherence across image" },
        "contour_smooth": { name: "Contour Smoothness", description: "Analyzes contour smoothness patterns" },
        "color_entropy": { name: "Color Entropy", description: "Measures color entropy distribution" },
        "brightness_gradient": { name: "Brightness Gradient", description: "Analyzes brightness gradient patterns" },
        "noise_granularity": { name: "Noise Granularity", description: "Measures noise grain size and distribution" },
        "hue_consistency": { name: "Hue Consistency", description: "Analyzes hue consistency across regions" },
        "pixel_bit_plane": { name: "Pixel Bit Plane", description: "Analyzes bit plane patterns for hidden artifacts" },
        "contrast_map": { name: "Contrast Map", description: "Creates spatial contrast maps" },
        "flat_region_ratio": { name: "Flat Region Ratio", description: "Measures ratio of flat/smooth regions" },
        "posterization": { name: "Posterization Detection", description: "Detects color posterization artifacts" },
        "mean_shift_cluster": { name: "Mean Shift Clustering", description: "Analyzes pixel clustering patterns" },
        "gradient_magnitude": { name: "Gradient Magnitude Histogram", description: "Analyzes gradient magnitude distribution" },
        "richardson_lucy": { name: "Richardson-Lucy Deconvolution", description: "Applies Richardson-Lucy deconvolution to detect sharpness artifacts (Fridrich, 2012)" },
        "wiener_residual": { name: "Wiener Filter Residual", description: "Analyzes Wiener filter residual noise patterns (Fridrich, 2012)" },
        "second_order_grad": { name: "Second Order Gradient", description: "Computes 2nd-order gradient for texture analysis (Wang, 2019)" },
        "dct_energy_compact": { name: "DCT Energy Compaction", description: "Analyzes DCT energy compaction ratio (Frank, 2020)" },
        "spatial_rich_model": { name: "Spatial Rich Model (SRM)", description: "Implements Fridrich's Spatial Rich Model for steganalysis (2012)" },
        "mid_freq_energy": { name: "Mid-Frequency Energy", description: "Analyzes mid-frequency band energy ratio (Durall, 2020)" },
        "laplacian_variance": { name: "Laplacian Variance", description: "Measures Laplacian variance for blur detection (Tenenbaum, 2004)" },
        "sobel_magnitude": { name: "Sobel Magnitude Distribution", description: "Analyzes Sobel gradient magnitude distribution (Canny, 2007)" },
        "canny_density": { name: "Canny Edge Density", description: "Measures edge density using Canny-like detection (2006)" },
        "cooc_entropy": { name: "Co-occurrence Entropy", description: "Computes co-occurrence matrix entropy (Haralick, 2015)" },
        "box_filter_residual": { name: "Box Filter Residual", description: "Analyzes box filter residual for smoothing detection (2018)" },
        "maximal_grad_flow": { name: "Maximal Gradient Flow", description: "Analyzes dominant gradient flow direction (2019)" },
        "difference_histogram": { name: "Difference Histogram", description: "Studies adjacent pixel difference histogram (Popescu, 2013)" },
        "sub_band_dev": { name: "Sub-band Deviation", description: "Measures spatial sub-band deviation (Durall, 2020)" },
        "grad_orient_hist": { name: "Gradient Orientation Histogram", description: "Analyzes gradient orientation uniformity (Dalal, 2015)" },
        "kirsch_edge": { name: "Kirsch Edge Response", description: "Computes Kirsch compass edge response (2008)" },
        "laws_texture_e": { name: "Laws Texture Energy", description: "Computes Laws texture energy measures (Laws, 1980)" },
        "gabor_energy": { name: "Gabor Energy Distribution", description: "Analyzes multi-scale Gabor energy distribution (2010)" },
        "scharr_gradient": { name: "Scharr Gradient", description: "Computes Scharr gradient for edge analysis (2000)" },
        "structural_complexity": { name: "Structural Complexity", description: "Measures image structural block diversity (2016)" },
        "audio_noise_floor": { name: "Audio Noise Floor", description: "Analyzes audio noise floor patterns" },
        "audio_spectral": { name: "Audio Spectral Analysis", description: "Analyzes audio spectral characteristics" },
        "audio_visual_delay": { name: "Audio-Visual Delay", description: "Measures audio-video synchronization delay" },
        "blood_flow_rppg": { name: "Blood Flow rPPG", description: "Detects remote photoplethysmography signals" },
        "body_movement_fluidity": { name: "Body Movement Fluidity", description: "Analyzes body movement smoothness" },
        "breathing_pattern": { name: "Breathing Pattern", description: "Detects breathing motion patterns" },
        "eye_contact": { name: "Eye Contact Consistency", description: "Analyzes eye contact direction consistency" },
        "face_warping": { name: "Face Warping Artifact", description: "Detects face warping transformation artifacts" },
        "facial_boundary_freq": { name: "Facial Boundary Frequency", description: "Analyzes facial boundary frequency content" },
        "frame_rate_consistency": { name: "Frame Rate Consistency", description: "Detects frame rate irregularities" },
        "gait_analysis": { name: "Gait Analysis", description: "Analyzes walking gait naturalness" },
        "hair_strand_v": { name: "Hair Strand Consistency", description: "Analyzes individual hair strand rendering" },
        "lip_sync_v2": { name: "Lip Sync Analysis v2", description: "Advanced lip-audio synchronization analysis" },
        "phoneme_correlation": { name: "Phoneme Correlation", description: "Correlates phoneme shapes with audio" },
        "scene_geometry": { name: "Scene Geometry Consistency", description: "Analyzes 3D scene geometry consistency" },
        "spectral_flicker_v": { name: "Spectral Flicker", description: "Detects spectral flicker patterns" },
        "temporal_color_histogram": { name: "Temporal Color Histogram", description: "Tracks color histogram changes over time" },
        "tongue_consistency": { name: "Tongue Consistency", description: "Analyzes tongue rendering consistency" },
        "video_frame_rate": { name: "Video Frame Rate", description: "Analyzes frame rate consistency patterns" },
        "video_resolution_map": { name: "Video Resolution Map", description: "Maps resolution consistency across frame" },
        "skin_color_drift": { name: "Skin Color Drift", description: "Analyzes skin color drift patterns across frames" },
        "facial_symmetry_v": { name: "Facial Symmetry (Video)", description: "Analyzes facial symmetry consistency in video" },
        "lip_texture_detail": { name: "Lip Texture Detail", description: "Analyzes lip micro-texture detail" },
        "forehead_wrinkle": { name: "Forehead Wrinkle", description: "Analyzes forehead wrinkle consistency" },
        "iris_detail": { name: "Iris Detail", description: "Analyzes iris pattern detail and consistency" },
        "nose_shadow": { name: "Nose Shadow", description: "Analyzes nose shadow casting patterns" },
        "chin_jaw_detail": { name: "Chin-Jaw Detail", description: "Analyzes chin and jawline detail" },
        "bg_complexity": { name: "Background Complexity", description: "Measures background scene complexity" },
        "color_bleeding": { name: "Color Bleeding", description: "Detects color bleeding artifacts at boundaries" },
        "face_mask_edge": { name: "Face Mask Edge", description: "Detects face mask edge artifacts" },
        "motion_blur_dir": { name: "Motion Blur Direction", description: "Analyzes motion blur directionality" },
        "video_global_illum": { name: "Video Global Illumination", description: "Analyzes global illumination consistency" },
        "pixel_jitter": { name: "Pixel Jitter", description: "Detects pixel jitter artifacts" },
        "frame_edge_energy": { name: "Frame Edge Energy", description: "Analyzes frame edge energy distribution" },
        "facial_pore_texture": { name: "Facial Pore Texture", description: "Analyzes facial pore micro-texture" },
        "temporal_gradient": { name: "Temporal Gradient", description: "Analyzes temporal gradient patterns" },
        "video_saturation_map": { name: "Video Saturation Map", description: "Maps saturation distribution across frame" },
        "neck_skin": { name: "Neck Skin Consistency", description: "Analyzes neck skin texture consistency" },
        "video_luma_range": { name: "Video Luma Range", description: "Analyzes luminance range distribution" },
        "cheek_texture": { name: "Cheek Texture", description: "Analyzes cheek skin texture patterns" },
        "video_color_balance": { name: "Video Color Balance", description: "Analyzes color balance consistency" },
        "edge_aa_video": { name: "Edge Antialiasing (Video)", description: "Analyzes edge antialiasing in video frames" },
        "temporal_coherence_map": { name: "Temporal Coherence Map", description: "Maps temporal coherence across frames" },
        "video_freq_spectrum": { name: "Video Frequency Spectrum", description: "Analyzes frequency spectrum of video frames" },
        "face_xray": { name: "Face X-Ray Boundary", description: "Detects blending boundaries using Face X-Ray technique (Li et al., 2020)" },
        "face_blend_bound": { name: "Face Blend Boundary", description: "Analyzes face-background blend boundary artifacts (Matern, 2019)" },
        "color_hist_shift": { name: "Color Histogram Shift", description: "Detects face vs background color histogram shift (2020)" },
        "face_skin_smooth_v": { name: "Face Skin Smoothness", description: "Analyzes excessive skin smoothness from AI generation (2019)" },
        "specular_highlight": { name: "Specular Highlight", description: "Analyzes specular highlight consistency (2020)" },
        "contour_continuity": { name: "Contour Continuity", description: "Analyzes contour edge continuity patterns (2020)" },
        "skin_micro_motion": { name: "Skin Micro Motion", description: "Detects micro-motion in skin regions (FakeCatcher, 2020)" },
        "bg_freq_map": { name: "Background Frequency Map", description: "Maps frequency content of background regions (2021)" },
        "inter_frame_blend": { name: "Inter-Frame Blend", description: "Detects inter-frame blending artifacts (2021)" },
        "edge_sharpness_var": { name: "Edge Sharpness Variance", description: "Analyzes edge sharpness variance across quadrants (2021)" },
        "nostril_darkness": { name: "Nostril Darkness", description: "Analyzes nostril darkness consistency (2020)" },
        "ear_detail": { name: "Ear Detail Consistency", description: "Compares left-right ear detail consistency (2019)" },
        "clothing_edge_blend": { name: "Clothing Edge Blend", description: "Analyzes clothing edge blending quality (2021)" },
        "temporal_jitter": { name: "Temporal Jitter Detection", description: "Detects temporal jitter oscillation patterns (2021)" },
        "skin_pore_sim": { name: "Skin Pore Simulation", description: "Detects simulated pore patterns vs real pores (2023)" },
        "typo_error_pattern": { name: "Typo Error Pattern", description: "Analyzes typo and error patterns — AI rarely makes human-like typos" },
        "cultural_reference": { name: "Cultural Reference", description: "Detects cultural references and context" },
        "personal_experience": { name: "Personal Experience", description: "Analyzes personal experience markers" },
        "filler_word_usage": { name: "Filler Word Usage", description: "Measures filler word frequency" },
        "sentence_fragment": { name: "Sentence Fragment Usage", description: "Detects sentence fragment patterns" },
        "exclamation_pattern": { name: "Exclamation Pattern", description: "Analyzes exclamation usage patterns" },
        "parenthetical_usage": { name: "Parenthetical Usage", description: "Measures parenthetical expression frequency" },
        "list_enumeration": { name: "List Enumeration Pattern", description: "Analyzes list and enumeration patterns" },
        "vocab_growth_rate": { name: "Vocabulary Growth Rate", description: "Tracks vocabulary growth rate across text" },
        "word_specificity": { name: "Word Specificity Index", description: "Measures word specificity level" },
        "rhetorical_device": { name: "Rhetorical Device", description: "Detects rhetorical devices usage" },
        "colloquial_expression": { name: "Colloquial Expression", description: "Analyzes colloquial language usage" },
        "sentence_rhythm": { name: "Sentence Rhythm", description: "Analyzes rhythmic patterns in sentences" },
        "topic_depth": { name: "Topic Depth Analysis", description: "Measures topic exploration depth" },
        "narrative_structure": { name: "Narrative Structure", description: "Analyzes narrative arc structure" },
        "dialogue_pattern": { name: "Dialogue Pattern", description: "Detects dialogue pattern usage" },
        "evidence_citation": { name: "Evidence Citation", description: "Analyzes evidence citation patterns" },
        "emotional_arc": { name: "Emotional Arc", description: "Tracks emotional arc progression" },
        "ambiguity_tolerance": { name: "Ambiguity Tolerance", description: "Measures tolerance for ambiguity" },
        "anaphora_resolution": { name: "Anaphora Resolution", description: "Analyzes anaphora resolution patterns" },
        "acronym_usage": { name: "Acronym Usage", description: "Analyzes acronym and abbreviation patterns" },
        "question_density": { name: "Question Mark Density", description: "Measures question mark density patterns" },
        "sent_start_variety": { name: "Sentence Start Variety", description: "Analyzes sentence opening word variety" },
        "verb_tense": { name: "Verb Tense Consistency", description: "Measures verb tense consistency" },
        "comma_freq": { name: "Comma Frequency", description: "Analyzes comma usage frequency patterns" },
        "semicolon_usage": { name: "Semicolon Usage", description: "Measures semicolon frequency" },
        "superlative_usage": { name: "Superlative Usage", description: "Analyzes superlative adjective frequency" },
        "contraction_detect": { name: "Contraction Detection", description: "Detects contraction usage patterns" },
        "avg_word_length": { name: "Average Word Length", description: "Measures average word length distribution" },
        "emphasis_pattern": { name: "Emphasis Pattern", description: "Analyzes text emphasis usage" },
        "definite_article": { name: "Definite Article", description: "Analyzes definite article usage patterns" },
        "number_usage": { name: "Number Usage", description: "Analyzes numeric expression patterns" },
        "qualifier_density": { name: "Qualifier Density", description: "Measures qualifier word density" },
        "passive_active_mix": { name: "Passive-Active Voice Mix", description: "Analyzes passive vs active voice distribution" },
        "quotation_usage": { name: "Quotation Usage", description: "Measures quotation mark usage patterns" },
        "analogy_simile": { name: "Analogy & Simile", description: "Detects analogy and simile usage" },
        "conjunction_pair": { name: "Conjunction Pair", description: "Analyzes correlative conjunction pairs" },
        "abstractness": { name: "Abstractness Index", description: "Measures linguistic abstractness level" },
        "instructional_tone": { name: "Instructional Tone", description: "Detects instructional writing tone" },
        "transition_smooth": { name: "Transition Smoothness", description: "Analyzes paragraph transition smoothness" },
        "definition_pattern": { name: "Definition Pattern", description: "Detects definition structure patterns" },
        "conditional_usage": { name: "Conditional Usage", description: "Analyzes conditional sentence patterns" },
        "repetitive_phrase": { name: "Repetitive Phrase", description: "Detects repetitive phrase patterns" },
        "conclusion_indicator": { name: "Conclusion Indicator", description: "Detects conclusion marker patterns" },
        "zipf_deviation": { name: "Zipf Deviation", description: "Measures deviation from Zipf's Law word distribution (Gehrmann, 2019)" },
        "token_predictability": { name: "Token Predictability", description: "Analyzes next-token predictability using bigram statistics (Mitchell, 2023)" },
        "log_likelihood_rank": { name: "Log-Likelihood Rank", description: "Measures common word usage ratio (DetectGPT, 2023)" },
        "entropy_per_word": { name: "Entropy Per Word", description: "Computes normalized entropy per word (Kirchenbauer, 2023)" },
        "curie_detect": { name: "Curie Detection", description: "Analyzes sentence length CV for uniformity detection (2023)" },
        "vocabulary_richness": { name: "Vocabulary Richness", description: "Computes root TTR for vocabulary richness (2023)" },
        "mean_dep_parse": { name: "Mean Dependency Depth", description: "Estimates mean dependency depth approximation (2023)" },
        "word_rarity": { name: "Word Rarity Score", description: "Detects rare archaic vocabulary usage (Tulchinskii, 2023)" },
        "clause_balance": { name: "Clause Balance", description: "Analyzes clause length balance within sentences (2023)" },
        "micro_repetition": { name: "Micro Repetition", description: "Detects micro-level word repetition patterns (2023)" },
        "text_dna": { name: "Text DNA Watermark", description: "Analyzes vowel-consonant ratio as text fingerprint (2023)" },
        "intrinsic_dimension": { name: "Intrinsic Dimension", description: "Estimates intrinsic dimensionality of text (Tulchinskii, 2023)" },
        "sentence_entropy": { name: "Sentence Entropy", description: "Computes sentence length distribution entropy (2023)" },
        "lexical_density": { name: "Lexical Density", description: "Measures content word ratio (lexical density) (2023)" },
        "text_burstiness2": { name: "Text Burstiness v2", description: "IQR-based burstiness measurement of sentence lengths (2023)" },
        "vignette_analysis": { name: "Vignette Analysis", description: "Analyzes optical vignetting patterns" },
        "depth_map_consistency": { name: "Depth Map Consistency", description: "Analyzes depth map consistency for 3D scene plausibility" },
        "noise_floor_level": { name: "Noise Floor Level", description: "Measures base noise floor level across image" },
        "jpeg_coefficient": { name: "JPEG Coefficient Distribution", description: "Analyzes DCT coefficient distribution in JPEG compressed images" },
        "edge_density": { name: "Edge Density Map", description: "Creates spatial edge density maps to find anomalous regions" },
        "color_moments": { name: "Color Moment Statistics", description: "Computes statistical color moments (mean, std, skewness) for forensic analysis" },
        "lens_distortion_img": { name: "Lens Distortion (Image)", description: "Detects barrel/pincushion lens distortion patterns" },
        "accessory_consistency": { name: "Accessory Consistency", description: "Analyzes accessory rendering consistency in video" },
        "eye_contact_consistency": { name: "Eye Contact Consistency", description: "Analyzes eye contact direction consistency" },
        "hair_strand_consistency": { name: "Hair Strand Consistency", description: "Analyzes individual hair strand rendering" },
        "face_warping_artifact": { name: "Face Warping Artifact", description: "Detects face warping transformation artifacts" },
        "facial_muscle_physics": { name: "Facial Muscle Physics", description: "Analyzes facial muscle movement physics" },
    },
    vi: {
        "anti_aliasing": { name: "Nhất quán khử răng cưa", description: "Phân tích tính nhất quán mẫu khử răng cưa — AI thường tạo khử răng cưa quá mịn hoặc không đồng đều" },
        "aperture_diffraction": { name: "Nhiễu xạ khẩu độ", description: "Phân tích mẫu nhiễu xạ quang học mà ống kính máy ảnh thực tạo ra" },
        "channel_independence": { name: "Độc lập kênh màu", description: "Kiểm tra tính độc lập pixel giữa các kênh màu RGB" },
        "chroma_subsampling": { name: "Lấy mẫu phụ sắc độ", description: "Phát hiện dấu vết lấy mẫu phụ sắc độ từ nén ảnh" },
        "color_channel_noise": { name: "Nhiễu kênh màu", description: "Phân tích phân bổ nhiễu trên các kênh R, G, B" },
        "color_moment_statistics": { name: "Thống kê moment màu", description: "Tính toán moment màu thống kê (trung bình, độ lệch, độ xiên) cho phân tích pháp y" },
        "depth_map": { name: "Nhất quán bản đồ độ sâu", description: "Phân tích tính nhất quán bản đồ độ sâu cho tính hợp lý cảnh 3D" },
        "edge_density_map": { name: "Bản đồ mật độ cạnh", description: "Tạo bản đồ mật độ cạnh không gian để tìm vùng bất thường" },
        "hot_pixel": { name: "Phát hiện điểm ảnh nóng", description: "Phát hiện mẫu điểm ảnh nóng/chết vắng mặt trong ảnh AI" },
        "image_complexity": { name: "Độ phức tạp ảnh", description: "Đo độ phức tạp cấu trúc tổng thể của ảnh" },
        "jpeg_coefficient_dist": { name: "Phân bổ hệ số JPEG", description: "Phân tích phân bổ hệ số DCT trong ảnh nén JPEG" },
        "lens_distortion_i": { name: "Méo ống kính (Ảnh)", description: "Phát hiện mẫu méo hình thùng/đệm của ống kính" },
        "micro_texture": { name: "Phân tích vi kết cấu", description: "Phân tích mẫu kết cấu vi mô không nhìn thấy bằng mắt thường" },
        "moire_pattern": { name: "Mẫu Moiré", description: "Phát hiện mẫu giao thoa Moiré từ chụp màn hình" },
        "noise_floor": { name: "Mức sàn nhiễu", description: "Đo mức sàn nhiễu cơ bản trên toàn ảnh" },
        "patch_similarity": { name: "Ma trận tương đồng mảnh", description: "Tính ma trận tự tương đồng của các mảnh ảnh" },
        "spectral_decay": { name: "Tốc độ suy giảm phổ", description: "Đo tốc độ suy giảm phổ tần số" },
        "texture_periodicity": { name: "Tính tuần hoàn kết cấu", description: "Phát hiện mẫu kết cấu tuần hoàn phổ biến trong AI" },
        "tone_mapping": { name: "Phân tích ánh xạ tông", description: "Phân tích dấu vết ánh xạ tông HDR" },
        "vignette": { name: "Phân tích viễn ảnh", description: "Phân tích mẫu viễn ảnh quang học" },
        "skin_texture_freq": { name: "Tần số kết cấu da", description: "Phân tích mẫu tần số kết cấu da để phát hiện dấu vết AI" },
        "bloom_artifact": { name: "Dấu vết tán sáng", description: "Phát hiện dấu vết tán sáng phổ biến trong ảnh AI" },
        "gamma_distortion": { name: "Méo gamma", description: "Phân tích mẫu méo đường cong gamma" },
        "linear_pattern": { name: "Phát hiện mẫu tuyến tính", description: "Phát hiện mẫu tuyến tính không tự nhiên trong ảnh" },
        "dynamic_range": { name: "Phân tích dải động", description: "Phân tích đặc tính dải động của ảnh" },
        "intensity_kurtosis": { name: "Độ nhọn cường độ", description: "Đo độ nhọn của phân bổ cường độ pixel" },
        "cross_gradient": { name: "Gradient chéo", description: "Phân tích mẫu gradient theo hướng chéo" },
        "pixel_symmetry": { name: "Đối xứng pixel", description: "Phát hiện mẫu đối xứng pixel không tự nhiên" },
        "local_entropy": { name: "Entropy cục bộ", description: "Đo biến thiên entropy cục bộ trên các vùng ảnh" },
        "luma_gradient_angle": { name: "Góc gradient độ sáng", description: "Phân tích phân bổ góc gradient độ sáng" },
        "rgb_correlation": { name: "Tương quan RGB", description: "Đo mẫu tương quan giữa các kênh" },
        "isolated_pixel": { name: "Pixel cô lập", description: "Phát hiện bất thường pixel cô lập" },
        "spatial_coherence": { name: "Nhất quán không gian", description: "Phân tích tính nhất quán không gian trên ảnh" },
        "contour_smooth": { name: "Độ mịn đường viền", description: "Phân tích mẫu độ mịn đường viền" },
        "color_entropy": { name: "Entropy màu", description: "Đo phân bổ entropy màu" },
        "brightness_gradient": { name: "Gradient độ sáng", description: "Phân tích mẫu gradient độ sáng" },
        "noise_granularity": { name: "Độ hạt nhiễu", description: "Đo kích thước hạt nhiễu và phân bổ" },
        "hue_consistency": { name: "Nhất quán sắc độ", description: "Phân tích tính nhất quán sắc độ trên các vùng" },
        "pixel_bit_plane": { name: "Mặt phẳng bit pixel", description: "Phân tích mẫu mặt phẳng bit để tìm dấu vết ẩn" },
        "contrast_map": { name: "Bản đồ tương phản", description: "Tạo bản đồ tương phản không gian" },
        "flat_region_ratio": { name: "Tỷ lệ vùng phẳng", description: "Đo tỷ lệ vùng phẳng/mịn" },
        "posterization": { name: "Phát hiện posterization", description: "Phát hiện dấu vết posterization màu" },
        "mean_shift_cluster": { name: "Phân cụm Mean Shift", description: "Phân tích mẫu phân cụm pixel" },
        "gradient_magnitude": { name: "Histogram biên độ gradient", description: "Phân tích phân bổ biên độ gradient" },
        "richardson_lucy": { name: "Giải chập Richardson-Lucy", description: "Áp dụng giải chập Richardson-Lucy để phát hiện dấu vết sắc nét" },
        "wiener_residual": { name: "Dư Wiener Filter", description: "Phân tích mẫu nhiễu dư của bộ lọc Wiener" },
        "second_order_grad": { name: "Gradient bậc 2", description: "Tính gradient bậc 2 cho phân tích kết cấu" },
        "dct_energy_compact": { name: "Nén năng lượng DCT", description: "Phân tích tỷ lệ nén năng lượng DCT" },
        "spatial_rich_model": { name: "Mô hình phong phú không gian", description: "Triển khai SRM của Fridrich cho phân tích steganography" },
        "mid_freq_energy": { name: "Năng lượng tần số trung", description: "Phân tích tỷ lệ năng lượng dải tần số trung" },
        "laplacian_variance": { name: "Phương sai Laplacian", description: "Đo phương sai Laplacian để phát hiện mờ" },
        "sobel_magnitude": { name: "Phân bổ biên độ Sobel", description: "Phân tích phân bổ biên độ gradient Sobel" },
        "canny_density": { name: "Mật độ cạnh Canny", description: "Đo mật độ cạnh sử dụng phát hiện kiểu Canny" },
        "cooc_entropy": { name: "Entropy đồng xuất hiện", description: "Tính entropy ma trận đồng xuất hiện" },
        "box_filter_residual": { name: "Dư bộ lọc hộp", description: "Phân tích dư bộ lọc hộp để phát hiện làm mịn" },
        "maximal_grad_flow": { name: "Dòng gradient cực đại", description: "Phân tích hướng dòng gradient chiếm ưu thế" },
        "difference_histogram": { name: "Histogram hiệu số", description: "Nghiên cứu histogram hiệu pixel liền kề" },
        "sub_band_dev": { name: "Độ lệch dải phụ", description: "Đo độ lệch dải phụ không gian" },
        "grad_orient_hist": { name: "Histogram hướng gradient", description: "Phân tích tính đồng đều hướng gradient" },
        "kirsch_edge": { name: "Phản hồi cạnh Kirsch", description: "Tính phản hồi cạnh la bàn Kirsch" },
        "laws_texture_e": { name: "Năng lượng kết cấu Laws", description: "Tính các đại lượng năng lượng kết cấu Laws" },
        "gabor_energy": { name: "Phân bổ năng lượng Gabor", description: "Phân tích phân bổ năng lượng Gabor đa tỷ lệ" },
        "scharr_gradient": { name: "Gradient Scharr", description: "Tính gradient Scharr cho phân tích cạnh" },
        "structural_complexity": { name: "Độ phức tạp cấu trúc", description: "Đo tính đa dạng khối cấu trúc ảnh" },
        "audio_noise_floor": { name: "Sàn nhiễu âm thanh", description: "Phân tích mẫu sàn nhiễu âm thanh" },
        "audio_spectral": { name: "Phân tích phổ âm thanh", description: "Phân tích đặc tính phổ âm thanh" },
        "audio_visual_delay": { name: "Trễ âm thanh-hình ảnh", description: "Đo trễ đồng bộ âm thanh-video" },
        "blood_flow_rppg": { name: "Dòng máu rPPG", description: "Phát hiện tín hiệu quang thể tích từ xa" },
        "body_movement_fluidity": { name: "Trôi chảy chuyển động cơ thể", description: "Phân tích độ mượt chuyển động cơ thể" },
        "breathing_pattern": { name: "Mẫu thở", description: "Phát hiện mẫu chuyển động thở" },
        "eye_contact": { name: "Nhất quán giao tiếp mắt", description: "Phân tích nhất quán hướng giao tiếp mắt" },
        "face_warping": { name: "Dấu vết biến dạng mặt", description: "Phát hiện dấu vết biến đổi biến dạng mặt" },
        "facial_boundary_freq": { name: "Tần số biên mặt", description: "Phân tích nội dung tần số biên khuôn mặt" },
        "frame_rate_consistency": { name: "Nhất quán tốc độ khung", description: "Phát hiện bất thường tốc độ khung hình" },
        "gait_analysis": { name: "Phân tích dáng đi", description: "Phân tích tính tự nhiên dáng đi" },
        "hair_strand_v": { name: "Nhất quán sợi tóc", description: "Phân tích render từng sợi tóc" },
        "lip_sync_v2": { name: "Đồng bộ môi v2", description: "Phân tích đồng bộ môi-âm thanh nâng cao" },
        "phoneme_correlation": { name: "Tương quan âm vị", description: "Tương quan hình dạng âm vị với âm thanh" },
        "scene_geometry": { name: "Nhất quán hình học cảnh", description: "Phân tích tính nhất quán hình học cảnh 3D" },
        "spectral_flicker_v": { name: "Nhấp nháy phổ", description: "Phát hiện mẫu nhấp nháy phổ" },
        "temporal_color_histogram": { name: "Histogram màu thời gian", description: "Theo dõi thay đổi histogram màu theo thời gian" },
        "tongue_consistency": { name: "Nhất quán lưỡi", description: "Phân tích tính nhất quán render lưỡi" },
        "video_frame_rate": { name: "Tốc độ khung video", description: "Phân tích mẫu nhất quán tốc độ khung" },
        "video_resolution_map": { name: "Bản đồ phân giải video", description: "Ánh xạ nhất quán phân giải trên khung hình" },
        "skin_color_drift": { name: "Trôi màu da", description: "Phân tích mẫu trôi màu da giữa các khung hình" },
        "facial_symmetry_v": { name: "Đối xứng khuôn mặt (Video)", description: "Phân tích nhất quán đối xứng khuôn mặt trong video" },
        "lip_texture_detail": { name: "Chi tiết kết cấu môi", description: "Phân tích chi tiết vi kết cấu môi" },
        "forehead_wrinkle": { name: "Nếp nhăn trán", description: "Phân tích tính nhất quán nếp nhăn trán" },
        "iris_detail": { name: "Chi tiết mống mắt", description: "Phân tích chi tiết và nhất quán mẫu mống mắt" },
        "nose_shadow": { name: "Bóng mũi", description: "Phân tích mẫu đổ bóng mũi" },
        "chin_jaw_detail": { name: "Chi tiết cằm-hàm", description: "Phân tích chi tiết cằm và đường hàm" },
        "bg_complexity": { name: "Độ phức tạp nền", description: "Đo độ phức tạp cảnh nền" },
        "color_bleeding": { name: "Chảy màu", description: "Phát hiện dấu vết chảy màu tại biên" },
        "face_mask_edge": { name: "Biên mặt nạ", description: "Phát hiện dấu vết biên mặt nạ khuôn mặt" },
        "motion_blur_dir": { name: "Hướng mờ chuyển động", description: "Phân tích tính định hướng mờ chuyển động" },
        "video_global_illum": { name: "Chiếu sáng toàn cục", description: "Phân tích nhất quán chiếu sáng toàn cục" },
        "pixel_jitter": { name: "Rung pixel", description: "Phát hiện dấu vết rung pixel" },
        "frame_edge_energy": { name: "Năng lượng cạnh khung", description: "Phân tích phân bổ năng lượng cạnh khung hình" },
        "facial_pore_texture": { name: "Kết cấu lỗ chân lông", description: "Phân tích vi kết cấu lỗ chân lông mặt" },
        "temporal_gradient": { name: "Gradient thời gian", description: "Phân tích mẫu gradient thời gian" },
        "video_saturation_map": { name: "Bản đồ bão hòa", description: "Ánh xạ phân bổ bão hòa trên khung hình" },
        "neck_skin": { name: "Nhất quán da cổ", description: "Phân tích nhất quán kết cấu da cổ" },
        "video_luma_range": { name: "Dải sáng video", description: "Phân tích phân bổ dải độ sáng" },
        "cheek_texture": { name: "Kết cấu má", description: "Phân tích mẫu kết cấu da má" },
        "video_color_balance": { name: "Cân bằng màu video", description: "Phân tích nhất quán cân bằng màu" },
        "edge_aa_video": { name: "Khử răng cưa cạnh (Video)", description: "Phân tích khử răng cưa cạnh trong khung hình video" },
        "temporal_coherence_map": { name: "Bản đồ nhất quán thời gian", description: "Ánh xạ nhất quán thời gian giữa các khung hình" },
        "video_freq_spectrum": { name: "Phổ tần số video", description: "Phân tích phổ tần số khung hình video" },
        "face_xray": { name: "Biên Face X-Ray", description: "Phát hiện biên pha trộn bằng kỹ thuật Face X-Ray (Li, 2020)" },
        "face_blend_bound": { name: "Biên pha trộn mặt", description: "Phân tích dấu vết biên pha trộn mặt-nền" },
        "color_hist_shift": { name: "Dịch histogram màu", description: "Phát hiện dịch histogram màu giữa mặt và nền" },
        "face_skin_smooth_v": { name: "Độ mịn da mặt", description: "Phân tích độ mịn da quá mức từ AI" },
        "specular_highlight": { name: "Điểm sáng phản xạ", description: "Phân tích nhất quán điểm sáng phản xạ" },
        "contour_continuity": { name: "Liên tục đường viền", description: "Phân tích mẫu liên tục cạnh đường viền" },
        "skin_micro_motion": { name: "Vi chuyển động da", description: "Phát hiện vi chuyển động trong vùng da" },
        "bg_freq_map": { name: "Bản đồ tần số nền", description: "Ánh xạ nội dung tần số vùng nền" },
        "inter_frame_blend": { name: "Pha trộn liên khung", description: "Phát hiện dấu vết pha trộn giữa các khung hình" },
        "edge_sharpness_var": { name: "Phương sai sắc nét cạnh", description: "Phân tích phương sai sắc nét cạnh trên các phần tư" },
        "nostril_darkness": { name: "Độ tối lỗ mũi", description: "Phân tích tính nhất quán độ tối lỗ mũi" },
        "ear_detail": { name: "Nhất quán chi tiết tai", description: "So sánh nhất quán chi tiết tai trái-phải" },
        "clothing_edge_blend": { name: "Pha trộn biên quần áo", description: "Phân tích chất lượng pha trộn biên quần áo" },
        "temporal_jitter": { name: "Phát hiện rung thời gian", description: "Phát hiện mẫu dao động rung thời gian" },
        "skin_pore_sim": { name: "Mô phỏng lỗ chân lông", description: "Phát hiện mẫu lỗ chân lông mô phỏng vs thật" },
        "typo_error_pattern": { name: "Mẫu lỗi chính tả", description: "Phân tích mẫu lỗi chính tả — AI hiếm khi mắc lỗi giống người" },
        "cultural_reference": { name: "Tham chiếu văn hóa", description: "Phát hiện tham chiếu và ngữ cảnh văn hóa" },
        "personal_experience": { name: "Trải nghiệm cá nhân", description: "Phân tích dấu hiệu trải nghiệm cá nhân" },
        "filler_word_usage": { name: "Sử dụng từ đệm", description: "Đo tần suất từ đệm" },
        "sentence_fragment": { name: "Câu không hoàn chỉnh", description: "Phát hiện mẫu câu không hoàn chỉnh" },
        "exclamation_pattern": { name: "Mẫu câu cảm thán", description: "Phân tích mẫu sử dụng câu cảm thán" },
        "parenthetical_usage": { name: "Sử dụng ngoặc đơn", description: "Đo tần suất biểu thức ngoặc đơn" },
        "list_enumeration": { name: "Mẫu liệt kê", description: "Phân tích mẫu liệt kê và đánh số" },
        "vocab_growth_rate": { name: "Tốc độ tăng từ vựng", description: "Theo dõi tốc độ tăng từ vựng trong văn bản" },
        "word_specificity": { name: "Chỉ số đặc thù từ", description: "Đo mức độ đặc thù của từ" },
        "rhetorical_device": { name: "Biện pháp tu từ", description: "Phát hiện sử dụng biện pháp tu từ" },
        "colloquial_expression": { name: "Biểu thức khẩu ngữ", description: "Phân tích sử dụng ngôn ngữ khẩu ngữ" },
        "sentence_rhythm": { name: "Nhịp câu", description: "Phân tích mẫu nhịp điệu trong câu" },
        "topic_depth": { name: "Phân tích chiều sâu chủ đề", description: "Đo chiều sâu khám phá chủ đề" },
        "narrative_structure": { name: "Cấu trúc tường thuật", description: "Phân tích cấu trúc cung tường thuật" },
        "dialogue_pattern": { name: "Mẫu đối thoại", description: "Phát hiện mẫu sử dụng đối thoại" },
        "evidence_citation": { name: "Trích dẫn chứng cứ", description: "Phân tích mẫu trích dẫn chứng cứ" },
        "emotional_arc": { name: "Cung cảm xúc", description: "Theo dõi tiến trình cung cảm xúc" },
        "ambiguity_tolerance": { name: "Chấp nhận mơ hồ", description: "Đo mức chấp nhận sự mơ hồ" },
        "anaphora_resolution": { name: "Giải quyết hồi chiếu", description: "Phân tích mẫu giải quyết hồi chiếu" },
        "acronym_usage": { name: "Sử dụng từ viết tắt", description: "Phân tích mẫu từ viết tắt và chữ cái đầu" },
        "question_density": { name: "Mật độ dấu hỏi", description: "Đo mẫu mật độ dấu hỏi" },
        "sent_start_variety": { name: "Đa dạng mở đầu câu", description: "Phân tích sự đa dạng từ mở đầu câu" },
        "verb_tense": { name: "Nhất quán thì động từ", description: "Đo tính nhất quán thì động từ" },
        "comma_freq": { name: "Tần suất dấu phẩy", description: "Phân tích mẫu tần suất sử dụng dấu phẩy" },
        "semicolon_usage": { name: "Sử dụng dấu chấm phẩy", description: "Đo tần suất dấu chấm phẩy" },
        "superlative_usage": { name: "Sử dụng bậc nhất", description: "Phân tích tần suất tính từ bậc nhất" },
        "contraction_detect": { name: "Phát hiện viết tắt", description: "Phát hiện mẫu sử dụng dạng viết tắt" },
        "avg_word_length": { name: "Độ dài từ trung bình", description: "Đo phân bổ độ dài từ trung bình" },
        "emphasis_pattern": { name: "Mẫu nhấn mạnh", description: "Phân tích sử dụng nhấn mạnh văn bản" },
        "definite_article": { name: "Mạo từ xác định", description: "Phân tích mẫu sử dụng mạo từ xác định" },
        "number_usage": { name: "Sử dụng số", description: "Phân tích mẫu biểu thức số" },
        "qualifier_density": { name: "Mật độ từ hạn định", description: "Đo mật độ từ hạn định" },
        "passive_active_mix": { name: "Kết hợp chủ-bị động", description: "Phân tích phân bổ giọng chủ động vs bị động" },
        "quotation_usage": { name: "Sử dụng dấu ngoặc kép", description: "Đo mẫu sử dụng dấu ngoặc kép" },
        "analogy_simile": { name: "Phép so sánh & tương tự", description: "Phát hiện sử dụng phép so sánh và tương tự" },
        "conjunction_pair": { name: "Cặp liên từ", description: "Phân tích cặp liên từ tương quan" },
        "abstractness": { name: "Chỉ số trừu tượng", description: "Đo mức độ trừu tượng ngôn ngữ" },
        "instructional_tone": { name: "Giọng hướng dẫn", description: "Phát hiện giọng viết hướng dẫn" },
        "transition_smooth": { name: "Mượt mà chuyển tiếp", description: "Phân tích độ mượt mà chuyển tiếp đoạn" },
        "definition_pattern": { name: "Mẫu định nghĩa", description: "Phát hiện mẫu cấu trúc định nghĩa" },
        "conditional_usage": { name: "Sử dụng điều kiện", description: "Phân tích mẫu câu điều kiện" },
        "repetitive_phrase": { name: "Cụm từ lặp lại", description: "Phát hiện mẫu cụm từ lặp lại" },
        "conclusion_indicator": { name: "Chỉ báo kết luận", description: "Phát hiện mẫu dấu hiệu kết luận" },
        "zipf_deviation": { name: "Độ lệch Zipf", description: "Đo độ lệch từ phân bổ từ theo Luật Zipf" },
        "token_predictability": { name: "Dự đoán token", description: "Phân tích khả năng dự đoán token tiếp theo bằng thống kê bigram" },
        "log_likelihood_rank": { name: "Xếp hạng khả năng", description: "Đo tỷ lệ sử dụng từ phổ biến" },
        "entropy_per_word": { name: "Entropy trên từ", description: "Tính entropy chuẩn hóa trên mỗi từ" },
        "curie_detect": { name: "Phát hiện Curie", description: "Phân tích CV độ dài câu để phát hiện tính đồng đều" },
        "vocabulary_richness": { name: "Phong phú từ vựng", description: "Tính root TTR cho sự phong phú từ vựng" },
        "mean_dep_parse": { name: "Độ sâu phụ thuộc trung bình", description: "Ước lượng xấp xỉ độ sâu phụ thuộc trung bình" },
        "word_rarity": { name: "Điểm hiếm từ", description: "Phát hiện sử dụng từ vựng cổ hiếm" },
        "clause_balance": { name: "Cân bằng mệnh đề", description: "Phân tích cân bằng độ dài mệnh đề trong câu" },
        "micro_repetition": { name: "Vi lặp lại", description: "Phát hiện mẫu lặp lại từ ở cấp vi mô" },
        "text_dna": { name: "Dấu vân tay văn bản", description: "Phân tích tỷ lệ nguyên âm-phụ âm làm dấu vân tay" },
        "intrinsic_dimension": { name: "Chiều nội tại", description: "Ước lượng chiều nội tại của văn bản" },
        "sentence_entropy": { name: "Entropy câu", description: "Tính entropy phân bổ độ dài câu" },
        "lexical_density": { name: "Mật độ từ vựng", description: "Đo tỷ lệ từ nội dung (mật độ từ vựng)" },
        "text_burstiness2": { name: "Bùng phát văn bản v2", description: "Đo tính bùng phát dựa trên IQR của độ dài câu" },
        "vignette_analysis": { name: "Phân tích viễn ảnh", description: "Phân tích mẫu viễn ảnh quang học" },
        "depth_map_consistency": { name: "Nhất quán bản đồ độ sâu", description: "Phân tích tính nhất quán bản đồ độ sâu cho tính hợp lý cảnh 3D" },
        "noise_floor_level": { name: "Mức sàn nhiễu", description: "Đo mức sàn nhiễu cơ bản trên toàn ảnh" },
        "jpeg_coefficient": { name: "Phân bổ hệ số JPEG", description: "Phân tích phân bổ hệ số DCT trong ảnh nén JPEG" },
        "edge_density": { name: "Bản đồ mật độ cạnh", description: "Tạo bản đồ mật độ cạnh không gian để tìm vùng bất thường" },
        "color_moments": { name: "Thống kê moment màu", description: "Tính toán moment màu thống kê (trung bình, độ lệch, độ xiên) cho phân tích pháp y" },
        "lens_distortion_img": { name: "Méo ống kính (Ảnh)", description: "Phát hiện mẫu méo hình thùng/đệm của ống kính" },
        "accessory_consistency": { name: "Nhất quán phụ kiện", description: "Phân tích tính nhất quán render phụ kiện trong video" },
        "eye_contact_consistency": { name: "Nhất quán giao tiếp mắt", description: "Phân tích nhất quán hướng giao tiếp mắt" },
        "hair_strand_consistency": { name: "Nhất quán sợi tóc", description: "Phân tích render từng sợi tóc" },
        "face_warping_artifact": { name: "Dấu vết biến dạng mặt", description: "Phát hiện dấu vết biến đổi biến dạng mặt" },
        "facial_muscle_physics": { name: "Vật lý cơ mặt", description: "Phân tích vật lý chuyển động cơ mặt" },
    },
};

export function getMethodTranslation(methodId: string, locale: Locale): MethodLocaleEntry {
    return METHOD_I18N[locale]?.[methodId] ?? VIDEO_V3_METHODS[locale]?.[methodId] ?? TEXT_V3_METHODS[locale]?.[methodId] ?? NEW_METHODS_FALLBACK[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? VIDEO_V3_METHODS.en?.[methodId] ?? TEXT_V3_METHODS.en?.[methodId] ?? NEW_METHODS_FALLBACK.en?.[methodId] ?? { name: methodId, description: "" };
}

