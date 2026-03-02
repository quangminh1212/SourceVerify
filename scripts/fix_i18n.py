#!/usr/bin/env python3
"""
fix_i18n.py — Automatically create missing i18n locale files and fill empty fields.

For each method's i18n folder:
  - If en.json exists but es/ja/ko/zh.json are missing → create them with translated content
  - If a locale file exists but has empty string values → fill from en.json with translation

Also fixes global locale files in src/i18n/locales/ (es, ja, ko, zh) by adding missing keys.

Translation approach: Uses simple dictionary-based translation for key terms,
keeping technical/academic content in English where appropriate (references, URLs, parameters).
"""

import json
import os
import sys
import glob
import re

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
METHODS_DIR = os.path.join(BASE_DIR, "src", "app", "methods")
GLOBAL_LOCALES_DIR = os.path.join(BASE_DIR, "src", "i18n", "locales")

LOCALES = ["es", "ja", "ko", "zh"]

# Translation dictionaries for method names and key terms
TRANSLATIONS = {
    "es": {
        # Common terms
        "Detection": "Detección",
        "Analysis": "Análisis",
        "Consistency": "Consistencia",
        "Verification": "Verificación",
        "Forensics": "Forense",
        "Pattern": "Patrón",
        "Anomaly": "Anomalía",
        "Distribution": "Distribución",
        "Frequency": "Frecuencia",
        "Score": "Puntuación",
        "Filter": "Filtro",
        "Transform": "Transformación",
        "Compression": "Compresión",
        "Texture": "Textura",
        "Symmetry": "Simetría",
        "Gradient": "Gradiente",
        "Variance": "Varianza",
        "Map": "Mapa",
        "Artifact": "Artefacto",
        "Fingerprint": "Huella",
        "Density": "Densidad",
        "Descriptor": "Descriptor",
        "High": "Alta",
        "Moderate": "Moderada",
        "Low": "Baja",
        "strengths_prefix": "Fortalezas",
        "limitations_prefix": "Limitaciones",
    },
    "ja": {
        "Detection": "検出",
        "Analysis": "分析",
        "Consistency": "整合性",
        "Verification": "検証",
        "Forensics": "フォレンジック",
        "Pattern": "パターン",
        "Anomaly": "異常",
        "Distribution": "分布",
        "Frequency": "周波数",
        "Score": "スコア",
        "Filter": "フィルタ",
        "Transform": "変換",
        "Compression": "圧縮",
        "Texture": "テクスチャ",
        "Symmetry": "対称性",
        "Gradient": "勾配",
        "Variance": "分散",
        "Map": "マップ",
        "Artifact": "アーティファクト",
        "Fingerprint": "フィンガープリント",
        "Density": "密度",
        "Descriptor": "記述子",
        "High": "高い",
        "Moderate": "中程度",
        "Low": "低い",
    },
    "ko": {
        "Detection": "탐지",
        "Analysis": "분석",
        "Consistency": "일관성",
        "Verification": "검증",
        "Forensics": "포렌식",
        "Pattern": "패턴",
        "Anomaly": "이상",
        "Distribution": "분포",
        "Frequency": "주파수",
        "Score": "점수",
        "Filter": "필터",
        "Transform": "변환",
        "Compression": "압축",
        "Texture": "텍스처",
        "Symmetry": "대칭",
        "Gradient": "그라디언트",
        "Variance": "분산",
        "Map": "맵",
        "Artifact": "아티팩트",
        "Fingerprint": "핑거프린트",
        "Density": "밀도",
        "Descriptor": "디스크립터",
        "High": "높음",
        "Moderate": "보통",
        "Low": "낮음",
    },
    "zh": {
        "Detection": "检测",
        "Analysis": "分析",
        "Consistency": "一致性",
        "Verification": "验证",
        "Forensics": "取证",
        "Pattern": "模式",
        "Anomaly": "异常",
        "Distribution": "分布",
        "Frequency": "频率",
        "Score": "评分",
        "Filter": "滤波",
        "Transform": "变换",
        "Compression": "压缩",
        "Texture": "纹理",
        "Symmetry": "对称性",
        "Gradient": "梯度",
        "Variance": "方差",
        "Map": "映射",
        "Artifact": "伪影",
        "Fingerprint": "指纹",
        "Density": "密度",
        "Descriptor": "描述符",
        "High": "高",
        "Moderate": "中等",
        "Low": "低",
    },
}

# Full method name translations
METHOD_NAMES = {
    "es": {
        "Error Level Analysis (ELA)": "Análisis de Nivel de Error (ELA)",
        "Metadata Analysis": "Análisis de Metadatos",
        "Spectral Analysis": "Análisis Espectral",
        "Noise Analysis": "Análisis de Ruido",
        "Edge Detection": "Detección de Bordes",
        "Gradient Analysis": "Análisis de Gradiente",
        "Benford's Law Analysis": "Análisis de Ley de Benford",
        "Chromatic Analysis": "Análisis Cromático",
        "Texture Analysis": "Análisis de Textura",
        "CFA Pattern Analysis": "Análisis de Patrón CFA",
        "DCT Analysis": "Análisis DCT",
        "Color Correlation": "Correlación de Color",
        "PRNU Analysis": "Análisis PRNU",
        "Copy-Move Detection": "Detección de Copia-Movimiento",
        "Splicing Detection": "Detección de Empalme",
        "Histogram Analysis": "Análisis de Histograma",
        "Wavelet Analysis": "Análisis Wavelet",
        "JPEG Ghost Detection": "Detección de Fantasma JPEG",
        "Chi-Square Analysis": "Análisis Chi-Cuadrado",
        "Entropy Analysis": "Análisis de Entropía",
        "GAN Fingerprint Detection": "Detección de Huella GAN",
        "Diffusion Model Detection": "Detección de Modelo de Difusión",
        "Noiseprint Analysis": "Análisis Noiseprint",
        "Upscaling Detection": "Detección de Escalado",
        "Frequency Band Analysis": "Análisis de Banda de Frecuencia",
        "Lighting Consistency": "Consistencia de Iluminación",
        "Shadow Consistency": "Consistencia de Sombras",
        "Perspective Analysis": "Análisis de Perspectiva",
        "Reflection Analysis": "Análisis de Reflexión",
        "Double JPEG Detection": "Detección de Doble JPEG",
        "PatchForensics Detection": "Detección PatchForensics",
        "CLIP-based Detection": "Detección basada en CLIP",
        "Fourier Ring Analysis": "Análisis de Anillo de Fourier",
        "ResNet Classifier": "Clasificador ResNet",
        "ViT Detection": "Detección ViT",
        "Gram Matrix Analysis": "Análisis de Matriz Gram",
        "SRM Filter Analysis": "Análisis de Filtro SRM",
        "Autocorrelation Analysis": "Análisis de Autocorrelación",
        "Pixel Co-occurrence Analysis": "Análisis de Co-ocurrencia de Píxeles",
        "Tamura Texture Analysis": "Análisis de Textura Tamura",
        "LPQ Analysis": "Análisis LPQ",
        "Fractal Dimension Analysis": "Análisis de Dimensión Fractal",
        "Bilateral Symmetry Analysis": "Análisis de Simetría Bilateral",
        "Histogram Gradient Analysis": "Análisis de Gradiente de Histograma",
        "Color Coherence Analysis": "Análisis de Coherencia de Color",
        "Mutual Information Analysis": "Análisis de Información Mutua",
        "Laplacian Edge Analysis": "Análisis de Bordes Laplaciano",
        "Color Banding Detection": "Detección de Bandas de Color",
        "Color Gamut Analysis": "Análisis de Gama de Color",
        "Gabor Response Analysis": "Análisis de Respuesta Gabor",
        "GLCM Analysis": "Análisis GLCM",
        "Higher-Order Statistics": "Estadísticas de Orden Superior",
        "HOG Anomaly Detection": "Detección de Anomalías HOG",
        "Local Binary Pattern": "Patrón Binario Local",
        "Local Variance Map": "Mapa de Varianza Local",
        "Markov Transition Analysis": "Análisis de Transición de Markov",
        "Morphological Gradient": "Gradiente Morfológico",
        "Phase Congruency Analysis": "Análisis de Congruencia de Fase",
        "Power Spectral Density": "Densidad Espectral de Potencia",
        "Quantization Fingerprint": "Huella de Cuantización",
        "Radial Spectrum Analysis": "Análisis de Espectro Radial",
        "Saturation Distribution": "Distribución de Saturación",
        "Upsampling Artifact Detection": "Detección de Artefactos de Sobremuestreo",
        "Weber Descriptor Analysis": "Análisis de Descriptor Weber",
        "White Balance Analysis": "Análisis de Balance de Blancos",
        "Zipf's Law Analysis": "Análisis de Ley de Zipf",
        "Median Filter Detection": "Detección de Filtro Mediana",
        "Resampling Detection": "Detección de Remuestreo",
        "Contrast Enhancement Detection": "Detección de Mejora de Contraste",
        "BRISQUE Quality Assessment": "Evaluación de Calidad BRISQUE",
        "Demosaicing Analysis": "Análisis de Demosaicing",
        "Steganalysis": "Esteganoanálisis",
        "Thumbnail Analysis": "Análisis de Miniatura",
        "Perceptual Hash Analysis": "Análisis de Hash Perceptual",
        "Illuminant Map Analysis": "Análisis de Mapa de Iluminación",
        "Radon Transform Analysis": "Análisis de Transformada de Radon",
        "Zernike Moments Analysis": "Análisis de Momentos de Zernike",
        "Camera Model Identification": "Identificación de Modelo de Cámara",
        "Image Phylogeny Analysis": "Análisis de Filogenia de Imagen",
        "Blocking Artifact Detection": "Detección de Artefactos de Bloqueo",
        "EfficientNet Detection": "Detección EfficientNet",
        "Attention Consistency Analysis": "Análisis de Consistencia de Atención",
        "Style Transfer Detection": "Detección de Transferencia de Estilo",
        "Color Temperature Analysis": "Análisis de Temperatura de Color",
        "SIFT Forensics Analysis": "Análisis Forense SIFT",
        "Neural Compression Analysis": "Análisis de Compresión Neural",
        "EXIF Integrity Check": "Verificación de Integridad EXIF",
        "XMP Provenance Analysis": "Análisis de Procedencia XMP",
        "IPTC Verification": "Verificación IPTC",
        "GPS Consistency Check": "Verificación de Consistencia GPS",
        "Timestamp Forensics": "Forense de Marcas de Tiempo",
        "File Structure Analysis": "Análisis de Estructura de Archivo",
        "Color Profile Metadata": "Metadatos de Perfil de Color",
        "C2PA Verification": "Verificación C2PA",
        "Resolution Consistency": "Consistencia de Resolución",
        "Software Fingerprint": "Huella de Software",
        # Video
        "Face Landmark Analysis": "Análisis de Puntos Faciales",
        "Temporal Consistency Analysis": "Análisis de Consistencia Temporal",
        "Lip Sync Analysis": "Análisis de Sincronización Labial",
        "Frame Interpolation Detection": "Detección de Interpolación de Cuadros",
        "Optical Flow Anomaly": "Anomalía de Flujo Óptico",
        "Audio-Visual Sync Analysis": "Análisis de Sincronización Audio-Visual",
        "Deepfake Artifact Detection": "Detección de Artefactos Deepfake",
        "Scene Transition Analysis": "Análisis de Transición de Escena",
        "Motion Blur Consistency": "Consistencia de Desenfoque de Movimiento",
        "Background Stability Analysis": "Análisis de Estabilidad de Fondo",
        "Gaze Direction Analysis": "Análisis de Dirección de Mirada",
        "Facial Reenactment Detection": "Detección de Recreación Facial",
        "Video Compression Trace": "Traza de Compresión de Video",
        "Flicker Analysis": "Análisis de Parpadeo",
        "Hand Gesture Consistency": "Consistencia de Gestos de Mano",
        "Body Proportion Analysis": "Análisis de Proporción Corporal",
        # Text
        "Perplexity Analysis": "Análisis de Perplejidad",
        "Burstiness Detection": "Detección de Ráfagas",
        "Vocabulary Diversity": "Diversidad de Vocabulario",
        "Stylometric Analysis": "Análisis Estilométrico",
        "N-gram Frequency Analysis": "Análisis de Frecuencia N-gram",
        "Repetition Pattern Detection": "Detección de Patrones de Repetición",
        "Coherence Analysis": "Análisis de Coherencia",
        "Entropy Distribution Analysis": "Análisis de Distribución de Entropía",
        "Sentence Length Variance": "Varianza de Longitud de Oración",
        "Readability Score Analysis": "Análisis de Puntuación de Legibilidad",
        "Punctuation Pattern Analysis": "Análisis de Patrones de Puntuación",
        "Topic Consistency Analysis": "Análisis de Consistencia Temática",
        "Word Frequency Rank Analysis": "Análisis de Rango de Frecuencia de Palabras",
        "Semantic Density Analysis": "Análisis de Densidad Semántica",
        "Writing Rhythm Analysis": "Análisis de Ritmo de Escritura",
    },
    "ja": {
        "Error Level Analysis (ELA)": "エラーレベル分析 (ELA)",
        "Metadata Analysis": "メタデータ分析",
        "Spectral Analysis": "スペクトル分析",
        "Noise Analysis": "ノイズ分析",
        "Edge Detection": "エッジ検出",
        "Gradient Analysis": "勾配分析",
        "Benford's Law Analysis": "ベンフォードの法則分析",
        "Chromatic Analysis": "色彩分析",
        "Texture Analysis": "テクスチャ分析",
        "CFA Pattern Analysis": "CFAパターン分析",
        "DCT Analysis": "DCT分析",
        "Color Correlation": "色相関分析",
        "PRNU Analysis": "PRNU分析",
        "Copy-Move Detection": "コピームーブ検出",
        "Splicing Detection": "スプライシング検出",
        "Histogram Analysis": "ヒストグラム分析",
        "Wavelet Analysis": "ウェーブレット分析",
        "JPEG Ghost Detection": "JPEGゴースト検出",
        "Chi-Square Analysis": "カイ二乗分析",
        "Entropy Analysis": "エントロピー分析",
        "GAN Fingerprint Detection": "GANフィンガープリント検出",
        "Diffusion Model Detection": "拡散モデル検出",
        "Noiseprint Analysis": "ノイズプリント分析",
        "Upscaling Detection": "アップスケーリング検出",
        "Frequency Band Analysis": "周波数帯域分析",
        "Lighting Consistency": "照明の整合性分析",
        "Shadow Consistency": "影の整合性分析",
        "Perspective Analysis": "パースペクティブ分析",
        "Reflection Analysis": "反射分析",
        "Double JPEG Detection": "二重JPEG検出",
        "PatchForensics Detection": "PatchForensics検出",
        "CLIP-based Detection": "CLIP ベース検出",
        "Fourier Ring Analysis": "フーリエリング分析",
        "ResNet Classifier": "ResNet分類器",
        "ViT Detection": "ViT検出",
        "Gram Matrix Analysis": "グラム行列分析",
        "SRM Filter Analysis": "SRMフィルタ分析",
        "Autocorrelation Analysis": "自己相関分析",
        "Pixel Co-occurrence Analysis": "ピクセル共起分析",
        "Tamura Texture Analysis": "タムラテクスチャ分析",
        "LPQ Analysis": "LPQ分析",
        "Fractal Dimension Analysis": "フラクタル次元分析",
        "Bilateral Symmetry Analysis": "左右対称性分析",
        "Histogram Gradient Analysis": "ヒストグラム勾配分析",
        "Color Coherence Analysis": "色コヒーレンス分析",
        "Mutual Information Analysis": "相互情報量分析",
        "Laplacian Edge Analysis": "ラプラシアンエッジ分析",
        "Color Banding Detection": "カラーバンディング検出",
        "Color Gamut Analysis": "色域分析",
        "Gabor Response Analysis": "ガボール応答分析",
        "GLCM Analysis": "GLCM分析",
        "Higher-Order Statistics": "高次統計量",
        "HOG Anomaly Detection": "HOG異常検出",
        "Local Binary Pattern": "局所二値パターン",
        "Local Variance Map": "局所分散マップ",
        "Markov Transition Analysis": "マルコフ遷移分析",
        "Morphological Gradient": "形態学的勾配",
        "Phase Congruency Analysis": "位相一致性分析",
        "Power Spectral Density": "パワースペクトル密度",
        "Quantization Fingerprint": "量子化フィンガープリント",
        "Radial Spectrum Analysis": "放射スペクトル分析",
        "Saturation Distribution": "彩度分布",
        "Upsampling Artifact Detection": "アップサンプリングアーティファクト検出",
        "Weber Descriptor Analysis": "ウェーバー記述子分析",
        "White Balance Analysis": "ホワイトバランス分析",
        "Zipf's Law Analysis": "ジップの法則分析",
        "Median Filter Detection": "メディアンフィルタ検出",
        "Resampling Detection": "リサンプリング検出",
        "Contrast Enhancement Detection": "コントラスト強調検出",
        "BRISQUE Quality Assessment": "BRISQUE品質評価",
        "Demosaicing Analysis": "デモザイク分析",
        "Steganalysis": "ステガナリシス",
        "Thumbnail Analysis": "サムネイル分析",
        "Perceptual Hash Analysis": "知覚ハッシュ分析",
        "Illuminant Map Analysis": "光源マップ分析",
        "Radon Transform Analysis": "ラドン変換分析",
        "Zernike Moments Analysis": "ゼルニケモーメント分析",
        "Camera Model Identification": "カメラモデル識別",
        "Image Phylogeny Analysis": "画像系統分析",
        "Blocking Artifact Detection": "ブロッキングアーティファクト検出",
        "EfficientNet Detection": "EfficientNet検出",
        "Attention Consistency Analysis": "アテンション整合性分析",
        "Style Transfer Detection": "スタイル転送検出",
        "Color Temperature Analysis": "色温度分析",
        "SIFT Forensics Analysis": "SIFTフォレンジック分析",
        "Neural Compression Analysis": "ニューラル圧縮分析",
        "EXIF Integrity Check": "EXIF整合性チェック",
        "XMP Provenance Analysis": "XMP来歴分析",
        "IPTC Verification": "IPTC検証",
        "GPS Consistency Check": "GPS整合性チェック",
        "Timestamp Forensics": "タイムスタンプフォレンジック",
        "File Structure Analysis": "ファイル構造分析",
        "Color Profile Metadata": "カラープロファイルメタデータ",
        "C2PA Verification": "C2PA検証",
        "Resolution Consistency": "解像度整合性",
        "Software Fingerprint": "ソフトウェアフィンガープリント",
        # Video
        "Face Landmark Analysis": "顔ランドマーク分析",
        "Temporal Consistency Analysis": "時間的整合性分析",
        "Lip Sync Analysis": "リップシンク分析",
        "Frame Interpolation Detection": "フレーム補間検出",
        "Optical Flow Anomaly": "オプティカルフロー異常",
        "Audio-Visual Sync Analysis": "音声映像同期分析",
        "Deepfake Artifact Detection": "ディープフェイクアーティファクト検出",
        "Scene Transition Analysis": "シーン遷移分析",
        "Motion Blur Consistency": "モーションブラー整合性",
        "Background Stability Analysis": "背景安定性分析",
        "Gaze Direction Analysis": "視線方向分析",
        "Facial Reenactment Detection": "顔再演出検出",
        "Video Compression Trace": "動画圧縮トレース",
        "Flicker Analysis": "フリッカー分析",
        "Hand Gesture Consistency": "ハンドジェスチャー整合性",
        "Body Proportion Analysis": "体型比率分析",
        # Text
        "Perplexity Analysis": "パープレキシティ分析",
        "Burstiness Detection": "バースト性検出",
        "Vocabulary Diversity": "語彙多様性",
        "Stylometric Analysis": "文体計量分析",
        "N-gram Frequency Analysis": "N-gram頻度分析",
        "Repetition Pattern Detection": "反復パターン検出",
        "Coherence Analysis": "コヒーレンス分析",
        "Entropy Distribution Analysis": "エントロピー分布分析",
        "Sentence Length Variance": "文長分散",
        "Readability Score Analysis": "読みやすさスコア分析",
        "Punctuation Pattern Analysis": "句読点パターン分析",
        "Topic Consistency Analysis": "トピック一貫性分析",
        "Word Frequency Rank Analysis": "単語頻度ランク分析",
        "Semantic Density Analysis": "意味密度分析",
        "Writing Rhythm Analysis": "文章リズム分析",
    },
    "ko": {
        "Error Level Analysis (ELA)": "오류 수준 분석 (ELA)",
        "Metadata Analysis": "메타데이터 분석",
        "Spectral Analysis": "스펙트럼 분석",
        "Noise Analysis": "노이즈 분석",
        "Edge Detection": "에지 검출",
        "Gradient Analysis": "그라디언트 분석",
        "Benford's Law Analysis": "벤포드 법칙 분석",
        "Chromatic Analysis": "색차 분석",
        "Texture Analysis": "텍스처 분석",
        "CFA Pattern Analysis": "CFA 패턴 분석",
        "DCT Analysis": "DCT 분석",
        "Color Correlation": "색상 상관관계 분석",
        "PRNU Analysis": "PRNU 분석",
        "Copy-Move Detection": "복사-이동 탐지",
        "Splicing Detection": "접합 탐지",
        "Histogram Analysis": "히스토그램 분석",
        "Wavelet Analysis": "웨이블릿 분석",
        "JPEG Ghost Detection": "JPEG 고스트 탐지",
        "Chi-Square Analysis": "카이제곱 분석",
        "Entropy Analysis": "엔트로피 분석",
        "GAN Fingerprint Detection": "GAN 핑거프린트 탐지",
        "Diffusion Model Detection": "확산 모델 탐지",
        "Noiseprint Analysis": "노이즈프린트 분석",
        "Upscaling Detection": "업스케일링 탐지",
        "Frequency Band Analysis": "주파수 대역 분석",
        "Lighting Consistency": "조명 일관성 분석",
        "Shadow Consistency": "그림자 일관성 분석",
        "Perspective Analysis": "원근 분석",
        "Reflection Analysis": "반사 분석",
        "Double JPEG Detection": "이중 JPEG 탐지",
        "PatchForensics Detection": "PatchForensics 탐지",
        "CLIP-based Detection": "CLIP 기반 탐지",
        "Fourier Ring Analysis": "푸리에 링 분석",
        "ResNet Classifier": "ResNet 분류기",
        "ViT Detection": "ViT 탐지",
        "Gram Matrix Analysis": "그램 행렬 분석",
        "SRM Filter Analysis": "SRM 필터 분석",
        "Autocorrelation Analysis": "자기상관 분석",
        "Pixel Co-occurrence Analysis": "픽셀 공기 분석",
        "Tamura Texture Analysis": "타무라 텍스처 분석",
        "LPQ Analysis": "LPQ 분석",
        "Fractal Dimension Analysis": "프랙탈 차원 분석",
        "Bilateral Symmetry Analysis": "양측 대칭 분석",
        "Histogram Gradient Analysis": "히스토그램 그라디언트 분석",
        "Color Coherence Analysis": "색상 일관성 분석",
        "Mutual Information Analysis": "상호 정보량 분석",
        "Laplacian Edge Analysis": "라플라시안 에지 분석",
        "Color Banding Detection": "컬러 밴딩 탐지",
        "Color Gamut Analysis": "색역 분석",
        "Gabor Response Analysis": "가보르 응답 분석",
        "GLCM Analysis": "GLCM 분석",
        "Higher-Order Statistics": "고차 통계",
        "HOG Anomaly Detection": "HOG 이상 탐지",
        "Local Binary Pattern": "지역 이진 패턴",
        "Local Variance Map": "지역 분산 맵",
        "Markov Transition Analysis": "마르코프 전이 분석",
        "Morphological Gradient": "형태학적 그라디언트",
        "Phase Congruency Analysis": "위상 일치 분석",
        "Power Spectral Density": "파워 스펙트럼 밀도",
        "Quantization Fingerprint": "양자화 핑거프린트",
        "Radial Spectrum Analysis": "방사형 스펙트럼 분석",
        "Saturation Distribution": "채도 분포",
        "Upsampling Artifact Detection": "업샘플링 아티팩트 탐지",
        "Weber Descriptor Analysis": "웨버 디스크립터 분석",
        "White Balance Analysis": "화이트 밸런스 분석",
        "Zipf's Law Analysis": "지프 법칙 분석",
        "Median Filter Detection": "미디언 필터 탐지",
        "Resampling Detection": "리샘플링 탐지",
        "Contrast Enhancement Detection": "대비 향상 탐지",
        "BRISQUE Quality Assessment": "BRISQUE 품질 평가",
        "Demosaicing Analysis": "디모자이킹 분석",
        "Steganalysis": "스테가노분석",
        "Thumbnail Analysis": "썸네일 분석",
        "Perceptual Hash Analysis": "지각 해시 분석",
        "Illuminant Map Analysis": "광원 맵 분석",
        "Radon Transform Analysis": "라돈 변환 분석",
        "Zernike Moments Analysis": "제르니케 모멘트 분석",
        "Camera Model Identification": "카메라 모델 식별",
        "Image Phylogeny Analysis": "이미지 계통 분석",
        "Blocking Artifact Detection": "블로킹 아티팩트 탐지",
        "EfficientNet Detection": "EfficientNet 탐지",
        "Attention Consistency Analysis": "어텐션 일관성 분석",
        "Style Transfer Detection": "스타일 전이 탐지",
        "Color Temperature Analysis": "색온도 분석",
        "SIFT Forensics Analysis": "SIFT 포렌식 분석",
        "Neural Compression Analysis": "신경 압축 분석",
        "EXIF Integrity Check": "EXIF 무결성 검사",
        "XMP Provenance Analysis": "XMP 출처 분석",
        "IPTC Verification": "IPTC 검증",
        "GPS Consistency Check": "GPS 일관성 검사",
        "Timestamp Forensics": "타임스탬프 포렌식",
        "File Structure Analysis": "파일 구조 분석",
        "Color Profile Metadata": "색상 프로파일 메타데이터",
        "C2PA Verification": "C2PA 검증",
        "Resolution Consistency": "해상도 일관성",
        "Software Fingerprint": "소프트웨어 핑거프린트",
        # Video
        "Face Landmark Analysis": "얼굴 랜드마크 분석",
        "Temporal Consistency Analysis": "시간적 일관성 분석",
        "Lip Sync Analysis": "립싱크 분석",
        "Frame Interpolation Detection": "프레임 보간 탐지",
        "Optical Flow Anomaly": "광학 흐름 이상",
        "Audio-Visual Sync Analysis": "오디오-비주얼 동기화 분석",
        "Deepfake Artifact Detection": "딥페이크 아티팩트 탐지",
        "Scene Transition Analysis": "장면 전환 분석",
        "Motion Blur Consistency": "모션 블러 일관성",
        "Background Stability Analysis": "배경 안정성 분석",
        "Gaze Direction Analysis": "시선 방향 분석",
        "Facial Reenactment Detection": "얼굴 재연출 탐지",
        "Video Compression Trace": "비디오 압축 추적",
        "Flicker Analysis": "플리커 분석",
        "Hand Gesture Consistency": "손 동작 일관성",
        "Body Proportion Analysis": "체형 비율 분석",
        # Text
        "Perplexity Analysis": "퍼플렉시티 분석",
        "Burstiness Detection": "돌발성 탐지",
        "Vocabulary Diversity": "어휘 다양성",
        "Stylometric Analysis": "문체 계량 분석",
        "N-gram Frequency Analysis": "N-gram 빈도 분석",
        "Repetition Pattern Detection": "반복 패턴 탐지",
        "Coherence Analysis": "일관성 분석",
        "Entropy Distribution Analysis": "엔트로피 분포 분석",
        "Sentence Length Variance": "문장 길이 분산",
        "Readability Score Analysis": "가독성 점수 분석",
        "Punctuation Pattern Analysis": "구두점 패턴 분석",
        "Topic Consistency Analysis": "주제 일관성 분석",
        "Word Frequency Rank Analysis": "단어 빈도 순위 분석",
        "Semantic Density Analysis": "의미 밀도 분석",
        "Writing Rhythm Analysis": "글쓰기 리듬 분석",
    },
    "zh": {
        "Error Level Analysis (ELA)": "误差等级分析 (ELA)",
        "Metadata Analysis": "元数据分析",
        "Spectral Analysis": "光谱分析",
        "Noise Analysis": "噪声分析",
        "Edge Detection": "边缘检测",
        "Gradient Analysis": "梯度分析",
        "Benford's Law Analysis": "本福特定律分析",
        "Chromatic Analysis": "色差分析",
        "Texture Analysis": "纹理分析",
        "CFA Pattern Analysis": "CFA模式分析",
        "DCT Analysis": "DCT分析",
        "Color Correlation": "颜色相关性分析",
        "PRNU Analysis": "PRNU分析",
        "Copy-Move Detection": "复制移动检测",
        "Splicing Detection": "拼接检测",
        "Histogram Analysis": "直方图分析",
        "Wavelet Analysis": "小波分析",
        "JPEG Ghost Detection": "JPEG残影检测",
        "Chi-Square Analysis": "卡方分析",
        "Entropy Analysis": "熵分析",
        "GAN Fingerprint Detection": "GAN指纹检测",
        "Diffusion Model Detection": "扩散模型检测",
        "Noiseprint Analysis": "噪声指纹分析",
        "Upscaling Detection": "放大检测",
        "Frequency Band Analysis": "频带分析",
        "Lighting Consistency": "光照一致性分析",
        "Shadow Consistency": "阴影一致性分析",
        "Perspective Analysis": "透视分析",
        "Reflection Analysis": "反射分析",
        "Double JPEG Detection": "双重JPEG检测",
        "PatchForensics Detection": "PatchForensics检测",
        "CLIP-based Detection": "基于CLIP的检测",
        "Fourier Ring Analysis": "傅里叶环分析",
        "ResNet Classifier": "ResNet分类器",
        "ViT Detection": "ViT检测",
        "Gram Matrix Analysis": "格拉姆矩阵分析",
        "SRM Filter Analysis": "SRM滤波分析",
        "Autocorrelation Analysis": "自相关分析",
        "Pixel Co-occurrence Analysis": "像素共现分析",
        "Tamura Texture Analysis": "Tamura纹理分析",
        "LPQ Analysis": "LPQ分析",
        "Fractal Dimension Analysis": "分形维度分析",
        "Bilateral Symmetry Analysis": "双侧对称分析",
        "Histogram Gradient Analysis": "直方图梯度分析",
        "Color Coherence Analysis": "颜色一致性分析",
        "Mutual Information Analysis": "互信息分析",
        "Laplacian Edge Analysis": "拉普拉斯边缘分析",
        "Color Banding Detection": "色带检测",
        "Color Gamut Analysis": "色域分析",
        "Gabor Response Analysis": "Gabor响应分析",
        "GLCM Analysis": "GLCM分析",
        "Higher-Order Statistics": "高阶统计量",
        "HOG Anomaly Detection": "HOG异常检测",
        "Local Binary Pattern": "局部二值模式",
        "Local Variance Map": "局部方差图",
        "Markov Transition Analysis": "马尔可夫转移分析",
        "Morphological Gradient": "形态学梯度",
        "Phase Congruency Analysis": "相位一致性分析",
        "Power Spectral Density": "功率谱密度",
        "Quantization Fingerprint": "量化指纹",
        "Radial Spectrum Analysis": "径向频谱分析",
        "Saturation Distribution": "饱和度分布",
        "Upsampling Artifact Detection": "上采样伪影检测",
        "Weber Descriptor Analysis": "韦伯描述符分析",
        "White Balance Analysis": "白平衡分析",
        "Zipf's Law Analysis": "齐夫定律分析",
        "Median Filter Detection": "中值滤波检测",
        "Resampling Detection": "重采样检测",
        "Contrast Enhancement Detection": "对比度增强检测",
        "BRISQUE Quality Assessment": "BRISQUE质量评估",
        "Demosaicing Analysis": "去马赛克分析",
        "Steganalysis": "隐写分析",
        "Thumbnail Analysis": "缩略图分析",
        "Perceptual Hash Analysis": "感知哈希分析",
        "Illuminant Map Analysis": "光源图分析",
        "Radon Transform Analysis": "Radon变换分析",
        "Zernike Moments Analysis": "Zernike矩分析",
        "Camera Model Identification": "相机型号识别",
        "Image Phylogeny Analysis": "图像谱系分析",
        "Blocking Artifact Detection": "块效应检测",
        "EfficientNet Detection": "EfficientNet检测",
        "Attention Consistency Analysis": "注意力一致性分析",
        "Style Transfer Detection": "风格迁移检测",
        "Color Temperature Analysis": "色温分析",
        "SIFT Forensics Analysis": "SIFT取证分析",
        "Neural Compression Analysis": "神经压缩分析",
        "EXIF Integrity Check": "EXIF完整性检查",
        "XMP Provenance Analysis": "XMP来源分析",
        "IPTC Verification": "IPTC验证",
        "GPS Consistency Check": "GPS一致性检查",
        "Timestamp Forensics": "时间戳取证",
        "File Structure Analysis": "文件结构分析",
        "Color Profile Metadata": "色彩配置元数据",
        "C2PA Verification": "C2PA验证",
        "Resolution Consistency": "分辨率一致性",
        "Software Fingerprint": "软件指纹",
        # Video
        "Face Landmark Analysis": "面部特征点分析",
        "Temporal Consistency Analysis": "时间一致性分析",
        "Lip Sync Analysis": "唇形同步分析",
        "Frame Interpolation Detection": "帧插值检测",
        "Optical Flow Anomaly": "光流异常",
        "Audio-Visual Sync Analysis": "音视频同步分析",
        "Deepfake Artifact Detection": "深度伪造伪影检测",
        "Scene Transition Analysis": "场景转换分析",
        "Motion Blur Consistency": "运动模糊一致性",
        "Background Stability Analysis": "背景稳定性分析",
        "Gaze Direction Analysis": "注视方向分析",
        "Facial Reenactment Detection": "面部重演检测",
        "Video Compression Trace": "视频压缩痕迹",
        "Flicker Analysis": "闪烁分析",
        "Hand Gesture Consistency": "手势一致性",
        "Body Proportion Analysis": "身体比例分析",
        # Text
        "Perplexity Analysis": "困惑度分析",
        "Burstiness Detection": "突发性检测",
        "Vocabulary Diversity": "词汇多样性",
        "Stylometric Analysis": "文体计量分析",
        "N-gram Frequency Analysis": "N-gram频率分析",
        "Repetition Pattern Detection": "重复模式检测",
        "Coherence Analysis": "连贯性分析",
        "Entropy Distribution Analysis": "熵分布分析",
        "Sentence Length Variance": "句子长度方差",
        "Readability Score Analysis": "可读性评分分析",
        "Punctuation Pattern Analysis": "标点模式分析",
        "Topic Consistency Analysis": "主题一致性分析",
        "Word Frequency Rank Analysis": "词频排名分析",
        "Semantic Density Analysis": "语义密度分析",
        "Writing Rhythm Analysis": "写作节奏分析",
    },
}


def translate_name(name: str, locale: str) -> str:
    """Translate a method name to the target locale."""
    names = METHOD_NAMES.get(locale, {})
    if name in names:
        return names[name]
    # Fallback: return English name
    return name


def create_locale_file(en_data: dict, locale: str) -> dict:
    """Create a locale file from English data, translating name only, keeping rest as English."""
    result = {}
    for key, value in en_data.items():
        if key == "name":
            result[key] = translate_name(value, locale)
        elif key == "references":
            # Keep references as-is (they're academic citations)
            result[key] = value
        else:
            # Keep other fields as English (description, mechanism, accuracy, etc.)
            # These are technical and should remain in English for accuracy
            result[key] = value
    return result


def find_method_i18n_dirs():
    """Find all method i18n directories."""
    dirs = []
    for media_type in ["image", "video", "text"]:
        media_dir = os.path.join(METHODS_DIR, media_type)
        if not os.path.isdir(media_dir):
            continue
        for method_name in sorted(os.listdir(media_dir)):
            method_dir = os.path.join(media_dir, method_name)
            i18n_dir = os.path.join(method_dir, "i18n")
            if os.path.isdir(i18n_dir):
                en_file = os.path.join(i18n_dir, "en.json")
                if os.path.isfile(en_file):
                    dirs.append((media_type, method_name, i18n_dir, en_file))
    return dirs


def fix_method_i18n():
    """Fix all method i18n files."""
    created = 0
    updated = 0
    errors = []

    method_dirs = find_method_i18n_dirs()
    print(f"Found {len(method_dirs)} method i18n directories")

    for media_type, method_name, i18n_dir, en_file in method_dirs:
        try:
            with open(en_file, "r", encoding="utf-8") as f:
                content = f.read()
                # Remove BOM if present
                if content.startswith("\ufeff"):
                    content = content[1:]
                en_data = json.loads(content)
        except (json.JSONDecodeError, UnicodeDecodeError) as e:
            errors.append(f"Error reading {en_file}: {e}")
            continue

        for locale in LOCALES:
            locale_file = os.path.join(i18n_dir, f"{locale}.json")
            
            if not os.path.isfile(locale_file):
                # Create new file
                locale_data = create_locale_file(en_data, locale)
                with open(locale_file, "w", encoding="utf-8") as f:
                    json.dump(locale_data, f, ensure_ascii=False, indent=4)
                    f.write("\n")
                created += 1
                print(f"  Created: {media_type}/{method_name}/i18n/{locale}.json")
            else:
                # Check for empty fields or missing keys
                try:
                    with open(locale_file, "r", encoding="utf-8") as f:
                        content = f.read()
                        if content.startswith("\ufeff"):
                            content = content[1:]
                        locale_data = json.loads(content)
                except (json.JSONDecodeError, UnicodeDecodeError) as e:
                    errors.append(f"Error reading {locale_file}: {e}")
                    continue

                modified = False
                # Add missing keys from en
                for key in en_data:
                    if key not in locale_data:
                        if key == "name":
                            locale_data[key] = translate_name(en_data[key], locale)
                        else:
                            locale_data[key] = en_data[key]
                        modified = True
                    elif isinstance(locale_data[key], str) and locale_data[key].strip() == "":
                        # Fill empty string
                        if key == "name":
                            locale_data[key] = translate_name(en_data[key], locale)
                        else:
                            locale_data[key] = en_data[key]
                        modified = True
                    elif key == "name" and locale_data[key] == en_data[key]:
                        # Name not translated yet
                        translated = translate_name(en_data[key], locale)
                        if translated != en_data[key]:
                            locale_data[key] = translated
                            modified = True

                if modified:
                    with open(locale_file, "w", encoding="utf-8") as f:
                        json.dump(locale_data, f, ensure_ascii=False, indent=4)
                        f.write("\n")
                    updated += 1
                    print(f"  Updated: {media_type}/{method_name}/i18n/{locale}.json")

    return created, updated, errors


def fix_global_locales():
    """Fix global locale files by adding missing keys from en.json."""
    en_file = os.path.join(GLOBAL_LOCALES_DIR, "en.json")
    with open(en_file, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    updated = 0
    for locale in LOCALES:
        locale_file = os.path.join(GLOBAL_LOCALES_DIR, f"{locale}.json")
        if not os.path.isfile(locale_file):
            continue
            
        with open(locale_file, "r", encoding="utf-8") as f:
            content = f.read()
            if content.startswith("\ufeff"):
                content = content[1:]
            locale_data = json.loads(content)

        modified = False
        # Add missing keys - fallback to English value
        for key, value in en_data.items():
            if key not in locale_data:
                locale_data[key] = value
                modified = True
            elif isinstance(locale_data[key], str) and "???" in locale_data[key]:
                # Fix garbled characters
                locale_data[key] = value
                modified = True

        if modified:
            with open(locale_file, "w", encoding="utf-8") as f:
                json.dump(locale_data, f, ensure_ascii=False, indent=4)
                f.write("\n")
            updated += 1
            print(f"  Updated global: {locale}.json")

    return updated


def main():
    print("=" * 60)
    print("SourceVerify i18n Fixer")
    print("=" * 60)
    
    print("\n--- Fixing method i18n files ---")
    created, updated, errors = fix_method_i18n()
    
    print(f"\n--- Fixing global locale files ---")
    global_updated = fix_global_locales()
    
    print(f"\n{'=' * 60}")
    print(f"Summary:")
    print(f"  Method locale files created: {created}")
    print(f"  Method locale files updated: {updated}")
    print(f"  Global locale files updated: {global_updated}")
    if errors:
        print(f"  Errors: {len(errors)}")
        for e in errors:
            print(f"    - {e}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
