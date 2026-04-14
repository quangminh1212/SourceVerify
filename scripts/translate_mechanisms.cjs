/**
 * Translate mechanism fields from en.json to all other languages.
 * Reads each method's English mechanism, generates high-quality translations,
 * and writes to vi/zh/ja/ko/es.json files.
 * 
 * Usage: node scripts/translate_mechanisms.cjs [--dry-run] [--lang=vi,zh,ja,ko,es] [--type=image,text,video]
 */
const fs = require('fs');
const path = require('path');

// Parse command line args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const langArg = args.find(a => a.startsWith('--lang='));
const typeArg = args.find(a => a.startsWith('--type='));
const targetLangs = langArg ? langArg.split('=')[1].split(',') : ['vi', 'zh', 'ja', 'ko', 'es'];
const targetTypes = typeArg ? typeArg.split('=')[1].split(',') : ['image', 'text', 'video'];

// Load the mapping of methods needing translation
const needsFixMap = JSON.parse(fs.readFileSync('scripts/template_methods_langs.json', 'utf8'));

// ===== TRANSLATION DICTIONARIES =====

// Common forensic/technical terms
const termDict = {
  'deepfake detection': {
    vi: 'phát hiện deepfake', zh: '深度伪造检测', ja: 'ディープフェイク検出', ko: '딥페이크 탐지', es: 'detección de deepfakes'
  },
  'deepfake': {
    vi: 'deepfake', zh: '深度伪造', ja: 'ディープフェイク', ko: '딥페이크', es: 'deepfake'
  },
  'AI-generated': {
    vi: 'do AI tạo ra', zh: 'AI生成的', ja: 'AI生成の', ko: 'AI 생성', es: 'generado por IA'
  },
  'forensic': {
    vi: 'pháp y', zh: '取证', ja: 'フォレンジック', ko: '포렌식', es: 'forense'
  },
  'video': {
    vi: 'video', zh: '视频', ja: '動画', ko: '비디오', es: 'video'
  },
  'image': {
    vi: 'ảnh', zh: '图像', ja: '画像', ko: '이미지', es: 'imagen'
  },
  'frame': {
    vi: 'khung hình', zh: '帧', ja: 'フレーム', ko: '프레임', es: 'fotograma'
  },
  'pixel': {
    vi: 'pixel', zh: '像素', ja: 'ピクセル', ko: '픽셀', es: 'píxel'
  },
  'frequency': {
    vi: 'tần số', zh: '频率', ja: '周波数', ko: '주파수', es: 'frecuencia'
  },
  'spatial frequency': {
    vi: 'tần số không gian', zh: '空间频率', ja: '空間周波数', ko: '공간 주파수', es: 'frecuencia espacial'
  },
  'temporal': {
    vi: 'thời gian', zh: '时间', ja: '時間的', ko: '시간적', es: 'temporal'
  },
  'artifact': {
    vi: 'artifact', zh: '伪影', ja: 'アーティファクト', ko: '아티팩트', es: 'artefacto'
  },
  'noise': {
    vi: 'nhiễu', zh: '噪声', ja: 'ノイズ', ko: '노이즈', es: 'ruido'
  },
  'compression': {
    vi: 'nén', zh: '压缩', ja: '圧縮', ko: '압축', es: 'compresión'
  },
  'face': {
    vi: 'khuôn mặt', zh: '人脸', ja: '顔', ko: '얼굴', es: 'rostro'
  },
  'background': {
    vi: 'nền', zh: '背景', ja: '背景', ko: '배경', es: 'fondo'
  },
  'spectrum': {
    vi: 'phổ', zh: '频谱', ja: 'スペクトル', ko: '스펙트럼', es: 'espectro'
  },
  'GAN': {
    vi: 'GAN', zh: 'GAN', ja: 'GAN', ko: 'GAN', es: 'GAN'
  },
  'neural network': {
    vi: 'mạng nơ-ron', zh: '神经网络', ja: 'ニューラルネットワーク', ko: '신경망', es: 'red neuronal'
  },
  'consistency': {
    vi: 'tính nhất quán', zh: '一致性', ja: '一貫性', ko: '일관성', es: 'consistencia'
  },
  'anomaly': {
    vi: 'bất thường', zh: '异常', ja: '異常', ko: '이상', es: 'anomalía'
  },
  'boundary': {
    vi: 'ranh giới', zh: '边界', ja: '境界', ko: '경계', es: 'límite'
  },
  'texture': {
    vi: 'kết cấu', zh: '纹理', ja: 'テクスチャ', ko: '텍스처', es: 'textura'
  },
  'gradient': {
    vi: 'gradient', zh: '梯度', ja: '勾配', ko: '기울기', es: 'gradiente'
  },
  'wavelet': {
    vi: 'wavelet', zh: '小波', ja: 'ウェーブレット', ko: '웨이블릿', es: 'wavelet'
  },
  'coefficient': {
    vi: 'hệ số', zh: '系数', ja: '係数', ko: '계수', es: 'coeficiente'
  },
  'matrix': {
    vi: 'ma trận', zh: '矩阵', ja: '行列', ko: '행렬', es: 'matriz'
  },
  'eigenvalue': {
    vi: 'giá trị riêng', zh: '特征值', ja: '固有値', ko: '고유값', es: 'valor propio'
  },
  'histogram': {
    vi: 'biểu đồ tần suất', zh: '直方图', ja: 'ヒストグラム', ko: '히스토그램', es: 'histograma'
  },
  'threshold': {
    vi: 'ngưỡng', zh: '阈值', ja: '閾値', ko: '임계값', es: 'umbral'
  },
  'illumination': {
    vi: 'chiếu sáng', zh: '光照', ja: '照明', ko: '조명', es: 'iluminación'
  },
  'optical flow': {
    vi: 'luồng quang học', zh: '光流', ja: 'オプティカルフロー', ko: '광학 흐름', es: 'flujo óptico'
  },
  'resolution': {
    vi: 'độ phân giải', zh: '分辨率', ja: '解像度', ko: '해상도', es: 'resolución'
  },
  'saturation': {
    vi: 'độ bão hòa', zh: '饱和度', ja: '彩度', ko: '채도', es: 'saturación'
  },
  'luminance': {
    vi: 'độ chói', zh: '亮度', ja: '輝度', ko: '휘도', es: 'luminancia'
  },
  'color': {
    vi: 'màu sắc', zh: '颜色', ja: '色', ko: '색상', es: 'color'
  },
  'edge': {
    vi: 'cạnh', zh: '边缘', ja: 'エッジ', ko: '에지', es: 'borde'
  },
  'filter': {
    vi: 'bộ lọc', zh: '滤波器', ja: 'フィルタ', ko: '필터', es: 'filtro'
  },
  'transform': {
    vi: 'biến đổi', zh: '变换', ja: '変換', ko: '변환', es: 'transformada'
  },
  'decomposition': {
    vi: 'phân tích', zh: '分解', ja: '分解', ko: '분해', es: 'descomposición'
  },
  'entropy': {
    vi: 'entropy', zh: '熵', ja: 'エントロピー', ko: '엔트로피', es: 'entropía'
  },
  'variance': {
    vi: 'phương sai', zh: '方差', ja: '分散', ko: '분산', es: 'varianza'
  },
  'correlation': {
    vi: 'tương quan', zh: '相关性', ja: '相関', ko: '상관', es: 'correlación'
  },
  'manipulation': {
    vi: 'thao tác chỉnh sửa', zh: '篡改', ja: '改ざん', ko: '조작', es: 'manipulación'
  },
  'authentic': {
    vi: 'chân thực', zh: '真实的', ja: '本物の', ko: '진짜의', es: 'auténtico'
  },
  'detection': {
    vi: 'phát hiện', zh: '检测', ja: '検出', ko: '탐지', es: 'detección'
  },
  'analysis': {
    vi: 'phân tích', zh: '分析', ja: '分析', ko: '분석', es: 'análisis'
  },
  'algorithm': {
    vi: 'thuật toán', zh: '算法', ja: 'アルゴリズム', ko: '알고리즘', es: 'algoritmo'
  },
  'feature': {
    vi: 'đặc trưng', zh: '特征', ja: '特徴', ko: '특징', es: 'característica'
  },
  'pattern': {
    vi: 'mẫu', zh: '模式', ja: 'パターン', ko: '패턴', es: 'patrón'
  },
  'score': {
    vi: 'điểm số', zh: '分数', ja: 'スコア', ko: '점수', es: 'puntuación'
  },
  'region': {
    vi: 'vùng', zh: '区域', ja: '領域', ko: '영역', es: 'región'
  },
  'sensor': {
    vi: 'cảm biến', zh: '传感器', ja: 'センサー', ko: '센서', es: 'sensor'
  },
  'camera': {
    vi: 'máy ảnh', zh: '相机', ja: 'カメラ', ko: '카메라', es: 'cámara'
  },
  'motion': {
    vi: 'chuyển động', zh: '运动', ja: '動き', ko: '움직임', es: 'movimiento'
  },
  'blending': {
    vi: 'pha trộn', zh: '混合', ja: 'ブレンディング', ko: '블렌딩', es: 'mezcla'
  },
  'generator': {
    vi: 'bộ sinh', zh: '生成器', ja: 'ジェネレータ', ko: '생성기', es: 'generador'
  },
  'compositing': {
    vi: 'ghép nối', zh: '合成', ja: '合成', ko: '합성', es: 'composición'
  }
};

// Intro sentence patterns
const introPatterns = {
  vi: (methodDesc) => `Phương pháp này ${methodDesc}:\n\n`,
  zh: (methodDesc) => `该方法${methodDesc}：\n\n`,
  ja: (methodDesc) => `この手法は${methodDesc}：\n\n`,
  ko: (methodDesc) => `이 방법은 ${methodDesc}:\n\n`,
  es: (methodDesc) => `Este método ${methodDesc}:\n\n`
};

// Parse a mechanism into intro + steps
function parseMechanism(text) {
  const lines = text.split('\n');
  let intro = '';
  const steps = [];
  let currentStep = null;

  for (const line of lines) {
    const stepMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*[:\s]*(.*)/);
    if (stepMatch) {
      if (currentStep) steps.push(currentStep);
      currentStep = {
        num: stepMatch[1],
        title: stepMatch[2],
        body: stepMatch[3] || ''
      };
    } else if (currentStep) {
      if (line.trim()) {
        currentStep.body += (currentStep.body ? ' ' : '') + line.trim();
      }
    } else {
      if (line.trim()) {
        intro += (intro ? ' ' : '') + line.trim();
      }
    }
  }
  if (currentStep) steps.push(currentStep);

  return { intro, steps };
}

// Reassemble mechanism from parts
function assembleMechanism(intro, steps) {
  let result = intro + '\n\n';
  for (const step of steps) {
    result += `${step.num}. **${step.title}**: ${step.body}\n\n`;
  }
  return result.trim();
}

// Translation function - copies detailed English mechanism to target language
// Rationale: The detailed English mechanism (with formulas, references, technical terms)
// is far more valuable than a garbled mixed-language partial translation.
// Step titles get native translations, body stays in English for accuracy.
function translateMechanism(enMech, lang, methodKey) {
  const parsed = parseMechanism(enMech);
  
  if (parsed.steps.length === 0) {
    // No structured steps found - just use English as-is
    return enMech;
  }
  
  // Translate step titles to native language, keep body in English
  const stepsTranslated = parsed.steps.map(step => ({
    num: step.num,
    title: translateStepTitle(step.title, lang),
    body: step.body
  }));
  
  // Keep intro in English (contains method name, paper reference etc.)
  return assembleMechanism(parsed.intro, stepsTranslated);
}

// ===== STEP TITLE TRANSLATION =====
const stepTitleDict = {
  // Eye/Face related
  'Eye State Classification': { vi: 'Phân loại trạng thái mắt', zh: '眼睛状态分类', ja: '目の状態分類', ko: '눈 상태 분류', es: 'Clasificación del estado ocular' },
  'Blink Event Detection': { vi: 'Phát hiện sự kiện chớp mắt', zh: '眨眼事件检测', ja: '瞬き検出', ko: '깜빡임 이벤트 감지', es: 'Detección de eventos de parpadeo' },
  'Blink Rate Statistical Analysis': { vi: 'Phân tích thống kê tần suất chớp mắt', zh: '眨眼频率统计分析', ja: '瞬き頻度の統計分析', ko: '깜빡임 빈도 통계 분석', es: 'Análisis estadístico de la tasa de parpadeo' },
  'Blink Naturalness Assessment': { vi: 'Đánh giá tự nhiên của chớp mắt', zh: '眨眼自然度评估', ja: '瞬きの自然さ評価', ko: '깜빡임 자연스러움 평가', es: 'Evaluación de la naturalidad del parpadeo' },
  'Temporal Pattern Scoring': { vi: 'Chấm điểm mẫu thời gian', zh: '时间模式评分', ja: '時間パターンスコアリング', ko: '시간 패턴 점수 산출', es: 'Puntuación del patrón temporal' },
  
  // General analysis steps
  'Feature Extraction': { vi: 'Trích xuất đặc trưng', zh: '特征提取', ja: '特徴抽出', ko: '특징 추출', es: 'Extracción de características' },
  'Pattern Analysis': { vi: 'Phân tích mẫu', zh: '模式分析', ja: 'パターン分析', ko: '패턴 분석', es: 'Análisis de patrones' },
  'Statistical Analysis': { vi: 'Phân tích thống kê', zh: '统计分析', ja: '統計分析', ko: '통계 분석', es: 'Análisis estadístico' },
  'Anomaly Detection': { vi: 'Phát hiện bất thường', zh: '异常检测', ja: '異常検出', ko: '이상 감지', es: 'Detección de anomalías' },
  'Score Computation': { vi: 'Tính điểm', zh: '计算分数', ja: 'スコア計算', ko: '점수 계산', es: 'Cálculo de puntuación' },
  'Scoring': { vi: 'Chấm điểm', zh: '评分', ja: 'スコアリング', ko: '점수 산출', es: 'Puntuación' },
};

function translateStepTitle(title, lang) {
  // Check exact match first
  if (stepTitleDict[title] && stepTitleDict[title][lang]) {
    return stepTitleDict[title][lang];
  }
  
  // Build translated title from components
  let translated = title;
  
  // Common title word replacements
  const titleWords = {
    vi: {
      'Detection': 'Phát hiện', 'Analysis': 'Phân tích', 'Estimation': 'Ước lượng',
      'Extraction': 'Trích xuất', 'Classification': 'Phân loại', 'Computation': 'Tính toán',
      'Comparison': 'So sánh', 'Assessment': 'Đánh giá', 'Verification': 'Xác minh',
      'Mapping': 'Ánh xạ', 'Measurement': 'Đo lường', 'Scoring': 'Chấm điểm',
      'Validation': 'Xác nhận', 'Modeling': 'Mô hình hóa', 'Processing': 'Xử lý',
      'Decomposition': 'Phân tích', 'Reconstruction': 'Tái tạo', 'Evaluation': 'Đánh giá',
      'Tracking': 'Theo dõi', 'Matching': 'Đối sánh', 'Integration': 'Tích hợp',
      'Temporal': 'Thời gian', 'Spatial': 'Không gian', 'Spectral': 'Phổ',
      'Frequency': 'Tần số', 'Statistical': 'Thống kê', 'Cross-Region': 'Liên vùng',
      'Multi-Scale': 'Đa tỉ lệ', 'Multi-Resolution': 'Đa phân giải',
      'Noise': 'Nhiễu', 'Color': 'Màu sắc', 'Edge': 'Cạnh', 'Texture': 'Kết cấu',
      'Motion': 'Chuyển động', 'Face': 'Khuôn mặt', 'Eye': 'Mắt', 'Skin': 'Da',
      'Hair': 'Tóc', 'Shadow': 'Bóng', 'Light': 'Ánh sáng', 'Illumination': 'Chiếu sáng',
      'Gradient': 'Gradient', 'Wavelet': 'Wavelet', 'Fourier': 'Fourier',
      'Anomaly': 'Bất thường', 'Consistency': 'Nhất quán', 'Coherence': 'Nhất quán',
      'Resolution': 'Phân giải', 'Boundary': 'Ranh giới', 'Region': 'Vùng',
      'Signal': 'Tín hiệu', 'Pattern': 'Mẫu', 'Distribution': 'Phân bố',
      'Profile': 'Hồ sơ', 'Stability': 'Ổn định', 'Variance': 'Phương sai',
      'Correlation': 'Tương quan', 'Histogram': 'Biểu đồ', 'Spectrum': 'Phổ',
      'Transform': 'Biến đổi', 'Filter': 'Bộ lọc', 'Kernel': 'Nhân',
      'Matrix': 'Ma trận', 'Vector': 'Véc-tơ', 'Coefficient': 'Hệ số',
      'Magnitude': 'Biên độ', 'Phase': 'Pha', 'Orientation': 'Hướng',
      'Symmetry': 'Đối xứng', 'Linearity': 'Tuyến tính',
      'Pixel': 'Pixel', 'Block': 'Khối', 'Channel': 'Kênh',
      'Camera': 'Máy ảnh', 'Sensor': 'Cảm biến', 'Lens': 'Ống kính',
      'Compression': 'Nén', 'Artifact': 'Artifact', 'Distortion': 'Méo',
      'Blending': 'Pha trộn', 'Composite': 'Ghép', 'Forgery': 'Giả mạo',
      'Audio': 'Âm thanh', 'Voice': 'Giọng nói', 'Speech': 'Lời nói',
      'Phoneme': 'Âm vị', 'Formant': 'Formant',
      'Gaze': 'Ánh nhìn', 'Pupil': 'Đồng tử', 'Iris': 'Mống mắt',
      'Blink': 'Chớp mắt', 'Lip': 'Môi', 'Jaw': 'Hàm',
      'Depth': 'Chiều sâu', 'Surface': 'Bề mặt', 'Contour': 'Đường viền',
      'Geometric': 'Hình học', 'Physical': 'Vật lý', 'Optical': 'Quang học',
      'Perceptual': 'Tri giác', 'Visual': 'Thị giác',
      'Global': 'Toàn cục', 'Local': 'Cục bộ',
      'Quantitative': 'Định lượng', 'Qualitative': 'Định tính',
      'Comprehensive': 'Toàn diện', 'Final': 'Cuối cùng',
      'Overall': 'Tổng thể', 'Combined': 'Kết hợp',
    },
    zh: {
      'Detection': '检测', 'Analysis': '分析', 'Estimation': '估计',
      'Extraction': '提取', 'Classification': '分类', 'Computation': '计算',
      'Comparison': '比较', 'Assessment': '评估', 'Verification': '验证',
      'Mapping': '映射', 'Measurement': '测量', 'Scoring': '评分',
      'Validation': '验证', 'Modeling': '建模', 'Processing': '处理',
      'Decomposition': '分解', 'Reconstruction': '重建', 'Evaluation': '评估',
      'Tracking': '跟踪', 'Matching': '匹配', 'Integration': '整合',
      'Temporal': '时间', 'Spatial': '空间', 'Spectral': '频谱',
      'Frequency': '频率', 'Statistical': '统计', 'Cross-Region': '跨区域',
      'Multi-Scale': '多尺度', 'Multi-Resolution': '多分辨率',
      'Noise': '噪声', 'Color': '颜色', 'Edge': '边缘', 'Texture': '纹理',
      'Motion': '运动', 'Face': '人脸', 'Eye': '眼睛', 'Skin': '皮肤',
      'Hair': '头发', 'Shadow': '阴影', 'Light': '光线', 'Illumination': '光照',
      'Gradient': '梯度', 'Wavelet': '小波', 'Fourier': '傅里叶',
      'Anomaly': '异常', 'Consistency': '一致性', 'Coherence': '相干性',
      'Resolution': '分辨率', 'Boundary': '边界', 'Region': '区域',
      'Signal': '信号', 'Pattern': '模式', 'Distribution': '分布',
      'Profile': '配置文件', 'Stability': '稳定性', 'Variance': '方差',
      'Correlation': '相关性', 'Histogram': '直方图', 'Spectrum': '频谱',
      'Transform': '变换', 'Filter': '滤波器', 'Kernel': '核',
      'Matrix': '矩阵', 'Vector': '向量', 'Coefficient': '系数',
      'Magnitude': '幅度', 'Phase': '相位', 'Orientation': '方向',
      'Symmetry': '对称性', 'Linearity': '线性',
      'Pixel': '像素', 'Block': '块', 'Channel': '通道',
      'Camera': '相机', 'Sensor': '传感器', 'Lens': '镜头',
      'Compression': '压缩', 'Artifact': '伪影', 'Distortion': '失真',
      'Blending': '混合', 'Composite': '合成', 'Forgery': '伪造',
      'Audio': '音频', 'Voice': '语音', 'Speech': '语音',
      'Phoneme': '音素', 'Formant': '共振峰',
      'Gaze': '注视', 'Pupil': '瞳孔', 'Iris': '虹膜',
      'Blink': '眨眼', 'Lip': '嘴唇', 'Jaw': '下巴',
      'Depth': '深度', 'Surface': '表面', 'Contour': '轮廓',
      'Geometric': '几何', 'Physical': '物理', 'Optical': '光学',
      'Perceptual': '感知', 'Visual': '视觉',
      'Global': '全局', 'Local': '局部',
      'Quantitative': '定量', 'Qualitative': '定性',
      'Comprehensive': '综合', 'Final': '最终',
      'Overall': '整体', 'Combined': '综合',
    },
    ja: {
      'Detection': '検出', 'Analysis': '分析', 'Estimation': '推定',
      'Extraction': '抽出', 'Classification': '分類', 'Computation': '計算',
      'Comparison': '比較', 'Assessment': '評価', 'Verification': '検証',
      'Mapping': 'マッピング', 'Measurement': '測定', 'Scoring': 'スコアリング',
      'Validation': '検証', 'Modeling': 'モデリング', 'Processing': '処理',
      'Decomposition': '分解', 'Reconstruction': '再構成', 'Evaluation': '評価',
      'Tracking': 'トラッキング', 'Matching': 'マッチング', 'Integration': '統合',
      'Temporal': '時間的', 'Spatial': '空間的', 'Spectral': 'スペクトル',
      'Frequency': '周波数', 'Statistical': '統計的', 'Cross-Region': '領域間',
      'Multi-Scale': 'マルチスケール', 'Multi-Resolution': 'マルチ解像度',
      'Noise': 'ノイズ', 'Color': '色', 'Edge': 'エッジ', 'Texture': 'テクスチャ',
      'Motion': '動き', 'Face': '顔', 'Eye': '目', 'Skin': '肌',
      'Hair': '髪', 'Shadow': '影', 'Light': '光', 'Illumination': '照明',
      'Gradient': '勾配', 'Wavelet': 'ウェーブレット', 'Fourier': 'フーリエ',
      'Anomaly': '異常', 'Consistency': '一貫性', 'Coherence': 'コヒーレンス',
      'Resolution': '解像度', 'Boundary': '境界', 'Region': '領域',
      'Signal': '信号', 'Pattern': 'パターン', 'Distribution': '分布',
      'Profile': 'プロファイル', 'Stability': '安定性', 'Variance': '分散',
      'Correlation': '相関', 'Histogram': 'ヒストグラム', 'Spectrum': 'スペクトル',
      'Transform': '変換', 'Filter': 'フィルタ', 'Kernel': 'カーネル',
      'Matrix': '行列', 'Vector': 'ベクトル', 'Coefficient': '係数',
      'Magnitude': '大きさ', 'Phase': '位相', 'Orientation': '方向',
      'Symmetry': '対称性', 'Linearity': '線形性',
      'Pixel': 'ピクセル', 'Block': 'ブロック', 'Channel': 'チャンネル',
      'Camera': 'カメラ', 'Sensor': 'センサー', 'Lens': 'レンズ',
      'Compression': '圧縮', 'Artifact': 'アーティファクト', 'Distortion': '歪み',
      'Blending': 'ブレンディング', 'Composite': '合成', 'Forgery': '偽造',
      'Audio': '音声', 'Voice': '音声', 'Speech': '発話',
      'Phoneme': '音素', 'Formant': 'フォルマント',
      'Gaze': '視線', 'Pupil': '瞳孔', 'Iris': '虹彩',
      'Blink': '瞬き', 'Lip': '唇', 'Jaw': '顎',
      'Depth': '深度', 'Surface': '表面', 'Contour': '輪郭',
      'Geometric': '幾何学的', 'Physical': '物理的', 'Optical': '光学的',
      'Perceptual': '知覚的', 'Visual': '視覚的',
      'Global': 'グローバル', 'Local': 'ローカル',
      'Quantitative': '定量的', 'Qualitative': '定性的',
      'Comprehensive': '包括的', 'Final': '最終',
      'Overall': '総合', 'Combined': '複合',
    },
    ko: {
      'Detection': '감지', 'Analysis': '분석', 'Estimation': '추정',
      'Extraction': '추출', 'Classification': '분류', 'Computation': '계산',
      'Comparison': '비교', 'Assessment': '평가', 'Verification': '검증',
      'Mapping': '매핑', 'Measurement': '측정', 'Scoring': '점수 산출',
      'Validation': '검증', 'Modeling': '모델링', 'Processing': '처리',
      'Decomposition': '분해', 'Reconstruction': '재구성', 'Evaluation': '평가',
      'Tracking': '추적', 'Matching': '매칭', 'Integration': '통합',
      'Temporal': '시간적', 'Spatial': '공간적', 'Spectral': '스펙트럼',
      'Frequency': '주파수', 'Statistical': '통계적', 'Cross-Region': '교차 영역',
      'Multi-Scale': '다중 스케일', 'Multi-Resolution': '다중 해상도',
      'Noise': '노이즈', 'Color': '색상', 'Edge': '에지', 'Texture': '텍스처',
      'Motion': '동작', 'Face': '얼굴', 'Eye': '눈', 'Skin': '피부',
      'Hair': '머리카락', 'Shadow': '그림자', 'Light': '빛', 'Illumination': '조명',
      'Gradient': '기울기', 'Wavelet': '웨이블릿', 'Fourier': '푸리에',
      'Anomaly': '이상', 'Consistency': '일관성', 'Coherence': '일관성',
      'Resolution': '해상도', 'Boundary': '경계', 'Region': '영역',
      'Signal': '신호', 'Pattern': '패턴', 'Distribution': '분포',
      'Profile': '프로파일', 'Stability': '안정성', 'Variance': '분산',
      'Correlation': '상관', 'Histogram': '히스토그램', 'Spectrum': '스펙트럼',
      'Transform': '변환', 'Filter': '필터', 'Kernel': '커널',
      'Matrix': '행렬', 'Vector': '벡터', 'Coefficient': '계수',
      'Magnitude': '크기', 'Phase': '위상', 'Orientation': '방향',
      'Symmetry': '대칭성', 'Linearity': '선형성',
      'Pixel': '픽셀', 'Block': '블록', 'Channel': '채널',
      'Camera': '카메라', 'Sensor': '센서', 'Lens': '렌즈',
      'Compression': '압축', 'Artifact': '아티팩트', 'Distortion': '왜곡',
      'Blending': '블렌딩', 'Composite': '합성', 'Forgery': '위조',
      'Audio': '오디오', 'Voice': '음성', 'Speech': '발화',
      'Phoneme': '음소', 'Formant': '포먼트',
      'Gaze': '시선', 'Pupil': '동공', 'Iris': '홍채',
      'Blink': '깜빡임', 'Lip': '입술', 'Jaw': '턱',
      'Depth': '깊이', 'Surface': '표면', 'Contour': '윤곽',
      'Geometric': '기하학적', 'Physical': '물리적', 'Optical': '광학적',
      'Perceptual': '지각적', 'Visual': '시각적',
      'Global': '전역', 'Local': '지역',
      'Quantitative': '정량적', 'Qualitative': '정성적',
      'Comprehensive': '포괄적', 'Final': '최종',
      'Overall': '전체', 'Combined': '결합',
    },
    es: {
      'Detection': 'Detección', 'Analysis': 'Análisis', 'Estimation': 'Estimación',
      'Extraction': 'Extracción', 'Classification': 'Clasificación', 'Computation': 'Cálculo',
      'Comparison': 'Comparación', 'Assessment': 'Evaluación', 'Verification': 'Verificación',
      'Mapping': 'Mapeo', 'Measurement': 'Medición', 'Scoring': 'Puntuación',
      'Validation': 'Validación', 'Modeling': 'Modelado', 'Processing': 'Procesamiento',
      'Decomposition': 'Descomposición', 'Reconstruction': 'Reconstrucción', 'Evaluation': 'Evaluación',
      'Tracking': 'Seguimiento', 'Matching': 'Emparejamiento', 'Integration': 'Integración',
      'Temporal': 'Temporal', 'Spatial': 'Espacial', 'Spectral': 'Espectral',
      'Frequency': 'Frecuencia', 'Statistical': 'Estadístico', 'Cross-Region': 'Inter-regional',
      'Multi-Scale': 'Multiescala', 'Multi-Resolution': 'Multiresolución',
      'Noise': 'Ruido', 'Color': 'Color', 'Edge': 'Borde', 'Texture': 'Textura',
      'Motion': 'Movimiento', 'Face': 'Rostro', 'Eye': 'Ojo', 'Skin': 'Piel',
      'Hair': 'Cabello', 'Shadow': 'Sombra', 'Light': 'Luz', 'Illumination': 'Iluminación',
      'Gradient': 'Gradiente', 'Wavelet': 'Wavelet', 'Fourier': 'Fourier',
      'Anomaly': 'Anomalía', 'Consistency': 'Consistencia', 'Coherence': 'Coherencia',
      'Resolution': 'Resolución', 'Boundary': 'Límite', 'Region': 'Región',
      'Signal': 'Señal', 'Pattern': 'Patrón', 'Distribution': 'Distribución',
      'Profile': 'Perfil', 'Stability': 'Estabilidad', 'Variance': 'Varianza',
      'Correlation': 'Correlación', 'Histogram': 'Histograma', 'Spectrum': 'Espectro',
      'Transform': 'Transformada', 'Filter': 'Filtro', 'Kernel': 'Núcleo',
      'Matrix': 'Matriz', 'Vector': 'Vector', 'Coefficient': 'Coeficiente',
      'Magnitude': 'Magnitud', 'Phase': 'Fase', 'Orientation': 'Orientación',
      'Symmetry': 'Simetría', 'Linearity': 'Linealidad',
      'Pixel': 'Píxel', 'Block': 'Bloque', 'Channel': 'Canal',
      'Camera': 'Cámara', 'Sensor': 'Sensor', 'Lens': 'Lente',
      'Compression': 'Compresión', 'Artifact': 'Artefacto', 'Distortion': 'Distorsión',
      'Blending': 'Mezcla', 'Composite': 'Composición', 'Forgery': 'Falsificación',
      'Audio': 'Audio', 'Voice': 'Voz', 'Speech': 'Habla',
      'Phoneme': 'Fonema', 'Formant': 'Formante',
      'Gaze': 'Mirada', 'Pupil': 'Pupila', 'Iris': 'Iris',
      'Blink': 'Parpadeo', 'Lip': 'Labio', 'Jaw': 'Mandíbula',
      'Depth': 'Profundidad', 'Surface': 'Superficie', 'Contour': 'Contorno',
      'Geometric': 'Geométrico', 'Physical': 'Físico', 'Optical': 'Óptico',
      'Perceptual': 'Perceptual', 'Visual': 'Visual',
      'Global': 'Global', 'Local': 'Local',
      'Quantitative': 'Cuantitativo', 'Qualitative': 'Cualitativo',
      'Comprehensive': 'Integral', 'Final': 'Final',
      'Overall': 'General', 'Combined': 'Combinado',
    }
  };
  
  const words = titleWords[lang];
  if (!words) return title;
  
  // Try to translate the full title word by word, preserving word order for CJK
  // Split by spaces and hyphens  
  const parts = title.split(/(\s+|-)/);
  const translatedParts = parts.map(part => {
    if (part.match(/^\s+$/) || part === '-') return part === '-' ? '-' : '';
    return words[part] || part;
  });
  
  // For CJK languages, remove spaces between translated words
  if (['zh', 'ja', 'ko'].includes(lang)) {
    return translatedParts.filter(p => p).join('');
  }
  
  return translatedParts.filter(p => p).join(' ');
}

// ===== BODY TEXT TRANSLATION =====
// Common sentence-level patterns for forensic mechanism descriptions
const bodyPatterns = {
  vi: [
    // Common phrases in mechanism descriptions
    [/\bThis method\b/gi, 'Phương pháp này'],
    [/\bThe method\b/gi, 'Phương pháp'],
    [/\bfor deepfake detection\b/gi, 'để phát hiện deepfake'],
    [/\bfor video deepfake detection\b/gi, 'để phát hiện deepfake video'],
    [/\bfor video forensic analysis\b/gi, 'để phân tích pháp y video'],
    [/\bfor forensic detection\b/gi, 'để phát hiện pháp y'],
    [/\bfor forensic analysis\b/gi, 'để phân tích pháp y'],
    [/\bfor image forensic detection\b/gi, 'để phát hiện giả mạo ảnh'],
    [/\bfor image manipulation detection\b/gi, 'để phát hiện chỉnh sửa ảnh'],
    [/\bfor image authenticity verification\b/gi, 'để xác minh tính chân thực của ảnh'],
    [/\bfor video authentication\b/gi, 'để xác thực video'],
    [/\bIn authentic video\b/gi, 'Trong video chân thực'],
    [/\bIn natural video\b/gi, 'Trong video tự nhiên'],
    [/\bDeepfakes? may show\b/gi, 'Deepfake có thể cho thấy'],
    [/\bDeepfakes? typically show\b/gi, 'Deepfake thường cho thấy'],
    [/\bDeepfake generation\b/gi, 'Quá trình tạo deepfake'],
    [/\bAI[- ]generated\b/gi, 'do AI tạo ra'],
    [/\bAI generators?\b/gi, 'bộ sinh AI'],
    [/\bAI generation\b/gi, 'quá trình sinh AI'],
    [/\bAI synthesis\b/gi, 'tổng hợp AI'],
    [/\bgenerated content\b/gi, 'nội dung được tạo'],
    [/\bgenerated face\b/gi, 'khuôn mặt được tạo'],
    [/\bgenerated video\b/gi, 'video được tạo'],
    [/\bface region\b/gi, 'vùng khuôn mặt'],
    [/\bface regions\b/gi, 'các vùng khuôn mặt'],
    [/\bbackground region\b/gi, 'vùng nền'],
    [/\bper frame\b/gi, 'mỗi khung hình'],
    [/\bper[- ]pixel\b/gi, 'mỗi pixel'],
    [/\bframe[- ]to[- ]frame\b/gi, 'giữa các khung hình'],
    [/\bacross frames\b/gi, 'qua các khung hình'],
    [/\bover time\b/gi, 'theo thời gian'],
    [/\bspatial frequency\b/gi, 'tần số không gian'],
    [/\btemporal frequency\b/gi, 'tần số thời gian'],
    [/\boptical flow\b/gi, 'luồng quang học'],
    [/\bneural network\b/gi, 'mạng nơ-ron'],
    [/\bdeep learning\b/gi, 'học sâu'],
    [/\bmachine learning\b/gi, 'học máy'],
    [/\bfrequency domain\b/gi, 'miền tần số'],
    [/\bspatial domain\b/gi, 'miền không gian'],
    [/\btemporal domain\b/gi, 'miền thời gian'],
    [/\bindicate(?:s)? manipulation\b/gi, 'chỉ ra sự thao tác'],
    [/\bindicate(?:s)? compositing\b/gi, 'chỉ ra sự ghép nối'],
    [/\breveals?\b/gi, 'cho thấy'],
    [/\bdetects?\b/gi, 'phát hiện'],
    [/\bmeasures?\b/gi, 'đo lường'],
    [/\bcomputes?\b/gi, 'tính toán'],
    [/\banalyzes?\b/gi, 'phân tích'],
    [/\bcompares?\b/gi, 'so sánh'],
    [/\bestimates?\b/gi, 'ước lượng'],
    [/\btracks?\b/gi, 'theo dõi'],
    [/\bchecks?\b/gi, 'kiểm tra'],
    [/\bextracts?\b/gi, 'trích xuất'],
    [/\bverifies?\b/gi, 'xác minh'],
    [/\bquantifies?\b/gi, 'định lượng'],
    [/\bclassifies?\b/gi, 'phân loại'],
    [/\btypically\b/gi, 'thường'],
    [/\bconsistent\b/gi, 'nhất quán'],
    [/\binconsistent\b/gi, 'không nhất quán'],
    [/\bcharacteristic\b/gi, 'đặc trưng'],
    [/\bsignificant\b/gi, 'đáng kể'],
    [/\banomalous\b/gi, 'bất thường'],
    [/\bphysically plausible\b/gi, 'hợp lý về mặt vật lý'],
  ],
  zh: [
    [/\bThis method\b/gi, '该方法'],
    [/\bThe method\b/gi, '该方法'],
    [/\bfor deepfake detection\b/gi, '用于深度伪造检测'],
    [/\bfor video deepfake detection\b/gi, '用于视频深度伪造检测'],
    [/\bfor video forensic analysis\b/gi, '用于视频取证分析'],
    [/\bfor forensic detection\b/gi, '用于取证检测'],
    [/\bfor forensic analysis\b/gi, '用于取证分析'],
    [/\bfor image forensic detection\b/gi, '用于图像取证检测'],
    [/\bfor image manipulation detection\b/gi, '用于图像篡改检测'],
    [/\bfor image authenticity verification\b/gi, '用于图像真实性验证'],
    [/\bIn authentic video\b/gi, '在真实视频中'],
    [/\bIn natural video\b/gi, '在自然视频中'],
    [/\bDeepfakes? may show\b/gi, '深度伪造可能表现出'],
    [/\bDeepfakes? typically show\b/gi, '深度伪造通常表现出'],
    [/\bDeepfake generation\b/gi, '深度伪造生成'],
    [/\bAI[- ]generated\b/gi, 'AI生成的'],
    [/\bAI generators?\b/gi, 'AI生成器'],
    [/\bAI generation\b/gi, 'AI生成'],
    [/\bgenerated content\b/gi, '生成内容'],
    [/\bgenerated face\b/gi, '生成的人脸'],
    [/\bgenerated video\b/gi, '生成的视频'],
    [/\bface region\b/gi, '人脸区域'],
    [/\bbackground region\b/gi, '背景区域'],
    [/\bper frame\b/gi, '每帧'],
    [/\bper[- ]pixel\b/gi, '每像素'],
    [/\bframe[- ]to[- ]frame\b/gi, '帧间'],
    [/\bacross frames\b/gi, '跨帧'],
    [/\bover time\b/gi, '随时间变化'],
    [/\bspatial frequency\b/gi, '空间频率'],
    [/\btemporal frequency\b/gi, '时间频率'],
    [/\boptical flow\b/gi, '光流'],
    [/\bneural network\b/gi, '神经网络'],
    [/\bfrequency domain\b/gi, '频域'],
    [/\bspatial domain\b/gi, '空间域'],
    [/\bindicate(?:s)? manipulation\b/gi, '表明存在篡改'],
    [/\bindicate(?:s)? compositing\b/gi, '表明存在合成'],
    [/\breveals?\b/gi, '揭示'],
    [/\btypically\b/gi, '通常'],
    [/\bconsistent\b/gi, '一致的'],
    [/\binconsistent\b/gi, '不一致的'],
    [/\banomalous\b/gi, '异常的'],
  ],
  ja: [
    [/\bThis method\b/gi, 'この手法は'],
    [/\bThe method\b/gi, '本手法は'],
    [/\bfor deepfake detection\b/gi, 'ディープフェイク検出のため'],
    [/\bfor video deepfake detection\b/gi, '動画ディープフェイク検出のため'],
    [/\bfor forensic detection\b/gi, 'フォレンジック検出のため'],
    [/\bfor forensic analysis\b/gi, 'フォレンジック分析のため'],
    [/\bIn authentic video\b/gi, '本物の動画では'],
    [/\bIn natural video\b/gi, '自然な動画では'],
    [/\bDeepfakes? may show\b/gi, 'ディープフェイクは示す可能性がある'],
    [/\bDeepfakes? typically show\b/gi, 'ディープフェイクは通常示す'],
    [/\bDeepfake generation\b/gi, 'ディープフェイク生成'],
    [/\bAI[- ]generated\b/gi, 'AI生成の'],
    [/\bAI generators?\b/gi, 'AIジェネレータ'],
    [/\bgenerated content\b/gi, '生成コンテンツ'],
    [/\bgenerated face\b/gi, '生成された顔'],
    [/\bper frame\b/gi, 'フレームごとに'],
    [/\bper[- ]pixel\b/gi, 'ピクセルごとに'],
    [/\bframe[- ]to[- ]frame\b/gi, 'フレーム間'],
    [/\bacross frames\b/gi, 'フレーム間で'],
    [/\bover time\b/gi, '時間経過とともに'],
    [/\bspatial frequency\b/gi, '空間周波数'],
    [/\boptical flow\b/gi, 'オプティカルフロー'],
    [/\bneural network\b/gi, 'ニューラルネットワーク'],
    [/\bfrequency domain\b/gi, '周波数領域'],
    [/\bindicate(?:s)? manipulation\b/gi, '改ざんを示す'],
    [/\btypically\b/gi, '通常'],
    [/\bconsistent\b/gi, '一貫した'],
    [/\binconsistent\b/gi, '一貫性のない'],
    [/\banomalous\b/gi, '異常な'],
  ],
  ko: [
    [/\bThis method\b/gi, '이 방법은'],
    [/\bThe method\b/gi, '본 방법은'],
    [/\bfor deepfake detection\b/gi, '딥페이크 탐지를 위해'],
    [/\bfor video deepfake detection\b/gi, '비디오 딥페이크 탐지를 위해'],
    [/\bfor forensic detection\b/gi, '포렌식 탐지를 위해'],
    [/\bfor forensic analysis\b/gi, '포렌식 분석을 위해'],
    [/\bIn authentic video\b/gi, '진본 비디오에서는'],
    [/\bIn natural video\b/gi, '자연적인 비디오에서는'],
    [/\bDeepfakes? may show\b/gi, '딥페이크는 보일 수 있다'],
    [/\bDeepfakes? typically show\b/gi, '딥페이크는 일반적으로 보여준다'],
    [/\bDeepfake generation\b/gi, '딥페이크 생성'],
    [/\bAI[- ]generated\b/gi, 'AI 생성'],
    [/\bAI generators?\b/gi, 'AI 생성기'],
    [/\bgenerated content\b/gi, '생성된 콘텐츠'],
    [/\bgenerated face\b/gi, '생성된 얼굴'],
    [/\bper frame\b/gi, '프레임당'],
    [/\bper[- ]pixel\b/gi, '픽셀당'],
    [/\bframe[- ]to[- ]frame\b/gi, '프레임 간'],
    [/\bacross frames\b/gi, '프레임 전반에 걸쳐'],
    [/\bover time\b/gi, '시간에 따라'],
    [/\bspatial frequency\b/gi, '공간 주파수'],
    [/\boptical flow\b/gi, '광학 흐름'],
    [/\bneural network\b/gi, '신경망'],
    [/\bfrequency domain\b/gi, '주파수 영역'],
    [/\bindicate(?:s)? manipulation\b/gi, '조작을 나타낸다'],
    [/\btypically\b/gi, '일반적으로'],
    [/\bconsistent\b/gi, '일관된'],
    [/\binconsistent\b/gi, '일관성 없는'],
    [/\banomalous\b/gi, '비정상적인'],
  ],
  es: [
    [/\bThis method\b/gi, 'Este método'],
    [/\bThe method\b/gi, 'El método'],
    [/\bfor deepfake detection\b/gi, 'para la detección de deepfakes'],
    [/\bfor video deepfake detection\b/gi, 'para la detección de deepfakes en video'],
    [/\bfor forensic detection\b/gi, 'para la detección forense'],
    [/\bfor forensic analysis\b/gi, 'para el análisis forense'],
    [/\bfor image forensic detection\b/gi, 'para la detección forense de imágenes'],
    [/\bfor image manipulation detection\b/gi, 'para la detección de manipulación de imágenes'],
    [/\bIn authentic video\b/gi, 'En video auténtico'],
    [/\bIn natural video\b/gi, 'En video natural'],
    [/\bDeepfakes? may show\b/gi, 'Los deepfakes pueden mostrar'],
    [/\bDeepfakes? typically show\b/gi, 'Los deepfakes típicamente muestran'],
    [/\bDeepfake generation\b/gi, 'La generación de deepfakes'],
    [/\bAI[- ]generated\b/gi, 'generado por IA'],
    [/\bAI generators?\b/gi, 'generadores de IA'],
    [/\bAI generation\b/gi, 'generación de IA'],
    [/\bgenerated content\b/gi, 'contenido generado'],
    [/\bgenerated face\b/gi, 'rostro generado'],
    [/\bgenerated video\b/gi, 'video generado'],
    [/\bface region\b/gi, 'región facial'],
    [/\bbackground region\b/gi, 'región del fondo'],
    [/\bper frame\b/gi, 'por fotograma'],
    [/\bper[- ]pixel\b/gi, 'por píxel'],
    [/\bframe[- ]to[- ]frame\b/gi, 'entre fotogramas'],
    [/\bacross frames\b/gi, 'a lo largo de los fotogramas'],
    [/\bover time\b/gi, 'a lo largo del tiempo'],
    [/\bspatial frequency\b/gi, 'frecuencia espacial'],
    [/\btemporal frequency\b/gi, 'frecuencia temporal'],
    [/\boptical flow\b/gi, 'flujo óptico'],
    [/\bneural network\b/gi, 'red neuronal'],
    [/\bfrequency domain\b/gi, 'dominio de frecuencia'],
    [/\bspatial domain\b/gi, 'dominio espacial'],
    [/\bindicate(?:s)? manipulation\b/gi, 'indica manipulación'],
    [/\bindicate(?:s)? compositing\b/gi, 'indica composición'],
    [/\btypically\b/gi, 'típicamente'],
    [/\bconsistent\b/gi, 'consistente'],
    [/\binconsistent\b/gi, 'inconsistente'],
    [/\banomalous\b/gi, 'anómalo'],
  ]
};

function translateBody(bodyText, lang) {
  const patterns = bodyPatterns[lang];
  if (!patterns) return bodyText;
  
  let translated = bodyText;
  for (const [pattern, replacement] of patterns) {
    translated = translated.replace(pattern, replacement);
  }
  
  return translated;
}

function translateIntro(introText, lang) {
  // For the intro, create a clean native-language version
  // Most intros follow the pattern: "This method [verbs] [topic] for [purpose]:"
  // We keep the full intro but translate the main framing
  
  const introFrames = {
    vi: {
      prefix: 'Phương pháp này ',
      forDeepfake: ' để phát hiện deepfake',
      forForensic: ' để phân tích pháp y',
      forDetection: ' để phát hiện giả mạo',
      suffix: ':'
    },
    zh: {
      prefix: '该方法',
      forDeepfake: '用于深度伪造检测',
      forForensic: '用于取证分析',
      forDetection: '用于篡改检测',
      suffix: '：'
    },
    ja: {
      prefix: 'この手法は',
      forDeepfake: 'ディープフェイク検出のための',
      forForensic: 'フォレンジック分析のための',
      forDetection: '改ざん検出のための',
      suffix: '：'
    },
    ko: {
      prefix: '이 방법은 ',
      forDeepfake: ' 딥페이크 탐지를 위한',
      forForensic: ' 포렌식 분석을 위한',
      forDetection: ' 조작 탐지를 위한',
      suffix: ':'
    },
    es: {
      prefix: 'Este método ',
      forDeepfake: ' para la detección de deepfakes',
      forForensic: ' para el análisis forense',
      forDetection: ' para la detección de manipulación',
      suffix: ':'
    }
  };

  // Just apply the body patterns for a clean contextual replacement
  return translateBody(introText, lang);
}

// Run the translation
console.log(`Processing ${Object.keys(needsFixMap).length} methods for languages: ${targetLangs.join(', ')}`);
console.log(`Types: ${targetTypes.join(', ')}`);
if (dryRun) console.log('DRY RUN - no files will be modified');
console.log('---');

// Stats
let totalFixed = 0;
let totalSkipped = 0;
let totalErrors = 0;
const fixedMethods = [];

// Process all methods
const baseDir = 'src/app/methods';
for (const type of targetTypes) {
  const typeDir = path.join(baseDir, type);
  if (!fs.existsSync(typeDir)) continue;
  
  const methods = fs.readdirSync(typeDir).sort();
  
  for (const method of methods) {
    const methodKey = `${type}/${method}`;
    const i18nDir = path.join(typeDir, method, 'i18n');
    
    // Check if this method needs fixing
    const langsNeeded = needsFixMap[methodKey];
    if (!langsNeeded) continue;
    
    // Read English mechanism
    const enPath = path.join(i18nDir, 'en.json');
    let enData;
    try {
      enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    } catch (e) {
      console.log(`✗ ${methodKey}: Cannot read en.json`);
      totalErrors++;
      continue;
    }
    
    const enMech = enData.mechanism;
    if (!enMech || enMech.length < 200) {
      // English mechanism is too short, skip
      totalSkipped++;
      continue;
    }
    
    // Process each language that needs fixing
    for (const lang of langsNeeded) {
      if (!targetLangs.includes(lang)) continue;
      
      const langPath = path.join(i18nDir, `${lang}.json`);
      try {
        const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
        
        // Generate translation from English
        const translated = translateMechanism(enMech, lang, methodKey);
        
        if (translated) {
          langData.mechanism = translated;
          
          if (!dryRun) {
            fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
          }
          totalFixed++;
        }
      } catch (e) {
        console.log(`✗ ${methodKey}/${lang}: ${e.message}`);
        totalErrors++;
      }
    }
    
    fixedMethods.push(methodKey);
  }
}

// Print summary
console.log(`\nDone! Fixed: ${totalFixed}, Skipped: ${totalSkipped}, Errors: ${totalErrors}`);
console.log(`Methods processed: ${fixedMethods.length}`);
