const fs = require('fs'), p = require('path');
const file = p.join(__dirname, '..', 'src', 'app', 'methods', 'methodsI18n.ts');
let content = fs.readFileSync(file, 'utf8');

// All new methods that need i18n fallback entries
// Format: [id, enName, enDesc, viName, viDesc]
const newMethods = [
    // Image v11 (20)
    ["anti_aliasing", "Anti-aliasing Consistency", "Analyzes anti-aliasing pattern consistency — AI often produces overly smooth or inconsistent edge anti-aliasing", "Nhất quán khử răng cưa", "Phân tích tính nhất quán mẫu khử răng cưa — AI thường tạo khử răng cưa quá mịn hoặc không đồng đều"],
    ["aperture_diffraction", "Aperture Diffraction", "Analyzes optical diffraction patterns that real camera lenses produce", "Nhiễu xạ khẩu độ", "Phân tích mẫu nhiễu xạ quang học mà ống kính máy ảnh thực tạo ra"],
    ["channel_independence", "Channel Independence", "Tests pixel independence between RGB color channels", "Độc lập kênh màu", "Kiểm tra tính độc lập pixel giữa các kênh màu RGB"],
    ["chroma_subsampling", "Chroma Subsampling", "Detects chroma subsampling artifacts from image compression", "Lấy mẫu phụ sắc độ", "Phát hiện dấu vết lấy mẫu phụ sắc độ từ nén ảnh"],
    ["color_channel_noise", "Color Channel Noise", "Analyzes noise distribution across R, G, B channels", "Nhiễu kênh màu", "Phân tích phân bổ nhiễu trên các kênh R, G, B"],
    ["color_moment_statistics", "Color Moment Statistics", "Computes statistical color moments (mean, std, skewness) for forensic analysis", "Thống kê moment màu", "Tính toán moment màu thống kê (trung bình, độ lệch, độ xiên) cho phân tích pháp y"],
    ["depth_map", "Depth Map Consistency", "Analyzes depth map consistency for 3D scene plausibility", "Nhất quán bản đồ độ sâu", "Phân tích tính nhất quán bản đồ độ sâu cho tính hợp lý cảnh 3D"],
    ["edge_density_map", "Edge Density Map", "Creates spatial edge density maps to find anomalous regions", "Bản đồ mật độ cạnh", "Tạo bản đồ mật độ cạnh không gian để tìm vùng bất thường"],
    ["hot_pixel", "Hot Pixel Detection", "Detects hot/dead pixel patterns absent in AI images", "Phát hiện điểm ảnh nóng", "Phát hiện mẫu điểm ảnh nóng/chết vắng mặt trong ảnh AI"],
    ["image_complexity", "Image Complexity", "Measures overall image structural complexity", "Độ phức tạp ảnh", "Đo độ phức tạp cấu trúc tổng thể của ảnh"],
    ["jpeg_coefficient_dist", "JPEG Coefficient Distribution", "Analyzes DCT coefficient distribution in JPEG compressed images", "Phân bổ hệ số JPEG", "Phân tích phân bổ hệ số DCT trong ảnh nén JPEG"],
    ["lens_distortion_i", "Lens Distortion (Image)", "Detects barrel/pincushion lens distortion patterns", "Méo ống kính (Ảnh)", "Phát hiện mẫu méo hình thùng/đệm của ống kính"],
    ["micro_texture", "Micro Texture Analysis", "Analyzes micro-level texture patterns invisible to human eye", "Phân tích vi kết cấu", "Phân tích mẫu kết cấu vi mô không nhìn thấy bằng mắt thường"],
    ["moire_pattern", "Moiré Pattern", "Detects moiré interference patterns from screen capture", "Mẫu Moiré", "Phát hiện mẫu giao thoa Moiré từ chụp màn hình"],
    ["noise_floor", "Noise Floor Level", "Measures base noise floor level across image", "Mức sàn nhiễu", "Đo mức sàn nhiễu cơ bản trên toàn ảnh"],
    ["patch_similarity", "Patch Similarity Matrix", "Computes self-similarity matrix of image patches", "Ma trận tương đồng mảnh", "Tính ma trận tự tương đồng của các mảnh ảnh"],
    ["spectral_decay", "Spectral Decay Rate", "Measures how fast frequency spectrum decays", "Tốc độ suy giảm phổ", "Đo tốc độ suy giảm phổ tần số"],
    ["texture_periodicity", "Texture Periodicity", "Detects periodic texture patterns common in AI generation", "Tính tuần hoàn kết cấu", "Phát hiện mẫu kết cấu tuần hoàn phổ biến trong AI"],
    ["tone_mapping", "Tone Mapping Analysis", "Analyzes HDR tone mapping artifacts", "Phân tích ánh xạ tông", "Phân tích dấu vết ánh xạ tông HDR"],
    ["vignette", "Vignette Analysis", "Analyzes optical vignetting patterns", "Phân tích viễn ảnh", "Phân tích mẫu viễn ảnh quang học"],
    // Image v12 (24)
    ["skin_texture_freq", "Skin Texture Frequency", "Analyzes skin texture frequency patterns for AI artifacts", "Tần số kết cấu da", "Phân tích mẫu tần số kết cấu da để phát hiện dấu vết AI"],
    ["bloom_artifact", "Bloom Artifact", "Detects light bloom artifacts common in AI generation", "Dấu vết tán sáng", "Phát hiện dấu vết tán sáng phổ biến trong ảnh AI"],
    ["gamma_distortion", "Gamma Distortion", "Analyzes gamma curve distortion patterns", "Méo gamma", "Phân tích mẫu méo đường cong gamma"],
    ["linear_pattern", "Linear Pattern Detection", "Detects unnatural linear patterns in image", "Phát hiện mẫu tuyến tính", "Phát hiện mẫu tuyến tính không tự nhiên trong ảnh"],
    ["dynamic_range", "Dynamic Range Analysis", "Analyzes image dynamic range characteristics", "Phân tích dải động", "Phân tích đặc tính dải động của ảnh"],
    ["intensity_kurtosis", "Intensity Kurtosis", "Measures kurtosis of pixel intensity distribution", "Độ nhọn cường độ", "Đo độ nhọn của phân bổ cường độ pixel"],
    ["cross_gradient", "Cross Gradient", "Analyzes cross-directional gradient patterns", "Gradient chéo", "Phân tích mẫu gradient theo hướng chéo"],
    ["pixel_symmetry", "Pixel Symmetry", "Detects unnatural pixel symmetry patterns", "Đối xứng pixel", "Phát hiện mẫu đối xứng pixel không tự nhiên"],
    ["local_entropy", "Local Entropy", "Measures local entropy variation across image regions", "Entropy cục bộ", "Đo biến thiên entropy cục bộ trên các vùng ảnh"],
    ["luma_gradient_angle", "Luma Gradient Angle", "Analyzes luminance gradient angle distribution", "Góc gradient độ sáng", "Phân tích phân bổ góc gradient độ sáng"],
    ["rgb_correlation", "RGB Correlation", "Measures inter-channel correlation patterns", "Tương quan RGB", "Đo mẫu tương quan giữa các kênh"],
    ["isolated_pixel", "Isolated Pixel", "Detects isolated pixel anomalies", "Pixel cô lập", "Phát hiện bất thường pixel cô lập"],
    ["spatial_coherence", "Spatial Coherence", "Analyzes spatial coherence across image", "Nhất quán không gian", "Phân tích tính nhất quán không gian trên ảnh"],
    ["contour_smooth", "Contour Smoothness", "Analyzes contour smoothness patterns", "Độ mịn đường viền", "Phân tích mẫu độ mịn đường viền"],
    ["color_entropy", "Color Entropy", "Measures color entropy distribution", "Entropy màu", "Đo phân bổ entropy màu"],
    ["brightness_gradient", "Brightness Gradient", "Analyzes brightness gradient patterns", "Gradient độ sáng", "Phân tích mẫu gradient độ sáng"],
    ["noise_granularity", "Noise Granularity", "Measures noise grain size and distribution", "Độ hạt nhiễu", "Đo kích thước hạt nhiễu và phân bổ"],
    ["hue_consistency", "Hue Consistency", "Analyzes hue consistency across regions", "Nhất quán sắc độ", "Phân tích tính nhất quán sắc độ trên các vùng"],
    ["pixel_bit_plane", "Pixel Bit Plane", "Analyzes bit plane patterns for hidden artifacts", "Mặt phẳng bit pixel", "Phân tích mẫu mặt phẳng bit để tìm dấu vết ẩn"],
    ["contrast_map", "Contrast Map", "Creates spatial contrast maps", "Bản đồ tương phản", "Tạo bản đồ tương phản không gian"],
    ["flat_region_ratio", "Flat Region Ratio", "Measures ratio of flat/smooth regions", "Tỷ lệ vùng phẳng", "Đo tỷ lệ vùng phẳng/mịn"],
    ["posterization", "Posterization Detection", "Detects color posterization artifacts", "Phát hiện posterization", "Phát hiện dấu vết posterization màu"],
    ["mean_shift_cluster", "Mean Shift Clustering", "Analyzes pixel clustering patterns", "Phân cụm Mean Shift", "Phân tích mẫu phân cụm pixel"],
    ["gradient_magnitude", "Gradient Magnitude Histogram", "Analyzes gradient magnitude distribution", "Histogram biên độ gradient", "Phân tích phân bổ biên độ gradient"],
    // Image v13 (20)
    ["richardson_lucy", "Richardson-Lucy Deconvolution", "Applies Richardson-Lucy deconvolution to detect sharpness artifacts (Fridrich, 2012)", "Giải chập Richardson-Lucy", "Áp dụng giải chập Richardson-Lucy để phát hiện dấu vết sắc nét"],
    ["wiener_residual", "Wiener Filter Residual", "Analyzes Wiener filter residual noise patterns (Fridrich, 2012)", "Dư Wiener Filter", "Phân tích mẫu nhiễu dư của bộ lọc Wiener"],
    ["second_order_grad", "Second Order Gradient", "Computes 2nd-order gradient for texture analysis (Wang, 2019)", "Gradient bậc 2", "Tính gradient bậc 2 cho phân tích kết cấu"],
    ["dct_energy_compact", "DCT Energy Compaction", "Analyzes DCT energy compaction ratio (Frank, 2020)", "Nén năng lượng DCT", "Phân tích tỷ lệ nén năng lượng DCT"],
    ["spatial_rich_model", "Spatial Rich Model (SRM)", "Implements Fridrich's Spatial Rich Model for steganalysis (2012)", "Mô hình phong phú không gian", "Triển khai SRM của Fridrich cho phân tích steganography"],
    ["mid_freq_energy", "Mid-Frequency Energy", "Analyzes mid-frequency band energy ratio (Durall, 2020)", "Năng lượng tần số trung", "Phân tích tỷ lệ năng lượng dải tần số trung"],
    ["laplacian_variance", "Laplacian Variance", "Measures Laplacian variance for blur detection (Tenenbaum, 2004)", "Phương sai Laplacian", "Đo phương sai Laplacian để phát hiện mờ"],
    ["sobel_magnitude", "Sobel Magnitude Distribution", "Analyzes Sobel gradient magnitude distribution (Canny, 2007)", "Phân bổ biên độ Sobel", "Phân tích phân bổ biên độ gradient Sobel"],
    ["canny_density", "Canny Edge Density", "Measures edge density using Canny-like detection (2006)", "Mật độ cạnh Canny", "Đo mật độ cạnh sử dụng phát hiện kiểu Canny"],
    ["cooc_entropy", "Co-occurrence Entropy", "Computes co-occurrence matrix entropy (Haralick, 2015)", "Entropy đồng xuất hiện", "Tính entropy ma trận đồng xuất hiện"],
    ["box_filter_residual", "Box Filter Residual", "Analyzes box filter residual for smoothing detection (2018)", "Dư bộ lọc hộp", "Phân tích dư bộ lọc hộp để phát hiện làm mịn"],
    ["maximal_grad_flow", "Maximal Gradient Flow", "Analyzes dominant gradient flow direction (2019)", "Dòng gradient cực đại", "Phân tích hướng dòng gradient chiếm ưu thế"],
    ["difference_histogram", "Difference Histogram", "Studies adjacent pixel difference histogram (Popescu, 2013)", "Histogram hiệu số", "Nghiên cứu histogram hiệu pixel liền kề"],
    ["sub_band_dev", "Sub-band Deviation", "Measures spatial sub-band deviation (Durall, 2020)", "Độ lệch dải phụ", "Đo độ lệch dải phụ không gian"],
    ["grad_orient_hist", "Gradient Orientation Histogram", "Analyzes gradient orientation uniformity (Dalal, 2015)", "Histogram hướng gradient", "Phân tích tính đồng đều hướng gradient"],
    ["kirsch_edge", "Kirsch Edge Response", "Computes Kirsch compass edge response (2008)", "Phản hồi cạnh Kirsch", "Tính phản hồi cạnh la bàn Kirsch"],
    ["laws_texture_e", "Laws Texture Energy", "Computes Laws texture energy measures (Laws, 1980)", "Năng lượng kết cấu Laws", "Tính các đại lượng năng lượng kết cấu Laws"],
    ["gabor_energy", "Gabor Energy Distribution", "Analyzes multi-scale Gabor energy distribution (2010)", "Phân bổ năng lượng Gabor", "Phân tích phân bổ năng lượng Gabor đa tỷ lệ"],
    ["scharr_gradient", "Scharr Gradient", "Computes Scharr gradient for edge analysis (2000)", "Gradient Scharr", "Tính gradient Scharr cho phân tích cạnh"],
    ["structural_complexity", "Structural Complexity", "Measures image structural block diversity (2016)", "Độ phức tạp cấu trúc", "Đo tính đa dạng khối cấu trúc ảnh"],
    // Video v4 (20)
    ["audio_noise_floor", "Audio Noise Floor", "Analyzes audio noise floor patterns", "Sàn nhiễu âm thanh", "Phân tích mẫu sàn nhiễu âm thanh"],
    ["audio_spectral", "Audio Spectral Analysis", "Analyzes audio spectral characteristics", "Phân tích phổ âm thanh", "Phân tích đặc tính phổ âm thanh"],
    ["audio_visual_delay", "Audio-Visual Delay", "Measures audio-video synchronization delay", "Trễ âm thanh-hình ảnh", "Đo trễ đồng bộ âm thanh-video"],
    ["blood_flow_rppg", "Blood Flow rPPG", "Detects remote photoplethysmography signals", "Dòng máu rPPG", "Phát hiện tín hiệu quang thể tích từ xa"],
    ["body_movement_fluidity", "Body Movement Fluidity", "Analyzes body movement smoothness", "Trôi chảy chuyển động cơ thể", "Phân tích độ mượt chuyển động cơ thể"],
    ["breathing_pattern", "Breathing Pattern", "Detects breathing motion patterns", "Mẫu thở", "Phát hiện mẫu chuyển động thở"],
    ["eye_contact", "Eye Contact Consistency", "Analyzes eye contact direction consistency", "Nhất quán giao tiếp mắt", "Phân tích nhất quán hướng giao tiếp mắt"],
    ["face_warping", "Face Warping Artifact", "Detects face warping transformation artifacts", "Dấu vết biến dạng mặt", "Phát hiện dấu vết biến đổi biến dạng mặt"],
    ["facial_boundary_freq", "Facial Boundary Frequency", "Analyzes facial boundary frequency content", "Tần số biên mặt", "Phân tích nội dung tần số biên khuôn mặt"],
    ["frame_rate_consistency", "Frame Rate Consistency", "Detects frame rate irregularities", "Nhất quán tốc độ khung", "Phát hiện bất thường tốc độ khung hình"],
    ["gait_analysis", "Gait Analysis", "Analyzes walking gait naturalness", "Phân tích dáng đi", "Phân tích tính tự nhiên dáng đi"],
    ["hair_strand_v", "Hair Strand Consistency", "Analyzes individual hair strand rendering", "Nhất quán sợi tóc", "Phân tích render từng sợi tóc"],
    ["lip_sync_v2", "Lip Sync Analysis v2", "Advanced lip-audio synchronization analysis", "Đồng bộ môi v2", "Phân tích đồng bộ môi-âm thanh nâng cao"],
    ["phoneme_correlation", "Phoneme Correlation", "Correlates phoneme shapes with audio", "Tương quan âm vị", "Tương quan hình dạng âm vị với âm thanh"],
    ["scene_geometry", "Scene Geometry Consistency", "Analyzes 3D scene geometry consistency", "Nhất quán hình học cảnh", "Phân tích tính nhất quán hình học cảnh 3D"],
    ["spectral_flicker_v", "Spectral Flicker", "Detects spectral flicker patterns", "Nhấp nháy phổ", "Phát hiện mẫu nhấp nháy phổ"],
    ["temporal_color_histogram", "Temporal Color Histogram", "Tracks color histogram changes over time", "Histogram màu thời gian", "Theo dõi thay đổi histogram màu theo thời gian"],
    ["tongue_consistency", "Tongue Consistency", "Analyzes tongue rendering consistency", "Nhất quán lưỡi", "Phân tích tính nhất quán render lưỡi"],
    ["video_frame_rate", "Video Frame Rate", "Analyzes frame rate consistency patterns", "Tốc độ khung video", "Phân tích mẫu nhất quán tốc độ khung"],
    ["video_resolution_map", "Video Resolution Map", "Maps resolution consistency across frame", "Bản đồ phân giải video", "Ánh xạ nhất quán phân giải trên khung hình"],
    // Video v5 (24)
    ["skin_color_drift", "Skin Color Drift", "Analyzes skin color drift patterns across frames", "Trôi màu da", "Phân tích mẫu trôi màu da giữa các khung hình"],
    ["facial_symmetry_v", "Facial Symmetry (Video)", "Analyzes facial symmetry consistency in video", "Đối xứng khuôn mặt (Video)", "Phân tích nhất quán đối xứng khuôn mặt trong video"],
    ["lip_texture_detail", "Lip Texture Detail", "Analyzes lip micro-texture detail", "Chi tiết kết cấu môi", "Phân tích chi tiết vi kết cấu môi"],
    ["forehead_wrinkle", "Forehead Wrinkle", "Analyzes forehead wrinkle consistency", "Nếp nhăn trán", "Phân tích tính nhất quán nếp nhăn trán"],
    ["iris_detail", "Iris Detail", "Analyzes iris pattern detail and consistency", "Chi tiết mống mắt", "Phân tích chi tiết và nhất quán mẫu mống mắt"],
    ["nose_shadow", "Nose Shadow", "Analyzes nose shadow casting patterns", "Bóng mũi", "Phân tích mẫu đổ bóng mũi"],
    ["chin_jaw_detail", "Chin-Jaw Detail", "Analyzes chin and jawline detail", "Chi tiết cằm-hàm", "Phân tích chi tiết cằm và đường hàm"],
    ["bg_complexity", "Background Complexity", "Measures background scene complexity", "Độ phức tạp nền", "Đo độ phức tạp cảnh nền"],
    ["color_bleeding", "Color Bleeding", "Detects color bleeding artifacts at boundaries", "Chảy màu", "Phát hiện dấu vết chảy màu tại biên"],
    ["face_mask_edge", "Face Mask Edge", "Detects face mask edge artifacts", "Biên mặt nạ", "Phát hiện dấu vết biên mặt nạ khuôn mặt"],
    ["motion_blur_dir", "Motion Blur Direction", "Analyzes motion blur directionality", "Hướng mờ chuyển động", "Phân tích tính định hướng mờ chuyển động"],
    ["video_global_illum", "Video Global Illumination", "Analyzes global illumination consistency", "Chiếu sáng toàn cục", "Phân tích nhất quán chiếu sáng toàn cục"],
    ["pixel_jitter", "Pixel Jitter", "Detects pixel jitter artifacts", "Rung pixel", "Phát hiện dấu vết rung pixel"],
    ["frame_edge_energy", "Frame Edge Energy", "Analyzes frame edge energy distribution", "Năng lượng cạnh khung", "Phân tích phân bổ năng lượng cạnh khung hình"],
    ["facial_pore_texture", "Facial Pore Texture", "Analyzes facial pore micro-texture", "Kết cấu lỗ chân lông", "Phân tích vi kết cấu lỗ chân lông mặt"],
    ["temporal_gradient", "Temporal Gradient", "Analyzes temporal gradient patterns", "Gradient thời gian", "Phân tích mẫu gradient thời gian"],
    ["video_saturation_map", "Video Saturation Map", "Maps saturation distribution across frame", "Bản đồ bão hòa", "Ánh xạ phân bổ bão hòa trên khung hình"],
    ["neck_skin", "Neck Skin Consistency", "Analyzes neck skin texture consistency", "Nhất quán da cổ", "Phân tích nhất quán kết cấu da cổ"],
    ["video_luma_range", "Video Luma Range", "Analyzes luminance range distribution", "Dải sáng video", "Phân tích phân bổ dải độ sáng"],
    ["cheek_texture", "Cheek Texture", "Analyzes cheek skin texture patterns", "Kết cấu má", "Phân tích mẫu kết cấu da má"],
    ["video_color_balance", "Video Color Balance", "Analyzes color balance consistency", "Cân bằng màu video", "Phân tích nhất quán cân bằng màu"],
    ["edge_aa_video", "Edge Antialiasing (Video)", "Analyzes edge antialiasing in video frames", "Khử răng cưa cạnh (Video)", "Phân tích khử răng cưa cạnh trong khung hình video"],
    ["temporal_coherence_map", "Temporal Coherence Map", "Maps temporal coherence across frames", "Bản đồ nhất quán thời gian", "Ánh xạ nhất quán thời gian giữa các khung hình"],
    ["video_freq_spectrum", "Video Frequency Spectrum", "Analyzes frequency spectrum of video frames", "Phổ tần số video", "Phân tích phổ tần số khung hình video"],
    // Video v6 (15)
    ["face_xray", "Face X-Ray Boundary", "Detects blending boundaries using Face X-Ray technique (Li et al., 2020)", "Biên Face X-Ray", "Phát hiện biên pha trộn bằng kỹ thuật Face X-Ray (Li, 2020)"],
    ["face_blend_bound", "Face Blend Boundary", "Analyzes face-background blend boundary artifacts (Matern, 2019)", "Biên pha trộn mặt", "Phân tích dấu vết biên pha trộn mặt-nền"],
    ["color_hist_shift", "Color Histogram Shift", "Detects face vs background color histogram shift (2020)", "Dịch histogram màu", "Phát hiện dịch histogram màu giữa mặt và nền"],
    ["face_skin_smooth_v", "Face Skin Smoothness", "Analyzes excessive skin smoothness from AI generation (2019)", "Độ mịn da mặt", "Phân tích độ mịn da quá mức từ AI"],
    ["specular_highlight", "Specular Highlight", "Analyzes specular highlight consistency (2020)", "Điểm sáng phản xạ", "Phân tích nhất quán điểm sáng phản xạ"],
    ["contour_continuity", "Contour Continuity", "Analyzes contour edge continuity patterns (2020)", "Liên tục đường viền", "Phân tích mẫu liên tục cạnh đường viền"],
    ["skin_micro_motion", "Skin Micro Motion", "Detects micro-motion in skin regions (FakeCatcher, 2020)", "Vi chuyển động da", "Phát hiện vi chuyển động trong vùng da"],
    ["bg_freq_map", "Background Frequency Map", "Maps frequency content of background regions (2021)", "Bản đồ tần số nền", "Ánh xạ nội dung tần số vùng nền"],
    ["inter_frame_blend", "Inter-Frame Blend", "Detects inter-frame blending artifacts (2021)", "Pha trộn liên khung", "Phát hiện dấu vết pha trộn giữa các khung hình"],
    ["edge_sharpness_var", "Edge Sharpness Variance", "Analyzes edge sharpness variance across quadrants (2021)", "Phương sai sắc nét cạnh", "Phân tích phương sai sắc nét cạnh trên các phần tư"],
    ["nostril_darkness", "Nostril Darkness", "Analyzes nostril darkness consistency (2020)", "Độ tối lỗ mũi", "Phân tích tính nhất quán độ tối lỗ mũi"],
    ["ear_detail", "Ear Detail Consistency", "Compares left-right ear detail consistency (2019)", "Nhất quán chi tiết tai", "So sánh nhất quán chi tiết tai trái-phải"],
    ["clothing_edge_blend", "Clothing Edge Blend", "Analyzes clothing edge blending quality (2021)", "Pha trộn biên quần áo", "Phân tích chất lượng pha trộn biên quần áo"],
    ["temporal_jitter", "Temporal Jitter Detection", "Detects temporal jitter oscillation patterns (2021)", "Phát hiện rung thời gian", "Phát hiện mẫu dao động rung thời gian"],
    ["skin_pore_sim", "Skin Pore Simulation", "Detects simulated pore patterns vs real pores (2023)", "Mô phỏng lỗ chân lông", "Phát hiện mẫu lỗ chân lông mô phỏng vs thật"],
    // Text v4 (20)
    ["typo_error_pattern", "Typo Error Pattern", "Analyzes typo and error patterns — AI rarely makes human-like typos", "Mẫu lỗi chính tả", "Phân tích mẫu lỗi chính tả — AI hiếm khi mắc lỗi giống người"],
    ["cultural_reference", "Cultural Reference", "Detects cultural references and context", "Tham chiếu văn hóa", "Phát hiện tham chiếu và ngữ cảnh văn hóa"],
    ["personal_experience", "Personal Experience", "Analyzes personal experience markers", "Trải nghiệm cá nhân", "Phân tích dấu hiệu trải nghiệm cá nhân"],
    ["filler_word_usage", "Filler Word Usage", "Measures filler word frequency", "Sử dụng từ đệm", "Đo tần suất từ đệm"],
    ["sentence_fragment", "Sentence Fragment Usage", "Detects sentence fragment patterns", "Câu không hoàn chỉnh", "Phát hiện mẫu câu không hoàn chỉnh"],
    ["exclamation_pattern", "Exclamation Pattern", "Analyzes exclamation usage patterns", "Mẫu câu cảm thán", "Phân tích mẫu sử dụng câu cảm thán"],
    ["parenthetical_usage", "Parenthetical Usage", "Measures parenthetical expression frequency", "Sử dụng ngoặc đơn", "Đo tần suất biểu thức ngoặc đơn"],
    ["list_enumeration", "List Enumeration Pattern", "Analyzes list and enumeration patterns", "Mẫu liệt kê", "Phân tích mẫu liệt kê và đánh số"],
    ["vocab_growth_rate", "Vocabulary Growth Rate", "Tracks vocabulary growth rate across text", "Tốc độ tăng từ vựng", "Theo dõi tốc độ tăng từ vựng trong văn bản"],
    ["word_specificity", "Word Specificity Index", "Measures word specificity level", "Chỉ số đặc thù từ", "Đo mức độ đặc thù của từ"],
    ["rhetorical_device", "Rhetorical Device", "Detects rhetorical devices usage", "Biện pháp tu từ", "Phát hiện sử dụng biện pháp tu từ"],
    ["colloquial_expression", "Colloquial Expression", "Analyzes colloquial language usage", "Biểu thức khẩu ngữ", "Phân tích sử dụng ngôn ngữ khẩu ngữ"],
    ["sentence_rhythm", "Sentence Rhythm", "Analyzes rhythmic patterns in sentences", "Nhịp câu", "Phân tích mẫu nhịp điệu trong câu"],
    ["topic_depth", "Topic Depth Analysis", "Measures topic exploration depth", "Phân tích chiều sâu chủ đề", "Đo chiều sâu khám phá chủ đề"],
    ["narrative_structure", "Narrative Structure", "Analyzes narrative arc structure", "Cấu trúc tường thuật", "Phân tích cấu trúc cung tường thuật"],
    ["dialogue_pattern", "Dialogue Pattern", "Detects dialogue pattern usage", "Mẫu đối thoại", "Phát hiện mẫu sử dụng đối thoại"],
    ["evidence_citation", "Evidence Citation", "Analyzes evidence citation patterns", "Trích dẫn chứng cứ", "Phân tích mẫu trích dẫn chứng cứ"],
    ["emotional_arc", "Emotional Arc", "Tracks emotional arc progression", "Cung cảm xúc", "Theo dõi tiến trình cung cảm xúc"],
    ["ambiguity_tolerance", "Ambiguity Tolerance", "Measures tolerance for ambiguity", "Chấp nhận mơ hồ", "Đo mức chấp nhận sự mơ hồ"],
    ["anaphora_resolution", "Anaphora Resolution", "Analyzes anaphora resolution patterns", "Giải quyết hồi chiếu", "Phân tích mẫu giải quyết hồi chiếu"],
    // Text v5 (24)
    ["acronym_usage", "Acronym Usage", "Analyzes acronym and abbreviation patterns", "Sử dụng từ viết tắt", "Phân tích mẫu từ viết tắt và chữ cái đầu"],
    ["question_density", "Question Mark Density", "Measures question mark density patterns", "Mật độ dấu hỏi", "Đo mẫu mật độ dấu hỏi"],
    ["sent_start_variety", "Sentence Start Variety", "Analyzes sentence opening word variety", "Đa dạng mở đầu câu", "Phân tích sự đa dạng từ mở đầu câu"],
    ["verb_tense", "Verb Tense Consistency", "Measures verb tense consistency", "Nhất quán thì động từ", "Đo tính nhất quán thì động từ"],
    ["comma_freq", "Comma Frequency", "Analyzes comma usage frequency patterns", "Tần suất dấu phẩy", "Phân tích mẫu tần suất sử dụng dấu phẩy"],
    ["semicolon_usage", "Semicolon Usage", "Measures semicolon frequency", "Sử dụng dấu chấm phẩy", "Đo tần suất dấu chấm phẩy"],
    ["superlative_usage", "Superlative Usage", "Analyzes superlative adjective frequency", "Sử dụng bậc nhất", "Phân tích tần suất tính từ bậc nhất"],
    ["contraction_detect", "Contraction Detection", "Detects contraction usage patterns", "Phát hiện viết tắt", "Phát hiện mẫu sử dụng dạng viết tắt"],
    ["avg_word_length", "Average Word Length", "Measures average word length distribution", "Độ dài từ trung bình", "Đo phân bổ độ dài từ trung bình"],
    ["emphasis_pattern", "Emphasis Pattern", "Analyzes text emphasis usage", "Mẫu nhấn mạnh", "Phân tích sử dụng nhấn mạnh văn bản"],
    ["definite_article", "Definite Article", "Analyzes definite article usage patterns", "Mạo từ xác định", "Phân tích mẫu sử dụng mạo từ xác định"],
    ["number_usage", "Number Usage", "Analyzes numeric expression patterns", "Sử dụng số", "Phân tích mẫu biểu thức số"],
    ["qualifier_density", "Qualifier Density", "Measures qualifier word density", "Mật độ từ hạn định", "Đo mật độ từ hạn định"],
    ["passive_active_mix", "Passive-Active Voice Mix", "Analyzes passive vs active voice distribution", "Kết hợp chủ-bị động", "Phân tích phân bổ giọng chủ động vs bị động"],
    ["quotation_usage", "Quotation Usage", "Measures quotation mark usage patterns", "Sử dụng dấu ngoặc kép", "Đo mẫu sử dụng dấu ngoặc kép"],
    ["analogy_simile", "Analogy & Simile", "Detects analogy and simile usage", "Phép so sánh & tương tự", "Phát hiện sử dụng phép so sánh và tương tự"],
    ["conjunction_pair", "Conjunction Pair", "Analyzes correlative conjunction pairs", "Cặp liên từ", "Phân tích cặp liên từ tương quan"],
    ["abstractness", "Abstractness Index", "Measures linguistic abstractness level", "Chỉ số trừu tượng", "Đo mức độ trừu tượng ngôn ngữ"],
    ["instructional_tone", "Instructional Tone", "Detects instructional writing tone", "Giọng hướng dẫn", "Phát hiện giọng viết hướng dẫn"],
    ["transition_smooth", "Transition Smoothness", "Analyzes paragraph transition smoothness", "Mượt mà chuyển tiếp", "Phân tích độ mượt mà chuyển tiếp đoạn"],
    ["definition_pattern", "Definition Pattern", "Detects definition structure patterns", "Mẫu định nghĩa", "Phát hiện mẫu cấu trúc định nghĩa"],
    ["conditional_usage", "Conditional Usage", "Analyzes conditional sentence patterns", "Sử dụng điều kiện", "Phân tích mẫu câu điều kiện"],
    ["repetitive_phrase", "Repetitive Phrase", "Detects repetitive phrase patterns", "Cụm từ lặp lại", "Phát hiện mẫu cụm từ lặp lại"],
    ["conclusion_indicator", "Conclusion Indicator", "Detects conclusion marker patterns", "Chỉ báo kết luận", "Phát hiện mẫu dấu hiệu kết luận"],
    // Text v6 (15)
    ["zipf_deviation", "Zipf Deviation", "Measures deviation from Zipf's Law word distribution (Gehrmann, 2019)", "Độ lệch Zipf", "Đo độ lệch từ phân bổ từ theo Luật Zipf"],
    ["token_predictability", "Token Predictability", "Analyzes next-token predictability using bigram statistics (Mitchell, 2023)", "Dự đoán token", "Phân tích khả năng dự đoán token tiếp theo bằng thống kê bigram"],
    ["log_likelihood_rank", "Log-Likelihood Rank", "Measures common word usage ratio (DetectGPT, 2023)", "Xếp hạng khả năng", "Đo tỷ lệ sử dụng từ phổ biến"],
    ["entropy_per_word", "Entropy Per Word", "Computes normalized entropy per word (Kirchenbauer, 2023)", "Entropy trên từ", "Tính entropy chuẩn hóa trên mỗi từ"],
    ["curie_detect", "Curie Detection", "Analyzes sentence length CV for uniformity detection (2023)", "Phát hiện Curie", "Phân tích CV độ dài câu để phát hiện tính đồng đều"],
    ["vocabulary_richness", "Vocabulary Richness", "Computes root TTR for vocabulary richness (2023)", "Phong phú từ vựng", "Tính root TTR cho sự phong phú từ vựng"],
    ["mean_dep_parse", "Mean Dependency Depth", "Estimates mean dependency depth approximation (2023)", "Độ sâu phụ thuộc trung bình", "Ước lượng xấp xỉ độ sâu phụ thuộc trung bình"],
    ["word_rarity", "Word Rarity Score", "Detects rare archaic vocabulary usage (Tulchinskii, 2023)", "Điểm hiếm từ", "Phát hiện sử dụng từ vựng cổ hiếm"],
    ["clause_balance", "Clause Balance", "Analyzes clause length balance within sentences (2023)", "Cân bằng mệnh đề", "Phân tích cân bằng độ dài mệnh đề trong câu"],
    ["micro_repetition", "Micro Repetition", "Detects micro-level word repetition patterns (2023)", "Vi lặp lại", "Phát hiện mẫu lặp lại từ ở cấp vi mô"],
    ["text_dna", "Text DNA Watermark", "Analyzes vowel-consonant ratio as text fingerprint (2023)", "Dấu vân tay văn bản", "Phân tích tỷ lệ nguyên âm-phụ âm làm dấu vân tay"],
    ["intrinsic_dimension", "Intrinsic Dimension", "Estimates intrinsic dimensionality of text (Tulchinskii, 2023)", "Chiều nội tại", "Ước lượng chiều nội tại của văn bản"],
    ["sentence_entropy", "Sentence Entropy", "Computes sentence length distribution entropy (2023)", "Entropy câu", "Tính entropy phân bổ độ dài câu"],
    ["lexical_density", "Lexical Density", "Measures content word ratio (lexical density) (2023)", "Mật độ từ vựng", "Đo tỷ lệ từ nội dung (mật độ từ vựng)"],
    ["text_burstiness2", "Text Burstiness v2", "IQR-based burstiness measurement of sentence lengths (2023)", "Bùng phát văn bản v2", "Đo tính bùng phát dựa trên IQR của độ dài câu"],
];

// Build inline fallback objects
let enObj = '';
let viObj = '';
for (const [id, enName, enDesc, viName, viDesc] of newMethods) {
    enObj += `        "${id}": { name: "${enName.replace(/"/g, '\\"')}", description: "${enDesc.replace(/"/g, '\\"')}" },\n`;
    viObj += `        "${id}": { name: "${viName.replace(/"/g, '\\"')}", description: "${viDesc.replace(/"/g, '\\"')}" },\n`;
}

const block = `
// All new methods v11-v13 fallback data
const NEW_METHODS_FALLBACK: Record<string, Record<string, MethodLocaleEntry>> = {
    en: {
${enObj}    },
    vi: {
${viObj}    },
};
`;

// Insert before getMethodTranslation function
content = content.replace(
    'export function getMethodTranslation',
    block + '\nexport function getMethodTranslation'
);

// Update getMethodTranslation to include NEW_METHODS_FALLBACK
content = content.replace(
    'return METHOD_I18N[locale]?.[methodId] ?? VIDEO_V3_METHODS[locale]?.[methodId] ?? TEXT_V3_METHODS[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? VIDEO_V3_METHODS.en?.[methodId] ?? TEXT_V3_METHODS.en?.[methodId] ?? { name: methodId, description: "" };',
    'return METHOD_I18N[locale]?.[methodId] ?? VIDEO_V3_METHODS[locale]?.[methodId] ?? TEXT_V3_METHODS[locale]?.[methodId] ?? NEW_METHODS_FALLBACK[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? VIDEO_V3_METHODS.en?.[methodId] ?? TEXT_V3_METHODS.en?.[methodId] ?? NEW_METHODS_FALLBACK.en?.[methodId] ?? { name: methodId, description: "" };'
);

fs.writeFileSync(file, content);
console.log('Updated methodsI18n.ts with', newMethods.length, 'method translations');
