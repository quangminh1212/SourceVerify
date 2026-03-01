/**
 * SourceVerify - API Middleware
 * CORS origin validation + Rate limiting (in-memory sliding window)
 */
import { NextRequest, NextResponse } from "next/server";

// ─── CORS ────────────────────────────────────────────────────────────────────

/**
 * Allowed origins for CORS
 * Production domain + localhost for development
 */
const ALLOWED_ORIGINS = [
    "https://sourceverify.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
];

function getAllowedOrigins(): string[] {
    return ALLOWED_ORIGINS;
}

/**
 * Check if origin is allowed
 * - Exact match against allowed list
 * - Always allow same-origin (no Origin header = same-origin request)
 * - In development mode, allow localhost
 */
function isOriginAllowed(origin: string | null): boolean {
    // Same-origin requests don't have Origin header → always allow
    if (!origin) return true;

    const allowed = getAllowedOrigins();

    // Check exact match
    if (allowed.includes(origin)) return true;

    // In development, also allow any localhost
    if (process.env.NODE_ENV === "development") {
        try {
            const url = new URL(origin);
            if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
                return true;
            }
        } catch {
            // Invalid URL → not allowed
        }
    }

    return false;
}

/**
 * Build CORS headers for a given request
 * Returns the validated origin or blocks the request
 */
export function getCorsHeaders(req: NextRequest): Record<string, string> {
    const origin = req.headers.get("origin");
    const allowedOrigin = isOriginAllowed(origin) ? (origin || "*") : "";

    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
        "Access-Control-Max-Age": "86400", // Cache preflight for 24h
        ...(allowedOrigin && allowedOrigin !== "*" ? { "Vary": "Origin" } : {}),
    };
}

/**
 * Handle CORS preflight (OPTIONS) request
 */
export function handleCorsPreFlight(req: NextRequest): NextResponse {
    const origin = req.headers.get("origin");
    if (!isOriginAllowed(origin)) {
        return NextResponse.json(
            { error: "Origin not allowed" },
            { status: 403 }
        );
    }
    return NextResponse.json({}, { headers: getCorsHeaders(req) });
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────

interface RateLimitEntry {
    timestamps: number[];
}

/**
 * In-memory sliding window rate limiter
 * Each instance tracks requests per IP within a time window
 */
class RateLimiter {
    private store = new Map<string, RateLimitEntry>();
    private readonly maxRequests: number;
    private readonly windowMs: number;
    private lastCleanup = Date.now();
    private readonly cleanupIntervalMs = 60_000; // cleanup stale entries every 60s

    constructor(maxRequests: number, windowMs: number) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    /**
     * Check if request should be allowed
     * Returns { allowed, remaining, resetMs }
     */
    check(key: string): { allowed: boolean; remaining: number; resetMs: number } {
        const now = Date.now();

        // Periodic cleanup of stale entries
        if (now - this.lastCleanup > this.cleanupIntervalMs) {
            this.cleanup(now);
            this.lastCleanup = now;
        }

        let entry = this.store.get(key);
        if (!entry) {
            entry = { timestamps: [] };
            this.store.set(key, entry);
        }

        // Remove timestamps outside the window
        const windowStart = now - this.windowMs;
        entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

        if (entry.timestamps.length >= this.maxRequests) {
            // Rate limited
            const oldestInWindow = entry.timestamps[0];
            const resetMs = oldestInWindow + this.windowMs - now;
            return {
                allowed: false,
                remaining: 0,
                resetMs: Math.max(resetMs, 0),
            };
        }

        // Allow request
        entry.timestamps.push(now);
        return {
            allowed: true,
            remaining: this.maxRequests - entry.timestamps.length,
            resetMs: this.windowMs,
        };
    }

    private cleanup(now: number) {
        const windowStart = now - this.windowMs;
        for (const [key, entry] of this.store) {
            entry.timestamps = entry.timestamps.filter((t) => t > windowStart);
            if (entry.timestamps.length === 0) {
                this.store.delete(key);
            }
        }
    }
}

// ─── Rate Limiter Instances ──────────────────────────────────────────────────

// Analyze endpoint: 30 requests per minute per IP
const analyzeLimiter = new RateLimiter(30, 60_000);

// Auth endpoint: 10 requests per minute per IP (more restrictive)
const authLimiter = new RateLimiter(10, 60_000);

/**
 * Get client IP from request
 * Supports: X-Forwarded-For (Vercel/proxy), X-Real-IP, direct connection
 */
function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        // Take first IP (client IP before proxies)
        return forwarded.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Apply rate limiting to a request
 * Returns null if allowed, or a 429 response if rate limited
 */
export function checkRateLimit(
    req: NextRequest,
    type: "analyze" | "auth"
): NextResponse | null {
    const limiter = type === "analyze" ? analyzeLimiter : authLimiter;
    const ip = getClientIp(req);
    const result = limiter.check(ip);

    if (!result.allowed) {
        const retryAfter = Math.ceil(result.resetMs / 1000);
        return NextResponse.json(
            {
                error: "Too many requests",
                message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
                retryAfter,
            },
            {
                status: 429,
                headers: {
                    ...getCorsHeaders(req),
                    "Retry-After": String(retryAfter),
                    "X-RateLimit-Limit": String(type === "analyze" ? 30 : 10),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(Math.ceil((Date.now() + result.resetMs) / 1000)),
                },
            }
        );
    }

    return null; // allowed
}

/**
 * Get rate limit headers to attach to successful responses
 */
export function getRateLimitHeaders(
    req: NextRequest,
    type: "analyze" | "auth"
): Record<string, string> {
    const limiter = type === "analyze" ? analyzeLimiter : authLimiter;
    const ip = getClientIp(req);
    const limit = type === "analyze" ? 30 : 10;
    // Peek without consuming - check current count
    const entry = limiter["store"].get(ip);
    const now = Date.now();
    const windowStart = now - limiter["windowMs"];
    const currentCount = entry
        ? entry.timestamps.filter((t) => t > windowStart).length
        : 0;

    return {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, limit - currentCount)),
        "X-RateLimit-Reset": String(Math.ceil((now + limiter["windowMs"]) / 1000)),
    };
}
