/**
 * Fix remaining es.json description fields that are still in English.
 * 32 files identified with untranslated description fields.
 */
const fs = require('fs');
const path = require('path');

// Manual translations for the 32 remaining descriptions
const translations = {
    // Image methods
    'image/kirsch_edge': 'Calcula la respuesta de bordes con operador de compás de Kirsch (2008)',
    'image/laplacian_pyramid': 'Analiza la distribución de energía residual de la pirámide Laplaciana a través de escalas (Burt & Adelson, 1983).',
    'image/laplacian_variance': 'Mide la varianza Laplaciana para detección de desenfoque (Tenenbaum, 2004)',
    'image/lens_distortion_img': 'Detecta patrones de distorsión de lente tipo barril/acerico',
    'image/log_gabor_filter': 'Aplica filtros log-Gabor para mejorar la selectividad de frecuencia sobre Gabor estándar — captura artefactos de generación por IA en el dominio de frecuencia.',
    'image/luma_gradient_angle': 'Analiza la distribución de ángulos del gradiente de luminancia',
    'image/maximal_grad_flow': 'Analiza la dirección dominante del flujo de gradiente (2019)',
    'image/moire_pattern': 'Detecta patrones de interferencia moiré de captura de pantalla',
    'image/moment_invariants': 'Calcula los siete momentos invariantes de Hu para detectar anomalías de forma y rotación en contenido IA (Hu, 1962).',
    'image/multiscale_entropy': 'Calcula la entropía muestral a múltiples escalas temporales para detectar diferencias de complejidad entre imágenes reales e IA.',
    'image/niqe_score': 'Calcula la puntuación de calidad ciega NIQE (Natural Image Quality Evaluator) — las imágenes IA a menudo puntúan diferente a las fotografías reales.',
    'image/noise_granularity': 'Mide el tamaño y distribución del grano de ruido',
    'image/pixel_bit_plane': 'Analiza patrones de planos de bits para artefactos ocultos',
    'image/pixel_value_diff': 'Detecta patrones de diferenciación de valores de píxeles tipo esteganografía que se filtran en imágenes generadas por IA (Wu & Tsai).',
    'image/rgb_correlation': 'Mide patrones de correlación inter-canal',
    'image/richardson_lucy': 'Aplica deconvolución de Richardson-Lucy para detectar artefactos de nitidez (Fridrich, 2012)',
    'image/run_length_matrix': 'Calcula características de la matriz de longitud de cadena de niveles de gris para caracterización de textura — detecta suavizado y patrones repetitivos de IA.',
    'image/scharr_gradient': 'Calcula el gradiente de Scharr para análisis de bordes (2000)',
    'image/shearlet_analysis': 'Usa la transformada shearlet para análisis multidireccional — superior a wavelets para características anisotrópicas.',
    'image/sobel_magnitude': 'Analiza la distribución de magnitud del gradiente de Sobel (Canny, 2007)',
    'image/sparse_representation': 'Usa codificación dispersa y aprendizaje de diccionarios para detectar anomalías de representación en imágenes IA (Wright et al.).',
    'image/spatial_rich_model': 'Implementa el Modelo Rico Espacial de Fridrich para estegoanálisis (2012)',
    'image/ssim_map': 'Calcula mapas locales de similitud estructural SSIM para detectar inconsistencias de calidad a nivel de región (Wang et al.).',
    'image/steerable_pyramid': 'Aplica pirámide orientable para análisis de sub-banda selectivo por orientación — detecta artefactos de síntesis de textura IA.',
    'image/sub_band_dev': 'Mide la desviación de sub-banda espacial (Durall, 2020)',
    'image/svd_decomposition': 'Aplica Descomposición en Valores Singulares para detectar patrones de deficiencia de rango típicos de imágenes generadas por IA.',
    'image/total_variation': 'Mide la norma de variación total para detectar suavidad antinatural o regularidad excesiva en imágenes generadas por IA.',
    'image/wavelet_packet': 'Aplica descomposición completa de paquetes wavelet para análisis de energía de sub-banda de grano fino (Coifman & Wickerhauser).',
    'image/wiener_residual': 'Analiza patrones de ruido residual del filtro de Wiener (Fridrich, 2012)',
    // Text methods
    'text/ghostbuster_detect': 'Aplica el método Ghostbuster combinando múltiples señales débiles — búsqueda estructurada sobre combinaciones de características para detección robusta de texto IA.',
    // Video methods
    'video/bg_perspective': 'Analiza la consistencia de la geometría de perspectiva del fondo',
    'video/ear_detail': 'Compara la consistencia de detalles entre oreja izquierda y derecha',
};

const methodsDir = path.join(__dirname, '..', 'src', 'app', 'methods');
let fixed = 0;

for (const [key, esDesc] of Object.entries(translations)) {
    const [type, method] = key.split('/');
    const esPath = path.join(methodsDir, type, method, 'i18n', 'es.json');
    
    if (!fs.existsSync(esPath)) {
        console.log(`  Warning: ${esPath} not found`);
        continue;
    }
    
    const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
    const enPath = path.join(methodsDir, type, method, 'i18n', 'en.json');
    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    
    if (es.description === en.description) {
        es.description = esDesc;
        fs.writeFileSync(esPath, JSON.stringify(es, null, 2) + '\n', 'utf8');
        console.log(`  Fixed: ${key}`);
        fixed++;
    } else {
        console.log(`  Skipped: ${key} (already different)`);
    }
}

console.log(`\nDone: Fixed ${fixed} es.json description fields.`);
