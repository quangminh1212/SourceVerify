const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '..', 'src', 'app', 'methods', 'methodsI18n.ts');
let content = fs.readFileSync(i18nPath, 'utf8');

// New video methods (50)
const newVideoMethods = [
    ["color_temporal_shift", "Color Temporal Shift", "Phân tích dịch chuyển màu", "Analyzes color drift patterns across spatial regions to detect AI generation artifacts", "Phân tích mẫu dịch chuyển màu sắc trên các vùng không gian để phát hiện dấu vết AI"],
    ["frame_drop", "Frame Drop Detection", "Phát hiện mất khung hình", "Detects frame continuity breaks and drop patterns common in AI-generated video", "Phát hiện sự gãy liên tục khung hình, phổ biến trong video AI"],
    ["blink_rate", "Blink Rate Analysis", "Phân tích tỷ lệ chớp mắt", "Analyzes eye blink patterns for naturalness — AI often generates unnatural blink rates", "Phân tích mẫu chớp mắt tự nhiên — AI thường tạo tỷ lệ chớp mắt không tự nhiên"],
    ["video_noise", "Video Noise Consistency", "Nhất quán nhiễu video", "Examines noise pattern consistency across frame regions", "Kiểm tra tính nhất quán của mẫu nhiễu trên các vùng khung hình"],
    ["skin_texture", "Skin Texture Realism", "Chất cảm da thực tế", "Analyzes skin micro-texture and pore detail for realism", "Phân tích vi kết cấu da và chi tiết lỗ chân lông"],
    ["hair_detail", "Hair Detail Analysis", "Phân tích chi tiết tóc", "Examines hair strand detail and rendering quality", "Kiểm tra chi tiết sợi tóc và chất lượng render"],
    ["eye_reflection", "Eye Reflection Consistency", "Nhất quán phản chiếu mắt", "Analyzes catchlight and eye reflection patterns", "Phân tích mẫu phản chiếu ánh sáng trong mắt"],
    ["jawline", "Jawline Consistency", "Nhất quán đường hàm", "Analyzes jaw boundary smoothness and consistency", "Phân tích độ mịn và nhất quán của đường viền hàm"],
    ["ear_symmetry", "Ear Symmetry Analysis", "Phân tích đối xứng tai", "Examines ear shape and symmetry consistency", "Kiểm tra hình dạng và đối xứng tai"],
    ["expression", "Expression Naturalness", "Tự nhiên biểu cảm", "Analyzes facial expression dynamics for naturalness", "Phân tích động lực biểu cảm khuôn mặt"],
    ["pupil_dilation", "Pupil Dilation", "Giãn đồng tử", "Analyzes pupil response and dilation patterns", "Phân tích phản ứng và mẫu giãn nở đồng tử"],
    ["facial_wrinkle", "Facial Wrinkle Consistency", "Nhất quán nếp nhăn", "Analyzes wrinkle pattern and depth consistency", "Phân tích mẫu nếp nhăn và độ sâu"],
    ["nose_geometry", "Nose Geometry", "Hình học mũi", "Analyzes nose 3D consistency and geometry", "Phân tích tính nhất quán 3D của mũi"],
    ["forehead_texture", "Forehead Texture", "Kết cấu trán", "Analyzes forehead micro-pattern and texture", "Phân tích vi mẫu và kết cấu trán"],
    ["teeth", "Teeth Consistency", "Nhất quán răng", "Analyzes teeth rendering and alignment", "Phân tích render và sắp xếp răng"],
    ["eyebrow", "Eyebrow Naturalness", "Tự nhiên lông mày", "Analyzes eyebrow texture and shape", "Phân tích kết cấu và hình dạng lông mày"],
    ["neck_transition", "Neck Transition", "Chuyển tiếp cổ", "Analyzes neck-face boundary transition", "Phân tích chuyển tiếp đường viền cổ-mặt"],
    ["shoulder", "Shoulder Alignment", "Căn chỉnh vai", "Analyzes shoulder geometry and alignment", "Phân tích hình học và căn chỉnh vai"],
    ["clothing_fold", "Clothing Fold Physics", "Vật lý nếp gấp áo", "Analyzes clothing fold physics simulation", "Phân tích mô phỏng vật lý nếp gấp quần áo"],
    ["finger_geometry", "Finger Geometry", "Hình học ngón tay", "Analyzes finger count and geometry", "Phân tích số lượng và hình học ngón tay"],
    ["bg_perspective", "Background Perspective", "Phối cảnh nền", "Analyzes background perspective geometry consistency", "Phân tích tính nhất quán hình học phối cảnh nền"],
    ["reflection_physics", "Reflection Physics", "Vật lý phản chiếu", "Analyzes reflection physical consistency", "Phân tích tính nhất quán vật lý phản chiếu"],
    ["shadow_temporal", "Shadow Temporal", "Bóng đổ thời gian", "Analyzes shadow movement consistency over time", "Phân tích tính nhất quán chuyển động bóng đổ"],
    ["watermark", "Watermark Detection", "Phát hiện watermark", "Analyzes AI watermark and signature patterns", "Phân tích watermark và dấu hiệu AI"],
    ["motion_vector", "Motion Vector Analysis", "Phân tích vector chuyển động", "Analyzes motion vector consistency and smoothness", "Phân tích tính nhất quán vector chuyển động"],
    ["head_pose_v2", "Head Pose Estimation v2", "Ước lượng tư thế đầu v2", "Analyzes head pose physics and rotation", "Phân tích vật lý tư thế và xoay đầu"],
    ["micro_expression_v2", "Micro-Expression v2", "Vi biểu cảm v2", "Detects micro-expression patterns and naturalness", "Phát hiện mẫu vi biểu cảm và tính tự nhiên"],
    ["face_alignment_v", "Face Alignment", "Căn chỉnh khuôn mặt", "Analyzes face alignment geometry consistency", "Phân tích tính nhất quán hình học căn chỉnh mặt"],
    ["depth_consistency", "Depth Consistency", "Nhất quán độ sâu", "Analyzes depth map consistency", "Phân tích tính nhất quán bản đồ độ sâu"],
    ["bokeh", "Bokeh Naturalness", "Tự nhiên bokeh", "Analyzes bokeh effect naturalness", "Phân tích tính tự nhiên hiệu ứng bokeh"],
    ["lens_distortion_v", "Lens Distortion", "Méo ống kính", "Analyzes lens distortion pattern", "Phân tích mẫu méo ống kính"],
    ["stabilization", "Stabilization Artifact", "Dấu vết ổn định", "Detects video stabilization artifacts", "Phát hiện dấu vết ổn định video"],
    ["edge_ringing", "Edge Ringing", "Ringing biên", "Analyzes edge ringing artifacts", "Phân tích dấu vết ringing biên"],
    ["chroma_bleed", "Chroma Bleed", "Chảy sắc độ", "Detects chroma bleed artifacts", "Phát hiện dấu vết chảy sắc độ"],
    ["pixel_repetition_v", "Pixel Repetition", "Lặp pixel", "Analyzes pixel pattern repetition in frame", "Phân tích sự lặp lại mẫu pixel trong khung hình"],
    ["video_hash", "Video Hash Analysis", "Phân tích hash video", "Analyzes video perceptual hash", "Phân tích hash nhận thức video"],
    ["face_boundary_blend", "Face Boundary Blend", "Pha trộn biên mặt", "Detects face boundary blending artifacts", "Phát hiện dấu vết pha trộn biên khuôn mặt"],
    ["color_quant_v", "Color Quantization", "Lượng tử hóa màu", "Analyzes color quantization level", "Phân tích mức lượng tử hóa màu"],
    ["spatial_freq_temporal", "Spatial Freq Temporal", "Tần số không gian", "Analyzes spatial frequency temporal stability", "Phân tích ổn định tần số không gian theo thời gian"],
    ["video_blockiness", "Video Blockiness", "Khối video", "Analyzes video compression blockiness", "Phân tích tính khối nén video"],
    ["temporal_noise", "Temporal Noise Pattern", "Mẫu nhiễu thời gian", "Analyzes temporal noise pattern", "Phân tích mẫu nhiễu theo thời gian"],
    ["frame_energy", "Frame Energy", "Năng lượng khung hình", "Analyzes frame energy distribution", "Phân tích phân bổ năng lượng khung hình"],
    ["video_sharpness", "Video Sharpness", "Sắc nét video", "Analyzes video sharpness consistency", "Phân tích tính nhất quán sắc nét video"],
    ["object_boundary", "Object Boundary", "Biên đối tượng", "Analyzes object boundary consistency", "Phân tích tính nhất quán biên đối tượng"],
    ["texture_flow", "Texture Flow", "Dòng kết cấu", "Analyzes texture flow coherence", "Phân tích tính liên kết dòng kết cấu"],
    ["video_grain", "Video Grain", "Hạt phim video", "Analyzes film grain pattern", "Phân tích mẫu hạt phim"],
    ["contrast_temporal", "Contrast Temporal", "Tương phản thời gian", "Analyzes contrast temporal stability", "Phân tích ổn định tương phản theo thời gian"],
    ["video_saturation", "Video Saturation", "Bão hòa video", "Analyzes video saturation distribution", "Phân tích phân bổ bão hòa video"],
    ["face_illumination", "Face Illumination", "Chiếu sáng mặt", "Analyzes face illumination consistency", "Phân tích tính nhất quán chiếu sáng khuôn mặt"],
    ["video_artifact_grid", "Video Artifact Grid", "Lưới dấu vết", "Grid-based artifact detection", "Phát hiện dấu vết dựa trên lưới"],
];

// New text methods (35)
const newTextMethods = [
    ["adverb_frequency", "Adverb Frequency", "Tần suất trạng từ", "Analyzes adverb usage patterns — AI text often overuses adverbs", "Phân tích mẫu sử dụng trạng từ — AI thường lạm dụng trạng từ"],
    ["contraction_usage", "Contraction Usage", "Sử dụng viết tắt", "Measures contraction frequency — AI tends to use fewer contractions", "Đo tần suất viết tắt — AI thường ít dùng viết tắt"],
    ["sentence_opener", "Sentence Opener Diversity", "Đa dạng mở đầu câu", "Analyzes sentence beginning diversity", "Phân tích sự đa dạng cách mở đầu câu"],
    ["emotional_tone", "Emotional Tone Variance", "Biến thiên cảm xúc", "Measures emotional variation across text", "Đo biến thiên cảm xúc trong văn bản"],
    ["metaphor_density", "Metaphor Density", "Mật độ ẩn dụ", "Analyzes figurative language density", "Phân tích mật độ ngôn ngữ hình tượng"],
    ["question_frequency", "Question Frequency", "Tần suất câu hỏi", "Measures question usage patterns", "Đo mẫu sử dụng câu hỏi"],
    ["paragraph_structure", "Paragraph Structure", "Cấu trúc đoạn văn", "Analyzes paragraph organization", "Phân tích tổ chức đoạn văn"],
    ["transition_quality", "Transition Quality", "Chất lượng chuyển tiếp", "Evaluates transition smoothness between ideas", "Đánh giá sự mượt mà chuyển tiếp giữa các ý"],
    ["idiom_detection", "Idiom Detection", "Phát hiện thành ngữ", "Detects idiomatic expression usage", "Phát hiện sử dụng thành ngữ"],
    ["abstract_concrete", "Abstract-Concrete Ratio", "Tỷ lệ trừu tượng", "Analyzes abstract vs concrete language balance", "Phân tích cân bằng ngôn ngữ trừu tượng và cụ thể"],
    ["first_person_usage", "First Person Usage", "Sử dụng ngôi thứ nhất", "Analyzes first person perspective patterns", "Phân tích mẫu góc nhìn ngôi thứ nhất"],
    ["technical_jargon", "Technical Jargon", "Thuật ngữ chuyên môn", "Measures technical term density", "Đo mật độ thuật ngữ chuyên môn"],
    ["redundancy_detection", "Redundancy Detection", "Phát hiện dư thừa", "Detects redundant phrases and repetition", "Phát hiện cụm từ dư thừa và lặp lại"],
    ["word_length_dist", "Word Length Distribution", "Phân bổ độ dài từ", "Analyzes word length distribution patterns", "Phân tích mẫu phân bổ độ dài từ"],
    ["hapax_legomena", "Hapax Legomena", "Từ xuất hiện một lần", "Analyzes unique word occurrence rate", "Phân tích tỷ lệ từ xuất hiện duy nhất một lần"],
    ["conjunction_density", "Conjunction Density", "Mật độ liên từ", "Measures conjunction usage patterns", "Đo mẫu sử dụng liên từ"],
    ["preposition_pattern", "Preposition Pattern", "Mẫu giới từ", "Analyzes preposition distribution", "Phân tích phân bổ giới từ"],
    ["modal_verb_frequency", "Modal Verb Frequency", "Tần suất động từ khiếm khuyết", "Measures modal verb usage patterns", "Đo mẫu sử dụng động từ khiếm khuyết"],
    ["subordinate_clause", "Subordinate Clause", "Mệnh đề phụ", "Analyzes subordinate clause frequency", "Phân tích tần suất mệnh đề phụ"],
    ["argument_structure", "Argument Structure", "Cấu trúc lập luận", "Analyzes argument chain structure", "Phân tích cấu trúc chuỗi lập luận"],
    ["text_formality", "Text Formality", "Trang trọng văn bản", "Measures text formality level", "Đo mức độ trang trọng văn bản"],
    ["negation_pattern", "Negation Pattern", "Mẫu phủ định", "Analyzes negation usage patterns", "Phân tích mẫu sử dụng phủ định"],
    ["comparative_structure", "Comparative Structure", "Cấu trúc so sánh", "Analyzes comparison usage patterns", "Phân tích mẫu sử dụng so sánh"],
    ["quantifier_usage", "Quantifier Usage", "Sử dụng lượng từ", "Measures quantifier frequency", "Đo tần suất lượng từ"],
    ["referential_density", "Referential Density", "Mật độ tham chiếu", "Analyzes reference density patterns", "Phân tích mẫu mật độ tham chiếu"],
    ["logical_connector", "Logical Connector", "Liên kết logic", "Analyzes logical connector distribution", "Phân tích phân bổ liên kết logic"],
    ["topic_shift_analysis", "Topic Shift Analysis", "Phân tích chuyển chủ đề", "Analyzes topic transition patterns", "Phân tích mẫu chuyển đổi chủ đề"],
    ["information_density", "Information Density", "Mật độ thông tin", "Measures information per sentence", "Đo thông tin trên mỗi câu"],
    ["sentiment_variance", "Sentiment Variance", "Biến thiên cảm xúc", "Analyzes sentiment variation patterns", "Phân tích mẫu biến thiên cảm xúc"],
    ["lexical_chain_repetition", "Lexical Chain Repetition", "Lặp chuỗi từ vựng", "Analyzes lexical chain repetition", "Phân tích lặp chuỗi từ vựng"],
    ["genre_conformity", "Genre Conformity", "Phù hợp thể loại", "Analyzes genre style conformity", "Phân tích sự phù hợp phong cách thể loại"],
    ["conclusion_pattern", "Conclusion Pattern", "Mẫu kết luận", "Analyzes conclusion structure patterns", "Phân tích mẫu cấu trúc kết luận"],
    ["vocab_complexity", "Vocabulary Complexity", "Độ phức tạp từ vựng", "Measures vocabulary complexity level", "Đo mức độ phức tạp từ vựng"],
    ["sentence_connectivity", "Sentence Connectivity", "Kết nối câu", "Analyzes sentence connectivity patterns", "Phân tích mẫu kết nối giữa các câu"],
    ["text_coherence", "Text Coherence Score", "Điểm mạch lạc", "Overall text coherence scoring", "Chấm điểm mạch lạc tổng thể văn bản"],
];

// Build fallback entries for getMethodTranslation
let fallbackEntries = '\n// Video Analysis Methods v3 - Inline fallback data for 50 new methods\nconst VIDEO_V3_METHODS: Record<string, Record<string, MethodLocaleEntry>> = {\n    en: {\n';

for (const [id, nameEn, , descEn] of newVideoMethods) {
    fallbackEntries += `        "${id}": { name: "${nameEn}", description: "${descEn}" },\n`;
}
fallbackEntries += '    },\n    vi: {\n';
for (const [id, , nameVi, , descVi] of newVideoMethods) {
    fallbackEntries += `        "${id}": { name: "${nameVi}", description: "${descVi}" },\n`;
}
fallbackEntries += '    },\n};\n\n';

fallbackEntries += '// Text Analysis Methods v3 - Inline fallback data for 35 new methods\nconst TEXT_V3_METHODS: Record<string, Record<string, MethodLocaleEntry>> = {\n    en: {\n';
for (const [id, nameEn, , descEn] of newTextMethods) {
    fallbackEntries += `        "${id}": { name: "${nameEn}", description: "${descEn}" },\n`;
}
fallbackEntries += '    },\n    vi: {\n';
for (const [id, , nameVi, , descVi] of newTextMethods) {
    fallbackEntries += `        "${id}": { name: "${nameVi}", description: "${descVi}" },\n`;
}
fallbackEntries += '    },\n};\n';

// Insert before getMethodTranslation function
content = content.replace(
    'const METHOD_I18N: Record<string, Record<string, MethodLocaleEntry>> = { en, vi };',
    `const METHOD_I18N: Record<string, Record<string, MethodLocaleEntry>> = { en, vi };\n${fallbackEntries}`
);

// Update getMethodTranslation to include fallbacks
content = content.replace(
    'return METHOD_I18N[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? { name: methodId, description: "" };',
    'return METHOD_I18N[locale]?.[methodId] ?? VIDEO_V3_METHODS[locale]?.[methodId] ?? TEXT_V3_METHODS[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? VIDEO_V3_METHODS.en?.[methodId] ?? TEXT_V3_METHODS.en?.[methodId] ?? { name: methodId, description: "" };'
);

fs.writeFileSync(i18nPath, content);
console.log('Updated app/methods/methodsI18n.ts with inline fallbacks');
