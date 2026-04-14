/**
 * Fix untranslated Spanish (es.json) fields
 * This script finds fields that are identical to English and translates them to Spanish.
 * Uses a dictionary of common translations for method names and patterns.
 */
const fs = require('fs');
const path = require('path');

const methodsRoot = path.join(__dirname, '..', 'src/app/methods');
const mediaTypes = ['image', 'text', 'video'];

// Translation helpers for common English->Spanish patterns
const nameTranslations = {
    // Image methods
    "Hot Pixel Detection": "Detección de Píxeles Calientes",
    "Hue Consistency Analysis": "Análisis de Consistencia de Matiz",
    "Image Complexity Analysis": "Análisis de Complejidad de Imagen",
    "Intensity Kurtosis Analysis": "Análisis de Curtosis de Intensidad",
    "Isolated Pixel Detection": "Detección de Píxeles Aislados",
    "JPEG Coefficient Distribution": "Distribución de Coeficientes JPEG",
    "Laws Texture Energy": "Energía de Textura de Laws",
    "Linear Pattern Detection": "Detección de Patrones Lineales",
    "Local Entropy Analysis": "Análisis de Entropía Local",
    "Mean Shift Clustering": "Agrupamiento por Desplazamiento de Media",
    "Micro Texture Analysis": "Análisis de Micro Textura",
    "Mid Frequency Energy": "Energía de Frecuencia Media",
    "Noise Floor Level": "Nivel Base de Ruido",
    "Patch Similarity Matrix": "Matriz de Similitud de Parches",
    "Pixel Symmetry Analysis": "Análisis de Simetría de Píxeles",
    "Posterization Detection": "Detección de Posterización",
    "Second Order Gradient": "Gradiente de Segundo Orden",
    "Skin Texture Frequency": "Frecuencia de Textura de Piel",
    "Spatial Coherence Analysis": "Análisis de Coherencia Espacial",
    "Spectral Decay Rate": "Tasa de Decaimiento Espectral",
    "Structural Complexity": "Complejidad Estructural",
    "Texture Periodicity": "Periodicidad de Textura",
    "Tone Mapping Analysis": "Análisis de Mapeo de Tonos",
    "Vignette Analysis": "Análisis de Viñeteo",
    // Text methods
    "Genre Conformity": "Conformidad de Género Textual",
    // Generic patterns that appear in many method names
    "Consistency": "Consistencia",
    "Analysis": "Análisis",
    "Detection": "Detección",
    "Pattern": "Patrón",
};

// Translation dictionary for common English phrases in strengths/limitations/useCase
const phraseTranslations = [
    // Strengths patterns
    [/Captures temporal artifacts that single-frame analysis misses/g, "Captura artefactos temporales que el análisis de cuadro único pierde"],
    [/Works with standard video formats/g, "Funciona con formatos de video estándar"],
    [/Effective against common deepfake techniques/g, "Efectivo contra técnicas comunes de deepfake"],
    [/Can be combined with other video forensic methods/g, "Se puede combinar con otros métodos forenses de video"],
    [/Based on established computer vision research/g, "Basado en investigación establecida de visión por computadora"],
    // Limitations patterns
    [/Performance affected by video compression and resolution/g, "Rendimiento afectado por la compresión y resolución del video"],
    [/Some methods require sufficient frame count for temporal analysis/g, "Algunos métodos requieren suficiente cantidad de cuadros para el análisis temporal"],
    [/Effectiveness varies with deepfake generation technique/g, "La efectividad varía según la técnica de generación de deepfake"],
    [/Best used as part of a comprehensive multi-method pipeline/g, "Se usa mejor como parte de un pipeline integral de múltiples métodos"],
    [/May produce false positives on heavily edited authentic video/g, "Puede producir falsos positivos en videos auténticos con edición intensiva"],
    // useCase patterns
    [/Detection of deepfake and AI-generated video through/g, "Detección de deepfake y video generado por IA mediante"],
    [/This method examines temporal and spatial features that are difficult for AI systems to perfectly replicate, providing evidence for video authenticity assessment/g, "Este método examina características temporales y espaciales que son difíciles de replicar perfectamente por sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video"],
];

// Specific name translations for video methods that have complex names
const videoNameMap = {
    "accessory_consistency": "Consistencia de Accesorios",
    "audio_formant": "Formantes de Audio",
    "audio_noise_floor": "Nivel Base de Ruido de Audio",
    "audio_spectral": "Análisis Espectral de Audio",
    "audio_visual_delay": "Retardo Audiovisual",
    "background_object_physics": "Física de Objetos de Fondo",
    "bframe_consistency": "Consistencia de B-Frames",
    "bg_complexity": "Complejidad del Fondo",
    "bg_freq_map": "Mapa de Frecuencia del Fondo",
    "bg_perspective": "Perspectiva del Fondo",
    "blink_rate": "Tasa de Parpadeo",
    "blood_flow_rppg": "Flujo Sanguíneo rPPG",
    "body_movement_fluidity": "Fluidez del Movimiento Corporal",
    "bokeh": "Análisis de Bokeh",
    "breathing_pattern": "Patrón de Respiración",
    "cheek_texture": "Textura de Mejilla",
    "chin_jaw_detail": "Detalle de Mentón y Mandíbula",
    "chroma_bleed": "Sangrado de Croma",
    "clothing_edge_blend": "Mezcla de Bordes de Ropa",
    "clothing_fold": "Pliegues de Ropa",
    "color_bleeding": "Sangrado de Color",
    "color_hist_shift": "Desplazamiento de Histograma de Color",
    "color_quant_v": "Cuantización de Color de Video",
    "color_temporal_shift": "Desplazamiento Temporal de Color",
    "contour_continuity": "Continuidad de Contorno",
    "contrast_temporal": "Contraste Temporal",
    "depth_consistency": "Consistencia de Profundidad",
    "ear_detail": "Detalle de Oreja",
    "ear_symmetry": "Simetría de Orejas",
    "edge_aa_video": "Anti-Aliasing de Bordes en Video",
    "edge_ringing": "Efecto Ringing de Bordes",
    "edge_sharpness_var": "Varianza de Nitidez de Bordes",
    "expression": "Naturalidad de Expresión",
    "eyebrow": "Naturalidad de Cejas",
    "eye_contact_consistency": "Consistencia de Contacto Visual",
    "eye_reflection": "Reflexión Ocular",
    "face_alignment_v": "Alineación Facial en Video",
    "face_blend_bound": "Límite de Mezcla Facial",
    "face_boundary_blend": "Mezcla de Contorno Facial",
    "face_illumination": "Iluminación Facial",
    "face_mask_edge": "Borde de Máscara Facial",
    "face_skin_smooth_v": "Suavizado de Piel Facial en Video",
    "face_warping_artifact": "Artefacto de Deformación Facial",
    "face_xray": "Rayos X Facial",
    "facial_action_timing": "Temporización de Acción Facial",
    "facial_aging_consistency": "Consistencia de Envejecimiento Facial",
    "facial_boundary_freq": "Frecuencia de Contorno Facial",
    "facial_muscle_physics": "Física Muscular Facial",
    "facial_pore_texture": "Textura de Poros Faciales",
    "facial_symmetry_v": "Simetría Facial en Video",
    "facial_wrinkle": "Arrugas Faciales",
    "facs_analysis": "Análisis FACS",
    "finger_geometry": "Geometría de Dedos",
    "forehead_texture": "Textura de Frente",
    "forehead_wrinkle": "Arrugas de Frente",
    "frame_drop": "Detección de Caída de Cuadros",
    "frame_edge_energy": "Energía de Bordes de Cuadro",
    "frame_energy": "Energía de Cuadro",
    "gait_analysis": "Análisis de Marcha",
    "gaze_vergence": "Vergencia de Mirada",
    "hair_detail": "Detalle Capilar",
    "hair_strand_consistency": "Consistencia de Hebras de Cabello",
    "hand_finger_count": "Conteo de Dedos de Mano",
    "head_nod_shake": "Asentimiento y Negación de Cabeza",
    "head_pose_v2": "Estimación de Pose de Cabeza V2",
    "identity_switch": "Detección de Cambio de Identidad",
    "inter_frame_blend": "Mezcla Inter-Cuadros",
    "intra_prediction": "Predicción Intra-Cuadro",
    "iris_detail": "Detalle de Iris",
    "jawline": "Consistencia de Línea de Mandíbula",
    "lens_distortion_v": "Distorsión de Lente en Video",
    "lip_reading_score": "Puntuación de Lectura Labial",
    "lip_texture_detail": "Detalle de Textura Labial",
    "micro_expression_v2": "Micro Expresión V2",
    "micro_tremor": "Micro Temblor",
    "motion_blur_dir": "Dirección de Desenfoque de Movimiento",
    "motion_estimation_res": "Residual de Estimación de Movimiento",
    "motion_vector": "Análisis de Vectores de Movimiento",
    "neck_skin": "Consistencia de Piel del Cuello",
    "neck_transition": "Transición del Cuello",
    "nose_geometry": "Geometría de Nariz",
    "nose_shadow": "Sombra de Nariz",
    "nostril_darkness": "Oscuridad de Fosas Nasales",
    "object_boundary": "Límite de Objetos",
    "phoneme_correlation": "Correlación de Fonemas",
    "phoneme_viseme_map": "Mapa de Fonemas-Visemas",
    "pixel_jitter": "Tremor de Píxeles",
    "pixel_repetition_v": "Repetición de Píxeles en Video",
    "pupillary_unrest": "Inquietud Pupilar",
    "pupil_dilation": "Dilatación Pupilar",
    "qp_analysis": "Análisis de Parámetro de Cuantización",
    "reflection_physics": "Física de Reflejos",
    "saccade_analysis": "Análisis de Sacadas",
    "scene_cut_anomaly": "Anomalía de Corte de Escena",
    "scene_geometry": "Geometría de Escena",
    "shadow_temporal": "Sombra Temporal",
    "shoulder": "Alineación de Hombros",
    "skin_color_drift": "Deriva de Color de Piel",
    "skin_micro_motion": "Micro Movimiento de Piel",
    "skin_pore_sim": "Simulación de Poros de Piel",
    "skin_specular_reflection": "Reflexión Especular de Piel",
    "skin_texture": "Textura de Piel",
    "spatial_freq_temporal": "Frecuencia Espacial Temporal",
    "spectral_flicker_v": "Parpadeo Espectral en Video",
    "specular_highlight": "Resalte Especular",
    "stabilization": "Análisis de Estabilización",
    "teeth": "Consistencia Dental",
    "temporal_coherence_map": "Mapa de Coherencia Temporal",
    "temporal_color_histogram": "Histograma de Color Temporal",
    "temporal_face_embedding": "Incrustación Facial Temporal",
    "temporal_frequency_anomaly": "Anomalía de Frecuencia Temporal",
    "temporal_gradient": "Gradiente Temporal",
    "temporal_jitter": "Fluctuación Temporal",
    "temporal_noise": "Ruido Temporal",
    "texture_flow": "Flujo de Textura",
    "tongue_consistency": "Consistencia de Lengua",
    "video_artifact_grid": "Cuadrícula de Artefactos de Video",
    "video_blockiness": "Bloqueo de Video",
    "video_color_balance": "Balance de Color de Video",
    "video_denoising_trace": "Traza de Eliminación de Ruido de Video",
    "video_frame_rate": "Consistencia de Tasa de Cuadros",
    "video_freq_spectrum": "Espectro de Frecuencia de Video",
    "video_global_illum": "Iluminación Global de Video",
    "video_grain": "Grano de Video",
    "video_hash": "Hash de Video",
    "video_luma_range": "Rango de Luminancia de Video",
    "video_noise": "Ruido de Video",
    "video_resolution_map": "Mapa de Resolución de Video",
    "video_saturation": "Saturación de Video",
    "video_saturation_map": "Mapa de Saturación de Video",
    "video_sharpness": "Nitidez de Video",
    "video_spectral_coherence": "Coherencia Espectral de Video",
    "voice_f0_analysis": "Análisis de Frecuencia F0 de Voz",
    "watermark": "Detección de Marca de Agua",
};

// Image method name map
const imageNameMap = {
    "hot_pixel": "Detección de Píxeles Calientes",
    "hue_consistency": "Análisis de Consistencia de Matiz",
    "image_complexity": "Análisis de Complejidad de Imagen",
    "intensity_kurtosis": "Análisis de Curtosis de Intensidad",
    "isolated_pixel": "Detección de Píxeles Aislados",
    "jpeg_coefficient": "Distribución de Coeficientes JPEG",
    "kirsch_edge": "Detector de Bordes Kirsch",
    "laplacian_pyramid": "Pirámide Laplaciana",
    "laplacian_variance": "Varianza Laplaciana",
    "laws_texture_e": "Energía de Textura de Laws",
    "lens_distortion_img": "Distorsión de Lente en Imagen",
    "linear_pattern": "Detección de Patrones Lineales",
    "local_entropy": "Análisis de Entropía Local",
    "log_gabor_filter": "Filtro Log-Gabor",
    "luma_gradient_angle": "Ángulo de Gradiente de Luminancia",
    "maximal_grad_flow": "Flujo Máximo de Gradiente",
    "mean_shift_cluster": "Agrupamiento por Desplazamiento de Media",
    "micro_texture": "Análisis de Micro Textura",
    "mid_freq_energy": "Energía de Frecuencia Media",
    "moire_pattern": "Patrón de Moiré",
    "moment_invariants": "Invariantes de Momentos",
    "multiscale_entropy": "Entropía Multi-escala",
    "niqe_score": "Puntuación NIQE",
    "noise_floor_level": "Nivel Base de Ruido",
    "noise_granularity": "Granularidad de Ruido",
    "patch_similarity": "Matriz de Similitud de Parches",
    "pixel_bit_plane": "Análisis de Plano de Bits de Píxel",
    "pixel_symmetry": "Análisis de Simetría de Píxeles",
    "pixel_value_diff": "Diferencia de Valores de Píxel",
    "posterization": "Detección de Posterización",
    "rgb_correlation": "Correlación RGB",
    "richardson_lucy": "Desconvolución Richardson-Lucy",
    "run_length_matrix": "Matriz de Longitud de Serie",
    "scharr_gradient": "Gradiente Scharr",
    "second_order_grad": "Gradiente de Segundo Orden",
    "shearlet_analysis": "Análisis de Shearlets",
    "skin_texture_freq": "Frecuencia de Textura de Piel",
    "sobel_magnitude": "Magnitud de Sobel",
    "sparse_representation": "Representación Dispersa",
    "spatial_coherence": "Análisis de Coherencia Espacial",
    "spatial_rich_model": "Modelo Rico Espacial",
    "spectral_decay": "Tasa de Decaimiento Espectral",
    "ssim_map": "Mapa SSIM",
    "steerable_pyramid": "Pirámide Orientable",
    "structural_complexity": "Complejidad Estructural",
    "style_transfer": "Detección de Transferencia de Estilo",
    "sub_band_dev": "Desviación de Sub-bandas",
    "svd_decomposition": "Descomposición SVD",
    "texture_periodicity": "Periodicidad de Textura",
    "tone_mapping": "Análisis de Mapeo de Tonos",
    "total_variation": "Variación Total",
    "vignette_analysis": "Análisis de Viñeteo",
    "wavelet_packet": "Paquetes Wavelet",
    "wiener_residual": "Residual de Wiener",
};

const textNameMap = {
    "genre_conformity": "Conformidad de Género Textual",
    "ghostbuster_detect": "Detección Ghostbuster",
};

// Common video description translations
const videoDescTranslations = {
    "accessory_consistency": "Analiza la consistencia de accesorios visibles en video para detectar deepfakes",
    "audio_formant": "Analiza formantes de audio para detectar manipulación vocal en videos",
    "bframe_consistency": "Analiza la consistencia de B-frames para detectar manipulación de video",
    "background_object_physics": "Analiza la física de objetos de fondo para detectar inconsistencias de video generado por IA",
    "audio_visual_delay": "Detecta retardos audiovisuales anómalos que indican manipulación de video",
    "blink_rate": "Analiza la tasa de parpadeo para detectar videos deepfake",
    "blood_flow_rppg": "Detecta flujo sanguíneo facial mediante fotopletismografía remota para identificar deepfakes",
    "clothing_fold": "Analiza la naturalidad de pliegues de ropa en video",
    "color_bleeding": "Detecta sangrado de color anormal en videos manipulados",
    "color_hist_shift": "Detecta desplazamientos anómalos en histogramas de color a lo largo del video",
    "color_temporal_shift": "Analiza desplazamientos temporales de color para detectar manipulación de video",
    "contour_continuity": "Analiza la continuidad de contornos faciales en video para detectar deepfakes",
    "ear_symmetry": "Compara la simetría de las orejas para detectar inconsistencias de deepfake",
    "edge_aa_video": "Analiza el anti-aliasing de bordes en video para detectar artefactos de generación IA",
    "edge_sharpness_var": "Analiza la varianza de nitidez de bordes para detectar manipulación de video",
    "expression": "Analiza la naturalidad de expresiones faciales en video para detectar deepfakes",
    "eye_contact_consistency": "Analiza la consistencia del contacto visual en video para detectar deepfakes",
    "eye_reflection": "Analiza reflexiones oculares para detectar inconsistencias de video deepfake",
    "face_alignment_v": "Analiza la alineación facial en video para detectar manipulación",
    "face_blend_bound": "Detecta límites de mezcla facial en videos deepfake",
    "face_boundary_blend": "Analiza la mezcla de contornos faciales para detectar deepfakes",
    "face_skin_smooth_v": "Detecta suavizado artificial de piel facial en video",
    "face_warping_artifact": "Detecta artefactos de deformación facial en videos deepfake",
    "face_xray": "Utiliza técnica de rayos X facial para detectar manipulación de video",
    "facial_action_timing": "Analiza la temporización de acciones faciales para detectar deepfakes",
    "facial_aging_consistency": "Verifica la consistencia del envejecimiento facial en video",
    "facial_symmetry_v": "Analiza la simetría facial en video para detectar deepfakes",
    "facial_wrinkle": "Analiza arrugas faciales para detectar inconsistencias de deepfake",
    "facs_analysis": "Utiliza el Sistema de Codificación de Acción Facial para detectar deepfakes",
    "frame_drop": "Detecta caídas de cuadros anómalas que indican manipulación de video",
    "gaze_vergence": "Analiza la vergencia de la mirada para detectar inconsistencias de deepfake",
    "hair_detail": "Analiza la consistencia del detalle capilar en video para detectar deepfakes",
    "hair_strand_consistency": "Analiza la consistencia de hebras de cabello individuales en video",
    "hand_finger_count": "Verifica el conteo correcto de dedos en video para detectar errores de IA",
    "head_nod_shake": "Analiza movimientos de asentimiento y negación para detectar anomalías de deepfake",
    "identity_switch": "Detecta cambios de identidad no naturales en video",
    "intra_prediction": "Analiza patrones de predicción intra-cuadro para detectar manipulación de video",
    "iris_detail": "Analiza los detalles del iris para detectar inconsistencias de deepfake",
    "jawline": "Analiza la consistencia de la línea de mandíbula en video para detectar deepfakes",
    "lip_reading_score": "Correlaciona movimiento labial con audio para detectar manipulación",
    "micro_expression_v2": "Detecta micro expresiones anómalas en video para identificar deepfakes",
    "micro_tremor": "Analiza micro temblores faciales para detectar videos generados por IA",
    "motion_estimation_res": "Analiza residuales de estimación de movimiento para detectar manipulación",
    "motion_vector": "Analiza vectores de movimiento para detectar anomalías en video manipulado",
    "nose_geometry": "Analiza la geometría de la nariz para detectar inconsistencias de deepfake",
    "phoneme_viseme_map": "Mapea fonemas a visemas para detectar desincronización labial en deepfakes",
    "pupil_dilation": "Analiza la dilatación pupilar para detectar anomalías de deepfake",
    "pupillary_unrest": "Analiza la inquietud pupilar para detectar videos generados por IA",
    "qp_analysis": "Analiza parámetros de cuantización de codec para detectar manipulación de video",
    "reflection_physics": "Analiza la física de reflejos para detectar inconsistencias en video",
    "saccade_analysis": "Analiza movimientos sacádicos oculares para detectar deepfakes",
    "scene_cut_anomaly": "Detecta anomalías en cortes de escena que indican manipulación",
    "shadow_temporal": "Analiza la consistencia temporal de sombras en video para detectar deepfakes",
    "shoulder": "Analiza la alineación de hombros para detectar inconsistencias en video deepfake",
    "skin_color_drift": "Detecta derivas anómalas de color de piel en video",
    "skin_micro_motion": "Analiza micro movimientos de piel para detectar videos generados por IA",
    "skin_pore_sim": "Analiza la simulación de poros de piel para detectar deepfakes",
    "skin_specular_reflection": "Analiza reflexiones especulares de piel para detectar anomalías de deepfake",
    "temporal_color_histogram": "Analiza histogramas de color temporal para detectar manipulación de video",
    "temporal_face_embedding": "Analiza incrustaciones faciales temporales para detectar deepfakes",
    "temporal_frequency_anomaly": "Detecta anomalías de frecuencia temporal en video manipulado",
    "temporal_jitter": "Detecta fluctuaciones temporales anómalas en video",
    "video_color_balance": "Analiza el balance de color del video para detectar manipulación",
    "video_denoising_trace": "Detecta trazas de eliminación de ruido artificial en video",
    "video_frame_rate": "Analiza la consistencia de la tasa de cuadros para detectar manipulación",
    "video_global_illum": "Analiza la iluminación global del video para detectar inconsistencias",
    "video_noise": "Analiza patrones de ruido de video para detectar manipulación",
    "video_resolution_map": "Mapea la resolución del video para detectar regiones manipuladas",
    "video_saturation_map": "Mapea la saturación del video para detectar anomalías de manipulación",
    "video_spectral_coherence": "Analiza la coherencia espectral del video para detectar manipulación",
    "voice_f0_analysis": "Analiza la frecuencia fundamental de voz para detectar manipulación de audio",
    "watermark": "Detecta marcas de agua digitales en video para verificar autenticidad",
};

// Common Spanish translations for useCase/strengths/limitations
const commonUseCaseES = {
    "video_default": "Detección de deepfake y video generado por IA mediante {method} análisis. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente por sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video.",
};

const commonStrengthsES = "• Captura artefactos temporales que el análisis de cuadro único pierde\n• Funciona con formatos de video estándar\n• Efectivo contra técnicas comunes de deepfake\n• Se puede combinar con otros métodos forenses de video\n• Basado en investigación establecida de visión por computadora";

const commonLimitationsES = "• Rendimiento afectado por la compresión y resolución del video\n• Algunos métodos requieren suficiente cantidad de cuadros para el análisis temporal\n• La efectividad varía según la técnica de generación de deepfake\n• Se usa mejor como parte de un pipeline integral de múltiples métodos\n• Puede producir falsos positivos en videos auténticos con edición intensiva";

let totalFixed = 0;
let totalFields = 0;

for (const mediaType of mediaTypes) {
    const mediaDir = path.join(methodsRoot, mediaType);
    if (!fs.existsSync(mediaDir)) continue;
    
    const methods = fs.readdirSync(mediaDir).filter(d => {
        return fs.statSync(path.join(mediaDir, d)).isDirectory();
    });
    
    for (const method of methods) {
        const enPath = path.join(mediaDir, method, 'i18n', 'en.json');
        const esPath = path.join(mediaDir, method, 'i18n', 'es.json');
        
        if (!fs.existsSync(enPath) || !fs.existsSync(esPath)) continue;
        
        const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
        const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
        
        let modified = false;
        const fieldsToCheck = ['name', 'description', 'useCase', 'strengths', 'limitations'];
        
        for (const field of fieldsToCheck) {
            if (en[field] && es[field] && en[field] === es[field]) {
                // Field is identical to English - needs translation
                let translated = null;
                
                if (field === 'name') {
                    const nameMap = mediaType === 'image' ? imageNameMap : 
                                   mediaType === 'text' ? textNameMap : videoNameMap;
                    translated = nameMap[method];
                } else if (field === 'description') {
                    if (mediaType === 'video') {
                        translated = videoDescTranslations[method];
                    } else if (mediaType === 'image') {
                        // For image, if description matches en exactly, create Spanish version
                        // by looking it up in image description map
                    }
                } else if (field === 'strengths' && en[field] === "• Captures temporal artifacts that single-frame analysis misses\n• Works with standard video formats\n• Effective against common deepfake techniques\n• Can be combined with other video forensic methods\n• Based on established computer vision research") {
                    translated = commonStrengthsES;
                } else if (field === 'limitations' && en[field] === "• Performance affected by video compression and resolution\n• Some methods require sufficient frame count for temporal analysis\n• Effectiveness varies with deepfake generation technique\n• Best used as part of a comprehensive multi-method pipeline\n• May produce false positives on heavily edited authentic video") {
                    translated = commonLimitationsES;
                } else if (field === 'useCase') {
                    // Apply phrase translations
                    let text = en[field];
                    for (const [pattern, replacement] of phraseTranslations) {
                        text = text.replace(pattern, replacement);
                    }
                    // Replace remaining "video" occurrences
                    text = text.replace(/\bvideo\b/gi, 'video');
                    if (text !== en[field]) {
                        translated = text;
                    }
                }
                
                if (field === 'strengths' && !translated) {
                    // Try applying phrase-level translations
                    let text = en[field];
                    let changed = false;
                    for (const [pattern, replacement] of phraseTranslations) {
                        const newText = text.replace(pattern, replacement);
                        if (newText !== text) changed = true;
                        text = newText;
                    }
                    if (changed) translated = text;
                }
                
                if (field === 'limitations' && !translated) {
                    let text = en[field];
                    let changed = false;
                    for (const [pattern, replacement] of phraseTranslations) {
                        const newText = text.replace(pattern, replacement);
                        if (newText !== text) changed = true;
                        text = newText;
                    }
                    if (changed) translated = text;
                }
                
                if (translated) {
                    es[field] = translated;
                    modified = true;
                    totalFields++;
                }
            }
        }
        
        if (modified) {
            fs.writeFileSync(esPath, JSON.stringify(es, null, 4) + '\n', 'utf8');
            totalFixed++;
            console.log(`Fixed: ${mediaType}/${method}`);
        }
    }
}

console.log(`\nTotal files fixed: ${totalFixed}`);
console.log(`Total fields translated: ${totalFields}`);
