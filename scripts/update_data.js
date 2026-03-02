const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'app', 'methods', 'data.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// New 50 video methods to add to data.ts
const newVideoData = [
    ['color_temporal_shift', 'pixel'], ['frame_drop', 'frequency'], ['blink_rate', 'sensor'],
    ['video_noise', 'sensor'], ['skin_texture', 'pixel'], ['hair_detail', 'pixel'],
    ['eye_reflection', 'sensor'], ['jawline', 'pixel'], ['ear_symmetry', 'pixel'],
    ['expression', 'sensor'], ['pupil_dilation', 'sensor'], ['facial_wrinkle', 'pixel'],
    ['nose_geometry', 'pixel'], ['forehead_texture', 'pixel'], ['teeth', 'pixel'],
    ['eyebrow', 'pixel'], ['neck_transition', 'pixel'], ['shoulder', 'pixel'],
    ['clothing_fold', 'pixel'], ['finger_geometry', 'pixel'], ['bg_perspective', 'pixel'],
    ['reflection_physics', 'pixel'], ['shadow_temporal', 'pixel'], ['watermark', 'metadata'],
    ['motion_vector', 'frequency'], ['head_pose', 'pixel'], ['micro_expression_v2', 'sensor'],
    ['face_alignment_v', 'pixel'], ['depth_consistency', 'pixel'], ['bokeh', 'sensor'],
    ['lens_distortion_v', 'sensor'], ['stabilization', 'frequency'], ['edge_ringing', 'frequency'],
    ['chroma_bleed', 'pixel'], ['pixel_repetition_v', 'pixel'], ['video_hash', 'statistical'],
    ['face_boundary_blend', 'sensor'], ['color_quant_v', 'statistical'], ['spatial_freq_temporal', 'frequency'],
    ['video_blockiness', 'frequency'], ['temporal_noise', 'sensor'], ['frame_energy', 'statistical'],
    ['video_sharpness', 'pixel'], ['object_boundary', 'pixel'], ['texture_flow', 'pixel'],
    ['video_grain', 'sensor'], ['contrast_temporal', 'statistical'], ['video_saturation', 'pixel'],
    ['face_illumination', 'pixel'], ['video_artifact_grid', 'frequency'],
];

// New 35 text methods
const newTextData = [
    ['adverb_frequency', 'statistical'], ['contraction_usage', 'statistical'], ['sentence_opener', 'statistical'],
    ['emotional_tone', 'statistical'], ['metaphor_density', 'statistical'], ['question_frequency', 'statistical'],
    ['paragraph_structure', 'statistical'], ['transition_quality', 'statistical'], ['idiom_detection', 'statistical'],
    ['abstract_concrete', 'statistical'], ['first_person_usage', 'statistical'], ['technical_jargon', 'statistical'],
    ['redundancy_detection', 'statistical'], ['word_length_dist', 'statistical'], ['hapax_legomena', 'statistical'],
    ['conjunction_density', 'statistical'], ['preposition_pattern', 'statistical'], ['modal_verb_frequency', 'statistical'],
    ['subordinate_clause', 'statistical'], ['argument_structure', 'statistical'], ['text_formality', 'statistical'],
    ['negation_pattern', 'statistical'], ['comparative_structure', 'statistical'], ['quantifier_usage', 'statistical'],
    ['referential_density', 'statistical'], ['logical_connector', 'statistical'], ['topic_shift_analysis', 'statistical'],
    ['information_density', 'statistical'], ['sentiment_variance', 'statistical'], ['lexical_chain_repetition', 'statistical'],
    ['genre_conformity', 'statistical'], ['conclusion_pattern', 'statistical'], ['vocab_complexity', 'statistical'],
    ['sentence_connectivity', 'statistical'], ['text_coherence', 'statistical'],
];

let videoLines = '    // Video Analysis Methods v3 - Extended detection\n';
for (const [id, cat] of newVideoData) {
    videoLines += `    { id: "${id}", category: "${cat}" as Category, mediaType: "video" as MediaType, weight: 0.02 },\n`;
}

let textLines = '    // Text Analysis Methods v3 - Extended NLP analysis\n';
for (const [id, cat] of newTextData) {
    textLines += `    { id: "${id}", category: "${cat}" as Category, mediaType: "text" as MediaType, weight: 0.02 },\n`;
}

// Insert new video methods before text methods
content = content.replace(
    '    // Text Analysis Methods\n',
    `${videoLines}    // Text Analysis Methods\n`
);

// Insert new text methods before closing bracket
content = content.replace(
    '    { id: "temporal_expression", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02 },\n];',
    `    { id: "temporal_expression", category: "statistical" as Category, mediaType: "text" as MediaType, weight: 0.02 },\n${textLines}];`
);

fs.writeFileSync(dataPath, content);
console.log('Updated data.ts');

// Count methods
const imgCount = (content.match(/mediaType: "image"/g) || []).length;
const vidCount = (content.match(/mediaType: "video"/g) || []).length;
const txtCount = (content.match(/mediaType: "text"/g) || []).length;
console.log(`Image: ${imgCount}, Video: ${vidCount}, Text: ${txtCount}, Total: ${imgCount + vidCount + txtCount}`);
