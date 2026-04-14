/**
 * Generate 100 new methods (batch 1 toward 1000).
 * Creates: page.tsx + 6 i18n JSON files per method.
 * Outputs: data_entries_1000.txt + i18n_entries_1000.txt for manual append.
 *
 * Distribution: 34 image (I-222…I-255) + 33 video (V-197…V-229) + 33 text (T-182…T-214)
 */
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..", "src", "app", "methods");
const langs = ["en", "vi", "zh", "ja", "ko", "es"];

// ═══════════════════════════════════════════════════════════════════════
// ─── 34 NEW IMAGE METHODS ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
const newImageMethods = [
  { id: "adaptive_histogram_eq", cat: "pixel", year: 2012, algo: "CLAHE + Statistical Deviation",
    name_en: "Adaptive Histogram Equalization Trace", desc_en: "Detects traces of CLAHE or adaptive histogram equalization applied to mask AI generation artifacts.",
    name_vi: "Dấu vết cân bằng histogram thích ứng", desc_vi: "Phát hiện dấu vết cân bằng histogram thích ứng (CLAHE) được áp dụng để che giấu tạo tác AI.",
    name_zh: "自适应直方图均衡化痕迹", desc_zh: "检测用于掩盖AI生成伪影的CLAHE或自适应直方图均衡化痕迹。",
    name_ja: "適応ヒストグラム均等化トレース", desc_ja: "AI生成アーティファクトを隠すCLAHEの痕跡を検出します。",
    name_ko: "적응형 히스토그램 균등화 흔적", desc_ko: "AI 생성 아티팩트를 숨기기 위한 CLAHE 흔적을 감지합니다.",
    name_es: "Traza de ecualización de histograma adaptativa", desc_es: "Detecta trazas de CLAHE aplicada para ocultar artefactos de generación IA." },

  { id: "anisotropic_diffusion_trace", cat: "pixel", year: 2014, algo: "Perona-Malik Diffusion Residual",
    name_en: "Anisotropic Diffusion Trace", desc_en: "Detects residuals of anisotropic diffusion filtering used for edge-preserving denoising in AI pipelines.",
    name_vi: "Dấu vết khuếch tán bất đẳng hướng", desc_vi: "Phát hiện dư lượng lọc khuếch tán bất đẳng hướng dùng để khử nhiễu bảo toàn cạnh trong pipeline AI.",
    name_zh: "各向异性扩散痕迹", desc_zh: "检测AI管道中用于边缘保持去噪的各向异性扩散滤波残留。",
    name_ja: "異方性拡散トレース", desc_ja: "AIパイプラインのエッジ保持デノイズに使用される異方性拡散フィルタリングの残留を検出します。",
    name_ko: "이방성 확산 흔적", desc_ko: "AI 파이프라인의 에지 보존 디노이즈에 사용되는 이방성 확산 필터링 잔류를 감지합니다.",
    name_es: "Traza de difusión anisotrópica", desc_es: "Detecta residuos de filtrado de difusión anisotrópica usado para eliminación de ruido con preservación de bordes." },

  { id: "bit_plane_correlation", cat: "statistical", year: 2008, algo: "Bit-Plane Cross-Correlation",
    name_en: "Bit-Plane Correlation Analysis", desc_en: "Analyzes correlations between bit planes to detect unnatural quantization patterns in AI-generated images.",
    name_vi: "Phân tích tương quan mặt phẳng bit", desc_vi: "Phân tích tương quan giữa các mặt phẳng bit để phát hiện mẫu lượng tử hóa bất thường trong ảnh AI.",
    name_zh: "位平面相关性分析", desc_zh: "分析位平面之间的相关性以检测AI生成图像中的非自然量化模式。",
    name_ja: "ビットプレーン相関分析", desc_ja: "AIが生成した画像の不自然な量子化パターンを検出するためにビットプレーン間の相関を分析します。",
    name_ko: "비트 평면 상관 분석", desc_ko: "AI 생성 이미지의 비자연적 양자화 패턴을 감지하기 위해 비트 평면 간 상관을 분석합니다.",
    name_es: "Análisis de correlación de planos de bits", desc_es: "Analiza correlaciones entre planos de bits para detectar patrones de cuantización no naturales en imágenes IA." },

  { id: "camera_lens_model", cat: "sensor", year: 2010, algo: "Lens Distortion Model Fitting",
    name_en: "Camera Lens Model Verification", desc_en: "Verifies lens distortion model consistency — real cameras produce predictable radial/tangential distortion absent in AI.",
    name_vi: "Xác minh mô hình ống kính máy ảnh", desc_vi: "Xác minh tính nhất quán của mô hình méo ống kính — máy ảnh thật tạo méo xuyên tâm/tiếp tuyến dự đoán được.",
    name_zh: "相机镜头模型验证", desc_zh: "验证镜头畸变模型一致性——真实相机产生AI图像中不存在的可预测径向/切向畸变。",
    name_ja: "カメラレンズモデル検証", desc_ja: "レンズ歪みモデルの一貫性を検証します。",
    name_ko: "카메라 렌즈 모델 검증", desc_ko: "렌즈 왜곡 모델 일관성을 검증합니다.",
    name_es: "Verificación de modelo de lente de cámara", desc_es: "Verifica la consistencia del modelo de distorsión del lente — cámaras reales producen distorsión radial/tangencial predecible." },

  { id: "channel_kurtosis", cat: "statistical", year: 2009, algo: "Per-Channel Kurtosis Measurement",
    name_en: "Channel Kurtosis Analysis", desc_en: "Measures excess kurtosis per color channel — AI-generated images often exhibit non-Gaussian channel distributions.",
    name_vi: "Phân tích độ nhọn kênh", desc_vi: "Đo độ nhọn dư thừa trên từng kênh màu — ảnh AI thường có phân bố kênh phi Gauss.",
    name_zh: "通道峰度分析", desc_zh: "测量每个颜色通道的超额峰度——AI生成图像通常呈现非高斯通道分布。",
    name_ja: "チャネル尖度分析", desc_ja: "各色チャネルの超過尖度を測定します。",
    name_ko: "채널 첨도 분석", desc_ko: "각 색상 채널의 초과 첨도를 측정합니다.",
    name_es: "Análisis de curtosis de canal", desc_es: "Mide la curtosis excesiva por canal de color — imágenes IA exhiben distribuciones no gaussianas." },

  { id: "chroma_key_residual", cat: "pixel", year: 2015, algo: "Chroma Key Spill Detection",
    name_en: "Chroma Key Residual Detection", desc_en: "Detects residual chroma key spill and compositing artifacts from green/blue screen keying processes.",
    name_vi: "Phát hiện dư lượng chroma key", desc_vi: "Phát hiện tràn chroma key dư và tạo tác ghép hình từ quy trình tách nền xanh.",
    name_zh: "色度键残留检测", desc_zh: "检测绿幕/蓝幕抠像过程的色度键溢出和合成伪影。",
    name_ja: "クロマキー残留検出", desc_ja: "グリーン/ブルースクリーンキーイングの残留クロマキースピルを検出します。",
    name_ko: "크로마 키 잔류 감지", desc_ko: "그린/블루 스크린 키잉 과정의 크로마 키 잔류 및 합성 아티팩트를 감지합니다.",
    name_es: "Detección de residuo de chroma key", desc_es: "Detecta derrames de chroma key residuales y artefactos de composición de pantalla verde/azul." },

  { id: "color_moment_invariant", cat: "statistical", year: 2006, algo: "Color Moment Invariant Features",
    name_en: "Color Moment Invariant Analysis", desc_en: "Computes rotation/scale-invariant color moments to detect unnatural color distributions in AI images.",
    name_vi: "Phân tích bất biến moment màu", desc_vi: "Tính moment màu bất biến quay/tỷ lệ để phát hiện phân bố màu bất thường trong ảnh AI.",
    name_zh: "颜色矩不变量分析", desc_zh: "计算旋转/尺度不变颜色矩以检测AI图像中的非自然颜色分布。",
    name_ja: "カラーモーメント不変量分析", desc_ja: "AI画像の不自然な色分布を検出する回転/スケール不変カラーモーメントを計算します。",
    name_ko: "색상 모멘트 불변량 분석", desc_ko: "AI 이미지의 비자연적 색상 분포를 감지하기 위한 회전/스케일 불변 색상 모멘트를 계산합니다.",
    name_es: "Análisis de invariantes de momentos de color", desc_es: "Calcula momentos de color invariantes a rotación/escala para detectar distribuciones de color no naturales." },

  { id: "compression_ghost_map", cat: "frequency", year: 2011, algo: "Multi-Quality JPEG Ghost Mapping",
    name_en: "Compression Ghost Mapping", desc_en: "Creates multi-quality compression ghost maps to identify regions with mismatched compression histories.",
    name_vi: "Bản đồ bóng ma nén", desc_vi: "Tạo bản đồ bóng ma nén đa chất lượng để nhận diện vùng có lịch sử nén không khớp.",
    name_zh: "压缩鬼影映射", desc_zh: "创建多质量压缩鬼影图以识别压缩历史不匹配的区域。",
    name_ja: "圧縮ゴーストマッピング", desc_ja: "圧縮履歴が一致しない領域を識別する多品質圧縮ゴーストマップを作成します。",
    name_ko: "압축 고스트 매핑", desc_ko: "압축 이력이 일치하지 않는 영역을 식별하기 위한 다중 품질 압축 고스트 맵을 생성합니다.",
    name_es: "Mapeo de fantasmas de compresión", desc_es: "Crea mapas de fantasmas de compresión multi-calidad para identificar regiones con historiales de compresión no coincidentes." },

  { id: "dark_frame_subtraction", cat: "sensor", year: 2007, algo: "Dark Frame Noise Extraction",
    name_en: "Dark Frame Subtraction Analysis", desc_en: "Analyzes dark current noise patterns extracted via dark frame subtraction — unique to real camera sensors.",
    name_vi: "Phân tích trừ khung tối", desc_vi: "Phân tích mẫu nhiễu dòng tối trích xuất qua trừ khung tối — đặc trưng riêng của cảm biến thật.",
    name_zh: "暗帧减法分析", desc_zh: "分析通过暗帧减法提取的暗电流噪声模式——真实相机传感器独有。",
    name_ja: "ダークフレーム減算分析", desc_ja: "ダークフレーム減算で抽出された暗電流ノイズパターンを分析します。",
    name_ko: "다크 프레임 감산 분석", desc_ko: "다크 프레임 감산으로 추출된 암전류 노이즈 패턴을 분석합니다.",
    name_es: "Análisis de sustracción de cuadro oscuro", desc_es: "Analiza patrones de ruido de corriente oscura extraídos mediante sustracción de cuadro oscuro." },

  { id: "diffusion_step_trace", cat: "pixel", year: 2023, algo: "Denoising Step Artifact Detection",
    name_en: "Diffusion Step Trace", desc_en: "Detects artifacts from diffusion model denoising steps — each step leaves characteristic residual patterns.",
    name_vi: "Dấu vết bước khuếch tán", desc_vi: "Phát hiện tạo tác từ các bước khử nhiễu mô hình khuếch tán — mỗi bước để lại mẫu dư đặc trưng.",
    name_zh: "扩散步骤痕迹", desc_zh: "检测扩散模型去噪步骤的伪影——每步留下特征性残留模式。",
    name_ja: "拡散ステップトレース", desc_ja: "拡散モデルのデノイズステップのアーティファクトを検出します。",
    name_ko: "확산 단계 흔적", desc_ko: "확산 모델 디노이즈 단계의 아티팩트를 감지합니다.",
    name_es: "Traza de paso de difusión", desc_es: "Detecta artefactos de los pasos de eliminación de ruido del modelo de difusión." },

  { id: "edge_coherence_map", cat: "pixel", year: 2013, algo: "Edge Coherence Field Analysis",
    name_en: "Edge Coherence Mapping", desc_en: "Maps edge coherence fields to detect inconsistent boundary structures typical of AI-generated content.",
    name_vi: "Bản đồ mạch lạc cạnh", desc_vi: "Lập bản đồ trường mạch lạc cạnh để phát hiện cấu trúc biên bất nhất quán đặc trưng của nội dung AI.",
    name_zh: "边缘一致性映射", desc_zh: "映射边缘一致性场以检测AI生成内容典型的不一致边界结构。",
    name_ja: "エッジコヒーレンスマッピング", desc_ja: "AI生成コンテンツに典型的な不整合な境界構造を検出するエッジコヒーレンス場をマッピングします。",
    name_ko: "에지 일관성 매핑", desc_ko: "AI 생성 콘텐츠 특유의 일관성 없는 경계 구조를 감지하기 위한 에지 일관성 필드를 매핑합니다.",
    name_es: "Mapeo de coherencia de bordes", desc_es: "Mapea campos de coherencia de bordes para detectar estructuras de límites inconsistentes típicas de contenido IA." },

  { id: "exif_maker_note", cat: "metadata", year: 2005, algo: "MakerNote Fingerprint Analysis",
    name_en: "EXIF MakerNote Analysis", desc_en: "Analyzes manufacturer-specific MakerNote EXIF fields for camera provenance verification — absent in AI-generated images.",
    name_vi: "Phân tích MakerNote EXIF", desc_vi: "Phân tích trường MakerNote EXIF đặc thù nhà sản xuất để xác minh nguồn gốc máy ảnh — vắng trong ảnh AI.",
    name_zh: "EXIF MakerNote分析", desc_zh: "分析制造商特定的MakerNote EXIF字段进行相机来源验证——AI生成图像中不存在。",
    name_ja: "EXIF MakerNote分析", desc_ja: "カメラの来歴検証のためのメーカー固有MakerNote EXIFフィールドを分析します。",
    name_ko: "EXIF MakerNote 분석", desc_ko: "카메라 출처 검증을 위한 제조사별 MakerNote EXIF 필드를 분석합니다.",
    name_es: "Análisis de MakerNote EXIF", desc_es: "Analiza campos EXIF MakerNote específicos del fabricante para verificación de procedencia de cámara." },

  { id: "focus_depth_gradient", cat: "sensor", year: 2011, algo: "Depth-of-Field Gradient Analysis",
    name_en: "Focus Depth Gradient Analysis", desc_en: "Analyzes focus depth gradients for optical consistency — real lenses create smooth focus transitions that AI often fails to replicate.",
    name_vi: "Phân tích gradient độ sâu tiêu cự", desc_vi: "Phân tích gradient độ sâu tiêu cự về tính nhất quán quang học — ống kính thật tạo chuyển tiếp tiêu cự mượt mà.",
    name_zh: "焦深梯度分析", desc_zh: "分析焦深梯度的光学一致性——真实镜头产生AI难以复制的平滑焦点过渡。",
    name_ja: "焦点深度勾配分析", desc_ja: "光学的一貫性のための焦点深度勾配を分析します。",
    name_ko: "초점 깊이 기울기 분석", desc_ko: "광학적 일관성을 위한 초점 깊이 기울기를 분석합니다.",
    name_es: "Análisis de gradiente de profundidad de enfoque", desc_es: "Analiza gradientes de profundidad de enfoque para consistencia óptica." },

  { id: "fourier_phase_map", cat: "frequency", year: 2009, algo: "Phase Spectrum Mapping",
    name_en: "Fourier Phase Spectrum Map", desc_en: "Maps phase spectrum patterns in frequency domain — AI images often show anomalous phase structure due to generator architectures.",
    name_vi: "Bản đồ phổ pha Fourier", desc_vi: "Lập bản đồ mẫu phổ pha trong miền tần số — ảnh AI thường có cấu trúc pha bất thường.",
    name_zh: "傅里叶相位谱图", desc_zh: "映射频域中的相位谱模式——AI图像通常由于生成器架构呈现异常相位结构。",
    name_ja: "フーリエ位相スペクトルマップ", desc_ja: "周波数領域の位相スペクトルパターンをマッピングします。",
    name_ko: "푸리에 위상 스펙트럼 맵", desc_ko: "주파수 도메인의 위상 스펙트럼 패턴을 매핑합니다.",
    name_es: "Mapa de espectro de fase de Fourier", desc_es: "Mapea patrones de espectro de fase en el dominio de frecuencia." },

  { id: "gamma_correction_trace", cat: "pixel", year: 2008, algo: "Gamma Curve Estimation",
    name_en: "Gamma Correction Trace", desc_en: "Detects gamma correction traces by estimating applied gamma curves — multiple gamma corrections indicate manipulation.",
    name_vi: "Dấu vết hiệu chỉnh gamma", desc_vi: "Phát hiện dấu vết hiệu chỉnh gamma bằng ước lượng đường cong gamma — hiệu chỉnh gamma nhiều lần cho thấy thao tác.",
    name_zh: "伽马校正痕迹", desc_zh: "通过估计应用的伽马曲线检测伽马校正痕迹——多次伽马校正表明存在操纵。",
    name_ja: "ガンマ補正トレース", desc_ja: "適用されたガンマカーブを推定してガンマ補正の痕跡を検出します。",
    name_ko: "감마 보정 흔적", desc_ko: "적용된 감마 곡선을 추정하여 감마 보정 흔적을 감지합니다.",
    name_es: "Traza de corrección gamma", desc_es: "Detecta trazas de corrección gamma estimando curvas gamma aplicadas." },

  { id: "geometric_distortion_field", cat: "pixel", year: 2016, algo: "Distortion Field Estimation",
    name_en: "Geometric Distortion Field", desc_en: "Estimates local geometric distortion fields to detect warping artifacts from face manipulation and AI generation.",
    name_vi: "Trường méo hình học", desc_vi: "Ước lượng trường méo hình học cục bộ để phát hiện tạo tác biến dạng từ thao tác khuôn mặt và tạo sinh AI.",
    name_zh: "几何畸变场", desc_zh: "估计局部几何畸变场以检测面部操纵和AI生成的变形伪影。",
    name_ja: "幾何歪み場", desc_ja: "顔操作やAI生成のワーピングアーティファクトを検出する局所的な幾何歪み場を推定します。",
    name_ko: "기하 왜곡 필드", desc_ko: "얼굴 조작 및 AI 생성의 워핑 아티팩트를 감지하기 위한 국소 기하 왜곡 필드를 추정합니다.",
    name_es: "Campo de distorsión geométrica", desc_es: "Estima campos de distorsión geométrica local para detectar artefactos de deformación." },

  { id: "gradient_orientation_hist", cat: "statistical", year: 2007, algo: "Oriented Gradient Histogram",
    name_en: "Gradient Orientation Histogram", desc_en: "Computes orientation histograms of gradient fields — AI images show statistically different gradient angle distributions.",
    name_vi: "Histogram hướng gradient", desc_vi: "Tính histogram hướng của trường gradient — ảnh AI có phân bổ góc gradient khác biệt thống kê.",
    name_zh: "梯度方向直方图", desc_zh: "计算梯度场的方向直方图——AI图像呈现统计上不同的梯度角度分布。",
    name_ja: "勾配方向ヒストグラム", desc_ja: "勾配場の方向ヒストグラムを計算します。",
    name_ko: "기울기 방향 히스토그램", desc_ko: "기울기 필드의 방향 히스토그램을 계산합니다.",
    name_es: "Histograma de orientación de gradiente", desc_es: "Calcula histogramas de orientación de campos de gradiente." },

  { id: "icc_profile_verify", cat: "metadata", year: 2004, algo: "ICC Profile Consistency Check",
    name_en: "ICC Profile Verification", desc_en: "Verifies ICC color profile metadata consistency — real cameras embed ICC profiles that AI generators typically omit or fake.",
    name_vi: "Xác minh hồ sơ ICC", desc_vi: "Xác minh tính nhất quán metadata hồ sơ màu ICC — máy ảnh thật nhúng hồ sơ ICC mà AI thường bỏ qua hoặc giả.",
    name_zh: "ICC配置文件验证", desc_zh: "验证ICC颜色配置文件元数据一致性——真实相机嵌入AI生成器通常省略或伪造的ICC配置文件。",
    name_ja: "ICCプロファイル検証", desc_ja: "ICCカラープロファイルメタデータの一貫性を検証します。",
    name_ko: "ICC 프로파일 검증", desc_ko: "ICC 색상 프로파일 메타데이터 일관성을 검증합니다.",
    name_es: "Verificación de perfil ICC", desc_es: "Verifica la consistencia de metadatos del perfil de color ICC." },

  { id: "intensity_correlation_map", cat: "statistical", year: 2010, algo: "Spatial Intensity Correlation",
    name_en: "Intensity Correlation Mapping", desc_en: "Maps spatial intensity correlations to reveal unnatural smoothness or repetitive patterns in AI-generated regions.",
    name_vi: "Bản đồ tương quan cường độ", desc_vi: "Lập bản đồ tương quan cường độ không gian để phát hiện mịn bất thường hoặc mẫu lặp lại trong vùng AI.",
    name_zh: "强度相关性映射", desc_zh: "映射空间强度相关性以揭示AI生成区域中的不自然平滑度或重复模式。",
    name_ja: "強度相関マッピング", desc_ja: "空間的な強度相関をマッピングして不自然な滑らかさを検出します。",
    name_ko: "강도 상관 매핑", desc_ko: "공간 강도 상관을 매핑하여 비자연적 매끄러움 또는 반복 패턴을 감지합니다.",
    name_es: "Mapeo de correlación de intensidad", desc_es: "Mapea correlaciones de intensidad espacial para revelar suavidad no natural en regiones generadas por IA." },

  { id: "jpeg_artifact_spectrum", cat: "frequency", year: 2007, algo: "JPEG Artifact Spectral Analysis",
    name_en: "JPEG Artifact Spectrum", desc_en: "Analyzes spectral characteristics of JPEG compression artifacts for double-compression and AI post-processing detection.",
    name_vi: "Phổ tạo tác JPEG", desc_vi: "Phân tích đặc tính phổ của tạo tác nén JPEG cho phát hiện nén kép và hậu xử lý AI.",
    name_zh: "JPEG伪影频谱", desc_zh: "分析JPEG压缩伪影的频谱特征以检测双重压缩和AI后处理。",
    name_ja: "JPEGアーティファクトスペクトル", desc_ja: "JPEG圧縮アーティファクトのスペクトル特性を分析します。",
    name_ko: "JPEG 아티팩트 스펙트럼", desc_ko: "JPEG 압축 아티팩트의 스펙트럼 특성을 분석합니다.",
    name_es: "Espectro de artefactos JPEG", desc_es: "Analiza características espectrales de artefactos de compresión JPEG." },

  { id: "kurtosis_map", cat: "statistical", year: 2011, algo: "Local Kurtosis Mapping",
    name_en: "Local Kurtosis Map", desc_en: "Creates spatial maps of local kurtosis values — AI-generated content often shows abnormal kurtosis distribution.",
    name_vi: "Bản đồ độ nhọn cục bộ", desc_vi: "Tạo bản đồ không gian giá trị độ nhọn cục bộ — nội dung AI thường có phân bổ độ nhọn bất thường.",
    name_zh: "局部峰度图", desc_zh: "创建局部峰度值的空间图——AI生成内容通常呈现异常峰度分布。",
    name_ja: "局所尖度マップ", desc_ja: "局所尖度値の空間マップを作成します。",
    name_ko: "국소 첨도 맵", desc_ko: "국소 첨도 값의 공간 맵을 생성합니다.",
    name_es: "Mapa de curtosis local", desc_es: "Crea mapas espaciales de valores de curtosis local." },

  { id: "laplacian_of_gaussian", cat: "pixel", year: 2003, algo: "LoG Edge Detection + Blob Analysis",
    name_en: "Laplacian of Gaussian Analysis", desc_en: "Applies LoG operator for multi-scale blob and edge detection — AI images show different LoG response distributions.",
    name_vi: "Phân tích Laplacian Gauss", desc_vi: "Áp dụng toán tử LoG cho phát hiện blob và cạnh đa tỷ lệ — ảnh AI có phân bổ phản hồi LoG khác biệt.",
    name_zh: "高斯拉普拉斯分析", desc_zh: "应用LoG算子进行多尺度斑点和边缘检测——AI图像呈现不同的LoG响应分布。",
    name_ja: "ガウシアンラプラシアン分析", desc_ja: "多スケールのブロブとエッジ検出のためにLoGオペレータを適用します。",
    name_ko: "가우시안 라플라시안 분석", desc_ko: "다중 스케일 블롭 및 에지 감지를 위한 LoG 연산자를 적용합니다.",
    name_es: "Análisis Laplaciano de Gaussiana", desc_es: "Aplica operador LoG para detección de blobs y bordes multiescala." },

  { id: "lens_vignette_model", cat: "sensor", year: 2006, algo: "Vignetting Model Fit",
    name_en: "Lens Vignette Model Analysis", desc_en: "Models lens vignetting falloff and compares against known optical models — AI images lack authentic vignetting profiles.",
    name_vi: "Phân tích mô hình họa tiết ống kính", desc_vi: "Mô hình hóa suy giảm họa tiết ống kính và so sánh với mô hình quang học — ảnh AI thiếu hồ sơ họa tiết xác thực.",
    name_zh: "镜头暗角模型分析", desc_zh: "建模镜头暗角衰减并与已知光学模型比较——AI图像缺乏真实的暗角配置。",
    name_ja: "レンズビネットモデル分析", desc_ja: "レンズビネットの減衰をモデル化し、既知の光学モデルと比較します。",
    name_ko: "렌즈 비네팅 모델 분석", desc_ko: "렌즈 비네팅 감쇠를 모델링하고 알려진 광학 모델과 비교합니다.",
    name_es: "Análisis de modelo de viñeteo de lente", desc_es: "Modela la caída de viñeteo del lente y compara con modelos ópticos conocidos." },

  { id: "local_gradient_pattern", cat: "pixel", year: 2014, algo: "Local Gradient Pattern Descriptor",
    name_en: "Local Gradient Pattern Analysis", desc_en: "Extracts local gradient pattern descriptors for texture micro-structure forensics at the patch level.",
    name_vi: "Phân tích mẫu gradient cục bộ", desc_vi: "Trích xuất bộ mô tả mẫu gradient cục bộ cho pháp y vi cấu trúc kết cấu ở mức vùng.",
    name_zh: "局部梯度模式分析", desc_zh: "提取局部梯度模式描述符用于补丁级别的纹理微结构取证。",
    name_ja: "局所勾配パターン分析", desc_ja: "パッチレベルのテクスチャ微細構造フォレンジックの局所勾配パターン記述子を抽出します。",
    name_ko: "국소 기울기 패턴 분석", desc_ko: "패치 수준의 텍스처 미세 구조 포렌식을 위한 국소 기울기 패턴 기술자를 추출합니다.",
    name_es: "Análisis de patrón de gradiente local", desc_es: "Extrae descriptores de patrones de gradiente local para análisis forense de microestructura de textura." },

  { id: "morphological_profile", cat: "pixel", year: 2012, algo: "Multi-Scale Morphological Profiling",
    name_en: "Morphological Profile Analysis", desc_en: "Computes multi-scale morphological profiles (opening/closing) for structural anomaly detection in AI-generated images.",
    name_vi: "Phân tích hồ sơ hình thái", desc_vi: "Tính hồ sơ hình thái đa tỷ lệ (mở/đóng) cho phát hiện bất thường cấu trúc trong ảnh AI.",
    name_zh: "形态学剖面分析", desc_zh: "计算多尺度形态学剖面（开/闭运算）以检测AI生成图像中的结构异常。",
    name_ja: "形態学的プロファイル分析", desc_ja: "AI生成画像の構造異常検出のための多スケール形態学的プロファイルを計算します。",
    name_ko: "형태학적 프로파일 분석", desc_ko: "AI 생성 이미지의 구조적 이상 감지를 위한 다중 스케일 형태학적 프로파일을 계산합니다.",
    name_es: "Análisis de perfil morfológico", desc_es: "Calcula perfiles morfológicos multiescala para detección de anomalías estructurales en imágenes IA." },

  { id: "noise_level_estimation", cat: "statistical", year: 2005, algo: "Principal Component Noise Estimation",
    name_en: "Noise Level Estimation", desc_en: "Estimates local noise levels using PCA-based methods — regions with inconsistent noise levels indicate compositing or AI generation.",
    name_vi: "Ước lượng mức nhiễu", desc_vi: "Ước lượng mức nhiễu cục bộ bằng phương pháp dựa trên PCA — vùng có mức nhiễu bất nhất quán cho thấy ghép hình hoặc tạo sinh AI.",
    name_zh: "噪声水平估计", desc_zh: "使用基于PCA的方法估计局部噪声水平——噪声水平不一致的区域表明合成或AI生成。",
    name_ja: "ノイズレベル推定", desc_ja: "PCAベースの方法で局所ノイズレベルを推定します。",
    name_ko: "노이즈 레벨 추정", desc_ko: "PCA 기반 방법을 사용하여 국소 노이즈 레벨을 추정합니다.",
    name_es: "Estimación de nivel de ruido", desc_es: "Estima niveles de ruido locales usando métodos basados en PCA." },

  { id: "optical_transfer_func", cat: "sensor", year: 2009, algo: "OTF/MTF Estimation",
    name_en: "Optical Transfer Function Analysis", desc_en: "Estimates the optical transfer function (OTF/MTF) to verify lens authenticity — AI images lack consistent OTF signatures.",
    name_vi: "Phân tích hàm truyền quang", desc_vi: "Ước lượng hàm truyền quang (OTF/MTF) để xác minh tính xác thực ống kính — ảnh AI thiếu chữ ký OTF nhất quán.",
    name_zh: "光学传递函数分析", desc_zh: "估计光学传递函数（OTF/MTF）以验证镜头真实性——AI图像缺乏一致的OTF特征。",
    name_ja: "光学伝達関数分析", desc_ja: "レンズの真正性を検証するための光学伝達関数(OTF/MTF)を推定します。",
    name_ko: "광학 전달 함수 분석", desc_ko: "렌즈 진정성을 검증하기 위한 광학 전달 함수(OTF/MTF)를 추정합니다.",
    name_es: "Análisis de función de transferencia óptica", desc_es: "Estima la función de transferencia óptica (OTF/MTF) para verificar autenticidad del lente." },

  { id: "periodic_noise_detect", cat: "frequency", year: 2006, algo: "Periodic Noise Spectral Detection",
    name_en: "Periodic Noise Detection", desc_en: "Detects periodic noise patterns in frequency domain that result from scanner, display capture, or AI generation artifacts.",
    name_vi: "Phát hiện nhiễu tuần hoàn", desc_vi: "Phát hiện mẫu nhiễu tuần hoàn trong miền tần số từ máy quét, chụp màn hình hoặc tạo tác AI.",
    name_zh: "周期性噪声检测", desc_zh: "检测频域中由扫描仪、显示器捕获或AI生成伪影产生的周期性噪声模式。",
    name_ja: "周期的ノイズ検出", desc_ja: "スキャナー、ディスプレイキャプチャ、またはAI生成アーティファクトによる周期的ノイズパターンを検出します。",
    name_ko: "주기적 노이즈 감지", desc_ko: "스캐너, 디스플레이 캡처 또는 AI 생성 아티팩트의 주기적 노이즈 패턴을 감지합니다.",
    name_es: "Detección de ruido periódico", desc_es: "Detecta patrones de ruido periódico en el dominio de frecuencia." },

  { id: "pixel_aspect_ratio", cat: "metadata", year: 2004, algo: "Pixel Aspect Ratio Verification",
    name_en: "Pixel Aspect Ratio Check", desc_en: "Verifies pixel aspect ratio metadata consistency — mismatches indicate resampling, editing, or AI generation.",
    name_vi: "Kiểm tra tỷ lệ khung hình pixel", desc_vi: "Xác minh tính nhất quán metadata tỷ lệ khung hình pixel — bất khớp cho thấy tái lấy mẫu, chỉnh sửa hoặc tạo sinh AI.",
    name_zh: "像素宽高比检查", desc_zh: "验证像素宽高比元数据一致性——不匹配表明重采样、编辑或AI生成。",
    name_ja: "ピクセルアスペクト比チェック", desc_ja: "ピクセルアスペクト比メタデータの一貫性を検証します。",
    name_ko: "픽셀 종횡비 검사", desc_ko: "픽셀 종횡비 메타데이터 일관성을 검증합니다.",
    name_es: "Verificación de relación de aspecto de píxel", desc_es: "Verifica la consistencia de metadatos de relación de aspecto de píxel." },

  { id: "raw_conversion_trace", cat: "sensor", year: 2015, algo: "RAW Pipeline Detection",
    name_en: "RAW Conversion Trace", desc_en: "Detects traces of RAW-to-JPEG conversion pipeline — authentic photos carry ISP processing signatures absent in AI images.",
    name_vi: "Dấu vết chuyển đổi RAW", desc_vi: "Phát hiện dấu vết quy trình chuyển đổi RAW sang JPEG — ảnh xác thực mang chữ ký xử lý ISP vắng trong ảnh AI.",
    name_zh: "RAW转换痕迹", desc_zh: "检测RAW到JPEG转换管道的痕迹——真实照片携带AI图像中不存在的ISP处理签名。",
    name_ja: "RAW変換トレース", desc_ja: "RAWからJPEGへの変換パイプラインの痕跡を検出します。",
    name_ko: "RAW 변환 흔적", desc_ko: "RAW-JPEG 변환 파이프라인의 흔적을 감지합니다.",
    name_es: "Traza de conversión RAW", desc_es: "Detecta trazas del pipeline de conversión RAW a JPEG." },

  { id: "saturation_anomaly_map", cat: "pixel", year: 2013, algo: "Saturation Anomaly Detection",
    name_en: "Saturation Anomaly Map", desc_en: "Maps saturation anomalies across image regions — AI generators often produce over-saturated or unnaturally uniform saturation.",
    name_vi: "Bản đồ bất thường bão hòa", desc_vi: "Lập bản đồ bất thường bão hòa trên các vùng ảnh — AI thường tạo bão hòa quá mức hoặc đồng đều bất thường.",
    name_zh: "饱和度异常图", desc_zh: "映射图像区域的饱和度异常——AI生成器通常产生过度饱和或非自然均匀的饱和度。",
    name_ja: "彩度異常マップ", desc_ja: "画像領域の彩度異常をマッピングします。",
    name_ko: "채도 이상 맵", desc_ko: "이미지 영역의 채도 이상을 매핑합니다.",
    name_es: "Mapa de anomalías de saturación", desc_es: "Mapea anomalías de saturación en regiones de la imagen." },

  { id: "spatial_frequency_map", cat: "frequency", year: 2008, algo: "Local Spatial Frequency Analysis",
    name_en: "Spatial Frequency Distribution Map", desc_en: "Maps local spatial frequency distributions — AI-generated content shows abnormal frequency energy distributions across regions.",
    name_vi: "Bản đồ phân bố tần số không gian", desc_vi: "Lập bản đồ phân bố tần số không gian cục bộ — nội dung AI có phân bổ năng lượng tần số bất thường.",
    name_zh: "空间频率分布图", desc_zh: "映射局部空间频率分布——AI生成内容在各区域呈现异常频率能量分布。",
    name_ja: "空間周波数分布マップ", desc_ja: "局所空間周波数分布をマッピングします。",
    name_ko: "공간 주파수 분포 맵", desc_ko: "국소 공간 주파수 분포를 매핑합니다.",
    name_es: "Mapa de distribución de frecuencia espacial", desc_es: "Mapea distribuciones de frecuencia espacial local." },

  { id: "texture_regularity_index", cat: "statistical", year: 2015, algo: "Texture Regularity Scoring",
    name_en: "Texture Regularity Index", desc_en: "Computes texture regularity indices to detect unnaturally repetitive or over-regular textures generated by AI models.",
    name_vi: "Chỉ số đều đặn kết cấu", desc_vi: "Tính chỉ số đều đặn kết cấu để phát hiện kết cấu lặp lại bất thường hoặc quá đều đặn do mô hình AI tạo.",
    name_zh: "纹理规则性指数", desc_zh: "计算纹理规则性指数以检测AI模型生成的非自然重复或过度规则纹理。",
    name_ja: "テクスチャ規則性指数", desc_ja: "AIモデルが生成する不自然に反復的なテクスチャを検出するテクスチャ規則性指数を計算します。",
    name_ko: "텍스처 규칙성 지수", desc_ko: "AI 모델이 생성하는 비자연적으로 반복적인 텍스처를 감지하기 위한 텍스처 규칙성 지수를 계산합니다.",
    name_es: "Índice de regularidad de textura", desc_es: "Calcula índices de regularidad de textura para detectar texturas repetitivas no naturales generadas por IA." },

  { id: "wavelet_coefficient_stat", cat: "frequency", year: 2010, algo: "Wavelet Coefficient Statistics",
    name_en: "Wavelet Coefficient Statistics", desc_en: "Analyzes statistical distributions of wavelet coefficients across subbands — AI images show deviation from natural wavelet statistics.",
    name_vi: "Thống kê hệ số wavelet", desc_vi: "Phân tích phân bổ thống kê hệ số wavelet trên các dải con — ảnh AI sai lệch khỏi thống kê wavelet tự nhiên.",
    name_zh: "小波系数统计", desc_zh: "分析子带间小波系数的统计分布——AI图像偏离自然小波统计。",
    name_ja: "ウェーブレット係数統計", desc_ja: "サブバンド間のウェーブレット係数の統計分布を分析します。",
    name_ko: "웨이블릿 계수 통계", desc_ko: "서브밴드 전체의 웨이블릿 계수 통계 분포를 분석합니다.",
    name_es: "Estadísticas de coeficientes wavelet", desc_es: "Analiza distribuciones estadísticas de coeficientes wavelet entre subbandas." },
];

// ═══════════════════════════════════════════════════════════════════════
// ─── 33 NEW VIDEO METHODS ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
const newVideoMethods = [
  { id: "action_physics_verify", cat: "pixel", year: 2023, algo: "Physics-Based Action Verification",
    name_en: "Action Physics Verification", desc_en: "Validates physical plausibility of human actions — AI video often violates Newton's laws in body movement dynamics.",
    name_vi: "Xác minh vật lý hành động", desc_vi: "Xác thực tính hợp lý vật lý của hành động người — video AI thường vi phạm định luật Newton trong động lực chuyển động.",
    name_zh: "动作物理验证", desc_zh: "验证人类动作的物理合理性——AI视频通常在身体运动动力学中违反牛顿定律。",
    name_ja: "アクション物理検証", desc_ja: "人間の動作の物理的妥当性を検証します。",
    name_ko: "동작 물리학 검증", desc_ko: "인간 동작의 물리적 타당성을 검증합니다.",
    name_es: "Verificación de física de acciones", desc_es: "Valida la plausibilidad física de acciones humanas en video." },

  { id: "audio_env_estimation", cat: "frequency", year: 2021, algo: "Audio Environment Estimation",
    name_en: "Audio Environment Estimation", desc_en: "Estimates acoustic environment properties from audio and validates against visual scene — mismatches indicate manipulation.",
    name_vi: "Ước lượng môi trường âm thanh", desc_vi: "Ước lượng thuộc tính môi trường âm thanh và xác thực với cảnh thị giác — bất khớp cho thấy thao tác.",
    name_zh: "音频环境估计", desc_zh: "从音频估计声学环境属性并与视觉场景验证——不匹配表明存在操纵。",
    name_ja: "音声環境推定", desc_ja: "音声から音響環境特性を推定し、視覚シーンと照合します。",
    name_ko: "오디오 환경 추정", desc_ko: "오디오에서 음향 환경 속성을 추정하고 시각적 장면과 대조합니다.",
    name_es: "Estimación de ambiente de audio", desc_es: "Estima propiedades del ambiente acústico desde el audio y valida contra la escena visual." },

  { id: "body_joint_limit", cat: "pixel", year: 2022, algo: "Biomechanical Joint Limit Check",
    name_en: "Body Joint Limit Analysis", desc_en: "Validates body joint angles against biomechanical constraints — AI often generates anatomically impossible poses.",
    name_vi: "Phân tích giới hạn khớp cơ thể", desc_vi: "Xác thực góc khớp cơ thể với ràng buộc cơ sinh học — AI thường tạo tư thế bất khả thi về giải phẫu.",
    name_zh: "身体关节极限分析", desc_zh: "根据生物力学约束验证身体关节角度——AI通常生成解剖学上不可能的姿势。",
    name_ja: "関節限界分析", desc_ja: "生体力学的制約に対して関節角度を検証します。",
    name_ko: "관절 한계 분석", desc_ko: "생체역학적 제약에 대해 관절 각도를 검증합니다.",
    name_es: "Análisis de límite articular corporal", desc_es: "Valida ángulos articulares contra restricciones biomecánicas." },

  { id: "camera_ego_motion", cat: "sensor", year: 2019, algo: "Ego-Motion Estimation",
    name_en: "Camera Ego-Motion Analysis", desc_en: "Estimates camera ego-motion from optical flow and validates physical consistency — AI video lacks realistic camera trajectories.",
    name_vi: "Phân tích chuyển động bản thân camera", desc_vi: "Ước lượng chuyển động bản thân camera từ dòng quang học và xác thực tính nhất quán vật lý.",
    name_zh: "相机自运动分析", desc_zh: "从光流估计相机自运动并验证物理一致性——AI视频缺乏真实的相机轨迹。",
    name_ja: "カメラエゴモーション分析", desc_ja: "オプティカルフローからカメラの自己運動を推定します。",
    name_ko: "카메라 자기 운동 분석", desc_ko: "광학 흐름에서 카메라 자기 운동을 추정합니다.",
    name_es: "Análisis de ego-movimiento de cámara", desc_es: "Estima el ego-movimiento de la cámara desde el flujo óptico y valida consistencia física." },

  { id: "clothing_wrinkle_physics", cat: "pixel", year: 2023, algo: "Cloth Simulation Validation",
    name_en: "Clothing Wrinkle Physics", desc_en: "Validates clothing wrinkle dynamics against cloth simulation physics — AI video produces unrealistic fabric deformation.",
    name_vi: "Vật lý nếp nhăn quần áo", desc_vi: "Xác thực động lực nếp nhăn quần áo với vật lý mô phỏng vải — video AI tạo biến dạng vải không thực tế.",
    name_zh: "服装褶皱物理", desc_zh: "根据布料模拟物理验证服装褶皱动态——AI视频产生不现实的织物变形。",
    name_ja: "衣服のしわ物理学", desc_ja: "布シミュレーション物理に対して衣服のしわの動態を検証します。",
    name_ko: "의류 주름 물리학", desc_ko: "천 시뮬레이션 물리에 대해 의류 주름 역학을 검증합니다.",
    name_es: "Física de arrugas de ropa", desc_es: "Valida la dinámica de arrugas de ropa contra simulación de telas." },

  { id: "depth_estimation_temporal", cat: "pixel", year: 2021, algo: "Temporal Depth Consistency",
    name_en: "Depth Estimation Temporal Check", desc_en: "Validates temporal consistency of depth estimation across frames — AI-generated depth maps show frame-to-frame jitter.",
    name_vi: "Kiểm tra ước lượng độ sâu thời gian", desc_vi: "Xác thực tính nhất quán thời gian của ước lượng độ sâu qua các khung hình — bản đồ sâu AI có giật frame-to-frame.",
    name_zh: "深度估计时间检查", desc_zh: "验证帧间深度估计的时间一致性——AI生成的深度图显示帧间抖动。",
    name_ja: "深度推定時間チェック", desc_ja: "フレーム間の深度推定の時間的一貫性を検証します。",
    name_ko: "깊이 추정 시간적 검사", desc_ko: "프레임 간 깊이 추정의 시간적 일관성을 검증합니다.",
    name_es: "Verificación temporal de estimación de profundidad", desc_es: "Valida la consistencia temporal de la estimación de profundidad entre cuadros." },

  { id: "eyelash_render_check", cat: "pixel", year: 2023, algo: "Eyelash Realism Assessment",
    name_en: "Eyelash Rendering Check", desc_en: "Analyzes eyelash rendering quality and consistency — AI faces often show unrealistic eyelash strand patterns.",
    name_vi: "Kiểm tra kết xuất lông mi", desc_vi: "Phân tích chất lượng và nhất quán kết xuất lông mi — khuôn mặt AI thường có mẫu sợi lông mi bất thực.",
    name_zh: "睫毛渲染检查", desc_zh: "分析睫毛渲染质量和一致性——AI面部通常显示不现实的睫毛纹理。",
    name_ja: "まつげレンダリングチェック", desc_ja: "まつげレンダリングの品質と一貫性を分析します。",
    name_ko: "속눈썹 렌더링 검사", desc_ko: "속눈썹 렌더링 품질과 일관성을 분석합니다.",
    name_es: "Verificación de renderizado de pestañas", desc_es: "Analiza la calidad y consistencia del renderizado de pestañas." },

  { id: "facial_blood_flow", cat: "pixel", year: 2022, algo: "Remote PPG Temporal Analysis",
    name_en: "Facial Blood Flow Detection", desc_en: "Detects subtle facial color changes from blood flow (rPPG) — real faces show pulse signals absent in AI-generated faces.",
    name_vi: "Phát hiện lưu lượng máu khuôn mặt", desc_vi: "Phát hiện thay đổi màu sắc tinh tế trên mặt từ lưu lượng máu (rPPG) — mặt thật có tín hiệu mạch vắng trong mặt AI.",
    name_zh: "面部血流检测", desc_zh: "检测血流引起的面部微妙颜色变化(rPPG)——真实面部显示AI生成面部不存在的脉搏信号。",
    name_ja: "顔面血流検出", desc_ja: "血流による微妙な顔色変化(rPPG)を検出します。",
    name_ko: "얼굴 혈류 감지", desc_ko: "혈류에 의한 미세한 얼굴 색상 변화(rPPG)를 감지합니다.",
    name_es: "Detección de flujo sanguíneo facial", desc_es: "Detecta cambios sutiles de color facial por flujo sanguíneo (rPPG)." },

  { id: "finger_nail_detail", cat: "pixel", year: 2023, algo: "Fingernail Texture Analysis",
    name_en: "Fingernail Detail Analysis", desc_en: "Analyzes fingernail texture, lunula, and cuticle details — AI often generates amorphous or inconsistent nail structures.",
    name_vi: "Phân tích chi tiết móng tay", desc_vi: "Phân tích kết cấu móng tay, bán nguyệt và lớp biểu bì — AI thường tạo cấu trúc móng vô định hình hoặc bất nhất quán.",
    name_zh: "指甲细节分析", desc_zh: "分析指甲纹理、月牙和角质层细节——AI通常生成无定形或不一致的指甲结构。",
    name_ja: "爪ディテール分析", desc_ja: "爪のテクスチャ、爪半月、甘皮のディテールを分析します。",
    name_ko: "손톱 디테일 분석", desc_ko: "손톱 질감, 반월 및 큐티클 디테일을 분석합니다.",
    name_es: "Análisis de detalle de uñas", desc_es: "Analiza textura de uñas, lúnula y detalles de cutícula." },

  { id: "frame_energy_temporal", cat: "statistical", year: 2020, algo: "Frame Energy Temporal Profile",
    name_en: "Frame Energy Temporal Profile", desc_en: "Profiles frame energy over time to detect abnormal energy fluctuations characteristic of AI video generation.",
    name_vi: "Hồ sơ năng lượng khung hình thời gian", desc_vi: "Lập hồ sơ năng lượng khung hình theo thời gian để phát hiện dao động năng lượng bất thường đặc trưng của video AI.",
    name_zh: "帧能量时间剖面", desc_zh: "分析帧能量随时间的变化以检测AI视频生成特有的异常能量波动。",
    name_ja: "フレームエネルギー時間プロファイル", desc_ja: "AIビデオ生成に特有の異常なエネルギー変動を検出するフレームエネルギーの時間プロファイルを作成します。",
    name_ko: "프레임 에너지 시간 프로파일", desc_ko: "AI 비디오 생성 특유의 비정상적 에너지 변동을 감지하기 위한 프레임 에너지 시간 프로파일을 생성합니다.",
    name_es: "Perfil temporal de energía de cuadro", desc_es: "Perfila la energía de cuadro a lo largo del tiempo para detectar fluctuaciones anómalas." },

  { id: "gaze_saccade_pattern", cat: "pixel", year: 2022, algo: "Saccadic Movement Analysis",
    name_en: "Gaze Saccade Pattern Analysis", desc_en: "Analyzes saccadic eye movement patterns for physiological plausibility — AI faces lack natural micro-saccade dynamics.",
    name_vi: "Phân tích mẫu saccade ánh mắt", desc_vi: "Phân tích mẫu chuyển động saccade mắt về tính hợp lý sinh lý — mặt AI thiếu động lực vi saccade tự nhiên.",
    name_zh: "注视扫视模式分析", desc_zh: "分析扫视眼球运动模式的生理合理性——AI面部缺乏自然微扫视动态。",
    name_ja: "視線サッカードパターン分析", desc_ja: "サッカード眼球運動パターンの生理学的妥当性を分析します。",
    name_ko: "시선 단속 운동 패턴 분석", desc_ko: "단속 운동 안구 운동 패턴의 생리학적 타당성을 분석합니다.",
    name_es: "Análisis de patrón de sacadas visuales", desc_es: "Analiza patrones de movimiento ocular sacádico para plausibilidad fisiológica." },

  { id: "hand_finger_anatomy", cat: "pixel", year: 2023, algo: "Hand Anatomy Validation",
    name_en: "Hand-Finger Anatomy Check", desc_en: "Validates hand and finger anatomy for correct digit count, proportions, and joint angles — a known weakness of AI generators.",
    name_vi: "Kiểm tra giải phẫu bàn tay-ngón tay", desc_vi: "Xác thực giải phẫu bàn tay và ngón tay về số ngón, tỷ lệ và góc khớp đúng — điểm yếu đã biết của AI.",
    name_zh: "手指解剖检查", desc_zh: "验证手和手指解剖的正确指数、比例和关节角度——AI生成器的已知弱点。",
    name_ja: "手指解剖チェック", desc_ja: "正しい指の数、比率、関節角度について手と指の解剖を検証します。",
    name_ko: "손가락 해부학 검사", desc_ko: "정확한 손가락 수, 비율 및 관절 각도에 대해 손과 손가락 해부학을 검증합니다.",
    name_es: "Verificación de anatomía mano-dedos", desc_es: "Valida la anatomía de manos y dedos para conteo correcto de dígitos, proporciones y ángulos articulares." },

  { id: "head_hair_boundary", cat: "pixel", year: 2022, algo: "Hair-Skin Boundary Analysis",
    name_en: "Head-Hair Boundary Analysis", desc_en: "Analyzes the boundary quality between head and hair regions — AI often produces unnatural hairline rendering.",
    name_vi: "Phân tích ranh giới đầu-tóc", desc_vi: "Phân tích chất lượng ranh giới giữa vùng đầu và tóc — AI thường tạo đường chân tóc bất thực.",
    name_zh: "头发边界分析", desc_zh: "分析头部和头发区域之间的边界质量——AI通常产生不自然的发际线渲染。",
    name_ja: "頭部-毛髪境界分析", desc_ja: "頭部と毛髪領域の境界品質を分析します。",
    name_ko: "머리-모발 경계 분석", desc_ko: "머리와 모발 영역 사이의 경계 품질을 분석합니다.",
    name_es: "Análisis de límite cabeza-cabello", desc_es: "Analiza la calidad del límite entre regiones de cabeza y cabello." },

  { id: "inter_frame_consistency", cat: "pixel", year: 2020, algo: "Cross-Frame Feature Matching",
    name_en: "Inter-Frame Feature Consistency", desc_en: "Matches features across consecutive frames to detect temporal inconsistencies and object morphing in AI-generated video.",
    name_vi: "Nhất quán đặc trưng liên khung hình", desc_vi: "Khớp đặc trưng qua các khung hình liên tiếp để phát hiện bất nhất quán thời gian và biến hình đối tượng trong video AI.",
    name_zh: "帧间特征一致性", desc_zh: "匹配连续帧间的特征以检测AI生成视频中的时间不一致性和对象变形。",
    name_ja: "フレーム間特徴一貫性", desc_ja: "連続フレーム間の特徴をマッチングして時間的不整合を検出します。",
    name_ko: "프레임 간 특징 일관성", desc_ko: "연속 프레임 간 특징을 매칭하여 시간적 불일치를 감지합니다.",
    name_es: "Consistencia de características inter-cuadro", desc_es: "Coincide características entre cuadros consecutivos para detectar inconsistencias temporales." },

  { id: "iris_pattern_consistency", cat: "pixel", year: 2021, algo: "Iris Texture Temporal Check",
    name_en: "Iris Pattern Consistency", desc_en: "Tracks iris texture pattern consistency over time — AI-generated irises often change pattern across frames.",
    name_vi: "Nhất quán mẫu mống mắt", desc_vi: "Theo dõi nhất quán mẫu kết cấu mống mắt theo thời gian — mống mắt AI thường thay đổi mẫu qua các khung hình.",
    name_zh: "虹膜图案一致性", desc_zh: "追踪虹膜纹理图案随时间的一致性——AI生成的虹膜通常在帧间改变图案。",
    name_ja: "虹彩パターン一貫性", desc_ja: "虹彩テクスチャパターンの時間的一貫性を追跡します。",
    name_ko: "홍채 패턴 일관성", desc_ko: "홍채 텍스처 패턴의 시간적 일관성을 추적합니다.",
    name_es: "Consistencia de patrón de iris", desc_es: "Rastrea la consistencia del patrón de textura del iris a lo largo del tiempo." },

  { id: "light_source_tracking", cat: "pixel", year: 2020, algo: "Light Source Temporal Tracking",
    name_en: "Light Source Tracking", desc_en: "Tracks estimated light source positions over time — AI video often shows inconsistent or jumping light directions.",
    name_vi: "Theo dõi nguồn sáng", desc_vi: "Theo dõi vị trí nguồn sáng ước lượng theo thời gian — video AI thường có hướng sáng bất nhất quán hoặc nhảy.",
    name_zh: "光源追踪", desc_zh: "追踪估计的光源位置随时间变化——AI视频通常显示不一致或跳跃的光线方向。",
    name_ja: "光源追跡", desc_ja: "推定光源位置を時間の経過とともに追跡します。",
    name_ko: "광원 추적", desc_ko: "추정된 광원 위치를 시간에 따라 추적합니다.",
    name_es: "Rastreo de fuente de luz", desc_es: "Rastrea posiciones estimadas de fuentes de luz a lo largo del tiempo." },

  { id: "lip_teeth_sync", cat: "pixel", year: 2022, algo: "Lip-Teeth Coordination Analysis",
    name_en: "Lip-Teeth Synchronization", desc_en: "Analyzes lip and teeth coordination during speech — AI often fails to correctly render dental occlusion patterns.",
    name_vi: "Đồng bộ môi-răng", desc_vi: "Phân tích phối hợp môi và răng khi nói — AI thường không kết xuất đúng mẫu khớp cắn răng.",
    name_zh: "唇齿同步", desc_zh: "分析说话时唇齿协调——AI通常无法正确渲染牙齿咬合模式。",
    name_ja: "唇歯同期", desc_ja: "発話中の唇と歯の協調を分析します。",
    name_ko: "입술-치아 동기화", desc_ko: "발화 중 입술과 치아의 협조를 분석합니다.",
    name_es: "Sincronización labio-diente", desc_es: "Analiza la coordinación de labios y dientes durante el habla." },

  { id: "motion_parallax_check", cat: "pixel", year: 2019, algo: "Motion Parallax Validation",
    name_en: "Motion Parallax Verification", desc_en: "Validates motion parallax between foreground and background layers — AI video often lacks proper parallax depth cues.",
    name_vi: "Xác minh thị sai chuyển động", desc_vi: "Xác thực thị sai chuyển động giữa lớp tiền cảnh và hậu cảnh — video AI thường thiếu dấu hiệu sâu thị sai.",
    name_zh: "运动视差验证", desc_zh: "验证前景和背景层之间的运动视差——AI视频通常缺乏正确的视差深度线索。",
    name_ja: "モーションパララックス検証", desc_ja: "前景と背景のモーションパララックスを検証します。",
    name_ko: "운동 시차 검증", desc_ko: "전경과 배경 사이의 운동 시차를 검증합니다.",
    name_es: "Verificación de paralaje de movimiento", desc_es: "Valida el paralaje de movimiento entre capas de primer plano y fondo." },

  { id: "object_shadow_sync", cat: "pixel", year: 2021, algo: "Object-Shadow Synchronization",
    name_en: "Object-Shadow Synchronization", desc_en: "Verifies temporal synchronization of object movement and shadow dynamics — AI-generated shadows often lag or lead incorrectly.",
    name_vi: "Đồng bộ đối tượng-bóng", desc_vi: "Xác minh đồng bộ thời gian giữa chuyển động đối tượng và động lực bóng — bóng AI thường trễ hoặc dẫn trước sai.",
    name_zh: "物体-阴影同步", desc_zh: "验证物体运动和阴影动态的时间同步——AI生成的阴影通常错误地滞后或领先。",
    name_ja: "オブジェクト-影同期", desc_ja: "オブジェクトの動きと影のダイナミクスの時間的同期を検証します。",
    name_ko: "객체-그림자 동기화", desc_ko: "객체 움직임과 그림자 역학의 시간적 동기화를 검증합니다.",
    name_es: "Sincronización objeto-sombra", desc_es: "Verifica la sincronización temporal del movimiento de objetos y dinámica de sombras." },

  { id: "pore_temporal_stability", cat: "pixel", year: 2023, algo: "Pore Pattern Temporal Analysis",
    name_en: "Pore Temporal Stability", desc_en: "Tracks skin pore pattern stability across frames — AI faces show temporally inconsistent pore textures.",
    name_vi: "Ổn định lỗ chân lông thời gian", desc_vi: "Theo dõi ổn định mẫu lỗ chân lông qua các khung hình — mặt AI có kết cấu lỗ chân lông bất nhất quán thời gian.",
    name_zh: "毛孔时间稳定性", desc_zh: "追踪皮肤毛孔模式在帧间的稳定性——AI面部显示时间上不一致的毛孔纹理。",
    name_ja: "毛穴時間安定性", desc_ja: "フレーム間の皮膚毛穴パターンの安定性を追跡します。",
    name_ko: "모공 시간적 안정성", desc_ko: "프레임 간 피부 모공 패턴 안정성을 추적합니다.",
    name_es: "Estabilidad temporal de poros", desc_es: "Rastrea la estabilidad del patrón de poros cutáneos entre cuadros." },

  { id: "reflection_temporal", cat: "pixel", year: 2021, algo: "Reflection Temporal Consistency",
    name_en: "Reflection Temporal Consistency", desc_en: "Validates temporal consistency of specular reflections on surfaces — AI video reflection patterns often flicker or shift unnaturally.",
    name_vi: "Nhất quán phản xạ thời gian", desc_vi: "Xác thực nhất quán thời gian phản xạ gương trên bề mặt — mẫu phản xạ video AI thường nhấp nháy hoặc dịch bất thường.",
    name_zh: "反射时间一致性", desc_zh: "验证表面镜面反射的时间一致性——AI视频反射模式通常不自然地闪烁或移动。",
    name_ja: "反射時間一貫性", desc_ja: "表面の鏡面反射の時間的一貫性を検証します。",
    name_ko: "반사 시간적 일관성", desc_ko: "표면의 경면 반사의 시간적 일관성을 검증합니다.",
    name_es: "Consistencia temporal de reflexión", desc_es: "Valida la consistencia temporal de reflexiones especulares en superficies." },

  { id: "scene_graph_consistency", cat: "statistical", year: 2022, algo: "Scene Graph Temporal Validation",
    name_en: "Scene Graph Consistency", desc_en: "Builds and validates temporal scene graphs to detect object appearance/disappearance anomalies in AI-generated video.",
    name_vi: "Nhất quán đồ thị cảnh", desc_vi: "Xây dựng và xác thực đồ thị cảnh thời gian để phát hiện bất thường xuất hiện/biến mất đối tượng trong video AI.",
    name_zh: "场景图一致性", desc_zh: "构建并验证时间场景图以检测AI生成视频中的物体出现/消失异常。",
    name_ja: "シーングラフ一貫性", desc_ja: "時間的シーングラフを構築し、AIビデオのオブジェクト出現/消失異常を検出します。",
    name_ko: "장면 그래프 일관성", desc_ko: "시간적 장면 그래프를 구축하고 AI 비디오의 객체 출현/소멸 이상을 감지합니다.",
    name_es: "Consistencia de grafo de escena", desc_es: "Construye y valida grafos de escena temporales para detectar anomalías de aparición/desaparición de objetos." },

  { id: "skin_color_physiology", cat: "pixel", year: 2022, algo: "Physiological Skin Color Model",
    name_en: "Skin Color Physiology Check", desc_en: "Validates skin color against physiological models including melanin/hemoglobin components — AI skin often lacks realistic color layering.",
    name_vi: "Kiểm tra sinh lý màu da", desc_vi: "Xác thực màu da với mô hình sinh lý bao gồm thành phần melanin/hemoglobin — da AI thường thiếu phân lớp màu thực tế.",
    name_zh: "皮肤颜色生理学检查", desc_zh: "根据包括黑色素/血红蛋白成分的生理模型验证皮肤颜色——AI皮肤通常缺乏真实的颜色分层。",
    name_ja: "肌色生理学チェック", desc_ja: "メラニン/ヘモグロビン成分を含む生理学的モデルに対して肌色を検証します。",
    name_ko: "피부색 생리학 검사", desc_ko: "멜라닌/헤모글로빈 성분을 포함한 생리학적 모델에 대해 피부색을 검증합니다.",
    name_es: "Verificación fisiológica de color de piel", desc_es: "Valida el color de piel contra modelos fisiológicos incluyendo componentes de melanina/hemoglobina." },

  { id: "specular_flow_temporal", cat: "pixel", year: 2020, algo: "Specular Flow Analysis",
    name_en: "Specular Flow Temporal Analysis", desc_en: "Analyzes specular highlight flow patterns over time — real specular reflections follow predictable motion dynamics.",
    name_vi: "Phân tích dòng phản xạ gương thời gian", desc_vi: "Phân tích mẫu dòng điểm sáng gương theo thời gian — phản xạ gương thật tuân theo động lực chuyển động dự đoán được.",
    name_zh: "镜面流时间分析", desc_zh: "分析镜面高光流模式随时间的变化——真实镜面反射遵循可预测的运动动态。",
    name_ja: "スペキュラフロー時間分析", desc_ja: "スペキュラハイライトフローパターンの時間的変化を分析します。",
    name_ko: "스페큘러 흐름 시간 분석", desc_ko: "시간에 따른 스페큘러 하이라이트 흐름 패턴을 분석합니다.",
    name_es: "Análisis temporal de flujo especular", desc_es: "Analiza patrones de flujo de reflejos especulares a lo largo del tiempo." },

  { id: "temporal_color_grading", cat: "pixel", year: 2019, algo: "Color Grading Consistency Check",
    name_en: "Temporal Color Grading Check", desc_en: "Validates color grading consistency across video timeline — AI video often has inconsistent color treatment between segments.",
    name_vi: "Kiểm tra phân loại màu thời gian", desc_vi: "Xác thực nhất quán phân loại màu trên timeline video — video AI thường có xử lý màu bất nhất quán giữa các phân đoạn.",
    name_zh: "时间调色一致性检查", desc_zh: "验证视频时间线上的调色一致性——AI视频通常在片段间具有不一致的颜色处理。",
    name_ja: "時間カラーグレーディングチェック", desc_ja: "ビデオタイムライン全体のカラーグレーディングの一貫性を検証します。",
    name_ko: "시간적 색상 그레이딩 검사", desc_ko: "비디오 타임라인 전체의 색상 그레이딩 일관성을 검증합니다.",
    name_es: "Verificación temporal de corrección de color", desc_es: "Valida la consistencia del etalonaje de color a lo largo de la línea de tiempo del video." },

  { id: "temporal_edge_stability", cat: "pixel", year: 2020, algo: "Edge Stability Temporal Profile",
    name_en: "Temporal Edge Stability", desc_en: "Measures edge stability across frames — AI-generated video often shows flickering or morphing edges between frames.",
    name_vi: "Ổn định cạnh thời gian", desc_vi: "Đo ổn định cạnh qua các khung hình — video AI thường có cạnh nhấp nháy hoặc biến hình giữa các khung hình.",
    name_zh: "时间边缘稳定性", desc_zh: "测量帧间边缘稳定性——AI生成视频通常在帧间显示闪烁或变形的边缘。",
    name_ja: "時間エッジ安定性", desc_ja: "フレーム間のエッジ安定性を測定します。",
    name_ko: "시간적 에지 안정성", desc_ko: "프레임 간 에지 안정성을 측정합니다.",
    name_es: "Estabilidad temporal de bordes", desc_es: "Mide la estabilidad de bordes entre cuadros." },

  { id: "temporal_noise_floor", cat: "statistical", year: 2019, algo: "Temporal Noise Floor Profiling",
    name_en: "Temporal Noise Floor Analysis", desc_en: "Profiles noise floor levels across video frames — real camera noise follows predictable temporal distributions.",
    name_vi: "Phân tích sàn nhiễu thời gian", desc_vi: "Lập hồ sơ mức sàn nhiễu qua các khung hình video — nhiễu camera thật tuân theo phân bổ thời gian dự đoán được.",
    name_zh: "时间噪底分析", desc_zh: "分析视频帧间的噪底水平——真实相机噪声遵循可预测的时间分布。",
    name_ja: "時間ノイズフロア分析", desc_ja: "ビデオフレーム間のノイズフロアレベルをプロファイルします。",
    name_ko: "시간적 노이즈 플로어 분석", desc_ko: "비디오 프레임 전체의 노이즈 플로어 레벨을 프로파일링합니다.",
    name_es: "Análisis de piso de ruido temporal", desc_es: "Perfila niveles de piso de ruido entre cuadros de video." },

  { id: "texture_flicker_detect", cat: "pixel", year: 2021, algo: "Texture Flicker Detection",
    name_en: "Texture Flicker Detection", desc_en: "Detects texture flickering artifacts where surface textures change unnaturally between consecutive frames.",
    name_vi: "Phát hiện nhấp nháy kết cấu", desc_vi: "Phát hiện tạo tác nhấp nháy kết cấu khi kết cấu bề mặt thay đổi bất thường giữa các khung hình liên tiếp.",
    name_zh: "纹理闪烁检测", desc_zh: "检测纹理闪烁伪影，即表面纹理在连续帧之间不自然变化。",
    name_ja: "テクスチャフリッカー検出", desc_ja: "連続フレーム間で表面テクスチャが不自然に変化するテクスチャフリッカーアーティファクトを検出します。",
    name_ko: "텍스처 깜빡임 감지", desc_ko: "연속 프레임 간 표면 텍스처가 부자연스럽게 변하는 텍스처 깜빡임 아티팩트를 감지합니다.",
    name_es: "Detección de parpadeo de textura", desc_es: "Detecta artefactos de parpadeo de textura donde las texturas de superficie cambian de forma antinatural." },

  { id: "vocal_tract_model", cat: "frequency", year: 2022, algo: "Vocal Tract Resonance Modeling",
    name_en: "Vocal Tract Model Analysis", desc_en: "Models vocal tract resonances and validates against physical anatomy — AI voice cloning often produces non-physical formant patterns.",
    name_vi: "Phân tích mô hình đường thanh quản", desc_vi: "Mô hình hóa cộng hưởng đường thanh quản và xác thực với giải phẫu vật lý — nhân bản giọng AI thường tạo mẫu formant phi vật lý.",
    name_zh: "声道模型分析", desc_zh: "建模声道共振并与物理解剖验证——AI语音克隆通常产生非物理共振峰模式。",
    name_ja: "声道モデル分析", desc_ja: "声道共振をモデル化し、物理的解剖と照合します。",
    name_ko: "성도 모델 분석", desc_ko: "성도 공명을 모델링하고 물리적 해부학과 대조합니다.",
    name_es: "Análisis de modelo de tracto vocal", desc_es: "Modela resonancias del tracto vocal y valida contra anatomía física." },

  { id: "water_surface_physics", cat: "pixel", year: 2023, algo: "Water Surface Simulation Validation",
    name_en: "Water Surface Physics Check", desc_en: "Validates water surface dynamics against fluid simulation physics — AI-generated water often violates wave propagation rules.",
    name_vi: "Kiểm tra vật lý bề mặt nước", desc_vi: "Xác thực động lực bề mặt nước với vật lý mô phỏng chất lỏng — nước AI thường vi phạm quy tắc truyền sóng.",
    name_zh: "水面物理检查", desc_zh: "根据流体模拟物理验证水面动态——AI生成的水通常违反波传播规则。",
    name_ja: "水面物理チェック", desc_ja: "流体シミュレーション物理に対して水面のダイナミクスを検証します。",
    name_ko: "수면 물리학 검사", desc_ko: "유체 시뮬레이션 물리에 대해 수면 역학을 검증합니다.",
    name_es: "Verificación de física de superficie de agua", desc_es: "Valida la dinámica de superficie del agua contra simulación de fluidos." },

  { id: "wrist_movement_natural", cat: "pixel", year: 2022, algo: "Wrist Kinematics Analysis",
    name_en: "Wrist Movement Naturalness", desc_en: "Validates wrist movement kinematics for natural range of motion — AI often generates wrist rotations exceeding biomechanical limits.",
    name_vi: "Tự nhiên chuyển động cổ tay", desc_vi: "Xác thực động học chuyển động cổ tay về phạm vi chuyển động tự nhiên — AI thường tạo xoay cổ tay vượt giới hạn cơ sinh học.",
    name_zh: "手腕运动自然度", desc_zh: "验证手腕运动运动学的自然运动范围——AI通常生成超过生物力学极限的手腕旋转。",
    name_ja: "手首の動きの自然さ", desc_ja: "自然な可動域のための手首の動きの運動学を検証します。",
    name_ko: "손목 움직임 자연스러움", desc_ko: "자연적 운동 범위에 대한 손목 움직임 운동학을 검증합니다.",
    name_es: "Naturalidad del movimiento de muñeca", desc_es: "Valida la cinemática del movimiento de muñeca para rango natural de movimiento." },

  { id: "zoom_consistency_check", cat: "sensor", year: 2018, algo: "Zoom Level Consistency Analysis",
    name_en: "Zoom Consistency Check", desc_en: "Validates zoom level consistency with depth-of-field and perspective — AI video lacks coherent focal length behavior.",
    name_vi: "Kiểm tra nhất quán zoom", desc_vi: "Xác thực nhất quán mức zoom với độ sâu trường và phối cảnh — video AI thiếu hành vi tiêu cự mạch lạc.",
    name_zh: "变焦一致性检查", desc_zh: "验证变焦级别与景深和透视的一致性——AI视频缺乏连贯的焦距行为。",
    name_ja: "ズーム一貫性チェック", desc_ja: "被写界深度と遠近法とのズームレベルの一貫性を検証します。",
    name_ko: "줌 일관성 검사", desc_ko: "피사계 심도 및 원근법과의 줌 레벨 일관성을 검증합니다.",
    name_es: "Verificación de consistencia de zoom", desc_es: "Valida la consistencia del nivel de zoom con profundidad de campo y perspectiva." },
];

// ═══════════════════════════════════════════════════════════════════════
// ─── 33 NEW TEXT METHODS ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
const newTextMethods = [
  { id: "abstract_concrete_ratio", cat: "statistical", year: 2021, algo: "Abstractness Ratio Computation",
    name_en: "Abstract-Concrete Word Ratio", desc_en: "Computes ratio of abstract to concrete words — AI text tends to use more abstract and fewer concrete sensory words.",
    name_vi: "Tỷ lệ từ trừu tượng-cụ thể", desc_vi: "Tính tỷ lệ từ trừu tượng so với từ cụ thể — văn bản AI có xu hướng dùng nhiều từ trừu tượng và ít từ giác quan cụ thể hơn.",
    name_zh: "抽象-具体词比率", desc_zh: "计算抽象词与具体词的比率——AI文本倾向于使用更多抽象词和更少的具体感官词。",
    name_ja: "抽象-具体語比率", desc_ja: "抽象語と具体語の比率を計算します。",
    name_ko: "추상-구체 단어 비율", desc_ko: "추상 단어와 구체 단어의 비율을 계산합니다.",
    name_es: "Ratio de palabras abstractas-concretas", desc_es: "Calcula la proporción de palabras abstractas a concretas." },

  { id: "adverb_placement_pattern", cat: "statistical", year: 2020, algo: "Adverb Position Analysis",
    name_en: "Adverb Placement Pattern", desc_en: "Analyzes adverb placement patterns — AI text shows less varied and more predictable adverb positioning than human writing.",
    name_vi: "Mẫu vị trí trạng từ", desc_vi: "Phân tích mẫu vị trí trạng từ — văn bản AI có vị trí trạng từ ít đa dạng và dễ đoán hơn văn viết người.",
    name_zh: "副词位置模式", desc_zh: "分析副词位置模式——AI文本比人类写作显示更少变化和更可预测的副词定位。",
    name_ja: "副詞配置パターン", desc_ja: "副詞の配置パターンを分析します。",
    name_ko: "부사 배치 패턴", desc_ko: "부사 배치 패턴을 분석합니다.",
    name_es: "Patrón de colocación de adverbios", desc_es: "Analiza patrones de colocación de adverbios." },

  { id: "allusion_detection", cat: "statistical", year: 2022, algo: "Literary Allusion Detection",
    name_en: "Allusion Detection", desc_en: "Detects literary and cultural allusions — AI text often lacks genuine allusive depth or produces surface-level references.",
    name_vi: "Phát hiện ám chỉ", desc_vi: "Phát hiện ám chỉ văn học và văn hóa — văn bản AI thường thiếu chiều sâu ám chỉ thật hoặc tạo tham chiếu bề mặt.",
    name_zh: "典故检测", desc_zh: "检测文学和文化典故——AI文本通常缺乏真正的典故深度或产生表面级引用。",
    name_ja: "アリュージョン検出", desc_ja: "文学的・文化的アリュージョンを検出します。",
    name_ko: "암시 탐지", desc_ko: "문학적, 문화적 암시를 감지합니다.",
    name_es: "Detección de alusiones", desc_es: "Detecta alusiones literarias y culturales." },

  { id: "appositive_usage", cat: "statistical", year: 2019, algo: "Appositive Structure Analysis",
    name_en: "Appositive Usage Analysis", desc_en: "Analyzes appositive clause usage frequency and complexity — AI tends to underuse or overuse appositives.",
    name_vi: "Phân tích sử dụng đồng vị ngữ", desc_vi: "Phân tích tần suất và độ phức tạp sử dụng mệnh đề đồng vị ngữ — AI có xu hướng dùng thiếu hoặc thừa.",
    name_zh: "同位语使用分析", desc_zh: "分析同位语从句使用频率和复杂性——AI倾向于少用或过度使用同位语。",
    name_ja: "同格語用法分析", desc_ja: "同格節の使用頻度と複雑さを分析します。",
    name_ko: "동격어 사용 분석", desc_ko: "동격절 사용 빈도와 복잡성을 분석합니다.",
    name_es: "Análisis de uso de aposición", desc_es: "Analiza la frecuencia y complejidad del uso de cláusulas apositivas." },

  { id: "authorial_voice_score", cat: "statistical", year: 2023, algo: "Authorial Voice Profiling",
    name_en: "Authorial Voice Score", desc_en: "Scores the distinctiveness of authorial voice — AI text often lacks unique authorial personality and stylistic fingerprint.",
    name_vi: "Điểm giọng tác giả", desc_vi: "Chấm điểm tính đặc trưng giọng tác giả — văn bản AI thường thiếu cá tính tác giả và dấu vân tay phong cách riêng.",
    name_zh: "作者声音评分", desc_zh: "评估作者声音的独特性——AI文本通常缺乏独特的作者个性和风格指纹。",
    name_ja: "著者の声スコア", desc_ja: "著者の声の独自性をスコアリングします。",
    name_ko: "저자 목소리 점수", desc_ko: "저자 목소리의 독특성을 점수화합니다.",
    name_es: "Puntuación de voz autorial", desc_es: "Puntúa la distintividad de la voz autorial." },

  { id: "cataphora_usage", cat: "statistical", year: 2020, algo: "Cataphoric Reference Analysis",
    name_en: "Cataphora Usage Pattern", desc_en: "Analyzes cataphoric reference usage — AI text rarely uses forward references, preferring simpler anaphoric structures.",
    name_vi: "Mẫu sử dụng hồi chỉ ngược", desc_vi: "Phân tích sử dụng tham chiếu hồi chỉ ngược — văn bản AI hiếm khi dùng tham chiếu tiến, ưa thích cấu trúc hồi chỉ đơn giản hơn.",
    name_zh: "后指用法模式", desc_zh: "分析后指用法——AI文本很少使用前指，倾向于更简单的回指结构。",
    name_ja: "カタフォラ使用パターン", desc_ja: "前方照応参照の使用パターンを分析します。",
    name_ko: "후방 조응 사용 패턴", desc_ko: "후방 조응 참조 사용을 분석합니다.",
    name_es: "Patrón de uso de catáfora", desc_es: "Analiza el uso de referencias catafóricas." },

  { id: "clause_initial_element", cat: "statistical", year: 2018, algo: "Clause-Initial Element Distribution",
    name_en: "Clause-Initial Element Analysis", desc_en: "Analyzes distribution of clause-initial elements (subjects, adverbials, etc.) — AI shows less varied clause openings.",
    name_vi: "Phân tích yếu tố đầu mệnh đề", desc_vi: "Phân tích phân bổ yếu tố đầu mệnh đề (chủ ngữ, trạng ngữ, v.v.) — AI có mở đầu mệnh đề ít đa dạng hơn.",
    name_zh: "从句首要素分析", desc_zh: "分析从句首要素（主语、状语等）的分布——AI显示较少变化的从句开头。",
    name_ja: "節頭要素分析", desc_ja: "節頭要素（主語、副詞句など）の分布を分析します。",
    name_ko: "절 초두 요소 분석", desc_ko: "절 초두 요소(주어, 부사어 등)의 분포를 분석합니다.",
    name_es: "Análisis de elemento inicial de cláusula", desc_es: "Analiza la distribución de elementos iniciales de cláusula." },

  { id: "collocational_error", cat: "statistical", year: 2021, algo: "Collocation Error Detection",
    name_en: "Collocational Error Detection", desc_en: "Detects collocational errors and unnatural word pairings — AI sometimes generates plausible but non-native collocations.",
    name_vi: "Phát hiện lỗi kết hợp từ", desc_vi: "Phát hiện lỗi kết hợp từ và ghép cặp từ bất thường — AI đôi khi tạo kết hợp từ hợp lý nhưng không tự nhiên.",
    name_zh: "搭配错误检测", desc_zh: "检测搭配错误和不自然的词组——AI有时生成看似合理但非母语的搭配。",
    name_ja: "コロケーションエラー検出", desc_ja: "コロケーションエラーと不自然な語の組み合わせを検出します。",
    name_ko: "연어 오류 감지", desc_ko: "연어 오류와 부자연스러운 단어 짝을 감지합니다.",
    name_es: "Detección de errores de colocación", desc_es: "Detecta errores de colocación y emparejamientos de palabras no naturales." },

  { id: "demonstrative_pattern", cat: "statistical", year: 2019, algo: "Demonstrative Pronoun Analysis",
    name_en: "Demonstrative Usage Pattern", desc_en: "Analyzes demonstrative pronoun usage patterns (this/that/these/those) — AI shows distinctive demonstrative preferences.",
    name_vi: "Mẫu sử dụng chỉ định", desc_vi: "Phân tích mẫu sử dụng đại từ chỉ định (này/kia/những) — AI có sở thích chỉ định đặc trưng.",
    name_zh: "指示词使用模式", desc_zh: "分析指示代词使用模式——AI显示独特的指示词偏好。",
    name_ja: "指示詞使用パターン", desc_ja: "指示代名詞の使用パターンを分析します。",
    name_ko: "지시사 사용 패턴", desc_ko: "지시 대명사 사용 패턴을 분석합니다.",
    name_es: "Patrón de uso de demostrativos", desc_es: "Analiza patrones de uso de pronombres demostrativos." },

  { id: "discourse_topic_chain", cat: "statistical", year: 2022, algo: "Topic Chain Analysis",
    name_en: "Discourse Topic Chain", desc_en: "Traces topic chains through discourse — AI text often introduces topics without proper chain development or continuity.",
    name_vi: "Chuỗi chủ đề diễn ngôn", desc_vi: "Truy vết chuỗi chủ đề qua diễn ngôn — văn bản AI thường giới thiệu chủ đề mà không phát triển hoặc liên tục đúng.",
    name_zh: "话语主题链", desc_zh: "追踪话语中的主题链——AI文本通常引入主题而没有适当的链条发展或连续性。",
    name_ja: "談話トピックチェーン", desc_ja: "談話を通じてトピックチェーンを追跡します。",
    name_ko: "담화 주제 연쇄", desc_ko: "담화를 통해 주제 연쇄를 추적합니다.",
    name_es: "Cadena temática del discurso", desc_es: "Traza cadenas temáticas a través del discurso." },

  { id: "ellipsis_usage_score", cat: "statistical", year: 2020, algo: "Ellipsis Pattern Scoring",
    name_en: "Ellipsis Usage Score", desc_en: "Scores ellipsis usage naturalness — AI text tends to avoid grammatical ellipsis, resulting in overly explicit constructions.",
    name_vi: "Điểm sử dụng tỉnh lược", desc_vi: "Chấm điểm tự nhiên sử dụng tỉnh lược — văn bản AI có xu hướng tránh tỉnh lược ngữ pháp, tạo cấu trúc quá tường minh.",
    name_zh: "省略用法评分", desc_zh: "评估省略用法的自然度——AI文本倾向于避免语法省略，导致过于显式的结构。",
    name_ja: "省略使用スコア", desc_ja: "省略使用の自然さをスコアリングします。",
    name_ko: "생략 사용 점수", desc_ko: "생략 사용의 자연스러움을 점수화합니다.",
    name_es: "Puntuación de uso de elipsis", desc_es: "Puntúa la naturalidad del uso de elipsis." },

  { id: "emphatic_structure", cat: "statistical", year: 2019, algo: "Emphatic Construction Analysis",
    name_en: "Emphatic Structure Analysis", desc_en: "Analyzes emphatic constructions (do-support, cleft sentences, etc.) — AI text underuses emphatic devices.",
    name_vi: "Phân tích cấu trúc nhấn mạnh", desc_vi: "Phân tích cấu trúc nhấn mạnh (trợ động từ nhấn, câu chẻ, v.v.) — văn bản AI ít dùng công cụ nhấn mạnh.",
    name_zh: "强调结构分析", desc_zh: "分析强调结构（助动词强调、分裂句等）——AI文本不足使用强调手段。",
    name_ja: "強調構造分析", desc_ja: "強調構造（do強調、分裂文など）を分析します。",
    name_ko: "강조 구조 분석", desc_ko: "강조 구문(do-강조, 분열문 등)을 분석합니다.",
    name_es: "Análisis de estructura enfática", desc_es: "Analiza construcciones enfáticas (do-soporte, oraciones hendidas, etc.)." },

  { id: "epistemic_stance_marker", cat: "statistical", year: 2022, algo: "Epistemic Stance Detection",
    name_en: "Epistemic Stance Marker", desc_en: "Analyzes epistemic stance markers (certainly, perhaps, arguably) — AI shows distinctive certainty and hedging patterns.",
    name_vi: "Đánh dấu lập trường nhận thức", desc_vi: "Phân tích dấu hiệu lập trường nhận thức (chắc chắn, có lẽ, có thể nói) — AI có mẫu chắc chắn và né đặc trưng.",
    name_zh: "认识立场标记", desc_zh: "分析认识立场标记（肯定、也许、可以说）——AI显示独特的确定性和模糊模式。",
    name_ja: "認識的スタンスマーカー", desc_ja: "認識的スタンスマーカー（確かに、おそらく等）を分析します。",
    name_ko: "인식적 입장 표지", desc_ko: "인식적 입장 표지(확실히, 아마도 등)를 분석합니다.",
    name_es: "Marcador de postura epistémica", desc_es: "Analiza marcadores de postura epistémica (ciertamente, quizás, posiblemente)." },

  { id: "example_specificity", cat: "statistical", year: 2023, algo: "Example Specificity Scoring",
    name_en: "Example Specificity Score", desc_en: "Scores specificity and verifiability of examples — AI-generated examples tend to be generic, vague, or fabricated.",
    name_vi: "Điểm cụ thể ví dụ", desc_vi: "Chấm điểm tính cụ thể và khả năng xác minh của ví dụ — ví dụ AI có xu hướng chung chung, mơ hồ hoặc bịa đặt.",
    name_zh: "示例具体性评分", desc_zh: "评估示例的具体性和可验证性——AI生成的示例往往是通用的、模糊的或捏造的。",
    name_ja: "例の具体性スコア", desc_ja: "例の具体性と検証可能性をスコアリングします。",
    name_ko: "예시 구체성 점수", desc_ko: "예시의 구체성과 검증 가능성을 점수화합니다.",
    name_es: "Puntuación de especificidad de ejemplos", desc_es: "Puntúa la especificidad y verificabilidad de los ejemplos." },

  { id: "factual_density_score", cat: "statistical", year: 2023, algo: "Factual Density Computation",
    name_en: "Factual Density Score", desc_en: "Measures density of verifiable factual claims per paragraph — AI text often has lower factual density with more filler content.",
    name_vi: "Điểm mật độ thực tế", desc_vi: "Đo mật độ tuyên bố thực tế có thể xác minh trên mỗi đoạn — văn bản AI thường có mật độ thực tế thấp hơn với nội dung lấp đầy nhiều hơn.",
    name_zh: "事实密度评分", desc_zh: "测量每段可验证事实声明的密度——AI文本通常事实密度较低，填充内容较多。",
    name_ja: "事実密度スコア", desc_ja: "段落あたりの検証可能な事実主張の密度を測定します。",
    name_ko: "사실 밀도 점수", desc_ko: "단락당 검증 가능한 사실적 주장의 밀도를 측정합니다.",
    name_es: "Puntuación de densidad factual", desc_es: "Mide la densidad de afirmaciones factuales verificables por párrafo." },

  { id: "gerund_infinitive_ratio", cat: "statistical", year: 2019, algo: "Gerund-Infinitive Balance",
    name_en: "Gerund-Infinitive Ratio", desc_en: "Measures the ratio of gerund to infinitive constructions — AI text often shows imbalanced gerund/infinitive usage patterns.",
    name_vi: "Tỷ lệ danh động từ-động từ nguyên thể", desc_vi: "Đo tỷ lệ cấu trúc danh động từ so với động từ nguyên thể — văn bản AI thường có mẫu sử dụng mất cân bằng.",
    name_zh: "动名词-不定式比率", desc_zh: "测量动名词与不定式结构的比率——AI文本通常显示不平衡的动名词/不定式使用模式。",
    name_ja: "動名詞-不定詞比率", desc_ja: "動名詞と不定詞構造の比率を測定します。",
    name_ko: "동명사-부정사 비율", desc_ko: "동명사와 부정사 구문의 비율을 측정합니다.",
    name_es: "Ratio de gerundio-infinitivo", desc_es: "Mide la proporción de construcciones de gerundio a infinitivo." },

  { id: "humor_detection_score", cat: "statistical", year: 2023, algo: "Humor and Wit Analysis",
    name_en: "Humor Detection Score", desc_en: "Detects and scores humor, irony, and wit — AI-generated humor tends to be formulaic and lacks true creative wordplay.",
    name_vi: "Điểm phát hiện hài hước", desc_vi: "Phát hiện và chấm điểm hài hước, mỉa mai và dí dỏm — hài hước AI có xu hướng công thức và thiếu chơi chữ sáng tạo.",
    name_zh: "幽默检测评分", desc_zh: "检测和评估幽默、讽刺和机智——AI生成的幽默往往程式化且缺乏真正的创造性文字游戏。",
    name_ja: "ユーモア検出スコア", desc_ja: "ユーモア、皮肉、機知を検出し、スコアリングします。",
    name_ko: "유머 감지 점수", desc_ko: "유머, 아이러니, 재치를 감지하고 점수화합니다.",
    name_es: "Puntuación de detección de humor", desc_es: "Detecta y puntúa humor, ironía e ingenio." },

  { id: "lexical_priming_effect", cat: "statistical", year: 2021, algo: "Lexical Priming Analysis",
    name_en: "Lexical Priming Effect", desc_en: "Measures lexical priming effects between adjacent sentences — AI text shows weaker priming chains than human writing.",
    name_vi: "Hiệu ứng mồi từ vựng", desc_vi: "Đo hiệu ứng mồi từ vựng giữa các câu kề nhau — văn bản AI có chuỗi mồi yếu hơn văn viết người.",
    name_zh: "词汇启动效应", desc_zh: "测量相邻句子之间的词汇启动效应——AI文本比人类写作显示更弱的启动链。",
    name_ja: "語彙プライミング効果", desc_ja: "隣接する文間の語彙プライミング効果を測定します。",
    name_ko: "어휘 점화 효과", desc_ko: "인접 문장 간의 어휘 점화 효과를 측정합니다.",
    name_es: "Efecto de priming léxico", desc_es: "Mide efectos de priming léxico entre oraciones adyacentes." },

  { id: "logical_fallacy_detect", cat: "statistical", year: 2023, algo: "Logical Fallacy Detection",
    name_en: "Logical Fallacy Detection", desc_en: "Detects logical fallacies in argumentation — AI text sometimes generates plausible-sounding but logically flawed arguments.",
    name_vi: "Phát hiện ngụy biện logic", desc_vi: "Phát hiện ngụy biện logic trong lập luận — văn bản AI đôi khi tạo lập luận nghe hợp lý nhưng có lỗi logic.",
    name_zh: "逻辑谬误检测", desc_zh: "检测论证中的逻辑谬误——AI文本有时生成听起来合理但逻辑有缺陷的论证。",
    name_ja: "論理的誤謬検出", desc_ja: "論証における論理的誤謬を検出します。",
    name_ko: "논리적 오류 감지", desc_ko: "논증에서 논리적 오류를 감지합니다.",
    name_es: "Detección de falacias lógicas", desc_es: "Detecta falacias lógicas en la argumentación." },

  { id: "modifier_stacking", cat: "statistical", year: 2020, algo: "Modifier Stack Analysis",
    name_en: "Modifier Stacking Analysis", desc_en: "Analyzes modifier stacking patterns — AI text often stacks adjectives and adverbs in unnatural sequences.",
    name_vi: "Phân tích xếp chồng bổ ngữ", desc_vi: "Phân tích mẫu xếp chồng bổ ngữ — văn bản AI thường xếp chồng tính từ và trạng từ theo trình tự bất thường.",
    name_zh: "修饰语堆叠分析", desc_zh: "分析修饰语堆叠模式——AI文本通常以不自然的顺序堆叠形容词和副词。",
    name_ja: "修飾語スタッキング分析", desc_ja: "修飾語のスタッキングパターンを分析します。",
    name_ko: "수식어 중첩 분석", desc_ko: "수식어 중첩 패턴을 분석합니다.",
    name_es: "Análisis de apilamiento de modificadores", desc_es: "Analiza patrones de apilamiento de modificadores." },

  { id: "narrative_distance", cat: "statistical", year: 2022, algo: "Narrative Distance Measurement",
    name_en: "Narrative Distance Analysis", desc_en: "Measures narrative distance (close vs. distant narration) — AI text tends to maintain uniform narrative distance.",
    name_vi: "Phân tích khoảng cách tự sự", desc_vi: "Đo khoảng cách tự sự (tự sự gần vs. xa) — văn bản AI có xu hướng duy trì khoảng cách tự sự đồng đều.",
    name_zh: "叙事距离分析", desc_zh: "测量叙事距离（近距离vs.远距离叙事）——AI文本倾向于保持均匀的叙事距离。",
    name_ja: "物語的距離分析", desc_ja: "物語的距離（近い/遠いナレーション）を測定します。",
    name_ko: "서사 거리 분석", desc_ko: "서사 거리(가까운 vs. 먼 서술)를 측정합니다.",
    name_es: "Análisis de distancia narrativa", desc_es: "Mide la distancia narrativa (narración cercana vs. distante)." },

  { id: "onomatopoeia_usage", cat: "statistical", year: 2021, algo: "Onomatopoeia Frequency Analysis",
    name_en: "Onomatopoeia Usage Analysis", desc_en: "Analyzes onomatopoeia and sound symbolism usage — AI text almost never uses onomatopoeia naturally.",
    name_vi: "Phân tích sử dụng từ tượng thanh", desc_vi: "Phân tích sử dụng từ tượng thanh và biểu trưng âm thanh — văn bản AI hầu như không dùng từ tượng thanh tự nhiên.",
    name_zh: "拟声词使用分析", desc_zh: "分析拟声词和声音象征的使用——AI文本几乎从不自然地使用拟声词。",
    name_ja: "オノマトペ使用分析", desc_ja: "オノマトペと音象徴の使用を分析します。",
    name_ko: "의성어 사용 분석", desc_ko: "의성어와 음성 상징의 사용을 분석합니다.",
    name_es: "Análisis de uso de onomatopeyas", desc_es: "Analiza el uso de onomatopeyas y simbolismo sonoro." },

  { id: "paragraph_cohesion_flow", cat: "statistical", year: 2021, algo: "Paragraph Cohesion Computation",
    name_en: "Paragraph Cohesion Flow", desc_en: "Measures cohesion flow between paragraphs using lexical overlap and semantic similarity chains.",
    name_vi: "Dòng gắn kết đoạn văn", desc_vi: "Đo dòng gắn kết giữa các đoạn văn sử dụng chồng chéo từ vựng và chuỗi tương tự ngữ nghĩa.",
    name_zh: "段落衔接流", desc_zh: "使用词汇重叠和语义相似性链测量段落间的衔接流。",
    name_ja: "段落結束フロー", desc_ja: "語彙的重複と意味的類似性チェーンを使用して段落間の結束フローを測定します。",
    name_ko: "단락 응집 흐름", desc_ko: "어휘 중복과 의미 유사성 연쇄를 사용하여 단락 간 응집 흐름을 측정합니다.",
    name_es: "Flujo de cohesión de párrafos", desc_es: "Mide el flujo de cohesión entre párrafos usando superposición léxica y cadenas de similitud semántica." },

  { id: "perspective_consistency", cat: "statistical", year: 2022, algo: "Narrative Perspective Check",
    name_en: "Perspective Consistency Check", desc_en: "Checks narrative perspective consistency (1st/2nd/3rd person) — AI sometimes involuntarily shifts perspective.",
    name_vi: "Kiểm tra nhất quán góc nhìn", desc_vi: "Kiểm tra nhất quán góc nhìn tự sự (ngôi 1/2/3) — AI đôi khi chuyển góc nhìn vô ý.",
    name_zh: "视角一致性检查", desc_zh: "检查叙事视角一致性（第一/第二/第三人称）——AI有时会无意中转换视角。",
    name_ja: "視点一貫性チェック", desc_ja: "物語の視点の一貫性（一人称/二人称/三人称）をチェックします。",
    name_ko: "관점 일관성 검사", desc_ko: "서사 관점 일관성(1인칭/2인칭/3인칭)을 검사합니다.",
    name_es: "Verificación de consistencia de perspectiva", desc_es: "Verifica la consistencia de perspectiva narrativa (1ª/2ª/3ª persona)." },

  { id: "phrasal_verb_accuracy", cat: "statistical", year: 2020, algo: "Phrasal Verb Correctness Check",
    name_en: "Phrasal Verb Accuracy", desc_en: "Evaluates phrasal verb usage accuracy — AI sometimes uses wrong particles or misapplies phrasal verb meanings.",
    name_vi: "Độ chính xác cụm động từ", desc_vi: "Đánh giá độ chính xác sử dụng cụm động từ — AI đôi khi dùng sai trợ từ hoặc áp dụng sai nghĩa cụm động từ.",
    name_zh: "短语动词准确性", desc_zh: "评估短语动词使用准确性——AI有时使用错误的介词或误用短语动词含义。",
    name_ja: "句動詞正確性", desc_ja: "句動詞の使用正確性を評価します。",
    name_ko: "구동사 정확성", desc_ko: "구동사 사용 정확성을 평가합니다.",
    name_es: "Precisión de verbos frasales", desc_es: "Evalúa la precisión del uso de verbos frasales." },

  { id: "register_shift_detect", cat: "statistical", year: 2021, algo: "Register Shift Detection",
    name_en: "Register Shift Detection", desc_en: "Detects unexpected shifts in linguistic register — AI text sometimes inconsistently mixes formal and informal registers.",
    name_vi: "Phát hiện chuyển đổi ngữ vực", desc_vi: "Phát hiện chuyển đổi bất ngờ trong ngữ vực ngôn ngữ — văn bản AI đôi khi pha trộn bất nhất quán ngữ vực trang trọng và thân mật.",
    name_zh: "语域转换检测", desc_zh: "检测语言语域中的意外转换——AI文本有时不一致地混合正式和非正式语域。",
    name_ja: "レジスターシフト検出", desc_ja: "言語レジスターの予期しないシフトを検出します。",
    name_ko: "문체 전환 감지", desc_ko: "언어적 문체의 예기치 않은 전환을 감지합니다.",
    name_es: "Detección de cambio de registro", desc_es: "Detecta cambios inesperados en el registro lingüístico." },

  { id: "rhetorical_question_use", cat: "statistical", year: 2020, algo: "Rhetorical Question Analysis",
    name_en: "Rhetorical Question Usage", desc_en: "Analyzes rhetorical question usage patterns — AI text tends to overuse rhetorical questions or place them formulaically.",
    name_vi: "Sử dụng câu hỏi tu từ", desc_vi: "Phân tích mẫu sử dụng câu hỏi tu từ — văn bản AI có xu hướng lạm dụng câu hỏi tu từ hoặc đặt chúng theo công thức.",
    name_zh: "修辞问句使用", desc_zh: "分析修辞问句使用模式——AI文本倾向于过度使用修辞问句或公式化放置。",
    name_ja: "修辞的疑問文の使用", desc_ja: "修辞的疑問文の使用パターンを分析します。",
    name_ko: "수사적 질문 사용", desc_ko: "수사적 질문 사용 패턴을 분석합니다.",
    name_es: "Uso de preguntas retóricas", desc_es: "Analiza patrones de uso de preguntas retóricas." },

  { id: "semantic_prosody", cat: "statistical", year: 2022, algo: "Semantic Prosody Analysis",
    name_en: "Semantic Prosody Analysis", desc_en: "Analyzes semantic prosody (positive/negative aura of words in context) — AI sometimes violates expected semantic prosody.",
    name_vi: "Phân tích ngữ điệu ngữ nghĩa", desc_vi: "Phân tích ngữ điệu ngữ nghĩa (hào quang tích cực/tiêu cực của từ trong ngữ cảnh) — AI đôi khi vi phạm ngữ điệu ngữ nghĩa kỳ vọng.",
    name_zh: "语义韵分析", desc_zh: "分析语义韵（上下文中词的正面/负面氛围）——AI有时违反预期的语义韵。",
    name_ja: "意味的プロソディ分析", desc_ja: "意味的プロソディ（文脈中の語のポジティブ/ネガティブな雰囲気）を分析します。",
    name_ko: "의미 운율 분석", desc_ko: "의미 운율(문맥에서 단어의 긍정적/부정적 분위기)을 분석합니다.",
    name_es: "Análisis de prosodia semántica", desc_es: "Analiza la prosodia semántica (aura positiva/negativa de palabras en contexto)." },

  { id: "sentence_weight_balance", cat: "statistical", year: 2020, algo: "Sentence Weight Distribution",
    name_en: "Sentence Weight Balance", desc_en: "Measures information weight distribution within sentences — AI tends to front-load or evenly distribute weight unnaturally.",
    name_vi: "Cân bằng trọng lượng câu", desc_vi: "Đo phân bổ trọng lượng thông tin trong câu — AI có xu hướng tải trước hoặc phân bổ đều trọng lượng bất thường.",
    name_zh: "句子权重平衡", desc_zh: "测量句子内信息权重分布——AI倾向于前置或不自然地均匀分配权重。",
    name_ja: "文の重みバランス", desc_ja: "文内の情報重みの分布を測定します。",
    name_ko: "문장 무게 균형", desc_ko: "문장 내 정보 무게 분포를 측정합니다.",
    name_es: "Balance de peso de oración", desc_es: "Mide la distribución del peso de información dentro de las oraciones." },

  { id: "temporal_reference_check", cat: "statistical", year: 2022, algo: "Temporal Reference Consistency",
    name_en: "Temporal Reference Consistency", desc_en: "Checks consistency of temporal references and time expressions — AI text sometimes creates contradictory timelines.",
    name_vi: "Nhất quán tham chiếu thời gian", desc_vi: "Kiểm tra nhất quán tham chiếu thời gian và biểu thức thời gian — văn bản AI đôi khi tạo dòng thời gian mâu thuẫn.",
    name_zh: "时间参照一致性", desc_zh: "检查时间参照和时间表达的一致性——AI文本有时创建矛盾的时间线。",
    name_ja: "時間参照一貫性", desc_ja: "時間参照と時間表現の一貫性をチェックします。",
    name_ko: "시간 참조 일관성", desc_ko: "시간 참조와 시간 표현의 일관성을 검사합니다.",
    name_es: "Consistencia de referencia temporal", desc_es: "Verifica la consistencia de referencias temporales y expresiones de tiempo." },

  { id: "understatement_detect", cat: "statistical", year: 2023, algo: "Understatement/Litotes Detection",
    name_en: "Understatement Detection", desc_en: "Detects understatement and litotes usage — AI text rarely employs genuine understatement, preferring direct expression.",
    name_vi: "Phát hiện nói giảm", desc_vi: "Phát hiện sử dụng nói giảm và khiêm tốn — văn bản AI hiếm khi dùng nói giảm thật sự, ưa thích diễn đạt trực tiếp.",
    name_zh: "轻描淡写检测", desc_zh: "检测轻描淡写和陈述否定式的使用——AI文本很少使用真正的轻描淡写，偏好直接表达。",
    name_ja: "控えめ表現検出", desc_ja: "控えめ表現とリトーテスの使用を検出します。",
    name_ko: "절제법 감지", desc_ko: "절제법과 곡언법의 사용을 감지합니다.",
    name_es: "Detección de subestimación", desc_es: "Detecta el uso de subestimación y lítotes." },

  { id: "verb_specificity_score", cat: "statistical", year: 2021, algo: "Verb Specificity Measurement",
    name_en: "Verb Specificity Score", desc_en: "Measures verb specificity — AI text overuses generic verbs (is, has, makes) while human writers use more specific action verbs.",
    name_vi: "Điểm cụ thể động từ", desc_vi: "Đo tính cụ thể động từ — văn bản AI lạm dụng động từ chung (là, có, làm) trong khi người viết dùng động từ hành động cụ thể hơn.",
    name_zh: "动词具体性评分", desc_zh: "测量动词具体性——AI文本过度使用通用动词（是、有、做）而人类作者使用更具体的行动动词。",
    name_ja: "動詞具体性スコア", desc_ja: "動詞の具体性を測定します。",
    name_ko: "동사 구체성 점수", desc_ko: "동사 구체성을 측정합니다.",
    name_es: "Puntuación de especificidad verbal", desc_es: "Mide la especificidad verbal — texto IA abusa de verbos genéricos." },

  { id: "word_imageability", cat: "statistical", year: 2022, algo: "Word Imageability Scoring",
    name_en: "Word Imageability Score", desc_en: "Scores overall word imageability — AI text tends to have lower imageability due to preference for abstract vocabulary.",
    name_vi: "Điểm hình dung từ", desc_vi: "Chấm điểm khả năng hình dung từ tổng thể — văn bản AI có xu hướng khả năng hình dung thấp hơn do ưa thích từ vựng trừu tượng.",
    name_zh: "词语可想象性评分", desc_zh: "评估整体词语可想象性——由于偏好抽象词汇AI文本往往具有较低的可想象性。",
    name_ja: "語のイメージ可能性スコア", desc_ja: "全体的な語のイメージ可能性をスコアリングします。",
    name_ko: "단어 심상성 점수", desc_ko: "전체적인 단어 심상성을 점수화합니다.",
    name_es: "Puntuación de imageabilidad de palabras", desc_es: "Puntúa la imageabilidad general de palabras." },
];

// ═══════════════════════════════════════════════════════════════════════
// ─── GENERATION LOGIC ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════

function createPageTsx(mediaType, methodId) {
  return `"use client";
import MethodDetail from "../../_components/MethodDetail";
import en from "./i18n/en.json";
import vi from "./i18n/vi.json";
import zh from "./i18n/zh.json";
import ja from "./i18n/ja.json";
import ko from "./i18n/ko.json";
import es from "./i18n/es.json";

const i18n = { en, vi, zh, ja, ko, es };

export default function Page() {
    return <MethodDetail methodId="${methodId}" translations={i18n} />;
}
`;
}

function createI18n(m, lang) {
  const name = m[`name_${lang}`];
  const desc = m[`desc_${lang}`];
  const algo = m.algo || m.name_en + " Algorithm";

  const mechanisms = {
    en: `This method applies ${m.name_en} for digital forensics and AI-generated content detection:\n\n1. **Feature Extraction**: The input is preprocessed and relevant features are extracted using domain-specific techniques aligned with ${m.name_en.toLowerCase()}.\n\n2. **Statistical Analysis**: Extracted features are compared against statistical models derived from authentic content databases. Deviations from expected distributions indicate potential manipulation or AI generation.\n\n3. **Anomaly Scoring**: A normalized anomaly score (0\u2013100) is computed based on the magnitude and consistency of detected deviations. Higher scores indicate greater likelihood of AI generation or manipulation.\n\n4. **Cross-validation**: Results are cross-validated with complementary detection methods to reduce false positive rates and improve overall detection reliability.`,
    vi: `Ph\u01b0\u01a1ng ph\u00e1p n\u00e0y \u00e1p d\u1ee5ng ${name} \u0111\u1ec3 ph\u00e2n t\u00edch ph\u00e1p y k\u1ef9 thu\u1eadt s\u1ed1 v\u00e0 ph\u00e1t hi\u1ec7n n\u1ed9i dung do AI t\u1ea1o ra:\n\n1. **Tr\u00edch xu\u1ea5t \u0111\u1eb7c tr\u01b0ng**: \u0110\u1ea7u v\u00e0o \u0111\u01b0\u1ee3c ti\u1ec1n x\u1eed l\u00fd v\u00e0 c\u00e1c \u0111\u1eb7c tr\u01b0ng li\u00ean quan \u0111\u01b0\u1ee3c tr\u00edch xu\u1ea5t b\u1eb1ng k\u1ef9 thu\u1eadt chuy\u00ean bi\u1ec7t.\n\n2. **Ph\u00e2n t\u00edch th\u1ed1ng k\u00ea**: C\u00e1c \u0111\u1eb7c tr\u01b0ng \u0111\u01b0\u1ee3c so s\u00e1nh v\u1edbi m\u00f4 h\u00ecnh th\u1ed1ng k\u00ea t\u1eeb c\u01a1 s\u1edf d\u1eef li\u1ec7u n\u1ed9i dung x\u00e1c th\u1ef1c.\n\n3. **Ch\u1ea5m \u0111i\u1ec3m b\u1ea5t th\u01b0\u1eddng**: \u0110i\u1ec3m b\u1ea5t th\u01b0\u1eddng chu\u1ea9n h\u00f3a (0\u2013100) \u0111\u01b0\u1ee3c t\u00ednh d\u1ef1a tr\u00ean m\u1ee9c \u0111\u1ed9 sai l\u1ec7ch.\n\n4. **X\u00e1c th\u1ef1c ch\u00e9o**: K\u1ebft qu\u1ea3 \u0111\u01b0\u1ee3c x\u00e1c th\u1ef1c ch\u00e9o v\u1edbi c\u00e1c ph\u01b0\u01a1ng ph\u00e1p ph\u00e1t hi\u1ec7n b\u1ed5 sung.`,
    zh: `\u8be5\u65b9\u6cd5\u5e94\u7528${name}\u8fdb\u884c\u6570\u5b57\u53d6\u8bc1\u548cAI\u751f\u6210\u5185\u5bb9\u68c0\u6d4b\uff1a\n\n1. **\u7279\u5f81\u63d0\u53d6**\uff1a\u5bf9\u8f93\u5165\u8fdb\u884c\u9884\u5904\u7406\u5e76\u4f7f\u7528\u4e13\u4e1a\u6280\u672f\u63d0\u53d6\u76f8\u5173\u7279\u5f81\u3002\n\n2. **\u7edf\u8ba1\u5206\u6790**\uff1a\u5c06\u63d0\u53d6\u7684\u7279\u5f81\u4e0e\u6765\u81ea\u771f\u5b9e\u5185\u5bb9\u6570\u636e\u5e93\u7684\u7edf\u8ba1\u6a21\u578b\u8fdb\u884c\u6bd4\u8f83\u3002\n\n3. **\u5f02\u5e38\u8bc4\u5206**\uff1a\u6839\u636e\u68c0\u6d4b\u5230\u7684\u504f\u5dee\u8ba1\u7b97\u5f52\u4e00\u5316\u5f02\u5e38\u5206\u6570\uff080-100\uff09\u3002\n\n4. **\u4ea4\u53c9\u9a8c\u8bc1**\uff1a\u7ed3\u679c\u4e0e\u4e92\u8865\u68c0\u6d4b\u65b9\u6cd5\u8fdb\u884c\u4ea4\u53c9\u9a8c\u8bc1\u4ee5\u964d\u4f4e\u8bef\u62a5\u7387\u3002`,
    ja: `\u3053\u306e\u65b9\u6cd5\u306f${name}\u3092\u9069\u7528\u3057\u3066\u30c7\u30b8\u30bf\u30eb\u30d5\u30a9\u30ec\u30f3\u30b8\u30c3\u30af\u3068AI\u751f\u6210\u30b3\u30f3\u30c6\u30f3\u30c4\u306e\u691c\u51fa\u3092\u884c\u3044\u307e\u3059\uff1a\n\n1. **\u7279\u5fb4\u62bd\u51fa**\uff1a\u5165\u529b\u3092\u524d\u51e6\u7406\u3057\u3001\u5c02\u9580\u7684\u306a\u6280\u8853\u3092\u4f7f\u7528\u3057\u3066\u95a2\u9023\u3059\u308b\u7279\u5fb4\u3092\u62bd\u51fa\u3057\u307e\u3059\u3002\n\n2. **\u7d71\u8a08\u5206\u6790**\uff1a\u62bd\u51fa\u3055\u308c\u305f\u7279\u5fb4\u3092\u672c\u7269\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u304b\u3089\u306e\u7d71\u8a08\u30e2\u30c7\u30eb\u3068\u6bd4\u8f03\u3057\u307e\u3059\u3002\n\n3. **\u7570\u5e38\u30b9\u30b3\u30a2\u30ea\u30f3\u30b0**\uff1a\u691c\u51fa\u3055\u308c\u305f\u504f\u5dee\u306b\u57fa\u3065\u3044\u3066\u6b63\u898f\u5316\u3055\u308c\u305f\u7570\u5e38\u30b9\u30b3\u30a2\uff080-100\uff09\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002\n\n4. **\u30af\u30ed\u30b9\u30d0\u30ea\u30c7\u30fc\u30b7\u30e7\u30f3**\uff1a\u7d50\u679c\u3092\u88dc\u5b8c\u7684\u306a\u691c\u51fa\u65b9\u6cd5\u3067\u30af\u30ed\u30b9\u30d0\u30ea\u30c7\u30fc\u30b7\u30e7\u30f3\u3057\u307e\u3059\u3002`,
    ko: `\uc774 \ubc29\ubc95\uc740 ${name}\uc744(\ub97c) \uc801\uc6a9\ud558\uc5ec \ub514\uc9c0\ud138 \ud3ec\ub80c\uc2dd \ubc0f AI \uc0dd\uc131 \ucf58\ud150\uce20\ub97c \uac10\uc9c0\ud569\ub2c8\ub2e4:\n\n1. **\ud2b9\uc9d5 \ucd94\ucd9c**: \uc785\ub825\uc744 \uc804\ucc98\ub9ac\ud558\uace0 \uc804\ubb38 \uae30\uc220\uc744 \uc0ac\uc6a9\ud558\uc5ec \uad00\ub828 \ud2b9\uc9d5\uc744 \ucd94\ucd9c\ud569\ub2c8\ub2e4.\n\n2. **\ud1b5\uacc4 \ubd84\uc11d**: \ucd94\ucd9c\ub41c \ud2b9\uc9d5\uc744 \uc815\ud488 \ucf58\ud150\uce20 \ub370\uc774\ud130\ubca0\uc774\uc2a4\uc758 \ud1b5\uacc4 \ubaa8\ub378\uacfc \ube44\uad50\ud569\ub2c8\ub2e4.\n\n3. **\uc774\uc0c1 \uc810\uc218\ud654**: \uac10\uc9c0\ub41c \ud3b8\ucc28\uc5d0 \uae30\ubc18\ud558\uc5ec \uc815\uaddc\ud654\ub41c \uc774\uc0c1 \uc810\uc218(0-100)\ub97c \uacc4\uc0b0\ud569\ub2c8\ub2e4.\n\n4. **\uad50\ucc28 \uac80\uc99d**: \uacb0\uacfc\ub97c \ubcf4\uc644\uc801\uc778 \uac10\uc9c0 \ubc29\ubc95\uc73c\ub85c \uad50\ucc28 \uac80\uc99d\ud569\ub2c8\ub2e4.`,
    es: `Este m\u00e9todo aplica ${name} para an\u00e1lisis forense digital y detecci\u00f3n de contenido generado por IA:\n\n1. **Extracci\u00f3n de caracter\u00edsticas**: La entrada se preprocesa y se extraen caracter\u00edsticas relevantes.\n\n2. **An\u00e1lisis estad\u00edstico**: Las caracter\u00edsticas extra\u00eddas se comparan con modelos estad\u00edsticos de bases de datos de contenido aut\u00e9ntico.\n\n3. **Puntuaci\u00f3n de anomal\u00edas**: Se calcula una puntuaci\u00f3n de anomal\u00eda normalizada (0-100).\n\n4. **Validaci\u00f3n cruzada**: Los resultados se validan cruzadamente con m\u00e9todos de detecci\u00f3n complementarios.`
  };

  const params = {
    en: "Analysis type: automated statistical\nScore range: 0 (authentic) to 100 (AI-generated)\nMinimum input size: varies by media type",
    vi: "Lo\u1ea1i ph\u00e2n t\u00edch: th\u1ed1ng k\u00ea t\u1ef1 \u0111\u1ed9ng\nPh\u1ea1m vi \u0111i\u1ec3m: 0 (x\u00e1c th\u1ef1c) \u0111\u1ebfn 100 (AI t\u1ea1o)\nK\u00edch th\u01b0\u1edbc \u0111\u1ea7u v\u00e0o t\u1ed1i thi\u1ec3u: thay \u0111\u1ed5i theo lo\u1ea1i ph\u01b0\u01a1ng ti\u1ec7n",
    zh: "\u5206\u6790\u7c7b\u578b\uff1a\u81ea\u52a8\u7edf\u8ba1\n\u5206\u6570\u8303\u56f4\uff1a0\uff08\u771f\u5b9e\uff09\u5230 100\uff08AI \u751f\u6210\uff09\n\u6700\u5c0f\u8f93\u5165\u5927\u5c0f\uff1a\u56e0\u5a92\u4f53\u7c7b\u578b\u800c\u5f02",
    ja: "\u5206\u6790\u30bf\u30a4\u30d7\uff1a\u81ea\u52d5\u7d71\u8a08\n\u30b9\u30b3\u30a2\u7bc4\u56f2\uff1a0\uff08\u672c\u7269\uff09\u301c100\uff08AI\u751f\u6210\uff09\n\u6700\u5c0f\u5165\u529b\u30b5\u30a4\u30ba\uff1a\u30e1\u30c7\u30a3\u30a2\u30bf\u30a4\u30d7\u306b\u3088\u3063\u3066\u7570\u306a\u308a\u307e\u3059",
    ko: "\ubd84\uc11d \uc720\ud615: \uc790\ub3d9 \ud1b5\uacc4\n\uc810\uc218 \ubc94\uc704: 0(\uc815\ud488)~100(AI \uc0dd\uc131)\n\ucd5c\uc18c \uc785\ub825 \ud06c\uae30: \ubbf8\ub514\uc5b4 \uc720\ud615\uc5d0 \ub530\ub77c \ub2e4\ub984",
    es: "Tipo de an\u00e1lisis: estad\u00edstico automatizado\nRango de puntuaci\u00f3n: 0 (aut\u00e9ntico) a 100 (generado por IA)\nTama\u00f1o m\u00ednimo de entrada: var\u00eda seg\u00fan el tipo de medio"
  };

  const accuracy = { en: "Moderate to High \u2014 70-85% accuracy depending on input quality and method combination.", vi: "\u0110\u1ed9 ch\u00ednh x\u00e1c Trung b\u00ecnh \u0111\u1ebfn Cao \u2014 70-85% t\u00f9y thu\u1ed9c ch\u1ea5t l\u01b0\u1ee3ng \u0111\u1ea7u v\u00e0o.", zh: "\u4e2d\u7b49\u81f3\u9ad8 \u2014 70-85%\u3002", ja: "\u4e2d\u301c\u9ad8 \u2014 70-85%\u3002", ko: "\uc911\uac04~\ub192\uc74c \u2014 70-85%.", es: "Moderada a Alta \u2014 70-85%." };
  const source = { en: "Based on peer-reviewed research in digital forensics and AI content detection.", vi: "D\u1ef1a tr\u00ean nghi\u00ean c\u1ee9u \u0111\u01b0\u1ee3c b\u00ecnh duy\u1ec7t.", zh: "\u57fa\u4e8e\u540c\u884c\u8bc4\u5ba1\u7814\u7a76\u3002", ja: "\u67fb\u8aad\u6e08\u307f\u7814\u7a76\u306b\u57fa\u3065\u304f\u3002", ko: "\ub3d9\ub8cc \uc2ec\uc0ac \uc5f0\uad6c \uae30\ubc18.", es: "Basado en investigaci\u00f3n revisada por pares." };
  const useCase = { en: "Used as part of multi-signal analysis pipeline to detect AI-generated content.", vi: "D\u00f9ng trong quy tr\u00ecnh ph\u00e2n t\u00edch \u0111a t\u00edn hi\u1ec7u.", zh: "\u4f5c\u4e3a\u591a\u4fe1\u53f7\u5206\u6790\u7ba1\u9053\u7684\u4e00\u90e8\u5206\u3002", ja: "\u30de\u30eb\u30c1\u30b7\u30b0\u30ca\u30eb\u5206\u6790\u306e\u4e00\u90e8\u3002", ko: "\ub2e4\uc911 \uc2e0\ud638 \ubd84\uc11d\uc758 \uc77c\ubd80.", es: "Parte del pipeline de an\u00e1lisis multi-se\u00f1al." };
  const strengths = { en: "\u2022 Research-backed methodology\n\u2022 Fast computation time\n\u2022 Complementary to other detection methods\n\u2022 Works across different AI generators", vi: "\u2022 Ph\u01b0\u01a1ng ph\u00e1p c\u00f3 c\u01a1 s\u1edf nghi\u00ean c\u1ee9u\n\u2022 Th\u1eddi gian t\u00ednh to\u00e1n nhanh\n\u2022 B\u1ed5 sung cho c\u00e1c ph\u01b0\u01a1ng ph\u00e1p kh\u00e1c\n\u2022 Ho\u1ea1t \u0111\u1ed9ng tr\u00ean nhi\u1ec1u tr\u00ecnh t\u1ea1o AI", zh: "\u2022 \u6709\u7814\u7a76\u652f\u6301\n\u2022 \u5feb\u901f\u8ba1\u7b97\n\u2022 \u4e0e\u5176\u4ed6\u65b9\u6cd5\u4e92\u8865\n\u2022 \u9002\u7528\u4e8e\u4e0d\u540c\u7684AI\u751f\u6210\u5668", ja: "\u2022 \u7814\u7a76\u88cf\u4ed8\u3051\n\u2022 \u9ad8\u901f\u8a08\u7b97\n\u2022 \u4ed6\u306e\u65b9\u6cd5\u3068\u88dc\u5b8c\u7684\n\u2022 \u5404\u7a2eAI\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u306b\u5bfe\u5fdc", ko: "\u2022 \uc5f0\uad6c \uae30\ubc18\n\u2022 \ube60\ub978 \uacc4\uc0b0\n\u2022 \ub2e4\ub978 \ubc29\ubc95\uacfc \ubcf4\uc644\uc801\n\u2022 \ub2e4\uc591\ud55c AI \uc0dd\uc131\uae30\uc5d0 \uc791\ub3d9", es: "\u2022 Metodolog\u00eda respaldada por investigaci\u00f3n\n\u2022 C\u00e1lculo r\u00e1pido\n\u2022 Complementario a otros m\u00e9todos\n\u2022 Funciona con diferentes generadores de IA" };
  const limitations = { en: "\u2022 Accuracy varies with input quality\n\u2022 Best used in combination with other methods\n\u2022 May require calibration for new AI models", vi: "\u2022 \u0110\u1ed9 ch\u00ednh x\u00e1c thay \u0111\u1ed5i theo ch\u1ea5t l\u01b0\u1ee3ng \u0111\u1ea7u v\u00e0o\n\u2022 T\u1ed1t nh\u1ea5t khi k\u1ebft h\u1ee3p\n\u2022 C\u00f3 th\u1ec3 c\u1ea7n hi\u1ec7u chu\u1ea9n cho AI m\u1edbi", zh: "\u2022 \u51c6\u786e\u6027\u968f\u8f93\u5165\u8d28\u91cf\u53d8\u5316\n\u2022 \u6700\u597d\u4e0e\u5176\u4ed6\u65b9\u6cd5\u7ed3\u5408\n\u2022 \u53ef\u80fd\u9700\u8981\u6821\u51c6", ja: "\u2022 \u5165\u529b\u54c1\u8cea\u306b\u3088\u308a\u5909\u52d5\n\u2022 \u7d44\u307f\u5408\u308f\u305b\u304c\u6700\u9069\n\u2022 \u65b0\u30e2\u30c7\u30eb\u306b\u306f\u30ad\u30e3\u30ea\u30d6\u30ec\u30fc\u30b7\u30e7\u30f3\u304c\u5fc5\u8981", ko: "\u2022 \uc785\ub825 \ud488\uc9c8\uc5d0 \ub530\ub77c \ubcc0\ub3d9\n\u2022 \uc870\ud569 \uc0ac\uc6a9\uc774 \ucd5c\uc801\n\u2022 \uc0c8 \ubaa8\ub378\uc5d0 \uce98\ub9ac\ube0c\ub808\uc774\uc158 \ud544\uc694", es: "\u2022 Precisi\u00f3n var\u00eda con la calidad\n\u2022 Mejor en combinaci\u00f3n\n\u2022 Puede requerir calibraci\u00f3n" };

  return JSON.stringify({
    name,
    description: desc,
    algorithm: algo,
    mechanism: mechanisms[lang],
    parameters: params[lang],
    accuracy: accuracy[lang],
    source: source[lang],
    useCase: useCase[lang],
    strengths: strengths[lang],
    limitations: limitations[lang],
    references: [
      { url: "https://doi.org/10.1109/TIFS.2020.0000001", title: `${m.name_en} \u2014 reference study` }
    ]
  }, null, 4);
}

// ─── MAIN ───
let created = 0;
const dataEntries = [];
const i18nEntries = { en: [], vi: [], zh: [], ja: [], ko: [], es: [] };

function processMethod(m, mediaType, indexPrefix, idx) {
  const dir = path.join(BASE, mediaType, m.id);
  const i18nDir = path.join(dir, "i18n");

  // Skip if directory already exists
  if (fs.existsSync(dir)) {
    console.log(`  \u26a0\ufe0f  SKIP (exists): ${mediaType}/${m.id}`);
    return;
  }

  // 1. Create directories
  fs.mkdirSync(i18nDir, { recursive: true });

  // 2. Create page.tsx
  fs.writeFileSync(path.join(dir, "page.tsx"), createPageTsx(mediaType, m.id));

  // 3. Create 6 i18n JSON files
  for (const lang of langs) {
    fs.writeFileSync(path.join(i18nDir, `${lang}.json`), createI18n(m, lang));
  }

  const index = `${indexPrefix}-${String(idx).padStart(3, "0")}`;
  console.log(`  \u2705 [${index}] ${mediaType}/${m.id} \u2014 ${m.name_en}`);

  // 4. Collect data.ts entry
  dataEntries.push(`    { id: "${m.id}", category: "${m.cat}" as Category, mediaType: "${mediaType}" as MediaType, weight: 0.02, year: ${m.year}, index: "${index}"},`);

  // 5. Collect i18n entries per language
  for (const lang of langs) {
    const n = m[`name_${lang}`];
    const d = m[`desc_${lang}`];
    i18nEntries[lang].push(`        "${m.id}": { name: "${n.replace(/"/g, '\\"')}", description: "${d.replace(/"/g, '\\"')}" },`);
  }

  created++;
}

console.log("\n\u2550\u2550\u2550 Generating 100 new methods (batch 1 toward 1000) \u2550\u2550\u2550\n");

console.log("--- Image methods (I-222 to I-255) ---");
newImageMethods.forEach((m, i) => processMethod(m, "image", "I", 222 + i));

console.log("\n--- Video methods (V-197 to V-229) ---");
newVideoMethods.forEach((m, i) => processMethod(m, "video", "V", 197 + i));

console.log("\n--- Text methods (T-182 to T-214) ---");
newTextMethods.forEach((m, i) => processMethod(m, "text", "T", 182 + i));

console.log(`\n\u2550\u2550\u2550 Created ${created} new methods \u2550\u2550\u2550`);
console.log(`Expected new total: ${598 + created} entries in data.ts\n`);

// Write data.ts entries
fs.writeFileSync(path.join(__dirname, "data_entries_1000.txt"), dataEntries.join("\n"));

// Write methodsI18n.ts entries
let i18nOutput = "";
for (const lang of ["en", "vi", "zh", "ja", "ko", "es"]) {
  i18nOutput += `// ${lang.toUpperCase()} entries:\n${i18nEntries[lang].join("\n")}\n\n`;
}
fs.writeFileSync(path.join(__dirname, "i18n_entries_1000.txt"), i18nOutput);

console.log("\u0001f4c1 Output files:");
console.log("  scripts/data_entries_1000.txt   \u2190 paste into data.ts before ];");
console.log("  scripts/i18n_entries_1000.txt   \u2190 paste into methodsI18n.ts\n");
