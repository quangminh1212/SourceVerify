import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

/** Domains allowed for media extraction */
const ALLOWED_DOMAINS = [
    "youtube.com", "youtu.be", "www.youtube.com", "m.youtube.com",
    "facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch",
    "tiktok.com", "www.tiktok.com", "vm.tiktok.com",
    "instagram.com", "www.instagram.com",
    "twitter.com", "x.com", "www.x.com",
    "threads.net", "www.threads.net",
    "reddit.com", "www.reddit.com",
    "pinterest.com", "www.pinterest.com",
    "linkedin.com", "www.linkedin.com",
    "flickr.com", "www.flickr.com",
    "imgur.com", "i.imgur.com",
    "twitch.tv", "www.twitch.tv",
    "vimeo.com", "www.vimeo.com",
    "bilibili.com", "www.bilibili.com",
    "weibo.com", "www.weibo.com",
];

/** Extract domain from URL for validation */
function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.toLowerCase();
    } catch {
        return "";
    }
}

/** Check if domain is from a known social media / content platform */
function isAllowedDomain(url: string): boolean {
    const domain = extractDomain(url);
    return ALLOWED_DOMAINS.some(d => domain === d || domain.endsWith("." + d));
}

/** Parse OpenGraph / meta tags from HTML to extract media URLs */
function extractMediaFromHtml(html: string, pageUrl: string): {
    images: string[];
    videos: string[];
    title: string;
    description: string;
    siteName: string;
} {
    const result = {
        images: [] as string[],
        videos: [] as string[],
        title: "",
        description: "",
        siteName: "",
    };

    // Helper to resolve relative URLs
    const resolve = (src: string) => {
        if (!src) return "";
        try {
            return new URL(src, pageUrl).href;
        } catch {
            return src;
        }
    };

    // Extract og:image
    const ogImageMatches = html.matchAll(/<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/gi);
    for (const m of ogImageMatches) result.images.push(resolve(m[1]));
    // Reverse attribute order
    const ogImageMatches2 = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["']/gi);
    for (const m of ogImageMatches2) result.images.push(resolve(m[1]));

    // Extract og:video
    const ogVideoMatches = html.matchAll(/<meta[^>]+property=["']og:video(?::url)?["'][^>]+content=["']([^"']+)["']/gi);
    for (const m of ogVideoMatches) result.videos.push(resolve(m[1]));
    const ogVideoMatches2 = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:video(?::url)?["']/gi);
    for (const m of ogVideoMatches2) result.videos.push(resolve(m[1]));

    // Extract twitter:image
    const twitterImageMatches = html.matchAll(/<meta[^>]+(?:name|property)=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/gi);
    for (const m of twitterImageMatches) result.images.push(resolve(m[1]));
    const twitterImageMatches2 = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']twitter:image(?::src)?["']/gi);
    for (const m of twitterImageMatches2) result.images.push(resolve(m[1]));

    // Extract og:title
    const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)
        || html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) result.title = titleMatch[1].trim();

    // Extract og:description
    const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
    if (descMatch) result.description = descMatch[1].trim();

    // Extract og:site_name
    const siteMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
    if (siteMatch) result.siteName = siteMatch[1].trim();

    // YouTube specific: extract high-res thumbnail
    const domain = extractDomain(pageUrl);
    if (domain.includes("youtube") || domain.includes("youtu.be")) {
        const vidIdMatch = pageUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (vidIdMatch) {
            const vidId = vidIdMatch[1];
            // Add maxresdefault first (highest quality)
            result.images.unshift(`https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`);
            result.images.push(`https://img.youtube.com/vi/${vidId}/hqdefault.jpg`);
        }
    }

    // Deduplicate
    result.images = [...new Set(result.images)].filter(Boolean);
    result.videos = [...new Set(result.videos)].filter(Boolean);

    return result;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const url = typeof body.url === "string" ? body.url.trim() : "";

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Validate URL format
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                return NextResponse.json({ error: "Only HTTP/HTTPS URLs are supported" }, { status: 400 });
            }
        } catch {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
        }

        // Check allowed domains
        if (!isAllowedDomain(url)) {
            return NextResponse.json({
                error: "Unsupported platform. Supported: YouTube, Facebook, TikTok, Instagram, X/Twitter, Reddit, Pinterest, LinkedIn, Flickr, Imgur, Vimeo, Bilibili, Weibo, Threads",
            }, { status: 400 });
        }

        // Fetch page HTML with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        let response: Response;
        try {
            response = await fetch(parsedUrl.href, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; SourceVerify/1.0; +https://sourceverify.app)",
                    "Accept": "text/html,application/xhtml+xml,*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                },
                redirect: "follow",
            });
            clearTimeout(timeout);
        } catch (e) {
            clearTimeout(timeout);
            const msg = e instanceof Error && e.name === "AbortError"
                ? "Request timed out"
                : "Failed to fetch URL";
            return NextResponse.json({ error: msg }, { status: 502 });
        }

        if (!response.ok) {
            return NextResponse.json({
                error: `Failed to fetch page (HTTP ${response.status})`,
            }, { status: 502 });
        }

        // Read HTML (limit to first 200KB to prevent memory issues)
        const text = await response.text();
        const html = text.slice(0, 200_000);

        const media = extractMediaFromHtml(html, parsedUrl.href);

        if (media.images.length === 0 && media.videos.length === 0) {
            return NextResponse.json({
                error: "No images or videos found on this page",
            }, { status: 404 });
        }

        // Try to fetch the first available image and return it as base64
        let mediaData: { type: "image" | "video"; url: string; base64: string; mimeType: string; fileName: string } | null = null;

        // Try images first
        for (const imgUrl of media.images.slice(0, 3)) {
            try {
                const imgResponse = await fetch(imgUrl, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (compatible; SourceVerify/1.0)",
                        "Referer": parsedUrl.origin,
                    },
                });
                if (!imgResponse.ok) continue;
                const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
                if (!contentType.startsWith("image/")) continue;
                const buffer = Buffer.from(await imgResponse.arrayBuffer());
                // Skip tiny images (likely icons/tracking pixels)
                if (buffer.length < 5000) continue;
                const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
                mediaData = {
                    type: "image",
                    url: imgUrl,
                    base64: `data:${contentType};base64,${buffer.toString("base64")}`,
                    mimeType: contentType,
                    fileName: `${media.siteName || "social"}_${Date.now()}.${ext}`,
                };
                break;
            } catch {
                continue;
            }
        }

        return NextResponse.json({
            success: true,
            title: media.title,
            description: media.description,
            siteName: media.siteName,
            images: media.images,
            videos: media.videos,
            media: mediaData,
        });
    } catch (error) {
        console.error("Extract URL error:", error);
        return NextResponse.json(
            { error: "Internal processing error" },
            { status: 500 }
        );
    }
}
