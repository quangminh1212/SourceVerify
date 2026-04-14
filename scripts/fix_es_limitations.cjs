// Fix remaining ES limitations, JA/KO useCase
const fs = require('fs');
const path = require('path');
const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');

const TRANSLATIONS = {
  // ES limitations
  "image/exif_integrity": {
    es: {
      limitations: "• El hacha forense se destruye completamente contra los sindicatos de élite Anti-Forenses. Una sola línea de código ExifTool permite a los hackers clonar telemetría legítima de cámara directamente en un Deepfake falso, suplantando el radar de forma transparente.\n• Catastróficamente desarmado contra el lavado de redes sociales. Facebook/WhatsApp destruyen intencionalmente el 100% de los envoltorios EXIF para comprimir ancho de banda, desencadenando Falsos Positivos masivos en fotos auténticamente compartidas."
    }
  },
  "image/image_phylogeny": {
    es: {
      limitations: "• Requiere múltiples versiones de la imagen\n• No puede detectar ediciones de un solo paso\n• La reconstrucción del árbol puede ser ambigua\n• Comparación por pares computacionalmente intensiva"
    }
  },
  "image/metadata": {
    es: {
      limitations: "• Los metadatos pueden eliminarse o falsificarse fácilmente\n• Muchas plataformas de redes sociales eliminan automáticamente los metadatos al subir\n• No puede detectar imágenes de IA a las que se les han eliminado los metadatos\n• Depende de si las herramientas de IA incrustan etiquetas de software"
    }
  },
  "image/morphological_gradient": {
    es: {
      limitations: "• La forma del elemento estructurante afecta significativamente los resultados\n• No puede capturar detalles finos de textura\n• La morfología binaria pierde información de escala de grises\n• Computacionalmente costoso para núcleos grandes\n• Los bordes generados por IA son cada vez más realistas"
    }
  },
  "image/neural_compression": {
    es: {
      limitations: "• Puede no detectar los generadores más recientes\n• El post-procesamiento puede reducir los artefactos\n• Requiere experiencia en dominio de frecuencia\n• Los ataques adversarios pueden evadir la detección"
    }
  },
  "image/patchforensics": {
    es: {
      limitations: "• El tamaño pequeño del parche puede pasar por alto inconsistencias globales\n• Efectos de borde entre parches\n• El rendimiento depende de la diversidad de datos de entrenamiento\n• Puede tener dificultades con generación de imagen completa (sin bordes locales)"
    }
  },
  "image/radon_transform": {
    es: {
      limitations: "• Computacionalmente costoso para imágenes grandes\n• Limitado a artefactos direccionales\n• Requiere ajuste cuidadoso de parámetros\n• Puede pasar por alto falsificaciones no direccionales"
    }
  },
  "image/sift_forensics": {
    es: {
      limitations: "• Computacionalmente costoso\n• Dificultades con regiones suaves/sin textura\n• Uso intensivo de memoria para muchos puntos clave\n• Sensibilidad a los parámetros"
    }
  },
  "image/thumbnail_analysis": {
    es: {
      limitations: "• Muchas imágenes carecen de miniaturas incrustadas\n• Algunos editores también actualizan las miniaturas\n• Las imágenes generadas por IA pueden no tener miniaturas\n• Limitado al formato JPEG"
    }
  },
  "image/vit_detection": {
    es: {
      limitations: "• Requiere recursos computacionales significativos\n• Gran tamaño del modelo y huella de memoria\n• Necesita grandes conjuntos de datos de entrenamiento para rendimiento óptimo\n• El enfoque por parches puede pasar por alto artefactos sub-parche"
    }
  },
  "image/zernike_moments": {
    es: {
      limitations: "• Cálculo de momentos computacionalmente costoso\n• Los momentos de alto orden son sensibles al ruido\n• El tamaño del bloque afecta la sensibilidad\n• Uso intensivo de memoria para imágenes grandes"
    }
  },
  "text/genre_conformity": {
    es: {
      limitations: "• Mejor utilizado en combinación con otros métodos de análisis de texto\n• El rendimiento varía con la longitud del texto (requiere texto suficiente)\n• Puede verse afectado por el idioma y estilo de escritura del texto\n• La precisión depende del modelo de IA utilizado para la generación\n• La escritura humana puede ocasionalmente generar falsos positivos"
    }
  },
  // JA/KO useCase for image/noise
  "image/noise": {
    ja: {
      useCase: "異常に均一なノイズパターンを通じたAI画像の検出。カメラソース識別や改ざん検出にも使用されます。"
    },
    ko: {
      useCase: "비정상적으로 균일한 노이즈 패턴을 통한 AI 이미지 감지. 카메라 소스 식별 및 조작 감지에도 사용됩니다."
    }
  }
};

let updated = 0;
for (const [methodPath, langObj] of Object.entries(TRANSLATIONS)) {
  for (const [lang, fields] of Object.entries(langObj)) {
    const filePath = path.join(METHODS_DIR, methodPath, 'i18n', `${lang}.json`);
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
      console.log(`Updated: ${methodPath} (${lang})`);
    }
  }
}

console.log(`\nTotal updated: ${updated} files`);
