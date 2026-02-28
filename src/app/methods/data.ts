export type Category = "all" | "pixel" | "frequency" | "statistical" | "metadata" | "sensor";

/* ── SVG Icon paths per category (same icon for same category) ── */
export const CAT_ICON_PATHS: Record<Category, string> = {
    all: "",
    pixel: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
    frequency: "M22 12L18 12L15 21L9 3L6 12L2 12",
    statistical: "M18 3h4v18h-4z M10 8h4v13h-4z M2 13h4v8H2z",
    metadata: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    sensor: "M12 12a10 10 0 110 0z M22 12h-4 M6 12H2 M12 6V2 M12 22v-4",
};

/* ── Category hex colors for icons ── */
export const CAT_HEX: Record<Category, string> = {
    all: "#888",
    pixel: "#4285F4",
    frequency: "#9C27B0",
    statistical: "#FBBC04",
    metadata: "#34A853",
    sensor: "#EA4335",
};


export const METHODS = [
    { id: "metadata", nameKey: "api.methods.metadata.name", descKey: "api.methods.metadata.desc", category: "metadata" as Category, weight: 0.07 },
    { id: "spectral", nameKey: "api.methods.spectral.name", descKey: "api.methods.spectral.desc", category: "frequency" as Category, weight: 0.06 },
    { id: "reconstruction", nameKey: "api.methods.reconstruction.name", descKey: "api.methods.reconstruction.desc", category: "pixel" as Category, weight: 0.05 },
    { id: "noise", nameKey: "api.methods.noise.name", descKey: "api.methods.noise.desc", category: "pixel" as Category, weight: 0.05 },
    { id: "edge", nameKey: "api.methods.edge.name", descKey: "api.methods.edge.desc", category: "pixel" as Category, weight: 0.04 },
    { id: "gradient", nameKey: "api.methods.gradient.name", descKey: "api.methods.gradient.desc", category: "pixel" as Category, weight: 0.04 },
    { id: "benford", nameKey: "api.methods.benford.name", descKey: "api.methods.benford.desc", category: "statistical" as Category, weight: 0.04 },
    { id: "chromatic", nameKey: "api.methods.chromatic.name", descKey: "api.methods.chromatic.desc", category: "sensor" as Category, weight: 0.05 },
    { id: "texture", nameKey: "api.methods.texture.name", descKey: "api.methods.texture.desc", category: "pixel" as Category, weight: 0.04 },
    { id: "cfa", nameKey: "api.methods.cfa.name", descKey: "api.methods.cfa.desc", category: "sensor" as Category, weight: 0.06 },
    { id: "dct", nameKey: "api.methods.dct.name", descKey: "api.methods.dct.desc", category: "frequency" as Category, weight: 0.04 },
    { id: "color", nameKey: "api.methods.color.name", descKey: "api.methods.color.desc", category: "pixel" as Category, weight: 0.03 },
    { id: "prnu", nameKey: "api.methods.prnu.name", descKey: "api.methods.prnu.desc", category: "sensor" as Category, weight: 0.04 },
    { id: "ela", nameKey: "api.methods.ela.name", descKey: "api.methods.ela.desc", category: "pixel" as Category, weight: 0.06 },
    { id: "copymove", nameKey: "api.methods.copymove.name", descKey: "api.methods.copymove.desc", category: "pixel" as Category, weight: 0.04 },
    { id: "splicing", nameKey: "api.methods.splicing.name", descKey: "api.methods.splicing.desc", category: "pixel" as Category, weight: 0.04 },
    { id: "histogram", nameKey: "api.methods.histogram.name", descKey: "api.methods.histogram.desc", category: "statistical" as Category, weight: 0.03 },
    { id: "wavelet", nameKey: "api.methods.wavelet.name", descKey: "api.methods.wavelet.desc", category: "frequency" as Category, weight: 0.04 },
    { id: "jpeg_ghost", nameKey: "api.methods.jpeg_ghost.name", descKey: "api.methods.jpeg_ghost.desc", category: "frequency" as Category, weight: 0.03 },
    { id: "chi_square", nameKey: "api.methods.chi_square.name", descKey: "api.methods.chi_square.desc", category: "statistical" as Category, weight: 0.03 },
    { id: "entropy", nameKey: "api.methods.entropy.name", descKey: "api.methods.entropy.desc", category: "statistical" as Category, weight: 0.03 },
    { id: "gan_fingerprint", nameKey: "api.methods.gan_fingerprint.name", descKey: "api.methods.gan_fingerprint.desc", category: "sensor" as Category, weight: 0.05 },
    { id: "diffusion", nameKey: "api.methods.diffusion.name", descKey: "api.methods.diffusion.desc", category: "sensor" as Category, weight: 0.04 },
    { id: "noiseprint", nameKey: "api.methods.noiseprint.name", descKey: "api.methods.noiseprint.desc", category: "sensor" as Category, weight: 0.04 },
    { id: "upscaling", nameKey: "api.methods.upscaling.name", descKey: "api.methods.upscaling.desc", category: "pixel" as Category, weight: 0.03 },
    // New methods based on academic research
    { id: "frequency_band", nameKey: "api.methods.frequency_band.name", descKey: "api.methods.frequency_band.desc", category: "frequency" as Category, weight: 0.03 },
    { id: "face_landmark", nameKey: "api.methods.face_landmark.name", descKey: "api.methods.face_landmark.desc", category: "pixel" as Category, weight: 0.04 },
    { id: "lighting", nameKey: "api.methods.lighting.name", descKey: "api.methods.lighting.desc", category: "pixel" as Category, weight: 0.03 },
    { id: "shadow", nameKey: "api.methods.shadow.name", descKey: "api.methods.shadow.desc", category: "pixel" as Category, weight: 0.02 },
    { id: "perspective", nameKey: "api.methods.perspective.name", descKey: "api.methods.perspective.desc", category: "pixel" as Category, weight: 0.02 },
    { id: "reflection", nameKey: "api.methods.reflection.name", descKey: "api.methods.reflection.desc", category: "pixel" as Category, weight: 0.02 },
    { id: "double_jpeg", nameKey: "api.methods.double_jpeg.name", descKey: "api.methods.double_jpeg.desc", category: "statistical" as Category, weight: 0.03 },
    { id: "patchforensics", nameKey: "api.methods.patchforensics.name", descKey: "api.methods.patchforensics.desc", category: "sensor" as Category, weight: 0.04 },
    { id: "clip_detection", nameKey: "api.methods.clip_detection.name", descKey: "api.methods.clip_detection.desc", category: "sensor" as Category, weight: 0.04 },
    { id: "binary_pattern", nameKey: "api.methods.binary_pattern.name", descKey: "api.methods.binary_pattern.desc", category: "pixel" as Category, weight: 0.03 },
    { id: "fourier_ring", nameKey: "api.methods.fourier_ring.name", descKey: "api.methods.fourier_ring.desc", category: "frequency" as Category, weight: 0.03 },
    { id: "resnet_classifier", nameKey: "api.methods.resnet_classifier.name", descKey: "api.methods.resnet_classifier.desc", category: "sensor" as Category, weight: 0.04 },
    { id: "vit_detection", nameKey: "api.methods.vit_detection.name", descKey: "api.methods.vit_detection.desc", category: "sensor" as Category, weight: 0.04 },
    { id: "gram_matrix", nameKey: "api.methods.gram_matrix.name", descKey: "api.methods.gram_matrix.desc", category: "pixel" as Category, weight: 0.02 },
    { id: "srm_filter", nameKey: "api.methods.srm_filter.name", descKey: "api.methods.srm_filter.desc", category: "pixel" as Category, weight: 0.03 },
];

export const CATEGORIES: { key: Category; labelKey: string }[] = [
    { key: "all", labelKey: "methods.catAll" },
    { key: "pixel", labelKey: "methods.catPixel" },
    { key: "frequency", labelKey: "methods.catFrequency" },
    { key: "statistical", labelKey: "methods.catStatistical" },
    { key: "metadata", labelKey: "methods.catMetadata" },
    { key: "sensor", labelKey: "methods.catSensor" },
];

export const CAT_COLORS: Record<Category, string> = {
    all: "",
    pixel: "cat-pixel",
    frequency: "cat-frequency",
    statistical: "cat-statistical",
    metadata: "cat-metadata",
    sensor: "cat-sensor",
};
