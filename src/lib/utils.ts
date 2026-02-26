/**
 * SourceVerify - Utility Functions
 * Image loading, metadata extraction, and helper functions
 */

import { MAX_PROCESS_DIMENSION } from "./constants";

export async function loadImage(file: File): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; img: HTMLImageElement }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            let w = img.width, h = img.height;
            if (w > MAX_PROCESS_DIMENSION || h > MAX_PROCESS_DIMENSION) {
                const scale = MAX_PROCESS_DIMENSION / Math.max(w, h);
                w = Math.round(w * scale);
                h = Math.round(h * scale);
            }

            const canvas = document.createElement("canvas");
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, w, h);

            URL.revokeObjectURL(url);
            resolve({ canvas, ctx, img });
        };

        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
        img.src = url;
    });
}

export async function extractBasicMetadata(file: File): Promise<Record<string, string>> {
    const metadata: Record<string, string> = {};
    metadata["File Name"] = file.name;
    metadata["File Size"] = formatFileSize(file.size);
    metadata["MIME Type"] = file.type;
    metadata["Last Modified"] = new Date(file.lastModified).toISOString();

    try {
        const buffer = await file.slice(0, 65536).arrayBuffer();
        const view = new DataView(buffer);

        if (view.getUint16(0) === 0xffd8) {
            metadata["Format"] = "JPEG";
            let offset = 2;
            while (offset < view.byteLength - 4) {
                const marker = view.getUint16(offset);
                if (marker === 0xffe1) {
                    const length = view.getUint16(offset + 2);
                    const exifStr = readString(view, offset + 4, Math.min(length, 100));
                    if (exifStr.includes("Exif")) metadata["EXIF"] = "Present";
                    break;
                }
                if ((marker & 0xff00) !== 0xff00) break;
                const segLen = view.getUint16(offset + 2);
                offset += 2 + segLen;
            }
        } else if (view.getUint32(0) === 0x89504e47) {
            metadata["Format"] = "PNG";
            let offset = 8;
            while (offset < Math.min(view.byteLength - 8, 4096)) {
                const chunkLen = view.getUint32(offset);
                const chunkType = readString(view, offset + 4, 4);
                if (chunkType === "tEXt" || chunkType === "iTXt") {
                    const text = readString(view, offset + 8, Math.min(chunkLen, 200));
                    if (text.toLowerCase().includes("software")) metadata["Software"] = text.split("\0").slice(1).join("");
                    if (text.toLowerCase().includes("comment")) metadata["Comment"] = text.split("\0").slice(1).join("");
                }
                offset += 12 + chunkLen;
                if (chunkType === "IEND") break;
            }
        }
    } catch { /* silent */ }

    return metadata;
}

function readString(view: DataView, offset: number, length: number): string {
    let str = "";
    for (let i = 0; i < length && offset + i < view.byteLength; i++) {
        const code = view.getUint8(offset + i);
        if (code >= 32 && code < 127) str += String.fromCharCode(code);
    }
    return str;
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate file magic bytes match claimed MIME type
 * Prevents MIME type spoofing attacks
 */
export async function validateFileMagicBytes(file: File): Promise<boolean> {
    try {
        const buffer = await file.slice(0, 12).arrayBuffer();
        const view = new DataView(buffer);
        const type = file.type;

        if (type === "image/jpeg") return view.getUint16(0) === 0xffd8;
        if (type === "image/png") return view.getUint32(0) === 0x89504e47;
        if (type === "image/gif") {
            const sig = readString(view, 0, 3);
            return sig === "GIF";
        }
        if (type === "image/webp") {
            const riff = readString(view, 0, 4);
            const webp = readString(view, 8, 4);
            return riff === "RIFF" && webp === "WEBP";
        }
        if (type === "image/bmp") return view.getUint16(0) === 0x424d;
        // Video: MP4 (ftyp box), WebM (EBML header), AVI (RIFF)
        if (type.startsWith("video/")) return true; // relaxed for video

        return true; // allow unknown types to pass through
    } catch {
        return true; // on error, allow (don't block)
    }
}
