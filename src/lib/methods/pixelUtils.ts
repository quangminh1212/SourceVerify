/**
 * Common pixel utility functions shared across analysis methods
 */

/** Convert RGBA pixel at given index to grayscale value */
export function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}
