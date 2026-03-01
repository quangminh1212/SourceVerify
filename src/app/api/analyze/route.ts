import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/apiKeyStore";
import { analyzeImageBuffer } from "@/lib/serverAnalyzer";
import { getCorsHeaders, handleCorsPreFlight, checkRateLimit, getRateLimitHeaders } from "@/lib/apiMiddleware";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function OPTIONS(req: NextRequest) {
    return handleCorsPreFlight(req);
}

export async function POST(req: NextRequest) {
    const corsHeaders = getCorsHeaders(req);

    try {
        // Rate limiting check
        const rateLimitResponse = checkRateLimit(req, "analyze");
        if (rateLimitResponse) return rateLimitResponse;

        // Validate API key
        const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");
        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key. Include X-API-Key header or Authorization: Bearer <key>" },
                { status: 401, headers: corsHeaders }
            );
        }

        const user = validateApiKey(apiKey);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid API key" },
                { status: 403, headers: corsHeaders }
            );
        }

        // Parse request
        const contentType = req.headers.get("content-type") || "";
        let buffer: Buffer;
        let fileName = "uploaded.jpg";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("image") as File | null;
            if (!file) {
                return NextResponse.json(
                    { error: "No 'image' field in form data" },
                    { status: 400, headers: corsHeaders }
                );
            }
            fileName = file.name;
            const arrayBuffer = await file.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } else if (contentType.includes("application/json")) {
            const body = await req.json();
            if (!body.image) {
                return NextResponse.json(
                    { error: "Missing 'image' field (base64 encoded)" },
                    { status: 400, headers: corsHeaders }
                );
            }
            const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
            buffer = Buffer.from(base64Data, "base64");
            fileName = body.fileName || "uploaded.jpg";
        } else {
            // Raw binary
            const arrayBuffer = await req.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        }

        // Validate size (max 10MB)
        if (buffer.length > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Image too large. Maximum 10MB." },
                { status: 413, headers: corsHeaders }
            );
        }

        // Analyze
        const result = await analyzeImageBuffer(buffer, fileName);

        return NextResponse.json({
            success: true,
            data: result,
            meta: {
                apiVersion: "v1",
                timestamp: new Date().toISOString(),
            },
        }, {
            headers: {
                ...corsHeaders,
                ...getRateLimitHeaders(req, "analyze"),
            },
        });

    } catch (error) {
        console.error("API analyze error:", error);
        return NextResponse.json(
            { error: "Analysis failed", message: error instanceof Error ? error.message : "Unknown error" },
            { status: 500, headers: corsHeaders }
        );
    }
}
