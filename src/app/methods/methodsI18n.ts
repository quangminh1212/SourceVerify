/**
 * Aggregated method translations — imported directly from each method's i18n folder.
 * This lets the listing page render method names/descriptions without relying on global i18n keys.
 */
import type { Locale } from "@/i18n/translations";

/* ── static imports for every method ── */
import metadata_en from "./metadata/i18n/en.json";
import metadata_vi from "./metadata/i18n/vi.json";
import spectral_en from "./spectral/i18n/en.json";
import spectral_vi from "./spectral/i18n/vi.json";
import reconstruction_en from "./reconstruction/i18n/en.json";
import reconstruction_vi from "./reconstruction/i18n/vi.json";
import noise_en from "./noise/i18n/en.json";
import noise_vi from "./noise/i18n/vi.json";
import edge_en from "./edge/i18n/en.json";
import edge_vi from "./edge/i18n/vi.json";
import gradient_en from "./gradient/i18n/en.json";
import gradient_vi from "./gradient/i18n/vi.json";
import benford_en from "./benford/i18n/en.json";
import benford_vi from "./benford/i18n/vi.json";
import chromatic_en from "./chromatic/i18n/en.json";
import chromatic_vi from "./chromatic/i18n/vi.json";
import texture_en from "./texture/i18n/en.json";
import texture_vi from "./texture/i18n/vi.json";
import cfa_en from "./cfa/i18n/en.json";
import cfa_vi from "./cfa/i18n/vi.json";
import dct_en from "./dct/i18n/en.json";
import dct_vi from "./dct/i18n/vi.json";
import color_en from "./color/i18n/en.json";
import color_vi from "./color/i18n/vi.json";
import prnu_en from "./prnu/i18n/en.json";
import prnu_vi from "./prnu/i18n/vi.json";
import ela_en from "./ela/i18n/en.json";
import ela_vi from "./ela/i18n/vi.json";
import copymove_en from "./copymove/i18n/en.json";
import copymove_vi from "./copymove/i18n/vi.json";
import splicing_en from "./splicing/i18n/en.json";
import splicing_vi from "./splicing/i18n/vi.json";
import histogram_en from "./histogram/i18n/en.json";
import histogram_vi from "./histogram/i18n/vi.json";
import wavelet_en from "./wavelet/i18n/en.json";
import wavelet_vi from "./wavelet/i18n/vi.json";
import jpeg_ghost_en from "./jpeg_ghost/i18n/en.json";
import jpeg_ghost_vi from "./jpeg_ghost/i18n/vi.json";
import chi_square_en from "./chi_square/i18n/en.json";
import chi_square_vi from "./chi_square/i18n/vi.json";
import entropy_en from "./entropy/i18n/en.json";
import entropy_vi from "./entropy/i18n/vi.json";
import gan_fingerprint_en from "./gan_fingerprint/i18n/en.json";
import gan_fingerprint_vi from "./gan_fingerprint/i18n/vi.json";
import diffusion_en from "./diffusion/i18n/en.json";
import diffusion_vi from "./diffusion/i18n/vi.json";
import noiseprint_en from "./noiseprint/i18n/en.json";
import noiseprint_vi from "./noiseprint/i18n/vi.json";
import upscaling_en from "./upscaling/i18n/en.json";
import upscaling_vi from "./upscaling/i18n/vi.json";
import frequency_band_en from "./frequency_band/i18n/en.json";
import frequency_band_vi from "./frequency_band/i18n/vi.json";
import face_landmark_en from "./face_landmark/i18n/en.json";
import face_landmark_vi from "./face_landmark/i18n/vi.json";
import lighting_en from "./lighting/i18n/en.json";
import lighting_vi from "./lighting/i18n/vi.json";
import shadow_en from "./shadow/i18n/en.json";
import shadow_vi from "./shadow/i18n/vi.json";
import perspective_en from "./perspective/i18n/en.json";
import perspective_vi from "./perspective/i18n/vi.json";
import reflection_en from "./reflection/i18n/en.json";
import reflection_vi from "./reflection/i18n/vi.json";
import double_jpeg_en from "./double_jpeg/i18n/en.json";
import double_jpeg_vi from "./double_jpeg/i18n/vi.json";
import patchforensics_en from "./patchforensics/i18n/en.json";
import patchforensics_vi from "./patchforensics/i18n/vi.json";
import clip_detection_en from "./clip_detection/i18n/en.json";
import clip_detection_vi from "./clip_detection/i18n/vi.json";
import binary_pattern_en from "./binary_pattern/i18n/en.json";
import binary_pattern_vi from "./binary_pattern/i18n/vi.json";
import fourier_ring_en from "./fourier_ring/i18n/en.json";
import fourier_ring_vi from "./fourier_ring/i18n/vi.json";
import resnet_classifier_en from "./resnet_classifier/i18n/en.json";
import resnet_classifier_vi from "./resnet_classifier/i18n/vi.json";
import vit_detection_en from "./vit_detection/i18n/en.json";
import vit_detection_vi from "./vit_detection/i18n/vi.json";
import gram_matrix_en from "./gram_matrix/i18n/en.json";
import gram_matrix_vi from "./gram_matrix/i18n/vi.json";
import srm_filter_en from "./srm_filter/i18n/en.json";
import srm_filter_vi from "./srm_filter/i18n/vi.json";

type MethodLocaleEntry = { name: string; description: string };

/** Build a per-locale map: methodId → { name, description } */
function buildMap(entries: [string, { name: string; description: string }][]): Record<string, MethodLocaleEntry> {
    const map: Record<string, MethodLocaleEntry> = {};
    for (const [id, data] of entries) {
        map[id] = { name: data.name, description: data.description };
    }
    return map;
}

const en = buildMap([
    ["metadata", metadata_en], ["spectral", spectral_en], ["reconstruction", reconstruction_en],
    ["noise", noise_en], ["edge", edge_en], ["gradient", gradient_en], ["benford", benford_en],
    ["chromatic", chromatic_en], ["texture", texture_en], ["cfa", cfa_en], ["dct", dct_en],
    ["color", color_en], ["prnu", prnu_en], ["ela", ela_en], ["copymove", copymove_en],
    ["splicing", splicing_en], ["histogram", histogram_en], ["wavelet", wavelet_en],
    ["jpeg_ghost", jpeg_ghost_en], ["chi_square", chi_square_en], ["entropy", entropy_en],
    ["gan_fingerprint", gan_fingerprint_en], ["diffusion", diffusion_en], ["noiseprint", noiseprint_en],
    ["upscaling", upscaling_en], ["frequency_band", frequency_band_en], ["face_landmark", face_landmark_en],
    ["lighting", lighting_en], ["shadow", shadow_en], ["perspective", perspective_en],
    ["reflection", reflection_en], ["double_jpeg", double_jpeg_en], ["patchforensics", patchforensics_en],
    ["clip_detection", clip_detection_en], ["binary_pattern", binary_pattern_en],
    ["fourier_ring", fourier_ring_en], ["resnet_classifier", resnet_classifier_en],
    ["vit_detection", vit_detection_en], ["gram_matrix", gram_matrix_en], ["srm_filter", srm_filter_en],
]);

const vi = buildMap([
    ["metadata", metadata_vi], ["spectral", spectral_vi], ["reconstruction", reconstruction_vi],
    ["noise", noise_vi], ["edge", edge_vi], ["gradient", gradient_vi], ["benford", benford_vi],
    ["chromatic", chromatic_vi], ["texture", texture_vi], ["cfa", cfa_vi], ["dct", dct_vi],
    ["color", color_vi], ["prnu", prnu_vi], ["ela", ela_vi], ["copymove", copymove_vi],
    ["splicing", splicing_vi], ["histogram", histogram_vi], ["wavelet", wavelet_vi],
    ["jpeg_ghost", jpeg_ghost_vi], ["chi_square", chi_square_vi], ["entropy", entropy_vi],
    ["gan_fingerprint", gan_fingerprint_vi], ["diffusion", diffusion_vi], ["noiseprint", noiseprint_vi],
    ["upscaling", upscaling_vi], ["frequency_band", frequency_band_vi], ["face_landmark", face_landmark_vi],
    ["lighting", lighting_vi], ["shadow", shadow_vi], ["perspective", perspective_vi],
    ["reflection", reflection_vi], ["double_jpeg", double_jpeg_vi], ["patchforensics", patchforensics_vi],
    ["clip_detection", clip_detection_vi], ["binary_pattern", binary_pattern_vi],
    ["fourier_ring", fourier_ring_vi], ["resnet_classifier", resnet_classifier_vi],
    ["vit_detection", vit_detection_vi], ["gram_matrix", gram_matrix_vi], ["srm_filter", srm_filter_vi],
]);

const METHOD_I18N: Record<string, Record<string, MethodLocaleEntry>> = { en, vi };

/**
 * Get the translated name & description for a method, falling back to English.
 */
export function getMethodTranslation(methodId: string, locale: Locale): MethodLocaleEntry {
    return METHOD_I18N[locale]?.[methodId] ?? METHOD_I18N.en[methodId] ?? { name: methodId, description: "" };
}
