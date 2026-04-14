// Batch translate untranslated "name" fields for es, ja, ko, zh
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');

// Translation dictionaries for method names
// Format: { "method/path": { es: "...", ja: "...", ko: "...", zh: "..." } }
const NAME_TRANSLATIONS = {
  // === IMAGE METHODS ===
  "image/anti_aliasing": { es: "Consistencia de Anti-Aliasing" },
  "image/census_transform": { zh: "Census变换微纹理分析" },
  "image/color_coherence": { es: "Vector de Coherencia de Color (CCV)" },
  "image/color_profile_meta": { es: "Huella de Perfil de Color ICC y Metadatos" },
  "image/contourlet_analysis": {
    es: "Topografía Micro-Geométrica de Bordes (Análisis Contourlet)",
    ja: "コンターレット変換解析 (Contourlet Analysis)",
    ko: "컨투어렛 변환 분석 (Contourlet Analysis)",
    zh: "轮廓波变换分析 (Contourlet Analysis)"
  },
  "image/convolutional_trace": {
    es: "Traza Convolucional Neuronal (Artefactos de Tablero)",
    ja: "ニューラル畳み込みトレース解析",
    ko: "신경 합성곱 트레이스 분석",
    zh: "神经卷积痕迹分析 (棋盘格伪影)"
  },
  "image/cooc_entropy": {
    es: "Matriz de Entropía de Co-ocurrencia de Píxeles (GLCM)",
    ja: "共起ピクセルエントロピーマトリクス (GLCM)",
    ko: "공기 픽셀 엔트로피 행렬 (GLCM)",
    zh: "共生像素熵矩阵 (GLCM)"
  },
  "image/copydays": { es: "Rastreo de Origen Clonado (Copy-Move)" },
  "image/copymove": { es: "Detección de Copia-Movimiento" },
  "image/curvelet_transform": {
    es: "Rastreador de Curvatura Orgánica (Transformada Curvelet)",
    ja: "カーブレット変換解析",
    ko: "커브렛 변환 분석 (Curvelet Transform)",
    zh: "曲波变换分析 (Curvelet Transform)"
  },
  "image/dct": { es: "Huella de Cuantización DCT" },
  "image/dct_energy_compact": {
    es: "Compactación de Energía DCT Cuántica",
    ja: "DCTエネルギーコンパクション解析",
    ko: "DCT 에너지 컴팩션 분석",
    zh: "DCT能量压缩分析"
  },
  "image/depth_map_consistency": {
    es: "Inconsistencia del Mapa de Profundidad Z Espacial",
    ja: "空間深度マップ不整合解析",
    ko: "공간 Z-깊이 맵 불일치 분석",
    zh: "空间Z-深度图不一致性分析"
  },
  "image/difference_histogram": {
    es: "Histograma de Diferencia de Remuestreo",
    ja: "リサンプリング差分ヒストグラム解析",
    ko: "리샘플링 차이 히스토그램 분석",
    zh: "重采样差异直方图分析"
  },
  "image/diffusion": { es: "Firma de Difusión Algorítmica" },
  "image/discrete_cosine_energy": {
    es: "Energía Coseno Morfológica Global (Energía DC)",
    ja: "離散コサインエネルギー解析 (DCエネルギー)",
    ko: "이산 코사인 에너지 분석 (DC Energy)",
    zh: "全局形态余弦能量分析 (DC Energy)"
  },
  "image/dynamic_range": {
    es: "Velo de Rango Dinámico Óptico (Conflicto de Sensor)",
    ja: "光学ダイナミックレンジ解析",
    ko: "광학 다이내믹 레인지 분석",
    zh: "光学动态范围分析 (传感器冲突)"
  },
  "image/edge": { es: "Topografía de Ruptura de Borde Óptico" },
  "image/ela": { es: "Anomalía de Nivel de Error Visual (ELA)" },
  "image/entropy": { es: "Radar de Disrupción de Entropía de Shannon" },
  "image/flat_region_ratio": {
    es: "Ratio de Vacío de Región Plana Sintética",
    ja: "合成フラット領域空洞率解析",
    ko: "합성 평탄 영역 비율 분석",
    zh: "合成平坦区域空洞比分析"
  },
  "image/gabor_energy": {
    es: "Radar de Energía Gabor Direccional",
    ja: "方向性ガボールエネルギーレーダー解析",
    ko: "방향성 가보르 에너지 레이더 분석",
    zh: "定向Gabor能量雷达分析"
  },
  "image/gabor_phase": {
    es: "Guillotina de Desplazamiento de Fase Gabor",
    ja: "ガボール位相シフト解析",
    ko: "가보르 위상 시프트 분석",
    zh: "Gabor相位偏移分析"
  },
  "image/gabor_response": { es: "Martillo de Sensibilidad de Textura (Respuesta Gabor)" },
  "image/gabor_wavelet_bank": {
    es: "Banco de Wavelets Gabor Omnidireccional",
    ja: "全方向ガボールウェーブレットバンク解析",
    ko: "전방향 가보르 웨이블릿 뱅크 분석",
    zh: "全方向Gabor小波组分析"
  },
  "image/gamma_distortion": {
    es: "Ejecutor de Distorsión Gamma Fotónica",
    ja: "ガンマ歪み解析",
    ko: "감마 왜곡 분석",
    zh: "光子伽马畸变分析"
  },
  "image/gan_fingerprint": { es: "Atribuidor Biométrico Neuronal (Huella GAN)" },
  "image/grad_orient_hist": {
    es: "Radar de Anomalía HOG Vectorial (Gradientes Orientados)",
    ja: "方向勾配ヒストグラム異常レーダー (HOG)",
    ko: "방향 경사 히스토그램 이상 레이더 (HOG)",
    zh: "方向梯度直方图异常雷达 (HOG)"
  },
  "image/gradient": { es: "Pendiente de Continuidad de Gradiente Fotónico" },
  "image/gradient_divergence": {
    es: "Extracción de Sumidero Fotónico Divergente",
    ja: "勾配発散抽出解析",
    ko: "기울기 발산 추출 분석",
    zh: "梯度散度提取分析"
  },
  "image/gradient_magnitude": {
    es: "Extremo de Velocidad-Carga Fotónica Absoluta",
    ja: "勾配大きさ分布解析",
    ko: "기울기 크기 분포 분석",
    zh: "梯度幅值分布分析"
  },
  "image/gradient_weighted_cam": {
    es: "Núcleo de Atención Termonuclear Grad-CAM",
    ja: "Grad-CAMアテンションコア解析",
    ko: "Grad-CAM 어텐션 코어 분석",
    zh: "Grad-CAM热核注意力核心分析"
  },
  "image/harris_corner": {
    es: "Radar de Ápice Blindado Geométrico (Harris Corner)",
    ja: "ハリスコーナー検出解析",
    ko: "해리스 코너 검출 분석",
    zh: "Harris角点检测分析"
  },
  "image/hessian_matrix": {
    es: "Escáner de Sutura Vascular Multidimensional Hessiano",
    ja: "ヘッセ行列多次元解析",
    ko: "헤시안 행렬 다차원 분석",
    zh: "Hessian矩阵多维分析"
  },
  "image/histogram": { es: "Disección de Estructura de Intensidad Fotónica (Varianza de Histograma)" },
  "image/hot_pixel": {
    ja: "ホットピクセル検出",
    ko: "핫 픽셀 검출",
    zh: "热像素检测"
  },
  "image/hue_consistency": {
    ja: "色相一貫性解析",
    ko: "색조 일관성 분석",
    zh: "色调一致性分析"
  },
  "image/image_complexity": {
    ja: "画像複雑度解析",
    ko: "이미지 복잡도 분석",
    zh: "图像复杂度分析"
  },
  "image/intensity_kurtosis": {
    ja: "強度尖度解析",
    ko: "강도 첨도 분석",
    zh: "强度峰度分析"
  },
  "image/jpeg_coefficient": {
    ja: "JPEG係数解析",
    ko: "JPEG 계수 분석",
    zh: "JPEG系数分析"
  },
  "image/jpeg_ghost": { es: "Análisis de Fantasma JPEG" },
  "image/kirsch_edge": {
    es: "Respuesta de Borde Kirsch",
    ja: "カーシュエッジ応答解析",
    ko: "키르슈 엣지 응답 분석",
    zh: "Kirsch边缘响应分析"
  },
  "image/laplacian_edge": { es: "Nitidez de Borde Laplaciano" },
  "image/laplacian_pyramid": {
    ja: "ラプラシアンピラミッド残差解析",
    ko: "라플라시안 피라미드 잔차 분석",
    zh: "拉普拉斯金字塔残差分析"
  },
  "image/laplacian_variance": {
    es: "Varianza Laplaciana",
    ja: "ラプラシアン分散解析",
    ko: "라플라시안 분산 분석",
    zh: "拉普拉斯方差分析"
  },
  "image/laws_texture_e": {
    ja: "Lawsテクスチャエネルギー解析",
    ko: "Laws 텍스처 에너지 분석",
    zh: "Laws纹理能量分析"
  },
  "image/lens_distortion_img": {
    ja: "レンズ歪み解析",
    ko: "렌즈 왜곡 분석",
    zh: "镜头畸变分析"
  },
  "image/linear_pattern": {
    ja: "線形パターン検出",
    ko: "선형 패턴 검출",
    zh: "线性图案检测"
  },
  "image/local_variance_map": { es: "Mapa de Varianza Local" },
  "image/log_gabor_filter": {
    es: "Análisis de Filtro Log-Gabor",
    ja: "対数ガボールフィルター解析",
    ko: "로그 가보르 필터 분석",
    zh: "Log-Gabor滤波器分析"
  },
  "image/luma_gradient_angle": {
    ja: "輝度勾配角度解析",
    ko: "휘도 기울기 각도 분석",
    zh: "亮度梯度角度分析"
  },
  "image/maximal_grad_flow": {
    ja: "最大勾配フロー解析",
    ko: "최대 기울기 흐름 분석",
    zh: "最大梯度流分析"
  },
  "image/mean_shift_cluster": {
    es: "Agrupamiento por Desplazamiento Medio",
    ja: "平均シフトクラスタリング解析",
    ko: "평균 시프트 클러스터링 분석",
    zh: "均值漂移聚类分析"
  },
  "image/metadata": { es: "Análisis de Metadatos" },
  "image/micro_texture": {
    ja: "マイクロテクスチャ解析",
    ko: "미세 질감 분석",
    zh: "微纹理分析"
  },
  "image/mid_freq_energy": {
    ja: "中周波エネルギー解析",
    ko: "중간 주파수 에너지 분석",
    zh: "中频能量分析"
  },
  "image/moment_invariants": {
    es: "Invariantes de Momento Hu",
    ja: "Huモーメント不変量解析",
    ko: "Hu 모멘트 불변량 분석",
    zh: "Hu矩不变量分析"
  },
  "image/multiscale_entropy": {
    ja: "マルチスケールエントロピー解析",
    ko: "다중 스케일 엔트로피 분석",
    zh: "多尺度熵分析"
  },
  "image/niqe_score": {
    ja: "NIQE品質スコア解析",
    ko: "NIQE 품질 점수 분석",
    zh: "NIQE质量评分分析"
  },
  "image/noise": { es: "Análisis de Residuos de Ruido" },
  "image/noise_floor_level": {
    es: "Nivel de Piso de Ruido",
    ja: "ノイズフロアレベル解析",
    ko: "잡음 바닥 수준 분석",
    zh: "噪声底限水平分析"
  },
  "image/noise_granularity": {
    es: "Granularidad de Ruido",
    ja: "ノイズ粒度解析",
    ko: "잡음 입자도 분석",
    zh: "噪声颗粒度分析"
  },
  "image/noiseprint": { es: "Análisis de Huella de Ruido" },
  "image/patch_similarity": {
    es: "Matriz de Similitud de Parches",
    ja: "パッチ類似度マトリクス解析",
    ko: "패치 유사도 행렬 분석",
    zh: "图块相似度矩阵分析"
  },
  "image/patchforensics": { es: "Forense Basado en Parches (CNN)" },
  "image/phase_congruency": { es: "Congruencia de Fase" },
  "image/pixel_bit_plane": {
    ja: "ピクセルビットプレーン解析",
    ko: "픽셀 비트 평면 분석",
    zh: "像素位平面分析"
  },
  "image/pixel_value_diff": {
    ja: "ピクセル値差分解析",
    ko: "픽셀 값 차분 분석",
    zh: "像素值差分分析"
  },
  "image/posterization": {
    ja: "ポスタリゼーション検出",
    ko: "포스터화 검출",
    zh: "色调分离检测"
  },
  "image/power_spectral_density": { es: "Densidad Espectral de Potencia" },
  "image/prnu": { es: "Ruido de Patrón del Sensor (PRNU)" },
  "image/reconstruction": { es: "Reconstrucción Multi-escala" },
  "image/resnet_classifier": { es: "Clasificador Binario ResNet" },
  "image/rgb_correlation": {
    ja: "RGB相関解析",
    ko: "RGB 상관 분석",
    zh: "RGB相关性分析"
  },
  "image/richardson_lucy": {
    ja: "Richardson-Lucyデコンボリューション解析",
    ko: "Richardson-Lucy 디컨볼루션 분석",
    zh: "Richardson-Lucy去卷积分析"
  },
  "image/run_length_matrix": {
    es: "Análisis de Matriz de Longitud de Ejecución",
    ja: "ランレングスマトリクス解析",
    ko: "런 길이 행렬 분석",
    zh: "游程长度矩阵分析"
  },
  "image/scharr_gradient": { es: "Gradiente Scharr" },
  "image/second_order_grad": {
    es: "Gradiente de Segundo Orden",
    ja: "二次勾配解析",
    ko: "2차 기울기 분석",
    zh: "二阶梯度分析"
  },
  "image/shearlet_analysis": {
    ja: "シアーレット変換解析",
    ko: "시어렛 변환 분석",
    zh: "剪切波变换分析"
  },
  "image/sift_forensics": { es: "Forense de Puntos Clave SIFT" },
  "image/skin_texture_freq": {
    es: "Frecuencia de Textura de Piel",
    ja: "皮膚テクスチャ周波数解析",
    ko: "피부 질감 주파수 분석",
    zh: "皮肤纹理频率分析"
  },
  "image/sobel_magnitude": {
    es: "Distribución de Magnitud Sobel",
    ja: "ソーベルフィルター大きさ分布解析",
    ko: "소벨 크기 분포 분석",
    zh: "Sobel幅值分布分析"
  },
  "image/sparse_representation": {
    ja: "スパース表現解析",
    ko: "희소 표현 분석",
    zh: "稀疏表示分析"
  },
  "image/spatial_coherence": {
    ja: "空間コヒーレンス解析",
    ko: "공간 일관성 분석",
    zh: "空间相干性分析"
  },
  "image/spatial_rich_model": {
    es: "Modelo Enriquecido Espacial (SRM)",
    ja: "空間リッチモデル (SRM) 解析",
    ko: "공간 리치 모델 (SRM) 분석",
    zh: "空间丰富模型 (SRM) 分析"
  },
  "image/spectral": { es: "Análisis Espectral de Nyquist" },
  "image/spectral_decay": {
    es: "Tasa de Decaimiento Espectral",
    ja: "スペクトル減衰率解析",
    ko: "스펙트럼 감쇠율 분석",
    zh: "频谱衰减率分析"
  },
  "image/splicing": { es: "Detección de Empalme" },
  "image/ssim_map": {
    ja: "SSIMマップ解析",
    ko: "SSIM 맵 분석",
    zh: "SSIM图分析"
  },
  "image/steerable_pyramid": {
    ja: "ステアラブルピラミッド分解解析",
    ko: "조향 가능 피라미드 분해 분석",
    zh: "可操控金字塔分解分析"
  },
  "image/structural_complexity": {
    es: "Complejidad Estructural",
    ja: "構造的複雑度解析",
    ko: "구조적 복잡도 분석",
    zh: "结构复杂度分析"
  },
  "image/sub_band_dev": {
    ja: "サブバンド偏差解析",
    ko: "서브밴드 편차 분석",
    zh: "子带偏差分析"
  },
  "image/svd_decomposition": {
    ja: "SVD分解解析",
    ko: "SVD 분해 분석",
    zh: "SVD分解分析"
  },
  "image/texture": { es: "Consistencia de Textura" },
  "image/texture_periodicity": {
    es: "Periodicidad de Textura",
    ja: "テクスチャ周期性解析",
    ko: "텍스처 주기성 분석",
    zh: "纹理周期性分析"
  },
  "image/timestamp_forensics": { es: "Forense de Marca Temporal" },
  "image/tone_mapping": {
    ja: "トーンマッピング解析",
    ko: "톤 매핑 분석",
    zh: "色调映射分析"
  },
  "image/total_variation": {
    ja: "全変動ノルム解析",
    ko: "전변동 노름 분석",
    zh: "全变分范数分析"
  },
  "image/upscaling": { es: "Detección de Escalado" },
  "image/vignette_analysis": {
    ja: "ビネット解析",
    ko: "비네팅 분석",
    zh: "暗角分析"
  },
  "image/wavelet": { es: "Análisis Wavelet" },
  "image/wavelet_packet": {
    es: "Descomposición de Paquete Wavelet",
    ja: "ウェーブレットパケット分解解析",
    ko: "웨이블릿 패킷 분해 분석",
    zh: "小波包分解分析"
  },
  "image/weber_descriptor": { es: "Descriptor Local de Weber" },
  "image/wiener_residual": {
    es: "Residual de Filtro de Wiener",
    ja: "ウィーナーフィルター残差解析",
    ko: "위너 필터 잔차 분석",
    zh: "维纳滤波残差分析"
  },

  // === TEXT METHODS ===
  "text/argument_structure": { es: "Perfilado de Estructura Argumentativa" },
  "text/colloquial_expression": { es: "Densidad de Coloquialismos e Idiomas" },
  "text/conjunction_pair": { es: "Pares de Conjunciones Correlativas" },
  "text/contextual_embedding_var": { es: "Varianza de Incrustación Contextual" },
  "text/cultural_reference": { es: "Perfilado de Referencia Cultural" },
  "text/discourse_markers": { es: "Perfilado de Marcadores Cohesivos" },
  "text/emotional_arc": { es: "Trayectoria del Arco Emocional" },
  "text/emotional_tone": { es: "Varianza de Tono Emocional" },
  "text/entity_grounding": { es: "Análisis de Anclaje de Entidades" },
  "text/fast_detectgpt": { es: "Curvatura de Probabilidad Fast-DetectGPT" },
  "text/filler_word_usage": { es: "Esterilidad de Palabras de Relleno" },
  "text/genre_conformity": {
    ja: "ジャンル適合性解析",
    ko: "장르 적합성 분석",
    zh: "体裁一致性分析"
  },
  "text/ghostbuster_detect": {
    ja: "ゴーストバスター検出",
    ko: "고스트버스터 탐지",
    zh: "Ghostbuster检测"
  },
  "text/hedging_language": { es: "Cobertura Epistémica (Lenguaje Cauteloso)" },
  "text/idiom_detection": { es: "Análisis de Expresiones Idiomáticas" },
  "text/likelihood_divergence": { es: "Divergencia de Verosimilitud" },
  "text/log_likelihood_rank": { es: "Rango de Log-Verosimilitud (Probabilidad de Muestreo)" },
  "text/mean_dep_parse": { es: "Profundidad Media de Dependencia (MDD)" },
  "text/modal_verb_frequency": { es: "Frecuencia de Verbos Modales" },
  "text/named_entity_consistency": { es: "Consistencia de Entidades Nombradas" },
  "text/narrative_structure": { es: "Estructura Narrativa" },
  "text/passive_voice_frequency": { es: "Frecuencia de Voz Pasiva" },
  "text/personal_experience": { es: "Marcadores de Experiencia Personal" },
  "text/qualifier_density": { es: "Patrón de Densidad de Calificadores" },
  "text/rank_probability": { es: "Probabilidad de Rango de Token" },
  "text/readability_score": { es: "Análisis de Varianza de Legibilidad" },
  "text/referential_density": { es: "Análisis de Densidad Referencial" },
  "text/sent_start_variety": { es: "Variedad de Inicio de Oraciones (Diversidad de Apertura)" },
  "text/sentiment_variance": { es: "Varianza de Sentimiento" },
  "text/subordinate_clause": { es: "Densidad de Cláusulas Subordinadas" },
  "text/superlative_usage": { es: "Densidad de Superlativos" },
  "text/temporal_expression": { es: "Coherencia Temporal" },
  "text/verb_tense": { es: "Consistencia de Tiempo Verbal" },
  "text/vocab_complexity": { es: "Complejidad de Vocabulario" },
  "text/word_frequency_rank": { es: "Rango de Frecuencia de Palabras (GLTR)" },
  "text/writing_rhythm": { es: "Ritmo y Cadencia de Escritura" },

  // === VIDEO METHODS ===
  "video/accessory_consistency": {
    es: "Consistencia de Accesorios",
    ja: "アクセサリー一貫性解析",
    ko: "액세서리 일관성 분석",
    zh: "配饰一致性分析"
  },
  "video/audio_formant": {
    es: "Análisis de Formantes de Audio",
    ja: "音声フォルマント解析",
    ko: "오디오 포먼트 분석",
    zh: "音频共振峰分析"
  },
  "video/audio_noise_floor": {
    es: "Piso de Ruido de Audio",
    ja: "音声ノイズフロア解析",
    ko: "오디오 잡음 바닥 분석",
    zh: "音频噪声底限分析"
  },
  "video/audio_spectral": {
    ja: "音声スペクトル解析",
    ko: "오디오 스펙트럼 분석",
    zh: "音频频谱分析"
  },
  "video/audio_visual_delay": {
    es: "Retraso Audio-Visual",
    ja: "音声・映像遅延解析",
    ko: "오디오-비주얼 지연 분석",
    zh: "音视频延迟分析"
  },
  "video/background_object_physics": {
    ja: "背景オブジェクト物理解析",
    ko: "배경 객체 물리 분석",
    zh: "背景物体物理分析"
  },
  "video/background_stability": { es: "Estabilidad del Fondo" },
  "video/bframe_consistency": {
    es: "Análisis de Consistencia de B-Frame",
    ja: "Bフレーム一貫性解析",
    ko: "B-프레임 일관성 분석",
    zh: "B帧一致性分析"
  },
  "video/bg_complexity": {
    es: "Complejidad del Fondo",
    ja: "背景複雑度解析",
    ko: "배경 복잡도 분석",
    zh: "背景复杂度分析"
  },
  "video/bg_freq_map": {
    es: "Mapa de Frecuencia del Fondo",
    ja: "背景周波数マップ解析",
    ko: "배경 주파수 맵 분석",
    zh: "背景频率图分析"
  },
  "video/bg_perspective": {
    es: "Perspectiva del Fondo",
    ja: "背景パースペクティブ解析",
    ko: "배경 원근법 분석",
    zh: "背景透视分析"
  },
  "video/blink_rate": {
    es: "Análisis de Frecuencia de Parpadeo",
    ja: "瞬き頻度解析",
    ko: "눈 깜빡임 빈도 분석",
    zh: "眨眼频率分析"
  },
  "video/blood_flow_rppg": {
    ja: "血流rPPG解析",
    ko: "혈류 rPPG 분석",
    zh: "血流rPPG分析"
  },
  "video/body_movement_fluidity": {
    es: "Fluidez de Movimiento Corporal",
    ja: "身体動作流暢性解析",
    ko: "신체 움직임 유연성 분석",
    zh: "身体运动流畅性分析"
  },
  "video/bokeh": {
    ja: "ボケの自然さ解析",
    ko: "보케 자연스러움 분석",
    zh: "散景自然度分析"
  },
  "video/breathing_pattern": {
    ja: "呼吸パターン解析",
    ko: "호흡 패턴 분석",
    zh: "呼吸模式分析"
  },
  "video/cheek_texture": { es: "Textura de Mejilla" },
  "video/chin_jaw_detail": {
    ja: "顎・あごディテール解析",
    ko: "턱-하악 디테일 분석",
    zh: "下巴-下颌细节分析"
  },
  "video/chroma_bleed": { es: "Sangrado de Croma" },
  "video/clothing_edge_blend": {
    es: "Fusión de Bordes de Ropa",
    ja: "衣服エッジブレンド解析",
    ko: "의류 엣지 블렌드 분석",
    zh: "服装边缘融合分析"
  },
  "video/clothing_fold": {
    es: "Física de Pliegues de Ropa",
    ja: "衣服シワ物理解析",
    ko: "의류 주름 물리 분석",
    zh: "服装褶皱物理分析"
  },
  "video/color_bleeding": { es: "Sangrado de Color" },
  "video/color_hist_shift": {
    es: "Cambio de Histograma de Color",
    ja: "色ヒストグラムシフト解析",
    ko: "색상 히스토그램 시프트 분석",
    zh: "色彩直方图偏移分析"
  },
  "video/color_quant_v": {
    ja: "カラー量子化解析",
    ko: "색상 양자화 분석",
    zh: "颜色量化分析"
  },
  "video/color_temporal_shift": {
    es: "Cambio Temporal de Color",
    ja: "色の時間的シフト解析",
    ko: "색상 시간적 시프트 분석",
    zh: "色彩时间偏移分析"
  },
  "video/contour_continuity": {
    es: "Continuidad de Contorno",
    ja: "輪郭連続性解析",
    ko: "윤곽 연속성 분석",
    zh: "轮廓连续性分析"
  },
  "video/contrast_temporal": {
    es: "Contraste Temporal",
    ja: "コントラスト時間解析",
    ko: "대비 시간적 분석",
    zh: "对比度时间分析"
  },
  "video/depth_consistency": {
    es: "Consistencia de Profundidad",
    ja: "深度一貫性解析",
    ko: "깊이 일관성 분석",
    zh: "深度一致性分析"
  },
  "video/ear_detail": { es: "Consistencia de Detalle de Oreja" },
  "video/ear_symmetry": {
    ja: "耳の対称性解析",
    ko: "귀 대칭성 분석",
    zh: "耳朵对称性分析"
  },
  "video/edge_aa_video": {
    es: "Anti-Aliasing de Bordes (Video)",
    ja: "エッジアンチエイリアシング (映像) 解析",
    ko: "엣지 안티앨리어싱 (비디오) 분석",
    zh: "边缘抗锯齿 (视频) 分析"
  },
  "video/edge_ringing": { es: "Ringing de Bordes" },
  "video/edge_sharpness_var": {
    es: "Varianza de Nitidez de Bordes",
    ja: "エッジシャープネス分散解析",
    ko: "엣지 선명도 분산 분석",
    zh: "边缘锐度方差分析"
  },
  "video/expression": {
    ja: "表情の自然さ解析",
    ko: "표정 자연스러움 분석",
    zh: "表情自然度分析"
  },
  "video/eye_contact_consistency": {
    es: "Consistencia de Contacto Visual",
    ja: "アイコンタクト一貫性解析",
    ko: "눈 맞춤 일관성 분석",
    zh: "眼神接触一致性分析"
  },
  "video/eye_reflection": {
    ja: "瞳の反射一貫性解析",
    ko: "눈 반사 일관성 분석",
    zh: "眼部反射一致性分析"
  },
  "video/eyebrow": {
    es: "Naturalidad de Cejas",
    ja: "眉の自然さ解析",
    ko: "눈썹 자연스러움 분석",
    zh: "眉毛自然度分析"
  },
  "video/face_blend_bound": {
    ja: "顔ブレンド境界解析",
    ko: "얼굴 블렌드 경계 분석",
    zh: "人脸融合边界分析"
  },
  "video/face_boundary_blend": {
    es: "Fusión de Límite Facial",
    ja: "顔境界ブレンド解析",
    ko: "얼굴 경계 블렌드 분석",
    zh: "面部边界融合分析"
  },
  "video/face_illumination": {
    ja: "顔照明解析",
    ko: "얼굴 조명 분석",
    zh: "面部光照分析"
  },
  "video/face_landmark": { es: "Consistencia de Marcadores Faciales" },
  "video/face_skin_smooth_v": {
    es: "Suavidad de Piel Facial",
    ja: "顔の皮膚滑らかさ解析",
    ko: "얼굴 피부 매끄러움 분석",
    zh: "面部皮肤光滑度分析"
  },
  "video/face_warping_artifact": {
    ja: "フェイスワーピングアーティファクト解析",
    ko: "얼굴 워핑 아티팩트 분석",
    zh: "人脸变形伪影分析"
  },
  "video/face_xray": {
    ja: "フェイスX-Ray境界解析",
    ko: "페이스 X-Ray 경계 분석",
    zh: "人脸X-Ray边界分析"
  },
  "video/facial_action_timing": {
    ja: "顔面動作タイミング解析",
    ko: "얼굴 동작 타이밍 분석",
    zh: "面部动作时序分析"
  },
  "video/facial_aging_consistency": {
    es: "Consistencia de Envejecimiento Facial",
    ja: "顔の加齢一貫性解析",
    ko: "얼굴 노화 일관성 분석",
    zh: "面部老化一致性分析"
  },
  "video/facial_boundary_freq": {
    es: "Frecuencia de Límite Facial",
    ja: "顔境界周波数解析",
    ko: "얼굴 경계 주파수 분석",
    zh: "面部边界频率分析"
  },
  "video/facial_muscle_physics": {
    ja: "顔面筋肉物理解析",
    ko: "안면 근육 물리 분석",
    zh: "面部肌肉物理分析"
  },
  "video/facial_pore_texture": {
    es: "Textura de Poros Faciales",
    ja: "顔の毛穴テクスチャ解析",
    ko: "얼굴 모공 질감 분석",
    zh: "面部毛孔纹理分析"
  },
  "video/facial_symmetry_v": {
    ja: "顔の対称性 (映像) 解析",
    ko: "얼굴 대칭성 (비디오) 분석",
    zh: "面部对称性 (视频) 分析"
  },
  "video/facial_wrinkle": {
    es: "Consistencia de Arrugas Faciales",
    ja: "顔のシワ一貫性解析",
    ko: "얼굴 주름 일관성 분석",
    zh: "面部皱纹一致性分析"
  },
  "video/facs_analysis": {
    ja: "FACS動作単位解析",
    ko: "FACS 액션 유닛 분석",
    zh: "FACS动作单元分析"
  },
  "video/finger_geometry": {
    ja: "指の幾何学解析",
    ko: "손가락 기하학 분석",
    zh: "手指几何分析"
  },
  "video/forehead_texture": {
    es: "Textura de Frente",
    ja: "額テクスチャ解析",
    ko: "이마 질감 분석",
    zh: "前额纹理分析"
  },
  "video/forehead_wrinkle": {
    es: "Arrugas de Frente",
    ja: "額のシワ解析",
    ko: "이마 주름 분석",
    zh: "前额皱纹分析"
  },
  "video/frame_drop": {
    ja: "フレームドロップ検出",
    ko: "프레임 드롭 검출",
    zh: "丢帧检测"
  },
  "video/frame_edge_energy": {
    ja: "フレームエッジエネルギー解析",
    ko: "프레임 엣지 에너지 분석",
    zh: "帧边缘能量分析"
  },
  "video/gaze_vergence": {
    es: "Análisis de Vergencia de Mirada",
    ja: "視線輻輳解析",
    ko: "시선 폭주 분석",
    zh: "注视辐辏分析"
  },
  "video/hair_detail": {
    es: "Análisis de Detalle de Cabello",
    ja: "髪のディテール解析",
    ko: "머리카락 디테일 분석",
    zh: "发丝细节分析"
  },
  "video/hair_strand_consistency": {
    es: "Consistencia de Mechones de Cabello",
    ja: "髪の毛の一貫性解析",
    ko: "모발 가닥 일관성 분석",
    zh: "发丝一致性分析"
  },
  "video/hand_finger_count": {
    es: "Análisis de Conteo de Dedos",
    ja: "手の指カウント解析",
    ko: "손가락 개수 분석",
    zh: "手指计数分析"
  },
  "video/hand_gesture_consistency": { es: "Consistencia de Gestos de Mano" },
  "video/head_nod_shake": {
    ja: "頭部のうなずき/首振りパターン解析",
    ko: "고개 끄덕임/흔들기 패턴 분석",
    zh: "头部点头/摇头模式分析"
  },
  "video/head_pose_v2": {
    ja: "頭部姿勢推定v2解析",
    ko: "머리 자세 추정 v2 분석",
    zh: "头部姿态估计v2分析"
  },
  "video/identity_switch": {
    ja: "アイデンティティ切替検出",
    ko: "신원 전환 탐지",
    zh: "身份切换检测"
  },
  "video/inter_frame_blend": {
    es: "Fusión Inter-Frame",
    ja: "フレーム間ブレンド解析",
    ko: "프레임간 블렌드 분석",
    zh: "帧间融合分析"
  },
  "video/intra_prediction": {
    ja: "フレーム内予測解析",
    ko: "프레임 내 예측 분석",
    zh: "帧内预测分析"
  },
  "video/iris_detail": { es: "Detalle de Iris" },
  "video/jawline": {
    ja: "顎ライン一貫性解析",
    ko: "턱선 일관성 분석",
    zh: "下颌线一致性分析"
  },
  "video/lens_distortion_v": {
    ja: "レンズ歪み解析 (映像)",
    ko: "렌즈 왜곡 분석 (비디오)",
    zh: "镜头畸变分析 (视频)"
  },
  "video/lip_reading_score": {
    ja: "読唇精度スコア解析",
    ko: "독순 정확도 점수 분석",
    zh: "唇读准确度评分分析"
  },
  "video/lip_texture_detail": {
    es: "Detalle de Textura de Labios",
    ja: "唇テクスチャディテール解析",
    ko: "입술 질감 디테일 분석",
    zh: "唇部纹理细节分析"
  },
  "video/micro_expression_v2": {
    ja: "マイクロ表情v2解析",
    ko: "미세 표정 v2 분석",
    zh: "微表情v2分析"
  },
  "video/micro_tremor": {
    ja: "マイクロ振戦検出",
    ko: "미세 진전 탐지",
    zh: "微震颤检测"
  },
  "video/motion_blur_consistency": { es: "Consistencia de Desenfoque de Movimiento" },
  "video/motion_blur_dir": {
    ja: "モーションブラー方向解析",
    ko: "모션 블러 방향 분석",
    zh: "运动模糊方向分析"
  },
  "video/motion_estimation_res": {
    ja: "動き推定残差解析",
    ko: "모션 추정 잔차 분석",
    zh: "运动估计残差分析"
  },
  "video/motion_vector": {
    ja: "動きベクトル解析",
    ko: "모션 벡터 분석",
    zh: "运动矢量分析"
  },
  "video/neck_skin": {
    es: "Consistencia de Piel del Cuello",
    ja: "首の皮膚一貫性解析",
    ko: "목 피부 일관성 분석",
    zh: "颈部皮肤一致性分析"
  },
  "video/neck_transition": {
    ja: "首の遷移解析",
    ko: "목 전환 분석",
    zh: "颈部过渡分析"
  },
  "video/nose_shadow": { es: "Sombra de Nariz" },
  "video/nostril_darkness": {
    es: "Oscuridad de Fosas Nasales",
    ja: "鼻孔の暗さ解析",
    ko: "콧구멍 어둠 분석",
    zh: "鼻孔暗度分析"
  },
  "video/object_boundary": {
    ja: "オブジェクト境界解析",
    ko: "객체 경계 분석",
    zh: "物体边界分析"
  },
  "video/phoneme_correlation": {
    ja: "音素相関解析",
    ko: "음소 상관 분석",
    zh: "音素相关性分析"
  },
  "video/phoneme_viseme_map": {
    es: "Mapeo Fonema-Visema",
    ja: "音素ビゼムマッピング解析",
    ko: "음소-비짐 매핑 분석",
    zh: "音素-视素映射分析"
  },
  "video/pixel_repetition_v": {
    ja: "ピクセル反復解析",
    ko: "픽셀 반복 분석",
    zh: "像素重复分析"
  },
  "video/pupillary_unrest": {
    es: "Índice de Inquietud Pupilar",
    ja: "瞳孔不安定指数解析",
    ko: "동공 불안 지수 분석",
    zh: "瞳孔不安指数分析"
  },
  "video/qp_analysis": {
    ja: "量子化パラメータ解析",
    ko: "양자화 매개변수 분석",
    zh: "量化参数分析"
  },
  "video/reflection_consistency_video": { es: "Consistencia de Reflejos en Video" },
  "video/reflection_physics": {
    ja: "反射物理解析",
    ko: "반사 물리 분석",
    zh: "反射物理分析"
  },
  "video/saccade_analysis": {
    ja: "サッケード（眼球急速運動）解析",
    ko: "단속운동 (사카드) 분석",
    zh: "眼跳分析"
  },
  "video/scene_cut_anomaly": {
    ja: "シーンカット異常検出",
    ko: "장면 전환 이상 탐지",
    zh: "场景切换异常检测"
  },
  "video/scene_geometry": {
    ja: "シーンジオメトリ一貫性解析",
    ko: "장면 기하학 일관성 분석",
    zh: "场景几何一致性分析"
  },
  "video/shadow_consistency_video": { es: "Consistencia de Sombras en Video" },
  "video/shadow_temporal": {
    es: "Sombra Temporal",
    ja: "影の時間解析",
    ko: "그림자 시간적 분석",
    zh: "阴影时间分析"
  },
  "video/shoulder": {
    ja: "肩の位置合わせ解析",
    ko: "어깨 정렬 분석",
    zh: "肩部对齐分析"
  },
  "video/skin_color_drift": {
    es: "Deriva de Color de Piel",
    ja: "肌色ドリフト解析",
    ko: "피부색 드리프트 분석",
    zh: "肤色漂移分析"
  },
  "video/skin_micro_motion": {
    es: "Micro Movimiento de Piel",
    ja: "皮膚マイクロモーション解析",
    ko: "피부 미세 움직임 분석",
    zh: "皮肤微运动分析"
  },
  "video/skin_pore_sim": {
    ja: "皮膚毛穴シミュレーション解析",
    ko: "피부 모공 시뮬레이션 분석",
    zh: "皮肤毛孔模拟分析"
  },
  "video/skin_specular_reflection": {
    ja: "皮膚鏡面反射解析",
    ko: "피부 정반사 분석",
    zh: "皮肤镜面反射分析"
  },
  "video/skin_texture": {
    es: "Realismo de Textura de Piel",
    ja: "皮膚テクスチャリアリズム解析",
    ko: "피부 질감 사실성 분석",
    zh: "皮肤纹理真实度分析"
  },
  "video/spatial_freq_temporal": {
    es: "Frecuencia Espacial Temporal",
    ja: "空間周波数時間解析",
    ko: "공간 주파수 시간적 분석",
    zh: "空间频率时间分析"
  },
  "video/spectral_flicker_v": {
    es: "Parpadeo Espectral",
    ja: "スペクトルフリッカー解析",
    ko: "스펙트럼 플리커 분석",
    zh: "频谱闪烁分析"
  },
  "video/specular_highlight": { es: "Reflejo Especular" },
  "video/stabilization": {
    ja: "安定化アーティファクト解析",
    ko: "안정화 아티팩트 분석",
    zh: "稳定化伪影分析"
  },
  "video/teeth": {
    es: "Consistencia de Dientes",
    ja: "歯の一貫性解析",
    ko: "치아 일관성 분석",
    zh: "牙齿一致性分析"
  },
  "video/temporal_coherence_map": {
    es: "Mapa de Coherencia Temporal",
    ja: "時間的コヒーレンスマップ解析",
    ko: "시간적 일관성 맵 분석",
    zh: "时间相干性图分析"
  },
  "video/temporal_color_histogram": {
    es: "Histograma de Color Temporal",
    ja: "時間的カラーヒストグラム解析",
    ko: "시간적 색상 히스토그램 분석",
    zh: "时间色彩直方图分析"
  },
  "video/temporal_face_embedding": {
    ja: "時間的顔埋め込みドリフト解析",
    ko: "시간적 얼굴 임베딩 드리프트 분석",
    zh: "时间面部嵌入漂移分析"
  },
  "video/temporal_frequency_anomaly": {
    ja: "時間周波数異常検出",
    ko: "시간 주파수 이상 탐지",
    zh: "时间频率异常检测"
  },
  "video/temporal_gradient": {
    es: "Gradiente Temporal",
    ja: "時間的勾配解析",
    ko: "시간적 기울기 분석",
    zh: "时间梯度分析"
  },
  "video/temporal_jitter": {
    ja: "テンポラルジッター検出",
    ko: "시간적 지터 검출",
    zh: "时间抖动检测"
  },
  "video/temporal_noise": {
    ja: "時間的ノイズパターン解析",
    ko: "시간적 잡음 패턴 분석",
    zh: "时间噪声模式分析"
  },
  "video/texture_flow": { es: "Flujo de Textura" },
  "video/tongue_consistency": {
    es: "Consistencia de Lengua",
    ja: "舌の一貫性解析",
    ko: "혀 일관성 분석",
    zh: "舌头一致性分析"
  },
  "video/video_artifact_grid": {
    ja: "映像アーティファクトグリッド解析",
    ko: "비디오 아티팩트 그리드 분석",
    zh: "视频伪影网格分析"
  },
  "video/video_blockiness": {
    es: "Bloqueo de Video",
    ja: "映像ブロック化解析",
    ko: "비디오 블록화 분석",
    zh: "视频块化分析"
  },
  "video/video_color_balance": {
    es: "Balance de Color de Video",
    ja: "映像カラーバランス解析",
    ko: "비디오 색상 밸런스 분석",
    zh: "视频色彩平衡分析"
  },
  "video/video_denoising_trace": {
    ja: "映像ノイズ除去トレース解析",
    ko: "비디오 디노이징 트레이스 분석",
    zh: "视频去噪痕迹分析"
  },
  "video/video_frame_rate": {
    es: "Tasa de Fotogramas de Video",
    ja: "映像フレームレート解析",
    ko: "비디오 프레임 레이트 분석",
    zh: "视频帧率分析"
  },
  "video/video_freq_spectrum": {
    es: "Espectro de Frecuencia de Video",
    ja: "映像周波数スペクトル解析",
    ko: "비디오 주파수 스펙트럼 분석",
    zh: "视频频率频谱分析"
  },
  "video/video_global_illum": {
    ja: "映像グローバルイルミネーション解析",
    ko: "비디오 글로벌 조명 분석",
    zh: "视频全局光照分析"
  },
  "video/video_hash": {
    ja: "映像ハッシュ解析",
    ko: "비디오 해시 분석",
    zh: "视频哈希分析"
  },
  "video/video_luma_range": {
    es: "Rango de Luminancia de Video",
    ja: "映像輝度レンジ解析",
    ko: "비디오 휘도 범위 분석",
    zh: "视频亮度范围分析"
  },
  "video/video_noise": {
    ja: "映像ノイズ一貫性解析",
    ko: "비디오 잡음 일관성 분석",
    zh: "视频噪声一致性分析"
  },
  "video/video_resolution_map": {
    ja: "映像解像度マップ解析",
    ko: "비디오 해상도 맵 분석",
    zh: "视频分辨率图分析"
  },
  "video/video_saturation": {
    ja: "映像彩度解析",
    ko: "비디오 채도 분석",
    zh: "视频饱和度分析"
  },
  "video/video_saturation_map": {
    ja: "映像彩度マップ解析",
    ko: "비디오 채도 맵 분석",
    zh: "视频饱和度图分析"
  },
  "video/video_sharpness": {
    es: "Nitidez de Video",
    ja: "映像シャープネス解析",
    ko: "비디오 선명도 분석",
    zh: "视频锐度分析"
  },
  "video/video_spectral_coherence": {
    es: "Coherencia Espectral de Video",
    ja: "映像スペクトルコヒーレンス解析",
    ko: "비디오 스펙트럼 코히어런스 분석",
    zh: "视频频谱相干性分析"
  },
  "video/voice_f0_analysis": {
    ja: "音声基本周波数解析",
    ko: "음성 기본 주파수 분석",
    zh: "语音基频分析"
  },
  "video/watermark": {
    ja: "透かし検出",
    ko: "워터마크 탐지",
    zh: "水印检测"
  },
};

// Apply translations
let updated = 0;
let skipped = 0;

for (const [methodPath, translations] of Object.entries(NAME_TRANSLATIONS)) {
  for (const [lang, translatedName] of Object.entries(translations)) {
    const filePath = path.join(METHODS_DIR, methodPath, 'i18n', `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP (not found): ${filePath}`);
      skipped++;
      continue;
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log(`SKIP (parse error): ${methodPath}/${lang}: ${e.message}`);
      skipped++;
      continue;
    }

    data.name = translatedName;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    updated++;
  }
}

console.log(`\nUpdated ${updated} files, skipped ${skipped}`);
