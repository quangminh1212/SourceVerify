export type Category = "all" | "pixel" | "frequency" | "statistical" | "metadata" | "sensor";

/* ── SVG Icon paths (Lucide-style, monochrome) ── */
export const ICON_PATHS: Record<string, string> = {
    metadata: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    spectral: "M22 12L18 12L15 21L9 3L6 12L2 12",
    reconstruction: "M11 11a8 8 0 110 0 M21 21l-4.35-4.35 M11 8v6 M8 11h6",
    noise: "M4 9h16 M4 15h16 M10 3l-2 18 M16 3l-2 18",
    edge: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
    gradient: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    benford: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    chromatic: "M12 12a10 10 0 110 0z M14.31 8l5.74 9.94 M9.69 8h11.48 M7.38 12l5.74-9.94 M9.69 16l-5.74-9.94 M14.31 16H2.83 M16.62 12l-5.74 9.94",
    texture: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
    cfa: "M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18",
    dct: "M18 3h4v18h-4z M10 8h4v13h-4z M2 13h4v8H2z",
    color: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    prnu: "M12 12a10 10 0 110 0z M22 12h-4 M6 12H2 M12 6V2 M12 22v-4",
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
    { id: "metadata", nameKey: "api.methods.metadata.name", descKey: "api.methods.metadata.desc", category: "metadata" as Category, weight: 0.12 },
    { id: "spectral", nameKey: "api.methods.spectral.name", descKey: "api.methods.spectral.desc", category: "frequency" as Category, weight: 0.10 },
    { id: "reconstruction", nameKey: "api.methods.reconstruction.name", descKey: "api.methods.reconstruction.desc", category: "pixel" as Category, weight: 0.08 },
    { id: "noise", nameKey: "api.methods.noise.name", descKey: "api.methods.noise.desc", category: "pixel" as Category, weight: 0.09 },
    { id: "edge", nameKey: "api.methods.edge.name", descKey: "api.methods.edge.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "gradient", nameKey: "api.methods.gradient.name", descKey: "api.methods.gradient.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "benford", nameKey: "api.methods.benford.name", descKey: "api.methods.benford.desc", category: "statistical" as Category, weight: 0.06 },
    { id: "chromatic", nameKey: "api.methods.chromatic.name", descKey: "api.methods.chromatic.desc", category: "sensor" as Category, weight: 0.08 },
    { id: "texture", nameKey: "api.methods.texture.name", descKey: "api.methods.texture.desc", category: "pixel" as Category, weight: 0.07 },
    { id: "cfa", nameKey: "api.methods.cfa.name", descKey: "api.methods.cfa.desc", category: "sensor" as Category, weight: 0.10 },
    { id: "dct", nameKey: "api.methods.dct.name", descKey: "api.methods.dct.desc", category: "frequency" as Category, weight: 0.06 },
    { id: "color", nameKey: "api.methods.color.name", descKey: "api.methods.color.desc", category: "pixel" as Category, weight: 0.05 },
    { id: "prnu", nameKey: "api.methods.prnu.name", descKey: "api.methods.prnu.desc", category: "sensor" as Category, weight: 0.05 },
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
