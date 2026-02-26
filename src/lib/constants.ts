/**
 * SourceVerify - Constants
 * AI software signatures and camera detection patterns
 */

export const AI_SOFTWARE_SIGNATURES = [
    "midjourney", "dall-e", "dalle", "stable diffusion", "comfyui",
    "automatic1111", "a1111", "novelai", "civitai", "invoke ai",
    "adobe firefly", "firefly", "bing image creator", "leonardo ai",
    "playground ai", "deep dream", "artbreeder", "nightcafe", "craiyon",
    "dreamstudio", "flux", "sora", "runway", "pika", "kling", "hailuo",
    "luma dream", "minimax", "genmo", "ideogram", "recraft",
];

export const REAL_CAMERA_SIGNATURES = [
    "canon", "nikon", "sony", "fujifilm", "olympus", "panasonic",
    "leica", "hasselblad", "pentax", "samsung", "apple", "google pixel",
    "huawei", "xiaomi", "oppo", "oneplus",
];

/** Common AI generator output resolutions */
export const TYPICAL_AI_RESOLUTIONS: [number, number][] = [
    [512, 512], [768, 768], [1024, 1024], [1024, 1792],
    [1792, 1024], [1024, 576], [576, 1024], [512, 768], [768, 512],
];

/** Common AI video output resolutions */
export const AI_VIDEO_RESOLUTIONS: [number, number][] = [
    [1024, 576], [576, 1024], [512, 512], [768, 768],
    [1280, 720], [720, 1280],
];

/** Max dimension for image processing (downscale if larger) */
export const MAX_PROCESS_DIMENSION = 1024;

/** Accepted file MIME types */
export const ACCEPTED_TYPES = [
    "image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/avif",
    "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo",
];

/** Maximum file size (100MB) */
export const MAX_FILE_SIZE = 100 * 1024 * 1024;
