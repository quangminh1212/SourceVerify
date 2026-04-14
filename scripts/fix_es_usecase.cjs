// Fix ES useCase and strengths/limitations translations
const fs = require('fs');
const path = require('path');
const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');

const ES_TRANSLATIONS = {
  // === useCase translations (40 methods) ===
  "image/contrast_enhancement": {
    useCase: "Examina exhaustivamente el histograma de iluminación completo para identificar con precisión qué componentes empalmados fueron oscurecidos o aclarados artificialmente para hacerse pasar como parte de la escena original."
  },
  "image/fourier_ring": {
    useCase: "Despliega un bombardeo adjudicativo implacable sobre las falsificaciones Deepfake/GAN, arrastrando su defecto genético inherente —los evidentes 'Anillos de Frecuencia Espectral'— violentamente a la luz para su exposición pública.",
    strengths: "• Intolerancia absoluta: La pesadilla eterna de la arquitectura CNN. Esta enfermedad de anillos concéntricos está tan profundamente grabada en las matemáticas convolucionales que los hackers que intentan desesperadamente comprimir o cambiar el color de la imagen luchan matemáticamente por eliminar la maldición de Fourier 2D.\n• Radar extremadamente hostil contra anomalías sintéticas de tablero de ajedrez (micro-dentado generado por GANs), devolviendo un veredicto de culpabilidad al 100% sin cuestionamientos tras la confirmación visual."
  },
  "image/gabor_response": {
    useCase: "Despliega un bombardeo adjudicativo implacable contra trabajos descuidados e idiotas que utilizan aplicaciones maliciosas de suavizado facial, o exponiendo entornos de IA Generativa (GAN) plagados de defectos arquitectónicos que carecen completamente de rugosidad física genuina."
  },
  "image/glcm": {
    useCase: "Descarga violentamente el mazo del verdugo sobre supuestas obras maestras artísticas donde aplicaciones maliciosas de 'Embellecimiento' (Retoque) cortan a través de la piel humana... aniquilando completamente los poros orgánicos y dejando toda la matriz GLCM completamente insensible de forma artificial."
  },
  "image/gradient": {
    useCase: "Desata un infierno absoluto sobre trabajos de empalme idiotas donde el perpetrador desplegó agresivamente un pincel malicioso de Borrador/Difuminado directamente en el límite estructural de un objeto. Directamente en ese punto de contacto borrado, el Gradiente matemático queda brutalmente destruido más allá de cualquier negación plausible."
  },
  "image/higher_order_statistics": {
    useCase: "Desata un bombardeo probatorio implacable directamente contra criminales que intentan limpiar astutamente una escena del crimen. Un estafador suaviza violentamente un rostro (Desenfoque), luego se da cuenta astutamente de que 'Es demasiado plástico, me atraparán', así que vuelca una capa de Ruido Gaussiano generado computacionalmente. Para el ojo humano: Poros de piel altamente realistas. Sumergido en el radar HOS: Lobotomización no lineal completa. Ejecución instantánea."
  },
  "image/hog_anomaly": {
    useCase: "Detección de orientaciones de gradiente uniformes en contenido generado por IA"
  },
  "image/illuminant_map": {
    useCase: "Detección de regiones empalmadas mediante la identificación de condiciones de iluminación inconsistentes dentro de una sola imagen",
    strengths: "• Enfoque basado en física\n• Detecta empalme entre imágenes\n• Visualizable como mapa de color\n• Complementario a otros métodos",
    limitations: "• Asume un solo iluminante por región\n• Falla en escenas complejas con múltiples luces\n• Requiere varianza de color suficiente\n• Sensible a reflejos especulares"
  },
  "image/iptc_verification": {
    useCase: "Verificación fotográfica profesional: valida imágenes de agencias de noticias, servicios de fotos de stock y fotógrafos profesionales. La presencia de metadatos IPTC completos indica fuertemente un origen profesional."
  },
  "image/local_binary_pattern": {
    useCase: "Detección de patrones de micro-textura sintéticos en imágenes de IA"
  },
  "image/local_variance_map": {
    useCase: "Detección de patrones de varianza uniformes en contenido generado por IA"
  },
  "image/lpq_analysis": {
    useCase: "Detección de diversidad de fase reducida en texturas locales generadas por IA"
  },
  "image/morphological_gradient": {
    useCase: "Detección de diferencias en la morfología de bordes en contenido generado por IA"
  },
  "image/neural_compression": {
    useCase: "Identificación de imágenes producidas por pipelines de generación con redes neuronales a través de firmas de compresión"
  },
  "image/noise": {
    useCase: "Detección de imágenes de IA a través de patrones de ruido anormalmente uniformes. También se usa para identificación de fuente de cámara y detección de manipulación."
  },
  "image/noiseprint": {
    useCase: "Identificación de modelo de cámara, atribución de fuente y verificación de contenido de IA"
  },
  "image/perspective": {
    useCase: "Detección de inconsistencias geométricas y perspectivas imposibles en imágenes arquitectónicas/de escenas generadas por IA",
    strengths: "• Basado en principios de geometría proyectiva\n• Efectivo para escenas arquitectónicas y urbanas\n• Detecta configuraciones físicamente imposibles\n• Puede identificar errores sutiles de perspectiva"
  },
  "image/pixel_cooccurrence": {
    useCase: "Detección de suavidad de micro-textura sintética en contenido generado por IA"
  },
  "image/prnu": {
    useCase: "Detección de la ausencia de huella de ruido del sensor físico en imágenes generadas por IA",
    strengths: "• Basado en propiedad única del sensor de hardware\n• Extremadamente difícil falsificar el ruido del sensor\n• Estándar forense bien establecido\n• Puede identificar una unidad de cámara específica"
  },
  "image/resampling": {
    useCase: "Detección de transformaciones geométricas aplicadas durante el empalme o composición de imágenes"
  },
  "image/shadow": {
    useCase: "Verificación de la consistencia de sombras para detectar generación por IA o composición de imágenes"
  },
  "image/software_fingerprint": {
    useCase: "Método de identificación principal para determinar exactamente qué herramienta creó una imagen. Crítico para plataformas de moderación de contenido, verificación de hechos periodísticos e investigaciones forenses donde conocer la herramienta de IA específica es importante."
  },
  "image/spectral": {
    useCase: "Detección de artefactos de frecuencia de redes generativas y sobremuestreo. Especialmente efectivo con imágenes GAN e imágenes escaladas por IA."
  },
  "image/tamura_texture": {
    useCase: "Detección de propiedades de textura no naturales en superficies y materiales generados por IA"
  },
  "image/texture": {
    useCase: "Identificación de patrones de textura uniformes típicos de la IA"
  },
  "image/upsampling_artifact": {
    useCase: "Detección de artefactos de sobremuestreo de GAN en imágenes generadas"
  },
  "image/vit_detection": {
    useCase: "Detección de contenido generado por IA utilizando patrones de atención global que capturan artefactos tanto locales como de largo alcance"
  },
  "image/white_balance": {
    useCase: "Detección de inconsistencias de balance de blancos en imágenes de IA"
  },
  "image/xmp_provenance": {
    useCase: "Verificación integral de procedencia para imágenes que retienen metadatos XMP. Esencial para autenticar imágenes en flujos de trabajo profesionales donde la integridad del historial de edición importa — periodismo, fotografía de stock, evidencia legal."
  },
  "video/bg_freq_map": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de mapa de frecuencia del fondo. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/cheek_texture": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de textura de mejillas. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/facial_boundary_freq": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de frecuencia del contorno facial. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/facial_pore_texture": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de textura de poros faciales. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/forehead_texture": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de textura de la frente. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/lip_texture_detail": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de detalle de textura labial. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/skin_texture": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de realismo de textura de piel. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/texture_flow": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis de flujo de textura. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "video/video_freq_spectrum": {
    useCase: "Detección de deepfake y video generado por IA mediante análisis del espectro de frecuencia del video. Este método examina características temporales y espaciales que son difíciles de replicar perfectamente para los sistemas de IA, proporcionando evidencia para la evaluación de autenticidad del video."
  },
  "text/avg_word_length": {
    useCase: "Detección de texto de IA que mantiene un ritmo de lectura artificialmente 'suave' al evitar las fluctuaciones naturales del vocabulario humano."
  },
  "text/genre_conformity": {
    useCase: "Detección de texto generado por IA mediante análisis de conformidad de género. Este método examina patrones lingüísticos específicos que difieren entre texto escrito por humanos y texto generado por IA, proporcionando evidencia complementaria en un pipeline de análisis multi-método."
  },
  // === strengths/limitations for remaining methods ===
  "image/copymove": {
    strengths: "• Excelente para detectar regiones clonadas\n• El filtrado RANSAC reduce los falsos positivos\n• Puede detectar copias escaladas/rotadas\n• Técnica forense bien comprobada",
    limitations: "• Solo detecta duplicación dentro de una sola imagen\n• El post-procesamiento intenso puede enmascarar regiones copiadas\n• Computacionalmente costoso para imágenes grandes\n• Puede pasar por alto áreas duplicadas muy pequeñas"
  },
  "image/jpeg_ghost": {
    strengths: "• Localiza regiones manipuladas específicamente\n• Evidencia sólida de re-compresión\n• Puede estimar el factor de calidad original\n• Metodología forense bien comprobada"
  }
};

let updated = 0;
for (const [methodPath, fields] of Object.entries(ES_TRANSLATIONS)) {
  const filePath = path.join(METHODS_DIR, methodPath, 'i18n', 'es.json');
  if (!fs.existsSync(filePath)) { console.log(`SKIP: ${filePath}`); continue; }
  
  let data;
  try { data = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e) { console.log(`ERROR: ${filePath}: ${e.message}`); continue; }
  
  let changed = false;
  for (const [field, value] of Object.entries(fields)) {
    data[field] = value;
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    updated++;
    console.log(`Updated: ${methodPath}`);
  }
}

console.log(`\nTotal updated: ${updated} files`);
