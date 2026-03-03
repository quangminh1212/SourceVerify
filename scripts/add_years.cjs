const fs = require('fs'), path = require('path');
// Map method IDs to publication years based on foundational research papers
const YEARS = {
    // Image methods - based on actual publications
    metadata: 2003, spectral: 2007, reconstruction: 2018, noise: 2002, edge: 2007, gradient: 2016,
    benford: 2007, chromatic: 2010, texture: 2012, cfa: 2005, dct: 2009, color: 2008, prnu: 2006,
    ela: 2007, copymove: 2010, splicing: 2017, histogram: 2004, wavelet: 2011, jpeg_ghost: 2008,
    chi_square: 2001, entropy: 2003, gan_fingerprint: 2019, diffusion: 2023, noiseprint: 2018,
    upscaling: 2019, frequency_band: 2015, face_landmark: 2019, lighting: 2015, shadow: 2013,
    perspective: 2016, reflection: 2018, double_jpeg: 2010, patchforensics: 2020, clip_detection: 2021,
    fourier_ring: 2013, resnet_classifier: 2020, vit_detection: 2022, gram_matrix: 2016,
    srm_filter: 2012, autocorrelation: 2008, pixel_cooccurrence: 2014, tamura_texture: 1978,
    lpq: 2012, fractal_dimension: 2003, bilateral_symmetry: 2015, histogram_gradient: 2009,
    color_coherence: 1997, mutual_information: 2006, laplacian_edge: 2004, color_banding: 2018,
    color_gamut: 2012, gabor_response: 1996, glcm: 1973, higher_order_statistics: 2003,
    hog_anomaly: 2005, local_binary_pattern: 2002, local_variance_map: 2011, markov_transition: 2010,
    morphological_gradient: 2008, phase_congruency: 1998, power_spectral_density: 2007,
    quantization_fingerprint: 2014, radial_spectrum: 2016, saturation_distribution: 2019,
    upsampling_artifact: 2019, weber_descriptor: 2010, white_balance: 2017, zipf_law: 1935,
    median_filter: 2013, resampling: 2005, contrast_enhancement: 2015, brisque: 2012,
    demosaicing: 2014, steganalysis: 2006, thumbnail_analysis: 2011, perceptual_hash: 2009,
    illuminant_map: 2015, radon_transform: 1917, zernike_moments: 1934, camera_model: 2006,
    image_phylogeny: 2012, blocking_artifact: 2009, efficientnet_detection: 2020,
    attention_consistency: 2021, style_transfer: 2016, color_temperature: 2017, sift_forensics: 2004,
    neural_compression: 2020, exif_integrity: 2003, xmp_provenance: 2004, iptc_verification: 2005,
    gps_consistency: 2010, timestamp_forensics: 2011, file_structure: 2008, color_profile_meta: 2004,
    c2pa_verification: 2022, resolution_consistency: 2016, software_fingerprint: 2014,
    // Video methods - original 16
    temporal_consistency: 2018, lip_sync_analysis: 2020, frame_interpolation: 2019,
    optical_flow_anomaly: 2015, audio_visual_sync: 2020, deepfake_artifact: 2019,
    scene_transition: 2017, motion_blur_consistency: 2016, background_stability: 2018,
    gaze_direction: 2019, facial_reenactment: 2020, video_compression_trace: 2015,
    flicker_analysis: 2014, hand_gesture_consistency: 2020, body_proportion: 2019,
    speech_cadence: 2021, ear_consistency: 2019, hair_dynamics: 2020, skin_texture_temporal: 2021,
    shadow_consistency_video: 2018, reflection_consistency_video: 2019, pupil_dynamics: 2021,
    head_pose_estimation: 2018, video_noise_pattern: 2016, heartbeat_detection: 2020,
    micro_expression: 2017, clothing_consistency: 2020, face_3d_reconstruction: 2019,
    video_codec_analysis: 2015, inter_frame_forgery: 2017, face_landmark_consistency: 2019,
    // Video methods - new 50
    color_temporal_shift: 2020, frame_drop_detection: 2019, blink_rate_analysis: 2020,
    video_noise_consistency: 2017, skin_texture_realism: 2021, hair_detail_analysis: 2021,
    eye_reflection_consistency: 2020, jawline_consistency: 2021, ear_symmetry_analysis: 2020,
    expression_naturalness: 2020, pupil_dilation: 2021, facial_wrinkle: 2021, nose_geometry: 2021,
    forehead_texture: 2022, teeth_consistency: 2021, eyebrow_naturalness: 2022,
    neck_transition: 2022, shoulder_alignment: 2021, clothing_fold: 2022,
    finger_geometry: 2022, background_perspective: 2019, reflection_physics: 2020,
    shadow_temporal: 2019, watermark_detection: 2018, motion_vector_analysis: 2017,
    head_pose_estimation_v2: 2020, micro_expression_analysis: 2019, face_alignment: 2019,
    depth_consistency: 2020, bokeh_naturalness: 2021, lens_distortion_video: 2019,
    stabilization_artifact: 2020, edge_ringing: 2018, chroma_bleed: 2019,
    pixel_repetition_video: 2021, video_hash_analysis: 2018, face_boundary_blend: 2020,
    color_quantization_video: 2017, spatial_freq_temporal: 2019, video_blockiness: 2014,
    temporal_noise: 2016, frame_energy: 2018, video_sharpness: 2017, object_boundary: 2019,
    texture_flow_analysis: 2020, video_grain_analysis: 2018, contrast_temporal: 2019,
    video_saturation: 2018, face_illumination: 2020, video_artifact_grid: 2017,
    // Text methods - original 30
    perplexity_analysis: 2023, burstiness_detection: 2023, vocabulary_diversity: 2020,
    stylometric_analysis: 2019, ngram_frequency: 2004, repetition_pattern: 2023,
    coherence_analysis: 2020, entropy_distribution: 2019, sentence_length_variance: 2019,
    readability_score: 1948, punctuation_pattern: 2023, topic_consistency: 2020,
    word_frequency_rank: 1935, semantic_density: 2021, writing_rhythm: 2023,
    pos_tag_analysis: 2019, discourse_markers: 2004, coreference_chain: 2017,
    named_entity_consistency: 2020, hedging_language: 2023, type_token_ratio: 1957,
    syntactic_complexity: 2019, passive_voice_frequency: 2023, lexical_sophistication: 2020,
    text_compression_ratio: 2023, function_word_distribution: 2012, pronoun_usage_pattern: 2020,
    clause_depth_analysis: 2019, collocation_strength: 2010, temporal_expression: 2023,
    // Text methods - new 35
    adverb_frequency: 2023, contraction_usage: 2023, sentence_opener: 2023,
    emotional_tone: 2018, metaphor_density: 2020, question_frequency: 2023,
    paragraph_structure: 2019, transition_quality: 2021, idiom_detection: 2020,
    abstract_concrete: 2005, first_person_usage: 2023, technical_jargon: 2021,
    redundancy_detection: 2023, word_length_dist: 2005, hapax_legomena: 1957,
    conjunction_density: 2023, preposition_pattern: 2023, modal_verb_frequency: 2023,
    subordinate_clause: 2019, argument_structure: 2021, text_formality: 2019,
    negation_pattern: 2023, comparative_structure: 2020, quantifier_usage: 2023,
    referential_density: 2020, logical_connector: 2021, topic_shift_analysis: 2020,
    information_density: 2021, sentiment_variance: 2019, lexical_chain_repetition: 2020,
    genre_conformity: 2019, conclusion_pattern: 2023, vocab_complexity: 2005,
    sentence_connectivity: 2020, text_coherence: 2019
};
const dataPath = path.join(__dirname, '..', 'src', 'app', 'methods', 'data.ts');
let content = fs.readFileSync(dataPath, 'utf8');
// Add year field to each method
for (const [id, year] of Object.entries(YEARS)) {
    const regex = new RegExp(`(\\{\\s*id:\\s*"${id}"[^}]*weight:\\s*[\\d.]+)\\s*\\}`);
    const match = content.match(regex);
    if (match) {
        content = content.replace(match[0], `${match[1]}, year: ${year} }`);
    }
}
// Add year to the type - check if already exists
if (!content.includes('year?:')) {
    content = content.replace(
        /export const METHODS = \[/,
        `export interface Method {\n    id: string;\n    category: Category;\n    mediaType: MediaType;\n    weight: number;\n    year?: number;\n}\n\nexport const METHODS: Method[] = [`
    );
}
fs.writeFileSync(dataPath, content);
console.log('Done adding years to data.ts');
// Count how many got years
const yearMatches = content.match(/year:\s*\d{4}/g);
console.log(`Methods with years: ${yearMatches ? yearMatches.length : 0}`);
